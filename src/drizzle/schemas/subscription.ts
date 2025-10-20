import { integer, numeric, pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { user } from './auth';
import { plan } from './plan';
import { subscription_type } from './subscription-type';
import { baseSchema } from './base-schema';

export const subscriptionStatusEnum = baseSchema.enum('subscription_status', [
  'active',
  'canceled',
  'past_due',
  'trial',
]);
export const subscriptionBillingCycleEnum = baseSchema.enum('subscription_billing_cycle', [
  'monthly',
  'yearly',
]);

export const subscription = baseSchema.table('subscription', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  user_id: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  plan_id: integer('plan_id')
    .notNull()
    .references(() => plan.id, { onDelete: 'cascade' }),
  stripe_subscription_id: text('stripe_subscription_id'),
  status: text('status').notNull().default('active'),
  subscription_type_id: integer('subscription_type_id')
    .notNull()
    .references(() => subscription_type.id, { onDelete: 'cascade' }),
  amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
  current_period_start: timestamp('current_period_start').notNull(),
  current_period_end: timestamp('current_period_end').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});
