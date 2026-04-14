import { convexTest } from "convex-test";
import { expect, test, describe } from "vitest";
import { api } from "../../convex/_generated/api";
import schema from "../../convex/schema";
import { ACTIONS } from "../../convex/constants";
import { convexModules, insertUser, sessionSubjectForUser } from "./helpers";

describe("communities.getById", () => {
  test("returns null when the community does not exist", async () => {
    const t = convexTest(schema, convexModules);
    const userId = await insertUser(t);
    const deletedId = await t.run(async (ctx) => {
      const id = await ctx.db.insert("communities", {
        name: "Deleted",
        slug: "deleted-temp",
        createdBy: userId,
        isActive: true,
        country: "US",
      });
      await ctx.db.delete(id);
      return id;
    });
    const result = await t.query(api.communities.getById, { id: deletedId });
    expect(result).toBeNull();
  });

  test("returns the community document when it exists", async () => {
    const t = convexTest(schema, convexModules);
    const userId = await insertUser(t);
    const communityId = await t.run(async (ctx) => {
      return await ctx.db.insert("communities", {
        name: "Riverdale",
        slug: "riverdale",
        createdBy: userId,
        isActive: true,
        country: "US",
      });
    });

    const result = await t.query(api.communities.getById, {
      id: communityId,
    });

    expect(result).toMatchObject({
      _id: communityId,
      name: "Riverdale",
      slug: "riverdale",
      createdBy: userId,
      isActive: true,
      country: "US",
    });
  });
});

describe("communities.getBySlug", () => {
  test("returns null when no community has the slug", async () => {
    const t = convexTest(schema, convexModules);
    const result = await t.query(api.communities.getBySlug, {
      slug: "nonexistent-slug",
    });
    expect(result).toBeNull();
  });

  test("returns the community matching the slug index", async () => {
    const t = convexTest(schema, convexModules);
    const userId = await insertUser(t);
    const communityId = await t.run(async (ctx) => {
      return await ctx.db.insert("communities", {
        name: "Hill Valley",
        slug: "hill-valley",
        createdBy: userId,
        isActive: true,
        country: "US",
      });
    });

    const result = await t.query(api.communities.getBySlug, {
      slug: "hill-valley",
    });

    expect(result).toMatchObject({
      _id: communityId,
      slug: "hill-valley",
      name: "Hill Valley",
    });
  });
});

describe("communities.createCommunity", () => {
  test("throws when the caller is not authenticated", async () => {
    const t = convexTest(schema, convexModules);

    await expect(
      t.mutation(api.communities.createCommunity, {
        name: "No Auth",
        slug: "no-auth",
        description: "x",
        country: "US",
        isActive: true,
      }),
    ).rejects.toThrow("Unauthenticated");
  });

  test("throws when the slug is already taken", async () => {
    const t = convexTest(schema, convexModules);
    const userId = await insertUser(t);
    const asUser = t.withIdentity({ subject: sessionSubjectForUser(userId) });

    await asUser.mutation(api.communities.createCommunity, {
      name: "First",
      slug: "duplicate-slug",
      country: "US",
      isActive: true,
    });

    await expect(
      asUser.mutation(api.communities.createCommunity, {
        name: "Second",
        slug: "duplicate-slug",
        country: "CA",
        isActive: true,
      }),
    ).rejects.toThrow("slug already taken");
  });

  test("creates community, owner membership, and activity when authenticated", async () => {
    const t = convexTest(schema, convexModules);
    const userId = await insertUser(t);
    const asUser = t.withIdentity({ subject: sessionSubjectForUser(userId) });

    const communityId = await asUser.mutation(api.communities.createCommunity, {
      name: "Oakhaven",
      slug: "oakhaven",
      description: "A test community",
      country: "KE",
      isActive: true,
    });

    const community = await t.run(async (ctx) => {
      return await ctx.db.get(communityId);
    });
    expect(community).toMatchObject({
      name: "Oakhaven",
      slug: "oakhaven",
      description: "A test community",
      country: "KE",
      createdBy: userId,
      isActive: true,
    });

    const membership = await t.run(async (ctx) => {
      return await ctx.db
        .query("memberships")
        .withIndex("communityIdAndUserId", (q) =>
          q.eq("communityId", communityId).eq("userId", userId),
        )
        .unique();
    });
    expect(membership).toMatchObject({
      communityId,
      userId,
      role: "owner",
    });

    const activity = await t.run(async (ctx) => {
      return await ctx.db
        .query("activity")
        .withIndex("communityId", (q) => q.eq("communityId", communityId))
        .first();
    });
    expect(activity).toMatchObject({
      communityId,
      userId,
      entity: "community",
      action: ACTIONS.CREATED,
      metadata: `${userId} created Oakhaven`,
    });
  });
});

