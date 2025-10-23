import { integer, pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { nanoid } from 'nanoid';
import { user } from './auth';
import { community } from './community';
import { baseSchema } from './base-schema';

export const invitationStatusEnum = baseSchema.enum('invitation_status', [
  'pending',
  'declined',
  'accepted',
]);
export const invitationTypeEnum = baseSchema.enum('invitation_type', ['email', 'link', 'code']);

export const invitation = baseSchema.table('invitation', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => nanoid()),
  community_id: text('community_id')
    .notNull()
    .references(() => community.id, { onDelete: 'cascade' }),
  invitation_type: invitationTypeEnum('invitation_type').notNull().default('email'),
  email: text('email'),
  code: text('code'),
  token: text('token').notNull().unique(),
  invited_by: text('invited_by')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  uses_count: integer('uses_count').default(0),
  metadata: text('metadata'),
  status: invitationStatusEnum('status').notNull().default('pending'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});
