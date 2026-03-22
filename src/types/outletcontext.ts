import { Doc } from "convex/_generated/dataModel";

export interface OutletContext {
  community: Doc<"communities">;
  membership: Doc<"memberships">;
}
