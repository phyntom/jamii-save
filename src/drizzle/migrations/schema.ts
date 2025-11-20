import { pgTable, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const communityMemberRole = pgEnum("community_member_role", ['super_admin', 'admin', 'member'])
export const communityMemberStatus = pgEnum("community_member_status", ['active', 'pending', 'removed'])
export const communityVisibility = pgEnum("community_visibility", ['public', 'private'])
export const invitationStatus = pgEnum("invitation_status", ['pending', 'declined', 'accepted'])
export const invitationType = pgEnum("invitation_type", ['email', 'link', 'code'])
export const userSubscriptionBillingCycle = pgEnum("user_subscription_billing_cycle", ['monthly', 'yearly'])
export const userSubscriptionStatus = pgEnum("user_subscription_status", ['active', 'canceled', 'past_due', 'trial'])



