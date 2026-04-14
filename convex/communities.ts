import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { logActivity } from "./activities";
import { ACTIONS } from "./constants";

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

export const createCommunity = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    country: v.string(),
    currency: v.string(),
    targetAmount: v.number(),
    contributionFrequency: v.optional(v.string()),
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
    await logActivity(ctx, {
      communityId,
      entity: "community",
      action: ACTIONS.CREATED,
      metadata: `${userId} created ${args.name}`,
    });
    return communityId;
  },
});

export const updateCommunity = mutation({
  args: {
    communityId: v.id("communities"),
    name: v.string(),
    country: v.string(),
    description: v.optional(v.string()),
    isActive: v.boolean(),
    logo: v.optional(v.id("_storage")),
  },
  handler: async (ctx, { communityId, ...fields }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthenticated");
    if (fields.logo !== undefined) {
      const existing = await ctx.db.get(communityId);
      if (existing?.logo && existing.logo !== fields.logo) {
        await ctx.storage.delete(existing.logo);
      }
    }
    await ctx.db.patch(communityId, fields);
    return communityId;
  },
});

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthenticated");
    const fileId = await ctx.storage.generateUploadUrl();
    return fileId;
  },
});

export const getLogoUrl = query({
  args: {
    storageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, { storageId }) => {
    if (!storageId) return null;
    return ctx.storage.getUrl(storageId);
  },
});
