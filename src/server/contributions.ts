'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { getSession } from '@/server/authentication';
import { sql, db } from '@/drizzle/db';
import { useSession } from '@/lib/auth-client';
import { recordContributionSchema } from '@/validation/contribution';
import { contribution } from '@/drizzle/schema';
import { and, desc, eq, sum } from 'drizzle-orm';

const approveContributionSchema = z.object({
  contributionId: z.string(),
  action: z.enum(['approve', 'reject']),
  notes: z.string().optional(),
});

export async function recordContribution(data: z.infer<typeof recordContributionSchema>) {
  const userSession = await getSession();
  if (!userSession) redirect('/sign-in'); // why not return an error message?

  const { user } = userSession;

  try {
    // Check if user is a member of the community
    const membership = await sql`
      SELECT EXISTS (
        SELECT 1
        FROM jamii.member
        WHERE user_id = ${user.id}
          AND community_id = ${data.groupId}
)
    `;

    if (!membership) {
      return { error: 'You are not a member of this group' };
    }

    // Record the contribution
    await db.insert(contribution).values({
      user_id: user.id,
      community_id: data.groupId,
      reference_number: data.referenceNumber,
      contribution_type: data.contributionType,
      contribution_amount: Number(data.amount),
      payment_method: data.paymentMethod,
      currency: data.currency,
      contribution_date: data.contributionDate,
      contribution_period: data.contributionPeriod,
      status: 'pending',
    });

    revalidatePath(`/dashboard/groups/${data.groupId}/contributions`);
    revalidatePath('/dashboard/contributions');
    return {
      success: true,
      message: 'Contribution recorded successfully. Awaiting admin approval.',
    };
  } catch (error) {
    console.error('[v0] Record contribution error:', error);
    return { error: 'Failed to record contribution. Please try again.' };
  }
}

export async function approveContribution(formData: FormData) {
  const user = await getSession();
  if (!user) redirect('/sign-in');

  const data = {
    contributionId: formData.get('contributionId') as string,
    action: formData.get('action') as string,
    notes: formData.get('notes') as string,
  };

  const validation = approveContributionSchema.safeParse(data);
  if (!validation.success) {
    return { error: validation.error.errors[0].message };
  }

  const { contributionId, action, notes } = validation.data;

  try {
    // Get contribution details
    const contributions = await sql`
      SELECT c.*, g.id as group_id
      FROM jamii.contributions c
      JOIN jamii.groups g ON c.group_id = g.id
      WHERE c.id = ${Number(contributionId)}
    `;

    if (contributions.length === 0) {
      return { error: 'Contribution not found' };
    }

    const contribution = contributions[0];

    // Check if user is admin of the group
    const membership = await sql`
      SELECT role FROM jamii.group_members
      WHERE group_id = ${contribution.group_id} AND user_id = ${user.id} AND status = 'active'
    `;

    if (membership.length === 0 || membership[0].role !== 'admin') {
      return { error: 'You do not have permission to approve contributions' };
    }

    // Update contribution status
    const newStatus = action === 'approve' ? 'approved' : 'rejected';
    await sql`
      UPDATE jamii.contributions
      SET 
        status = ${newStatus},
        approved_by = ${user.id},
        approved_at = NOW(),
        notes = CASE 
          WHEN ${notes || null} IS NOT NULL THEN ${notes}
          ELSE notes
        END,
        updated_at = NOW()
      WHERE id = ${Number(contributionId)}
    `;

    // Log the action
    await sql`
      INSERT INTO jamii.audit_logs (user_id, action, entity_type, entity_id, changes)
      VALUES (
        ${user.id},
        ${action === 'approve' ? 'approve_contribution' : 'reject_contribution'},
        'contribution',
        ${contributionId},
        ${JSON.stringify({ status: newStatus, notes })}::jsonb
      )
    `;

    revalidatePath(`/dashboard/groups/${contribution.group_id}/contributions`);
    revalidatePath('/dashboard/contributions');
    return { success: true, message: `Contribution ${action}d successfully` };
  } catch (error) {
    console.error('[v0] Approve contribution error:', error);
    return { error: 'Failed to process contribution. Please try again.' };
  }
}

// get contributions
export async function getUserContributions(userId: string, communityId: string) {
  const [contributionsResult, statsResult] = await Promise.all([
    sql`
      SELECT
        *
      FROM jamii.contribution
      WHERE user_id = ${userId}
        AND community_id = ${communityId}
      ORDER BY contribution_date DESC, created_at DESC
    `,
    sql`
      SELECT
        COALESCE(SUM(contribution_amount), 0)::float8
          AS "totalAmount",

        COUNT(*)::int
          AS "totalCount",

        COUNT(*) FILTER (WHERE status = ${'approved'})::int
          AS "approvedCount",

        COUNT(*) FILTER (WHERE status = ${'pending'})::int
          AS "pendingCount",

        COUNT(*) FILTER (WHERE status = ${'rejected'})::int
          AS "rejectedCount",

        COALESCE(
          SUM(contribution_amount)
            FILTER (WHERE status = ${'approved'}),
          0
        )::float8
          AS "approvedTotalAmount"

      FROM jamii.contribution
      WHERE user_id = ${userId}
        AND community_id = ${communityId}
    `,
  ]);

  const contributions = contributionsResult ?? [];
  const contributionStats = statsResult[0] ?? {
    totalAmount: 0,
    totalApproved: 0,
    totalCount: 0,
    approvedCount: 0,
    pendingCount: 0,
    rejectedCount: 0,
  };

  return { contributions, contributionStats };
}
