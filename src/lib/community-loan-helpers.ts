import { eq } from 'drizzle-orm';
import { db } from '@/drizzle/db';
import { community, communityLoanTerm } from '@/drizzle/schema';

export async function getCommunityWithLoanTerms(communityId: string) {
  const communityData = await db.query.community.findFirst({
    where: eq(community.id, communityId),
    with: {
      loanTerms: true
    }
  });
  
  return communityData;
}

export async function updateCommunityLoanTerms(
  communityId: string, 
  terms: Partial<typeof communityLoanTerm.$inferInsert>
) {
  return await db.update(communityLoanTerm)
    .set(terms)
    .where(eq(communityLoanTerm.community_id, communityId));
}

export async function createCommunityLoanTerms(
  communityId: string,
  terms: Partial<typeof communityLoanTerm.$inferInsert> = {}
) {
  return await db.insert(communityLoanTerm).values({
    community_id: communityId,
    loans_enabled: false,
    interest_rate: '0',
    late_fee_amount: '0',
    grace_period_days: 0,
    ...terms
  });
}

export async function enableLoansForCommunity(
  communityId: string,
  loanSettings: {
    max_loan_amount?: string;
    interest_rate?: string;
    late_fee_amount?: string;
    grace_period_days?: number;
    max_loan_duration_days?: number;
    min_loan_amount?: string;
  }
) {
  return await db.update(communityLoanTerm)
    .set({
      loans_enabled: true,
      ...loanSettings
    })
    .where(eq(communityLoanTerm.community_id, communityId));
}

export async function disableLoansForCommunity(communityId: string) {
  return await db.update(communityLoanTerm)
    .set({ loans_enabled: false })
    .where(eq(communityLoanTerm.community_id, communityId));
}
