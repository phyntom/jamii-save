import { boolean, integer, numeric, pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { nanoid } from 'nanoid';
import { plan } from './plan';
import { baseSchema } from './base-schema';
import { relations } from 'drizzle-orm';
import { member } from './member';

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
  slug: text('slug').notNull().unique(),
  logo: text('logo'),
  created_at: timestamp('created_at').notNull(),
  metadata: text('metadata'),
  visibility: visibilityEnum('visibility').notNull().default('private'),
  contributionFrequency: text('contribution_frequency').notNull().default('monthly'),
  country: countryEnum('country').notNull().default('CANADA'),
  currency: currencyEnum('currency').notNull().default('CAD'),
  targetAmount: numeric('contribution_amount', {
    precision: 10,
    scale: 2,
  }).notNull(),
  currentMemberCount: integer('current_member_count').notNull().default(0),
  additionalMemberCount: integer('additional_member_count').notNull().default(0),
  isActive: boolean('is_active').default(true).notNull(),
  adminEmail: text('admin_email').notNull(),
  maxMembers: integer('max_members').notNull().default(30),
  planType: integer('plan_type')
    .notNull()
    .references(() => plan.id, { onDelete: 'cascade' }),
  contributionStartDate: timestamp('contribution_start_date'),
  communityStartDate: timestamp('community_start_date'),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const communityRelations = relations(community, ({ many }) => ({
  members: many(member),
}));

export type Community = typeof community.$inferSelect;
