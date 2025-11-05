'use server';

import { getSession } from '@/server/authentication';
import { db } from '@/drizzle/db';
import { Plan, plan, community } from '@/drizzle/schema';
import { member } from '@/drizzle/schemas/member';
import { createInsertSchema } from 'drizzle-zod';
import slugify from 'slugify';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { eq } from 'drizzle-orm';

export async function getPlans(): Promise<Plan[] | null> {
  const plans = await db.query.plan.findMany();
  return plans;
}

export async function createCommunity(data: {
  name: string;
  description: string;
  visibility: string;
  contributionFrequency: string;
  country: string;
  currency: string;
  targetAmount: number;
  planType: number;
  isActive: boolean;
  communityStartDate: Date;
}) {
  const userSession = await getSession();
  // we have two types of users: admin and member. We assume that admin can create a community and member can only join a community.
  // TODO : I will implement role based access control later with better-auth.
  try {
    if (!userSession) {
      return { success: false, message: 'User is not authenticated' };
    }
    const { user } = userSession;

    const createdCommunity = await auth.api.createOrganization({
      body: {
        name: data.name,
        slug: slugify(data.name, { lower: true, strict: true }),
        description: data.description,
        visibility: data.visibility,
        contributionFrequency: data.contributionFrequency,
        country: data.country,
        currency: data.currency,
        targetAmount: data.targetAmount,
        planType: data.planType,
        isActive: data.isActive,
        communityStartDate: data.communityStartDate,
        adminEmail: user.email,
      },
      headers: await headers(),
    });

    if (!createdCommunity) {
      throw new Error('Failed to create community');
    }
    return { success: true, message: 'Community created successfully', data: createdCommunity };
  } catch (err: any) {
    console.error('[v0] Create community error:', err);
    return { success: false, message: err?.message || 'An unexpected error occurred' };
  }
}

export async function getCommunities() {
  const userSession = await getSession();
  if (!userSession) {
    return { success: false, message: 'User is not authenticated' };
  }
  const { user } = userSession;
  const userCommunities = await auth.api.listOrganizations({
    headers: await headers(),
    query: {
      userId: user.id,
    },
  });
  if (userCommunities.length === 0) {
    return { success: true, message: 'No organizations found', data: [] };
  }
  return { success: true, message: 'Communities fetched successfully', data: userCommunities };
}

export async function getCommunityById(communityId: string) {
  try {
    const foundCommunity = await db.query.community.findFirst({
      where: eq(community.id, communityId),
      with: {
        members: {
          with: {
            user: true,
          },
        },
      },
    });
    if (!foundCommunity) {
      return { success: false, message: 'Community not found', data: null };
    }
    return { success: true, message: 'Community fetched successfully', data: foundCommunity };
  } catch (err: any) {
    console.error('[v0] Get community by ID error:', err);
    return { success: false, message: err?.message || 'An unexpected error occurred', data: null };
  }
}
