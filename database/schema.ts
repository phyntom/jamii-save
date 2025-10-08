import { nanoid } from "nanoid";
import { pgTable, text, timestamp, boolean, pgSchema, pgEnum, integer, bigint, numeric, jsonb } from "drizzle-orm/pg-core";

const jamiiSchema = pgSchema("jamii");

// Define enum for invitation status
export const invitationStatusEnum = pgEnum("invitation_status", ["pending", "declined", "accepted"]);
export const communityVisibilityEnum = pgEnum("community_visibility", ["public", "private"]);
export const communityMemberRoleEnum = pgEnum("community_member_role", ["super_admin", "admin", "member"]);
export const communityMemberStatusEnum = pgEnum("community_member_status", ["active", "pending", "removed"]);
export const communityInvitationStatusEnum = pgEnum("community_invitation_status", ["pending", "declined", "accepted"]);
export const invitationTypeEnum = pgEnum("invitation_type", ["email", "link","code"]);
export const userSubscriptionStatusEnum = pgEnum("user_subscription_status", ["active", "canceled", "past_due", "trial"]);
export const userSubscriptionBillingCycleEnum = pgEnum("user_subscription_billing_cycle", ["monthly", "yearly"]);

export const user = jamiiSchema.table("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const session = jamiiSchema.table("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = jamiiSchema.table("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const verification = jamiiSchema.table("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const plan = jamiiSchema.table("plan", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull().unique(),
  description: text("description"),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  max_groups: integer("max_groups").notNull(),
  max_members_per_group: integer("max_members_per_group").notNull(),
  features: jsonb("features"), // Rich JSON with feature flags and descriptions
  stripe_price_id_monthly: text("stripe_price_id_monthly"),
  stripe_price_id_yearly: text("stripe_price_id_yearly"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const community = jamiiSchema.table("community", {
  id: text("id").primaryKey().$defaultFn(() => nanoid()),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category"),
  visibility: communityVisibilityEnum("visibility").notNull().default("private"),
  contribution_frequency: text("contribution_frequency").notNull().default("weekly"),
  contribution_amount: numeric("contribution_amount", { precision: 10, scale: 2 }).notNull(),
  contribution_day: integer("contribution_day").notNull().default(1),
  loan_interest_rate: numeric("loan_interest_rate", { precision: 5, scale: 2 }).notNull().default("0"),
  max_loan_amount: numeric("max_loan_amount", { precision: 10, scale: 2 }),
  late_fee_amount: numeric("late_fee_amount", { precision: 10, scale: 2 }).notNull().default("0"),
  grace_period_days: integer("grace_period_days").notNull().default(0),
  is_active: boolean("is_active").default(true).notNull(),
  admin_id: text("admin_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  max_members: integer("max_members").notNull().default(30),
  plan_id: integer("plan_id").notNull().references(() => plan.id, { onDelete: "cascade" }),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const community_members = jamiiSchema.table("community_members", {
  id: text("id").primaryKey().$defaultFn(() => nanoid()),
  community_id: text("community_id").notNull().references(() => community.id, { onDelete: "cascade" }),
  user_id: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  role: communityMemberRoleEnum("role").notNull().default("member"),
  status: communityMemberStatusEnum("status").notNull().default("active"),
  invited_at:timestamp("invited_at"),
  joined_at: timestamp("joined_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const community_invitations = jamiiSchema.table("community_invitations", {
  id: text("id").primaryKey().$defaultFn(() => nanoid()),
  community_id: text("community_id").notNull().references(() => community.id, { onDelete: "cascade" }),
  invitation_type: invitationTypeEnum("invitation_type").notNull().default("email"),
  email: text("email"),
  code:text("code"),
  token: text("token").notNull().unique(),
  invited_by: text("invited_by").notNull().references(() => user.id, { onDelete: "cascade" }),
  uses_count: integer("uses_count").default(0),
  metadata: text("metadata"),
  status: invitationStatusEnum("status").notNull().default("pending"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const subscription_types = jamiiSchema.table("subscription_types", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  description: text("description"),
  multiplier: numeric("multiplier", { precision: 10, scale: 2 }).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const user_subscriptions = jamiiSchema.table("user_subscriptions", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  user_id: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  plan_id: integer("plan_id").notNull().references(() => plan.id, { onDelete: "cascade" }),
  stripe_subscription_id: text("stripe_subscription_id"),
  status: text("status").notNull().default("active"),
  subscription_type_id: integer("subscription_type_id").notNull().references(() => subscription_types.id, { onDelete: "cascade" }),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  current_period_start: timestamp("current_period_start").notNull(),
  current_period_end: timestamp("current_period_end").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});
