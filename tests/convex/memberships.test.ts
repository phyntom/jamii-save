import { convexTest } from "convex-test";
import { describe, expect, test } from "vitest";
import { api } from "../../convex/_generated/api";
import schema from "../../convex/schema";
import {
  convexModules,
  insertCommunity,
  insertUser,
  sessionSubjectForUser,
} from "./helpers";

describe("memberships.getCommunityMembers", () => {
  test("returns an empty array when the community has no members", async () => {
    const t = convexTest(schema, convexModules);
    const ownerId = await insertUser(t);
    const communityId = await insertCommunity(t, {
      ownerId,
      name: "Empty",
      slug: "empty-community",
    });

    const members = await t.query(api.memberships.getCommunityMembers, {
      communityId,
    });

    expect(members).toEqual([]);
  });

  test("returns memberships with joined user documents, newest membership first", async () => {
    const t = convexTest(schema, convexModules);
    const ownerId = await insertUser(t, "owner@example.com");
    const memberId = await insertUser(t, "member@example.com");
    const communityId = await insertCommunity(t, {
      ownerId,
      name: "Crowded",
      slug: "crowded",
    });

    await t.run(async (ctx) => {
      await ctx.db.insert("memberships", {
        communityId,
        userId: ownerId,
        role: "owner",
        joinedAt: 1000,
      });
      await ctx.db.insert("memberships", {
        communityId,
        userId: memberId,
        role: "member",
        joinedAt: 2000,
      });
    });

    const members = await t.query(api.memberships.getCommunityMembers, {
      communityId,
    });

    expect(members).toHaveLength(2);
    expect(members[0]).toMatchObject({
      userId: memberId,
      role: "member",
      communityId,
    });
    expect(members[0].user).toMatchObject({
      _id: memberId,
      email: "member@example.com",
    });
    expect(members[1]).toMatchObject({
      userId: ownerId,
      role: "owner",
      communityId,
    });
    expect(members[1].user).toMatchObject({
      _id: ownerId,
      email: "owner@example.com",
    });
  });
});

describe("memberships.getUserCommunities", () => {
  test("returns an empty array when the user has no memberships", async () => {
    const t = convexTest(schema, convexModules);
    const lonerId = await insertUser(t, "loner@example.com");

    const communities = await t.query(api.memberships.getUserCommunities, {
      userId: lonerId,
    });

    expect(communities).toEqual([]);
  });

  test("returns community documents for each membership", async () => {
    const t = convexTest(schema, convexModules);
    const userId = await insertUser(t);
    const c1 = await insertCommunity(t, {
      ownerId: userId,
      name: "Alpha",
      slug: "alpha-group",
    });
    const c2 = await insertCommunity(t, {
      ownerId: userId,
      name: "Beta",
      slug: "beta-group",
    });

    await t.run(async (ctx) => {
      await ctx.db.insert("memberships", {
        communityId: c1,
        userId,
        role: "owner",
        joinedAt: Date.now(),
      });
      await ctx.db.insert("memberships", {
        communityId: c2,
        userId,
        role: "owner",
        joinedAt: Date.now(),
      });
    });

    const communities = await t.query(api.memberships.getUserCommunities, {
      userId,
    });

    expect(communities).toHaveLength(2);
    const names = communities
      .filter((c): c is NonNullable<typeof c> => c !== null)
      .map((c) => c.name)
      .sort();
    expect(names).toEqual(["Alpha", "Beta"]);
  });
});

describe("memberships.getMyMembership", () => {
  test("returns null when the client is not authenticated", async () => {
    const t = convexTest(schema, convexModules);
    const ownerId = await insertUser(t);
    await insertCommunity(t, {
      ownerId,
      name: "Solo",
      slug: "solo",
    });

    const row = await t.query(api.memberships.getMyMembership, {
      slug: "solo",
    });

    expect(row).toBeNull();
  });

  test("returns null when no community matches the slug", async () => {
    const t = convexTest(schema, convexModules);
    const userId = await insertUser(t);
    const asUser = t.withIdentity({ subject: sessionSubjectForUser(userId) });

    const row = await asUser.query(api.memberships.getMyMembership, {
      slug: "missing-slug",
    });

    expect(row).toBeNull();
  });

  test("returns null when the user is not a member", async () => {
    const t = convexTest(schema, convexModules);
    const ownerId = await insertUser(t, "owner@example.com");
    const outsiderId = await insertUser(t, "outsider@example.com");
    const communityId = await insertCommunity(t, {
      ownerId,
      name: "Private",
      slug: "private-club",
    });
    await t.run(async (ctx) => {
      await ctx.db.insert("memberships", {
        communityId,
        userId: ownerId,
        role: "owner",
        joinedAt: Date.now(),
      });
    });

    const asOutsider = t.withIdentity({
      subject: sessionSubjectForUser(outsiderId),
    });
    const row = await asOutsider.query(api.memberships.getMyMembership, {
      slug: "private-club",
    });

    expect(row).toBeNull();
  });

  test("returns the membership when the user belongs to the community", async () => {
    const t = convexTest(schema, convexModules);
    const userId = await insertUser(t);
    const communityId = await insertCommunity(t, {
      ownerId: userId,
      name: "Joined",
      slug: "joined-here",
    });
    await t.run(async (ctx) => {
      await ctx.db.insert("memberships", {
        communityId,
        userId,
        role: "owner",
        joinedAt: 42,
      });
    });

    const asUser = t.withIdentity({ subject: sessionSubjectForUser(userId) });
    const row = await asUser.query(api.memberships.getMyMembership, {
      slug: "joined-here",
    });

    expect(row).toMatchObject({
      communityId,
      userId,
      role: "owner",
      joinedAt: 42,
    });
  });
});
