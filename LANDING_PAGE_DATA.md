# Landing Page Static Data

This document explains how to adapt the static landing page data to your database schema.

## Current Static Data Structure

The landing page uses static data defined in `/lib/static-data.ts` with the following interfaces:

### Pricing Plans

- **Free Plan**: $0/month - 1 community, 10 members
- **Basic Plan**: $29/month - 5 communities, 50 members (Most Popular)
- **Premium Plan**: $99/month - Unlimited communities and members

### Features

- Community Management
- Contribution Tracking
- Security & Compliance
- Mobile Ready
- Global Access
- Advanced Analytics

### Testimonials

- Alice Mwangi (Community Leader, Nairobi)
- John Ochieng (Treasurer, Kisumu)
- Mary Wanjiku (Secretary, Mombasa)

## Database Integration Plan

### 1. Pricing Plans → Database Tables

The static pricing data should be migrated to your existing database schema:

```sql
-- Update the plan table with the static data
INSERT INTO plan (id, name, description, price, currency, period, popular, features, button_text, button_variant) VALUES
('free', 'Free', 'Perfect for small communities', 0, '$', 'per month', false, '["1 community maximum","10 members per community","Basic contribution tracking","Email notifications","Basic reporting"]', 'Get Started Free', 'outline'),
('basic', 'Basic', 'Great for growing communities', 29, '$', 'per month', true, '["5 communities maximum","50 members per community","Loan management features","SMS notifications","Advanced reporting","Data export capabilities"]', 'Start Basic Plan', 'default'),
('premium', 'Premium', 'For large organizations', 99, '$', 'per month', false, '["Unlimited communities","Unlimited members","Advanced analytics","All notification channels","Custom branding","API access","Priority support"]', 'Contact Sales', 'outline');
```

### 2. Features → Database Table

Create a features table:

```sql
CREATE TABLE features (
  id VARCHAR(50) PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  icon VARCHAR(50) NOT NULL,
  color VARCHAR(20) NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO features (id, title, description, icon, color, display_order) VALUES
('community-management', 'Community Management', 'Create and manage savings groups with flexible member roles and invitation systems.', 'Users', 'blue', 1),
('contribution-tracking', 'Contribution Tracking', 'Record and approve contributions with complete audit trails and status tracking.', 'BarChart3', 'green', 2),
('security-compliance', 'Secure & Compliant', 'Bank-level security with Better-Auth and complete data protection for your community.', 'Shield', 'purple', 3),
('mobile-ready', 'Mobile Ready', 'Access your community savings from anywhere with our responsive web platform.', 'Smartphone', 'orange', 4),
('global-access', 'Global Access', 'Support for multiple payment methods including mobile money and bank transfers.', 'Globe', 'indigo', 5),
('advanced-analytics', 'Advanced Analytics', 'Detailed reports and insights to help your community make informed financial decisions.', 'BarChart3', 'red', 6);
```

### 3. Testimonials → Database Table

Create a testimonials table:

```sql
CREATE TABLE testimonials (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  role VARCHAR(100) NOT NULL,
  location VARCHAR(100) NOT NULL,
  content TEXT NOT NULL,
  rating INTEGER DEFAULT 5,
  avatar VARCHAR(10) NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO testimonials (id, name, role, location, content, rating, avatar, display_order) VALUES
('alice-mwangi', 'Alice Mwangi', 'Community Leader', 'Nairobi', 'Jamii Save has revolutionized how our community manages savings. The transparency and ease of use is incredible.', 5, 'A', 1),
('john-ochieng', 'John Ochieng', 'Treasurer', 'Kisumu', 'Finally, a platform that understands African savings culture. Our group has grown from 10 to 50 members since using Jamii Save.', 5, 'J', 2),
('mary-wanjiku', 'Mary Wanjiku', 'Secretary', 'Mombasa', 'The loan management features are game-changing. We can now track everything digitally with complete transparency.', 5, 'M', 3);
```

## Implementation Steps

### Step 1: Update Database Schema

1. Run the SQL commands above to create the new tables
2. Insert the static data into the database

### Step 2: Create API Endpoints

Create API routes to fetch data from the database:

```typescript
// app/api/pricing/route.ts
export async function GET() {
  const plans = await db.select().from(plan);
  return Response.json(plans);
}

// app/api/features/route.ts
export async function GET() {
  const features = await db.select().from(features);
  return Response.json(features);
}

// app/api/testimonials/route.ts
export async function GET() {
  const testimonials = await db
    .select()
    .from(testimonials)
    .where(eq(testimonials.is_active, true));
  return Response.json(testimonials);
}
```

### Step 3: Update Landing Page Component

Replace the static data imports with API calls:

```typescript
// Replace static imports
import { pricingPlans, features, testimonials } from "@/lib/static-data";

// With API calls
const pricingPlans = await fetch("/api/pricing").then((res) => res.json());
const features = await fetch("/api/features").then((res) => res.json());
const testimonials = await fetch("/api/testimonials").then((res) => res.json());
```

### Step 4: Admin Interface

Create admin pages to manage:

- Pricing plans
- Features
- Testimonials
- Hero section content
- Footer links

## Benefits of Database Integration

1. **Dynamic Content**: Update pricing, features, and testimonials without code changes
2. **A/B Testing**: Test different content variations
3. **Analytics**: Track which features and testimonials perform best
4. **Localization**: Support multiple languages and regions
5. **Admin Control**: Non-technical users can update content

## Migration Checklist

- [ ] Create database tables for features, testimonials
- [ ] Update plan table with static data
- [ ] Create API endpoints for data fetching
- [ ] Update landing page to use API data
- [ ] Create admin interface for content management
- [ ] Test all functionality
- [ ] Remove static data file
- [ ] Update documentation

## Notes

- The current static data structure matches your existing database schema for plans
- Features and testimonials are new additions that need new tables
- Consider adding image uploads for testimonials and feature icons
- Add validation for all content fields
- Implement caching for better performance
