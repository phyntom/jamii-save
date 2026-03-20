import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

// The schema is normally optional, but Convex Auth
// requires indexes defined on `authTables`.
// The schema provides more precise TypeScript types.
export default defineSchema({
  ...authTables,
  communities: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    logo: v.optional(v.string()),
    slug: v.string(),
    createdBy: v.id("users"),
    isActive: v.boolean(),
    country: v.optional(v.string()),
    metadata: v.optional(v.string()),
  }).index("slug", ["slug"]),

  memberships: defineTable({
    communityId: v.id("communities"),
    joinedAt: v.number(),
    role: v.string(),
    userId: v.id("users"),
  })
    .index("communityId", ["communityId"])
    .index("userId", ["userId"])
    .index("communityIdAndUserId", ["communityId", "userId"]),

  invites: defineTable({
    email: v.string(),
    communityId: v.id("communities"),
    invitedBy: v.id("users"),
    token: v.string(),
    expiresAt: v.number(),
  })
    .index("token", ["token"])
    .index("communityId", ["communityId"])
    .index("email", ["email"]),
  contribution: defineTable({
    communityId: v.id("communities"),
    userId: v.id("users"),
    reference: v.string(),
    amount: v.number(),
    createdAt: v.number(),
    payment_method: v.string(),
    status: v.string(),
  }).index("communityId", ["communityId"]),
});
