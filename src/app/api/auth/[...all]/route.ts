import { toNextJsHandler } from 'better-auth/next-js';
import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';

export const { GET, POST } = toNextJsHandler(auth.handler);
