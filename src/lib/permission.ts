import { createAccessControl } from 'better-auth/plugins/access';
import { defaultStatements, adminAc } from 'better-auth/plugins/organization/access';

const statement = {
  ...defaultStatements,
  project: ['create', 'share', 'update', 'delete'],
} as const;

const ac = createAccessControl(statement);

const member = ac.newRole({
  project: ['create'],
});

const admin = ac.newRole({
  project: ['create', 'share', 'update', 'delete'],
});

const owner = ac.newRole({
  ...adminAc,
  project: ['create', 'share', 'update', 'delete'],
  organization: ['update', 'delete'],
  member: ['create', 'update', 'delete'],
  invitation: ['create', 'cancel'],
  team: [],
  ac: ['create', 'read', 'update', 'delete'],
});

export { ac, admin, member, owner, statement };
