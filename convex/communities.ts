import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getById = query({
  args: {
    id: v.id("communities"),
  },
  handler: async (ctx, { id }) => {
    const community = await ctx.db.get("communities", id);
    if (!community) return null;
    return community;
  },
});

export const getBySlug = query({
  args: {
    slug: v.string(),
  },
  handler: async (ctx, { slug }) => {
    const community = await ctx.db
      .query("communities")
      .withIndex("slug", (q) => q.eq("slug", slug))
      .first();
    if (!community) return null;
    return community;
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    country: v.string(),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthenticated");

    const existing = await ctx.db
      .query("communities")
      .withIndex("slug", (q) => q.eq("slug", args.slug))
      .first();
    if (existing) throw new Error("slug already taken");

    const communityId = await ctx.db.insert("communities", {
      ...args,
      createdBy: userId,
    });

    await ctx.db.insert("memberships", {
      communityId,
      userId,
      role: "owner",
      joinedAt: Date.now(),
    });

    return communityId;
  },
});

export const update = mutation({
  args: {
    id: v.id("communities"),
    name: v.string(),
    country: v.string(),
    description: v.optional(v.string()),
    isActive: v.boolean(),
  },
  handler: async (ctx, { id, ...fields }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthenticated");
    await ctx.db.patch(id, fields);
  },
});

export const uploadFile = mutation({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthenticated");
    const fileId = await ctx.storage.generateUploadUrl();
    return fileId;
  },
});
