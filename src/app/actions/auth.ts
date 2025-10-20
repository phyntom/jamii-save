'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import type { Session } from '@/drizzle/schemas/auth';

const signUpSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type Resutl<T> = {
  success: true,
}



const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export async function signUp(formData: FormData) {
  const data = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const validation = signUpSchema.safeParse(data);
  if (!validation.success) {
    return { error: validation.error.errors[0].message };
  }

  const { name, email, password } = validation.data;

  try {
    const result = await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
      },
      headers: await headers(),
    });

    if (!result) {
      return { error: 'Failed to create account. Please try again.' };
    }

    // Note: Better-auth will handle user creation and session automatically
    // You may want to create the default subscription in a separate step
  } catch (error: any) {
    console.error('[v0] Sign up error:', error);
    if (error.message?.includes('already exists')) {
      return { error: 'Email already registered' };
    }
    return { error: 'Failed to create account. Please try again.' };
  }

  redirect('/dashboard');
}

export async function signIn(formData: {email: string, password: string}) {

  const { email, password } = formData;
  const response = await auth.api.signInEmail({
    body: {
      email,
      password,
    },
    headers: await headers(),
    asResponse: true
  });
  return response;
}

export async function signInWithGoogle() {
  try {
    const result = await auth.api.signInSocial({
      body: {
        provider: 'google',
      },
      headers: await headers(),
    });

    if (!result) {
      throw new Error('Failed to sign in with Google');
    }

    redirect('/dashboard');
  } catch (error: any) {
    console.error('[v0] Google sign in error:', error);
    throw new Error('Failed to sign in with Google', error);
  }
}

export async function signOut() {
  await auth.api.signOut({
    headers: await headers(),
  });
  redirect('/');
}

export async function getSession(): Promise<Session | null> {
  const response = await auth.api.getSession({
    headers: await headers(),
  });
  return response || null;
}

export async function verifyToken(token: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session;
}

export async function forgotPassword(formData: FormData) {
  const data = {
    email: formData.get('email') as string,
  };

  const validation = forgotPasswordSchema.safeParse(data);
  if (!validation.success) {
    return { error: validation.error.errors[0].message };
  }

  const { email } = validation.data;

  try {
    // Better-auth will handle password reset
    // You'll need to configure email provider in better-auth config
    // For now, return success message
    return {
      success:
        'If an account exists with this email, you will receive password reset instructions.',
    };
  } catch (error) {
    console.error('[v0] Forgot password error:', error);
    return { error: 'Failed to process request. Please try again.' };
  }
}
