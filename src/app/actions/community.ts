'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { getSession } from '@/app/actions/auth';
import { db } from '@/drizzle/db';
import { Plan, plan } from '@/drizzle/schema';

export async function getPlans(): Promise<Plan[] | null> {
  const plans = await db.query.plan.findMany();
  return plans;
}
