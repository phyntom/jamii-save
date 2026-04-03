export const ACTIONS = {
  CREATED: "created",
  UPDATED: "updated",
  DELETED: "deleted",
  INVITED: "invited",
  JOINED: "joined",
  SENT: "sent",
  CANCELLED: "cancelled",
  REMOVED: "removed",
} as const;

export type Action = (typeof ACTIONS)[keyof typeof ACTIONS];

export const ENTITY_ACTIONS = {
  community: [ACTIONS.CREATED, ACTIONS.UPDATED, ACTIONS.DELETED],
  member: [ACTIONS.INVITED, ACTIONS.JOINED, ACTIONS.REMOVED],
  invite: [ACTIONS.SENT, ACTIONS.INVITED, ACTIONS.REMOVED, ACTIONS.CANCELLED],
  contribution: [ACTIONS.CREATED, ACTIONS.UPDATED, ACTIONS.DELETED],
} as const;

export type Entity = keyof typeof ENTITY_ACTIONS;

export type EntityAction<E extends Entity> = (typeof ENTITY_ACTIONS)[E][number];
