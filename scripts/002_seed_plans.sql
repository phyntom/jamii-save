-- Insert default plans
INSERT INTO jamii.plans (name, price_monthly, price_yearly, max_groups, max_members_per_group, features)
VALUES 
  (
    'Free',
    0.00,
    0.00,
    1,
    10,
    '{"basic_reporting": true, "email_notifications": true, "contribution_tracking": true}'::jsonb
  ),
  (
    'Basic',
    9.99,
    99.99,
    5,
    50,
    '{"basic_reporting": true, "email_notifications": true, "sms_notifications": true, "contribution_tracking": true, "loan_management": true, "export_data": true}'::jsonb
  ),
  (
    'Premium',
    29.99,
    299.99,
    999999,
    999999,
    '{"advanced_reporting": true, "email_notifications": true, "sms_notifications": true, "push_notifications": true, "contribution_tracking": true, "loan_management": true, "export_data": true, "custom_branding": true, "priority_support": true, "api_access": true}'::jsonb
  )
ON CONFLICT (name) DO NOTHING;
