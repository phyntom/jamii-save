import { boolean, integer, numeric, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { nanoid } from 'nanoid';
import { baseSchema } from './base-schema';
import { community } from './community';

export const communityLoanTerm = baseSchema.table('community_loan_term', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => nanoid()),
  community_id: text('community_id')
    .notNull()
    .references(() => community.id, { onDelete: 'cascade' }),
  
  // Loan feature toggle
  loans_enabled: boolean('loans_enabled').notNull().default(false),
  
  // Loan settings
  max_loan_amount: numeric('max_loan_amount', { precision: 10, scale: 2 }),
  interest_rate: numeric('interest_rate', { precision: 5, scale: 2 }).default('0'),
  late_fee_amount: numeric('late_fee_amount', { precision: 10, scale: 2 }).default('0'),
  grace_period_days: integer('grace_period_days').default(0),
  
  // Loan terms
  max_loan_duration_days: integer('max_loan_duration_days'),
  min_loan_amount: numeric('min_loan_amount', { precision: 10, scale: 2 }),
  
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});
