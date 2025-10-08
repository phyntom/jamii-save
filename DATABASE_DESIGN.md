# Jamii Save - Database Design & Schema Evolution

> **Purpose**: This document tracks all database schema changes, design decisions, and the evolution of the Jamii Save platform's data model.

---

## Table of Contents
1. [Design Principles](#design-principles)
2. [ID Generation Strategy](#id-generation-strategy)
3. [Schema Changelog](#schema-changelog)
4. [Current Schema Overview](#current-schema-overview)

---

## Design Principles

### Core Principles
- **Type Safety**: Use PostgreSQL enums for constrained values
- **Audit Trail**: All tables include `created_at` and `updated_at` timestamps
- **Soft Deletes**: Use status flags instead of hard deletes where appropriate
- **Extensibility**: Design schemas to support future features without breaking changes
- **Plan-Based Limits**: All features respect subscription tier limitations

### Naming Conventions
- **Tables**: Singular names within `jamii` schema (e.g., `jamii.user`, `jamii.community`)
- **Columns**: Snake_case for database columns (e.g., `created_at`, `max_members`)
- **Enums**: Descriptive names ending with `Enum` (e.g., `invitationStatusEnum`)
- **Foreign Keys**: Referenced table name + `_id` (e.g., `user_id`, `plan_id`)

---

## ID Generation Strategy

### User & Authentication Tables
- **Strategy**: Text-based IDs managed by Better-Auth
- **Format**: Better-Auth controlled format
- **Tables**: `user`, `session`, `account`, `verification`
- **Rationale**: Better-Auth requires specific ID format for compatibility

### Business Entity Tables (Manual Generation)
- **Strategy**: Text-based IDs, manually generated in application code
- **Format**: Custom format as needed per table
- **Tables**: `community`, `community_members`, `community_invitations`
- **Rationale**: Provides flexibility for custom ID formats (e.g., prefixed, human-readable)
- **Implementation**: Generate IDs in server actions/API routes before insert

### System/Lookup Tables
- **Strategy**: Auto-incrementing integers using `serial`
- **Format**: Sequential integers (1, 2, 3, ...)
- **Tables**: `plan`, `user_subscriptions`
- **Rationale**: Simple, efficient for internal reference tables with limited rows

### Future Consideration: nanoid
- Option to migrate business entities to nanoid with prefixes (e.g., `comm_abc123`)
- Would use `$defaultFn(() => nanoid())` in Drizzle schema
- Requires `nanoid` package installation
- Decision deferred to future iteration

---

## Schema Changelog

### [Phase 1] Authentication & User Management
**Date**: Initial Setup  
**Status**: ✅ Complete

#### Changes
- Added `user` table with Better-Auth integration
- Added `session` table for session management
- Added `account` table for OAuth and password storage
- Added `verification` table for email verification tokens

#### Design Decisions
- Used Better-Auth conventions for table structure
- All tables use text-based IDs controlled by Better-Auth
- Email verification optional but schema-ready

---

### [Phase 2] Subscription & Billing Foundation
**Date**: Initial Setup  
**Status**: ✅ Complete

#### Changes
- Added `plan` table with pricing tiers

#### Schema
```typescript
export const plan = jamiiSchema.table("plan", {
  id: bigint("id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull().unique(),
  description: text("description"),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  max_groups: integer("max_groups").notNull(),
  max_members_per_group: integer("max_members_per_group").notNull(),
});
```

#### Design Decisions
- Three-tier model: Free, Basic, Premium
- Plan limits control group and member counts
- Stripe integration prepared but not yet implemented

#### Pending Changes
- **TODO**: Change `id` from `bigint` to `serial` for simplicity
- **TODO**: Split `price` into `price_monthly` and `price_yearly`
- **TODO**: Add `features` JSON field for feature flags
- **TODO**: Add Stripe price IDs for payment integration
- **TODO**: Add timestamps (`created_at`)

---

### [Phase 3] Community & Membership System
**Date**: Current Phase  
**Status**: 🔄 In Progress

#### Objectives
- Enable community creation and management
- Support flexible invitation system (email/link/code)
- Implement role-based access control
- Add community settings (contributions, loans, fees)
- Integrate subscription plan limits

#### Changes Planned

##### 1. Add Enums for Type Safety
```typescript
// Invitation status (already exists)
export const invitationStatusEnum = pgEnum("invitation_status", 
  ["pending", "declined", "accepted"]
);

// New enums to add
export const communityVisibilityEnum = pgEnum("community_visibility", 
  ["public", "private", "unlisted"]
);

export const communityMemberRoleEnum = pgEnum("community_member_role", 
  ["admin", "treasurer", "secretary", "member"]
);

export const communityMemberStatusEnum = pgEnum("community_member_status", 
  ["active", "pending", "removed", "suspended"]
);

export const invitationTypeEnum = pgEnum("invitation_type", 
  ["email", "link", "code"]
);
```

##### 2. Enhance Community Table
Add comprehensive settings for community management:
- Description and category for organization
- Visibility controls (public/private/unlisted)
- Contribution rules (frequency, amount, schedule)
- Loan policies (interest rate, max amount)
- Late fee and grace period settings
- Soft delete support

##### 3. Update Community Members Table
- Replace text-based `role` with enum
- Replace text-based `status` with enum
- Add `invited_at` timestamp
- Add `updated_at` timestamp

##### 4. Enhance Community Invitations Table
Make invitation system flexible to support:
- Email invitations (current)
- Shareable links (future)
- Join codes (future)

New fields:
- `invitation_type`: enum for invite method
- `code`: short code for easy sharing
- `max_uses` & `uses_count`: track link/code usage
- `metadata`: JSON for additional data

##### 5. Add User Subscriptions Table
Link users to their active subscriptions:
- Track subscription status (active/canceled/etc)
- Support monthly and yearly billing cycles
- Store Stripe subscription ID for payment sync
- Track billing period dates

##### 6. Update Plan Table
- Change `id` from `bigint` to `serial` (auto-incrementing integer)
- Keep single `price` field (base price for the plan)
- Add `features` field (JSON string) for feature flags
- Add `created_at` timestamp

**Note**: Pricing flexibility achieved through `subscription_types` table with multipliers instead of hardcoded monthly/yearly prices. This allows for any billing cycle (monthly=1x, yearly=12x, quarterly=3x, etc.)

#### Design Decisions

**Community Terminology**
- Decision: Use "community" throughout the application
- Rationale: More inclusive than "group", aligns with social/collaborative nature
- Note: SQL scripts may still reference "groups" - to be updated in future cleanup

**Membership Workflow**
- Phase 1: Invitation-only (admin sends email invites)
- Future: Add join requests and public community discovery
- Rationale: Start simple, add complexity as needed

**Role System**
- Extensible role enum with 4 initial roles
- Admin: Full control over community
- Treasurer: Can approve contributions and loans (future)
- Secretary: Can manage members (future)
- Member: Basic participation
- Rationale: Enum allows adding roles without breaking changes

**Invitation System**
- Generic design supports multiple invitation methods
- All methods use same table with type discrimination
- Rationale: Flexible for future features without schema changes

**ID Strategy**
- Keep text IDs for business entities (manual generation)
- Use serial for system tables (plan, subscriptions)
- Rationale: Flexibility for custom formats when needed, simplicity for lookups

**Plan Integration**
- Fix type mismatch: `community.plan_id` should be integer (not text)
- User subscriptions act as join table between users and plans
- **Flexible Pricing Model**: Base plan price × subscription type multiplier = final amount
- **Rationale**: Enables unlimited billing cycles without schema changes, supports custom subscription periods

---

## Current Schema Overview

### Authentication & Users
- `user` - User accounts (Better-Auth managed)
- `session` - Active user sessions
- `account` - OAuth accounts and passwords
- `verification` - Email verification tokens

### Subscriptions & Billing
- `plan` - Subscription tiers (Free, Basic, Premium)
- `user_subscriptions` - User subscription tracking (to be added)

### Communities & Membership
- `community` - Savings communities/groups
- `community_members` - Community membership and roles
- `community_invitations` - Flexible invitation system

### Future Tables (Not Yet Implemented)
- `contributions` - Member contribution tracking
- `loans` - Loan requests and management
- `loan_repayments` - Loan payment tracking
- `notifications` - User notifications
- `audit_logs` - System activity logging
- `community_join_requests` - Public community join requests

---

## Migration Strategy

### Current Approach
- Using Drizzle ORM with PostgreSQL
- Schema defined in `database/schema.ts`
- Migrations generated with `drizzle-kit`

### For Phase 3 Implementation
1. Update enums in schema
2. Modify existing tables (community, community_members, community_invitations)
3. Add new table (user_subscriptions)
4. Update plan table structure
5. Generate migration with `drizzle-kit generate`
6. Review migration SQL
7. Apply migration with `drizzle-kit migrate`

### Breaking Changes to Handle
- `plan.id` type change (bigint → serial): Update foreign keys
- `community.plan_id` type change (text → integer): Data migration needed
- Enum replacements: Convert existing text values to enum values

---

## Notes & Considerations

### Performance
- Consider adding indexes on frequently queried columns (user_id, community_id, status fields)
- Enum values stored as integers internally - efficient for queries
- Text IDs may be less efficient than integers for joins - monitor performance

### Data Integrity
- All foreign keys use `onDelete: "cascade"` for automatic cleanup
- Enums prevent invalid values at database level
- Required fields use `.notNull()` for data quality

### Future Enhancements
- Add full-text search on community name/description
- Implement soft deletes with `deleted_at` timestamps
- Add community activity/statistics tracking
- Implement permission system beyond simple roles
- Add community categories/tags for discovery

---

*Last Updated: Phase 3 Planning*  
*Next Update: After Phase 3 Implementation*

