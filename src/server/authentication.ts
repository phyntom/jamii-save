'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import { user, type Session, type User } from '@/drizzle/schemas/auth';
import { eq } from 'drizzle-orm';
import { db } from '@/drizzle/db';

export async function signIn(formData: { email: string; password: string }) {
  const { email, password } = formData;
  const response = await auth.api.signInEmail({
    body: {
      email,
      password,
    },
    headers: await headers(),
    asResponse: true,
  });
  return response;
}

export async function signOut() {
  await auth.api.signOut({
    headers: await headers(),
  });
  redirect('/');
}

export async function getSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  // unwrap the .session property if present
  return session;
}

export async function verifyToken(token: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (session) {
    return session.session.token === token;
  }
  return false;
}

export const getCurrentUser = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect('/login');
  }

  const currentUser = await db.query.user.findFirst({
    where: eq(user.id, session.user.id),
  });

  if (!currentUser) {
    redirect('/login');
  }

  return {
    ...session,
    currentUser,
  };
};

export const checkEmailExists = async (email: string) => {
  const foundUser: User | undefined = await db.query.user.findFirst({
    where: eq(user.email, email),
  });
  return foundUser ? true : false;
};
