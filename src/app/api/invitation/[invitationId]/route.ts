import { getInvitationById } from '@/server/invitation';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ invitationId: string }> },
) {
  try {
    const { invitationId } = await params;
    console.log('invitationId', invitationId);

    if (!invitationId) {
      return NextResponse.json(
        { success: false, message: 'Invitation ID is required' },
        { status: 400 },
      );
    }
    const invitation = await getInvitationById(invitationId);
    if (!invitation) {
      return NextResponse.json({ error: 'Invitation not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: invitation }, { status: 200 });
  } catch (error) {
    console.error('Error fetching invitation:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
