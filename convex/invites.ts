import { v } from "convex/values";
import {
  internalMutation,
  internalQuery,
  mutation,
  query,
} from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// ── Queries ───────────────────────────────────────────────────────────────────

export const getInvitesByCommunity = query({
  args: { communityId: v.id("communities") },
  handler: async (ctx, { communityId }) => {
    const invites = await ctx.db
      .query("invites")
      .withIndex("communityId", (q) => q.eq("communityId", communityId))
      .order("desc")
      .collect();

    return Promise.all(
      invites.map(async (invite) => {
        const invitedBy = await ctx.db.get(invite.invitedBy);
        return { ...invite, invitedByUser: invitedBy };
      }),
    );
  },
});

export const getInviteById = internalQuery({
  args: { inviteId: v.id("invites") },
  handler: async (ctx, { inviteId }) => {
    return ctx.db.get(inviteId);
  },
});

export const hasPendingInvite = internalQuery({
  args: { communityId: v.id("communities"), email: v.string() },
  handler: async (ctx, { communityId, email }) => {
    const invite = await ctx.db
      .query("invites")
      .withIndex("email", (q) => q.eq("email", email))
      .filter((q) =>
        q.and(
          q.eq(q.field("communityId"), communityId),
          q.eq(q.field("status"), "pending"),
        ),
      )
      .first();
    return invite !== null;
  },
});

// ── Internal mutations (called from Node actions) ─────────────────────────────

export const insertInvite = internalMutation({
  args: {
    email: v.string(),
    communityId: v.id("communities"),
    invitedBy: v.id("users"),
    token: v.string(),
    expiresAt: v.number(),
  },
  handler: async (ctx, args) => {
    const invitationId = await ctx.db.insert("invites", {
      ...args,
      status: "pending",
    });
    return invitationId;
  },
});

export const patchInviteToken = internalMutation({
  args: {
    inviteId: v.id("invites"),
    token: v.string(),
    expiresAt: v.number(),
  },
  handler: async (ctx, { inviteId, token, expiresAt }) => {
    await ctx.db.patch(inviteId, { token, expiresAt, status: "pending" });
  },
});

// ── Public mutations ──────────────────────────────────────────────────────────

export const cancelInvite = mutation({
  args: { inviteId: v.id("invites") },
  handler: async (ctx, { inviteId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthenticated");
    await ctx.db.delete(inviteId);
  },
});

export const updateInviteStatus = mutation({
  args: {
    inviteId: v.id("invites"),
    status: v.union(v.literal("confirmed"), v.literal("declined")),
  },
  handler: async (ctx, { inviteId, status }) => {
    await ctx.db.patch(inviteId, { status });
  },
});
