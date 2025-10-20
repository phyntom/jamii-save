import { boolean, integer, numeric, pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { nanoid } from 'nanoid';
import { user } from './auth';
import { plan } from './plan';
import { baseSchema } from './base-schema';

export const visibilityEnum = baseSchema.enum('visibility', ['public', 'private', 'unlisted']);

export const communities = baseSchema.table('communities', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => nanoid()),
  name: text('name').notNull(),
  description: text('description'),
  category: text('category'),
  visibility: visibilityEnum('visibility').notNull().default('private'),
  contribution_frequency: text('contribution_frequency').notNull().default('weekly'),
  contribution_amount: numeric('contribution_amount', {
    precision: 10,
    scale: 2,
  }).notNull(),
  contribution_day: integer('contribution_day').notNull().default(1),
  loan_interest_rate: numeric('loan_interest_rate', { precision: 5, scale: 2 })
    .notNull()
    .default('0'),
  max_loan_amount: numeric('max_loan_amount', { precision: 10, scale: 2 }),
  late_fee_amount: numeric('late_fee_amount', { precision: 10, scale: 2 }).notNull().default('0'),
  grace_period_days: integer('grace_period_days').notNull().default(0),
  is_active: boolean('is_active').default(true).notNull(),
  admin_id: text('admin_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  max_members: integer('max_members').notNull().default(30),
  plan_id: integer('plan_id')
    .notNull()
    .references(() => plan.id, { onDelete: 'cascade' }),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});
