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

/**
 * Currency choices for contributions. This is a simplified list; in a real application, you'd likely want to support more currencies and use a library for handling them.
 */
export const CURRENCIES = {
  USD: "USD",
  CAD: "CAD",
  EUR: "EUR",
  GBP: "GBP",
  KES: "KES",
  RWF: "RWF",
} as const;

/**
 * Contribution Frequency options. This is a simplified list; you may want to support more options or allow custom frequencies in a real application.
 */
export const CONTRIBUTION_FREQUENCIES = {
  weekly: "weekly",
  biweekly: "biweekly",
  monthly: "monthly",
  quarterly: "quarterly",
  annually: "annually",
} as const;

export type Currency = (typeof CURRENCIES)[keyof typeof CURRENCIES];

export type Action = (typeof ACTIONS)[keyof typeof ACTIONS];

export type ContributionFrequency =
  (typeof CONTRIBUTION_FREQUENCIES)[keyof typeof CONTRIBUTION_FREQUENCIES];

export const ENTITY_ACTIONS = {
  community: [ACTIONS.CREATED, ACTIONS.UPDATED, ACTIONS.DELETED],
  member: [ACTIONS.INVITED, ACTIONS.JOINED, ACTIONS.REMOVED],
  invite: [ACTIONS.SENT, ACTIONS.INVITED, ACTIONS.REMOVED, ACTIONS.CANCELLED],
  contribution: [ACTIONS.CREATED, ACTIONS.UPDATED, ACTIONS.DELETED],
} as const;

export type Entity = keyof typeof ENTITY_ACTIONS;

export type EntityAction<E extends Entity> = (typeof ENTITY_ACTIONS)[E][number];
