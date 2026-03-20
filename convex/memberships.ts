import { v } from "convex/values";
import { query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getCommunityMembers = query({
  args: { communityId: v.id("communities") },
  handler: async (ctx, { communityId }) => {
    const memberships = await ctx.db
      .query("memberships")
      .withIndex("communityId", (q) => q.eq("communityId", communityId))
      .order("desc")
      .collect();

    const members = await Promise.all(
      memberships.map(async (m) => {
        const user = await ctx.db.get(m.userId);
        return { ...m, user };
      }),
    );
    return members;
  },
});

export const getUserCommunities = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const memberships = await ctx.db
      .query("memberships")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();

    const communities = await Promise.all(
      memberships.map(
        (membership) => ctx.db.get(membership.communityId),
        // ctx.db.get("communities", membership.communityId
      ),
    );
    return communities;
  },
});

export const getMyMembership = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const community = await ctx.db
      .query("communities")
      .withIndex("slug", (q) => q.eq("slug", slug))
      .first();
    if (!community) return null;

    console.log("community", community);

    return ctx.db
      .query("memberships")
      .withIndex("communityIdAndUserId", (q) =>
        q.eq("communityId", community._id).eq("userId", userId),
      )
      .first();
  },
});
