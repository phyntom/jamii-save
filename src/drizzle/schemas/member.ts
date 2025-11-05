import { pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { nanoid } from 'nanoid';
import { user } from './auth';
import { community } from './community';
import { baseSchema } from './base-schema';
import { relations } from 'drizzle-orm';

// export const memberStatusEnum = baseSchema.enum('member_status', ['active', 'pending', 'removed']);

export const role = baseSchema.enum('role', ['member', 'admin', 'owner']);

export const member = baseSchema.table('member', {
  id: text('id').primaryKey(),
  communityId: text('community_id')
    .notNull()
    .references(() => community.id, { onDelete: 'cascade' }),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  role: role('role').default('member').notNull(),
  created_at: timestamp('created_at').notNull(),
  status: text('status').notNull().default('active'),
  updatedAt: timestamp('updated_at'),
  metadata: text('metadata'),
});

export const memberRelations = relations(member, ({ one }) => ({
  community: one(community, {
    fields: [member.communityId],
    references: [community.id],
  }),
  user: one(user, {
    fields: [member.userId], // Update this reference too
    references: [user.id],
  }),
}));

export type Member = typeof member.$inferSelect & {
  user: typeof user.$inferSelect;
};

export type Role = (typeof role.enumValues)[number];
