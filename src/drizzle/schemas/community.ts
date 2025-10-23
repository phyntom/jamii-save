import { boolean, integer, numeric, pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { nanoid } from 'nanoid';
import { user } from './auth';
import { plan } from './plan';
import { baseSchema } from './base-schema';

export const visibilityEnum = baseSchema.enum('visibility', ['public', 'private', 'unlisted']);
export const currencyEnum = baseSchema.enum('currency', [
  'CAD',
  'USD',
  'EUR',
  'GBP',
  'KES',
  'NGN',
  'ZAR',
  'GHS',
  'TZS',
  'UGX',
  'RWF',
]);

export const countryEnum = baseSchema.enum('country', [
  'CANADA', // CAD
  'UNITED_STATES', // USD
  'UNITED_KINGDOM', // GBP
  'EUROZONE', // EUR
  'KENYA', // KES
  'NIGERIA', // NGN
  'SOUTH_AFRICA', // ZAR
  'GHANA', // GHS
  'TANZANIA', // TZS
  'UGANDA', // UGX
  'RWANDA', // RWF
]);
export const community = baseSchema.table('community', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => nanoid()),
  name: text('name').notNull(),
  description: text('description'),
  visibility: visibilityEnum('visibility').notNull().default('private'),
  contribution_frequency: text('contribution_frequency').notNull().default('monthly'),
  country: text('country').notNull().default('CANADA'),
  currency: currencyEnum('currency').notNull().default('CAD'),
  target_amount: numeric('contribution_amount', {
    precision: 10,
    scale: 2,
  }).notNull(),
  current_member_count: integer('current_member_count').notNull().default(0),
  additional_member_count: integer('additional_member_count').notNull().default(0),
  is_active: boolean('is_active').default(true).notNull(),
  admin_id: text('admin_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  admin_email: text('admin_email').notNull(),
  max_members: integer('max_members').notNull().default(30),
  plan_type: integer('plan_type')
    .notNull()
    .references(() => plan.id, { onDelete: 'cascade' }),
  logo_url: text('logo_url'),
  contribution_start_date: timestamp('contribution_start_date'),
  community_start_date: timestamp('community_start_date'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});
