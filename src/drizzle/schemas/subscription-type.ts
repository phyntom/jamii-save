import { integer, numeric, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { baseSchema } from './base-schema';

export const subscription_type = baseSchema.table('subscription_type', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  name: text('name').notNull(),
  description: text('description'),
  multiplier: numeric('multiplier', { precision: 10, scale: 2 }).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});