describe("communities.updateCommunity", () => {
  test("throws when the caller is not authenticated", async () => {
    const t = convexTest(schema, convexModules);
    const userId = await insertUser(t);
    const communityId = await t.run(async (ctx) => {
      return await ctx.db.insert("communities", {
        name: "Locked",
        slug: "locked",
        createdBy: userId,
        isActive: true,
        country: "US",
      });
    });

    await expect(
      t.mutation(api.communities.updateCommunity, {
        communityId,
        name: "Updated",
        country: "CA",
        description: "new",
        isActive: false,
      }),
    ).rejects.toThrow("Unauthenticated");
  });

  test("patches fields on an existing community", async () => {
    const t = convexTest(schema, convexModules);
    const userId = await insertUser(t);
    const asUser = t.withIdentity({ subject: sessionSubjectForUser(userId) });
    const communityId = await t.run(async (ctx) => {
      return await ctx.db.insert("communities", {
        name: "Before",
        slug: "before-patch",
        createdBy: userId,
        isActive: true,
        country: "US",
      });
    });

    await asUser.mutation(api.communities.updateCommunity, {
      communityId,
      name: "After",
      country: "RW",
      description: "Patched description",
      isActive: false,
    });

    const updated = await t.run(async (ctx) => {
      return await ctx.db.get(communityId);
    });
    expect(updated).toMatchObject({
      name: "After",
      country: "RW",
      description: "Patched description",
      isActive: false,
      slug: "before-patch",
    });
  });
});

describe("communities.generateUploadUrl", () => {
  test("throws when the caller is not authenticated", async () => {
    const t = convexTest(schema, convexModules);
    await expect(t.mutation(api.communities.generateUploadUrl, {})).rejects.toThrow(
      "Unauthenticated",
    );
  });

  test("returns a storage id when authenticated", async () => {
    const t = convexTest(schema, convexModules);
    const userId = await insertUser(t);
    const asUser = t.withIdentity({ subject: sessionSubjectForUser(userId) });

    const storageId = await asUser.mutation(api.communities.generateUploadUrl, {});
    expect(typeof storageId).toBe("string");
    expect(storageId.length).toBeGreaterThan(0);
  });
});

describe("communities.getLogoUrl", () => {
  test("returns null when storageId is omitted", async () => {
    const t = convexTest(schema, convexModules);
    const url = await t.query(api.communities.getLogoUrl, {});
    expect(url).toBeNull();
  });

  test("returns a signed URL when the blob exists, and null after it is deleted", async () => {
    const t = convexTest(schema, convexModules);
    const storageId = await t.run(async (ctx) => {
      return await ctx.storage.store(new Blob(["logo-bytes"], { type: "image/png" }));
    });

    let url = await t.query(api.communities.getLogoUrl, { storageId });
    expect(url).toMatch(/^https:\/\//);

    await t.run(async (ctx) => {
      await ctx.storage.delete(storageId);
    });

    url = await t.query(api.communities.getLogoUrl, { storageId });
    expect(url).toBeNull();
  });
});
