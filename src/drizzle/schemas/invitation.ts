import {
  integer,
  PgColumn,
  pgEnum,
  pgTable,
  PgTableWithColumns,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';
import { nanoid } from 'nanoid';
import { user } from './auth';
import { community } from './community';
import { baseSchema } from './base-schema';
import { role } from './member';
import { relations } from 'drizzle-orm';

export const invitation = baseSchema.table('invitation', {
  id: text('id').primaryKey(),
  communityId: text('community_id')
    .notNull()
    .references(() => community.id, { onDelete: 'cascade' }),
  email: text('email').notNull(),
  role: role('role'),
  status: text('status').default('pending').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  inviterId: text('inviter_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
});

export const invitationRelations = relations(invitation, ({ one }) => ({
  inviter: one(user, {
    fields: [invitation.inviterId],
    references: [user.id],
  }),
  community: one(community, {
    fields: [invitation.communityId],
    references: [community.id],
  }),
}));

export type Invitation = typeof invitation.$inferSelect;

// id	string	PK	Unique identifier for each invitation
// email	string	-	The email address of the user
// inviterId	string	FK	The ID of the inviter
// organizationId	string	FK	The ID of the organization
// role	string	-	The role of the user in the organization
// status	string	-	The status of the invitation
// expiresAt	Date	-	Timestamp of when the invitation expires
