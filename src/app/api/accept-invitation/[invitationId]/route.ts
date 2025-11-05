import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { NextRequest } from 'next/server';
import { headers } from 'next/headers';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ invitationId: string }> },
) {
  try {
    const { invitationId } = await params;
    const data = await auth.api.acceptInvitation({
      body: {
        invitationId: invitationId,
      },
    });
    if (!data || data.error) {
      return NextResponse.json({ error: 'Failed to accept invitation' }, { status: 400 });
    }
    return NextResponse.redirect(new URL('/sign-in', request.url));
  } catch (error) {
    console.error('Error accepting invitation:', error);
    return NextResponse.json({ error: 'Failed to accept invitation' }, { status: 500 });
  }
}
