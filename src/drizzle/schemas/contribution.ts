import { numeric, text, date, timestamp } from 'drizzle-orm/pg-core';
import { nanoid } from 'nanoid';
import { user } from './auth';
import { community } from './community';
import { baseSchema, currencyEnum } from './base-schema';

export const statusEnum = baseSchema.enum('status', ['pending', 'approved', 'rejected']);

export const contributionTypeEnum = baseSchema.enum('contribution_type', [
  'standard_contribution',
  'loan_payment',
  'social_activities',
  'emergency_fund',
  'other',
]);

export const paymentMethodEnum = baseSchema.enum('payment_method', [
  'bank_deposit',
  'mobile_money',
  'cash',
  'credit_card',
  'interac',
  'paypal',
]);

export const contribution = baseSchema.table('contribution', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => nanoid()),
  user_id: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  community_id: text('community_id')
    .notNull()
    .references(() => community.id, { onDelete: 'cascade' }),
  reference_number: text('reference_number').notNull(),
  contribution_type: contributionTypeEnum('contribution_type').default('standard_contribution'),
  contribution_amount: numeric('contribution_amount', {
    precision: 10,
    scale: 2,
  }).notNull(),
  payment_method: paymentMethodEnum('payment_method').default('cash'),
  currency: currencyEnum('currency').default('CAD'),
  contribution_date: date('contribution_date').notNull(),
  contribution_period: text('contribution_period').notNull(),
  status: statusEnum('status').default('pending'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});
