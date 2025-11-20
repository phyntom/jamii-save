import { Invitation } from './../drizzle/schemas/invitation';
import { community } from '@/drizzle/schema';
import { db } from '@/drizzle/db';
import { invitation } from './../../auth-schema';
import { and, eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export async function getInvitationById(invitationId: string) {
  const foundInvitation = await db.query.invitation.findFirst({
    where: eq(invitation.id, invitationId),
    with: {
      inviter: true,
      community: true,
    },
  });
  if (!foundInvitation) {
    return { success: false, message: 'Failed to fetch invitation' };
  }
  return { success: true, data: foundInvitation, message: 'Invitation fetched successfully' };
}

export async function getInvitationByEmail(email: string) {
  const foundInvitation: Invitation[] = await db.query.invitation.findMany({
    where: and(eq(invitation.email, email), eq(invitation.status, 'pending')),
    with: {
      inviter: true,
      community: true,
    },
  });
  if (!foundInvitation) {
    return { success: false, message: 'Failed to fetch invitation' };
  }
  return { success: true, data: foundInvitation, message: 'Invitation fetched successfully' };
}

export async function rejectInvitation(invitationId: string) {
  const foundInvitation = await db.query.invitation.findFirst({
    where: eq(invitation.id, invitationId),
  });
  if (foundInvitation) {
    await db.update(invitation).set({ status: 'rejected' }).where(eq(invitation.id, invitationId));
  }
  return { success: true, message: 'Invitation rejected successfully' };
}
