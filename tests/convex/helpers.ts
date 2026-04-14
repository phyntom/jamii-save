/// <reference types="vite/client" />
import { convexTest } from "convex-test";
import type { Id } from "../../convex/_generated/dataModel";

export const convexModules = import.meta.glob(["../../convex/**/*.ts"]);

export function sessionSubjectForUser(userId: Id<"users">) {
  return `${userId}|test-session`;
}

type TestClient = ReturnType<typeof convexTest>;

export async function insertUser(
  t: TestClient,
  email = "tester@example.com",
): Promise<Id<"users">> {
  return await t.run(async (ctx) => {
    return await ctx.db.insert("users", { email });
  });
}

export async function insertCommunity(
  t: TestClient,
  args: {
    ownerId: Id<"users">;
    name: string;
    slug: string;
    country?: string;
  },
): Promise<Id<"communities">> {
  const { ownerId, name, slug, country = "US" } = args;
  return await t.run(async (ctx) => {
    return await ctx.db.insert("communities", {
      name,
      slug,
      createdBy: ownerId,
      isActive: true,
      country,
    });
  });
}
