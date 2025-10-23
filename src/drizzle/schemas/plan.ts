import { integer, jsonb, numeric, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { baseSchema } from './base-schema';

export const plan = baseSchema.table('plan', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  name: text('name').notNull().unique(),
  description: text('description'),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  
  // Plan limits
  max_communities: integer('max_communities').notNull(),
  base_members_per_community: integer('base_members_per_community').notNull(),
  max_members_per_community: integer('max_members_per_community').notNull(),
  
  // Additional member pricing (for Advanced plan)
  additional_member_price: numeric('additional_member_price', { precision: 10, scale: 2 }),
  additional_member_batch_size: integer('additional_member_batch_size'), // e.g., 10 members per batch
  
  features: jsonb('features'),
  stripe_price_id_monthly: text('stripe_price_id_monthly'),
  stripe_price_id_yearly: text('stripe_price_id_yearly'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export type Plan = typeof plan.$inferSelect;
