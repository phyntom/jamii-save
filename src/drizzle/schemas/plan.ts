import { integer, jsonb, numeric, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { baseSchema } from './base-schema';

export const plan = baseSchema.table('plan', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  name: text('name').notNull().unique(),
  description: text('description'),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  max_groups: integer('max_groups').notNull(),
  max_members_per_group: integer('max_members_per_group').notNull(),
  features: jsonb('features'), // Rich JSON with feature flags and descriptions
  stripe_price_id_monthly: text('stripe_price_id_monthly'),
  stripe_price_id_yearly: text('stripe_price_id_yearly'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});
