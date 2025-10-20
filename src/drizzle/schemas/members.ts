import { pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { nanoid } from 'nanoid';
import { user } from './auth';
import { communities } from './communities';
import { baseSchema } from './base-schema';

export const memberRoleEnum = baseSchema.enum('member_role', ['super_admin', 'admin', 'member']);
export const memberStatusEnum = baseSchema.enum('member_status', ['active', 'pending', 'removed']);

export const members = baseSchema.table('members', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => nanoid()),
  community_id: text('community_id')
    .notNull()
    .references(() => communities.id, { onDelete: 'cascade' }),
  user_id: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  role: memberRoleEnum('role').notNull().default('member'),
  status: memberStatusEnum('status').notNull().default('active'),
  invited_at: timestamp('invited_at'),
  joined_at: timestamp('joined_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});
