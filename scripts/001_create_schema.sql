-- Create main schema for Jamii-Save
CREATE SCHEMA IF NOT EXISTS jamii;

-- Users table (better-auth compatible)
CREATE TABLE IF NOT EXISTS jamii.user (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  email_verified BOOLEAN DEFAULT FALSE,
  image TEXT,
  phone_number TEXT,
  profile_picture_url TEXT,
  notification_preferences JSONB DEFAULT '{"email": true, "sms": false, "push": false}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sessions table (better-auth)
CREATE TABLE IF NOT EXISTS jamii.session (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES jamii.user(id) ON DELETE CASCADE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  token TEXT NOT NULL UNIQUE,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Accounts table (better-auth - for OAuth providers)
CREATE TABLE IF NOT EXISTS jamii.account (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES jamii.user(id) ON DELETE CASCADE,
  account_id TEXT NOT NULL,
  provider_id TEXT NOT NULL,
  access_token TEXT,
  refresh_token TEXT,
  id_token TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  password TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Verification tokens table (better-auth)
CREATE TABLE IF NOT EXISTS jamii.verification (
  id TEXT PRIMARY KEY,
  identifier TEXT NOT NULL,
  value TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Plans table (Free, Basic, Premium)
CREATE TABLE IF NOT EXISTS jamii.plans (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  price_monthly DECIMAL(10, 2) NOT NULL,
  price_yearly DECIMAL(10, 2) NOT NULL,
  max_groups INTEGER NOT NULL,
  max_members_per_group INTEGER NOT NULL,
  features JSONB NOT NULL,
  stripe_price_id_monthly TEXT,
  stripe_price_id_yearly TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User subscriptions
CREATE TABLE IF NOT EXISTS jamii.user_subscriptions (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES jamii.user(id) ON DELETE CASCADE,
  plan_id INTEGER NOT NULL REFERENCES jamii.plans(id),
  stripe_subscription_id TEXT,
  status TEXT NOT NULL CHECK (status IN ('active', 'canceled', 'past_due', 'trialing')),
  billing_cycle TEXT NOT NULL CHECK (billing_cycle IN ('monthly', 'yearly')),
  current_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Groups table
CREATE TABLE IF NOT EXISTS jamii.groups (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_by TEXT NOT NULL REFERENCES jamii.user(id),
  contribution_frequency TEXT NOT NULL CHECK (contribution_frequency IN ('weekly', 'biweekly', 'monthly')),
  contribution_amount DECIMAL(10, 2) NOT NULL,
  contribution_day INTEGER, -- Day of week (1-7) or day of month (1-31)
  loan_interest_rate DECIMAL(5, 2) DEFAULT 0,
  max_loan_amount DECIMAL(10, 2),
  late_fee_amount DECIMAL(10, 2) DEFAULT 0,
  grace_period_days INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Group members
CREATE TABLE IF NOT EXISTS jamii.group_members (
  id SERIAL PRIMARY KEY,
  group_id INTEGER NOT NULL REFERENCES jamii.groups(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES jamii.user(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'member')),
  status TEXT NOT NULL CHECK (status IN ('active', 'pending', 'removed')),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(group_id, user_id)
);

-- Group invitations
CREATE TABLE IF NOT EXISTS jamii.group_invitations (
  id SERIAL PRIMARY KEY,
  group_id INTEGER NOT NULL REFERENCES jamii.groups(id) ON DELETE CASCADE,
  invited_by TEXT NOT NULL REFERENCES jamii.user(id),
  email TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL CHECK (status IN ('pending', 'accepted', 'expired')) DEFAULT 'pending',
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contributions
CREATE TABLE IF NOT EXISTS jamii.contributions (
  id SERIAL PRIMARY KEY,
  group_id INTEGER NOT NULL REFERENCES jamii.groups(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES jamii.user(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('cash', 'bank_transfer', 'mobile_money', 'card')),
  reference_number TEXT,
  status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  approved_by TEXT REFERENCES jamii.user(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Loans
CREATE TABLE IF NOT EXISTS jamii.loans (
  id SERIAL PRIMARY KEY,
  group_id INTEGER NOT NULL REFERENCES jamii.groups(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES jamii.user(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  interest_rate DECIMAL(5, 2) NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL, -- Principal + Interest
  purpose TEXT NOT NULL,
  repayment_schedule TEXT NOT NULL CHECK (repayment_schedule IN ('weekly', 'biweekly', 'monthly')),
  duration_months INTEGER NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'rejected', 'active', 'completed', 'defaulted')) DEFAULT 'pending',
  approved_by TEXT REFERENCES jamii.user(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  disbursed_at TIMESTAMP WITH TIME ZONE,
  due_date TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Loan repayments
CREATE TABLE IF NOT EXISTS jamii.loan_repayments (
  id SERIAL PRIMARY KEY,
  loan_id INTEGER NOT NULL REFERENCES jamii.loans(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('cash', 'bank_transfer', 'mobile_money', 'card')),
  reference_number TEXT,
  status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  approved_by TEXT REFERENCES jamii.user(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications
CREATE TABLE IF NOT EXISTS jamii.notifications (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES jamii.user(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('contribution_reminder', 'loan_reminder', 'approval_needed', 'group_invite', 'general')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit logs
CREATE TABLE IF NOT EXISTS jamii.audit_logs (
  id SERIAL PRIMARY KEY,
  user_id TEXT REFERENCES jamii.user(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  changes JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_email ON jamii.user(email);
CREATE INDEX IF NOT EXISTS idx_session_user_id ON jamii.session(user_id);
CREATE INDEX IF NOT EXISTS idx_session_token ON jamii.session(token);
CREATE INDEX IF NOT EXISTS idx_account_user_id ON jamii.account(user_id);
CREATE INDEX IF NOT EXISTS idx_group_members_user_id ON jamii.group_members(user_id);
CREATE INDEX IF NOT EXISTS idx_group_members_group_id ON jamii.group_members(group_id);
CREATE INDEX IF NOT EXISTS idx_contributions_group_id ON jamii.contributions(group_id);
CREATE INDEX IF NOT EXISTS idx_contributions_user_id ON jamii.contributions(user_id);
CREATE INDEX IF NOT EXISTS idx_contributions_status ON jamii.contributions(status);
CREATE INDEX IF NOT EXISTS idx_loans_group_id ON jamii.loans(group_id);
CREATE INDEX IF NOT EXISTS idx_loans_user_id ON jamii.loans(user_id);
CREATE INDEX IF NOT EXISTS idx_loans_status ON jamii.loans(status);
CREATE INDEX IF NOT EXISTS idx_loan_repayments_loan_id ON jamii.loan_repayments(loan_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON jamii.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON jamii.notifications(read);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON jamii.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON jamii.audit_logs(entity_type, entity_id);
