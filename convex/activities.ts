import { v } from "convex/values";
import { internalMutation, MutationCtx, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Entity, EntityAction } from "./constants";
import { internal } from "./_generated/api";
import { Doc, Id } from "./_generated/dataModel";

export const getActivitiesByCommunity = query({
  args: { communityId: v.id("communities") },
  handler: async (ctx, { communityId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthenticated");
    }
    const activities = await ctx.db
      .query("activity")
      .withIndex("communityId", (q) => q.eq("communityId", communityId))
      .order("desc")
      .collect();

    return Promise.all(
      activities.map(async (activity: Doc<"activity">) => {
        const user = await ctx.db.get(activity.userId);
        return { ...activity, userEmail: user?.email };
      }),
    );
  },
});

export const createActivity = internalMutation({
  args: {
    communityId: v.id("communities"),
    entity: v.string(),
    action: v.string(),
    metadata: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthenticated");
    }
    return await ctx.db.insert("activity", { userId, ...args });
  },
});

export async function logActivity<E extends Entity>(
  ctx: any,
  args: {
    communityId: Id<"communities">;
    entity: E;
    action: EntityAction<E>;
    metadata: string;
  },
) {
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    throw new Error("Unauthenticated");
  }
  return await ctx.runMutation(internal.activities.createActivity, {
    communityId: args.communityId,
    entity: args.entity,
    action: args.action,
    metadata: args.metadata,
  });
}
