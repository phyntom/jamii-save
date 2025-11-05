import { community } from '@/drizzle/schema';
import { db } from '@/drizzle/db';
import { invitation } from './../../auth-schema';
import { eq } from 'drizzle-orm';

export async function getInvitation(invitationId: string) {
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
