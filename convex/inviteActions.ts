"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { internal } from "./_generated/api";
import { Resend } from "resend";
import { render } from "@react-email/render";
import { InviteEmail } from "../src/emails/InviteEmail";
import * as React from "react";
import { Id } from "./_generated/dataModel";

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

function generateToken(): string {
  return (
    crypto.randomUUID().replace(/-/g, "") +
    crypto.randomUUID().replace(/-/g, "")
  );
}

async function sendInviteEmail(
  resend: Resend,
  to: string,
  inviterName: string,
  communityName: string,
  token: string,
) {
  const appUrl = process.env.APP_URL ?? "http://localhost:5173";
  const inviteUrl = `${appUrl}/invite?token=${token}`;

  const html = await render(
    React.createElement(InviteEmail, { inviterName, communityName, inviteUrl }),
  );

  await resend.emails.send({
    from: "Jamii Save <invites@jamii-save.com>",
    to,
    subject: `${inviterName} invited you to join ${communityName}`,
    html,
  });
}

export const sendInvite = action({
  args: {
    email: v.string(),
    communityId: v.id("communities"),
    communityName: v.string(),
    inviterName: v.string(),
  },
  handler: async (ctx, { email, communityId, communityName, inviterName }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthenticated");

    const alreadyInvited: boolean = await ctx.runQuery(
      internal.invites.hasPendingInvite,
      { communityId, email },
    );
    if (alreadyInvited) {
      throw new Error("A pending invite already exists for this email.");
    }

    const token = generateToken();
    const expiresAt = Date.now() + SEVEN_DAYS_MS;

    await ctx.runMutation(internal.invites.insertInvite, {
      email,
      communityId,
      invitedBy: userId as Id<"users">,
      token,
      expiresAt,
    });

    const resend = new Resend(process.env.RESEND_API_KEY);
    await sendInviteEmail(resend, email, inviterName, communityName, token);
  },
});

export const resendInvite = action({
  args: {
    inviteId: v.id("invites"),
    communityName: v.string(),
    inviterName: v.string(),
  },
  handler: async (ctx, { inviteId, communityName, inviterName }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthenticated");

    const invite = await ctx.runQuery(internal.invites.getInviteById, {
      inviteId,
    });
    if (!invite) throw new Error("Invite not found");

    const token = generateToken();
    const expiresAt = Date.now() + SEVEN_DAYS_MS;

    await ctx.runMutation(internal.invites.patchInviteToken, {
      inviteId,
      token,
      expiresAt,
    });

    const resend = new Resend(process.env.RESEND_API_KEY);
    await sendInviteEmail(
      resend,
      invite.email,
      inviterName,
      communityName,
      token,
    );
  },
});
