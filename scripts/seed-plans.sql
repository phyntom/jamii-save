-- Seed script for plan table
-- This script populates the plan table with pricing data from the landing page

-- Insert Free Plan
INSERT INTO "jamii"."plan" (
  "name",
  "description",
  "price",
  "max_communities",
  "base_members_per_community",
  "max_members_per_community",
  "additional_member_price",
  "additional_member_batch_size",
  "features",
  "stripe_price_id_monthly",
  "stripe_price_id_yearly"
) VALUES (
  'Free',
  'Perfect for small communities',
  0.00,
  1,
  10,
  10,
  NULL,
  NULL,
  '{
    "maxCommunities": "1",
    "maxMembers": "10",
    "contributionTracking": "basic",
    "notifications": "email",
    "reporting": "basic",
    "loanManagement": false,
    "dataExport": false,
    "analytics": false,
    "customBranding": false,
    "apiAccess": false,
    "support": "standard"
  }'::jsonb,
  NULL,
  NULL
);

-- Insert Basic Plan
INSERT INTO "jamii"."plan" (
  "name",
  "description",
  "price",
  "max_communities",
  "base_members_per_community",
  "max_members_per_community",
  "additional_member_price",
  "additional_member_batch_size",
  "features",
  "stripe_price_id_monthly",
  "stripe_price_id_yearly"
) VALUES (
  'Basic',
  'Great for growing communities',
  29.00,
  5,
  50,
  50,
  NULL,
  NULL,
  '{
    "maxCommunities": "5",
    "maxMembers": "50",
    "contributionTracking": "advanced",
    "notifications": "sms",
    "reporting": "advanced",
    "loanManagement": true,
    "dataExport": true,
    "analytics": false,
    "customBranding": false,
    "apiAccess": false,
    "support": "standard"
  }'::jsonb,
  NULL,
  NULL
);

-- Insert Premium Plan
INSERT INTO "jamii"."plan" (
  "name",
  "description",
  "price",
  "max_communities",
  "base_members_per_community",
  "max_members_per_community",
  "additional_member_price",
  "additional_member_batch_size",
  "features",
  "stripe_price_id_monthly",
  "stripe_price_id_yearly"
) VALUES (
  'Premium',
  'For large organizations',
  99.00,
  999999,  -- Represents unlimited communities
  999999,  -- Represents unlimited base members
  999999,  -- Represents unlimited max members
  NULL,
  NULL,
  '{
    "maxCommunities": "unlimited",
    "maxMembers": "unlimited",
    "contributionTracking": "advanced",
    "notifications": "all",
    "reporting": "advanced",
    "loanManagement": true,
    "dataExport": true,
    "analytics": "advanced",
    "customBranding": true,
    "apiAccess": true,
    "support": "priority"
  }'::jsonb,
  NULL,
  NULL
);

-- Verify the inserts
SELECT 
  id,
  name,
  description,
  price,
  max_communities,
  base_members_per_community,
  max_members_per_community,
  features
FROM "jamii"."plan"
ORDER BY price ASC;

