import { rejectInvitation } from '@/server/invitation';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const token = body.invitationId || body.token;
  if (!token) {
    return NextResponse.json({ success: false, message: 'Missing token' }, { status: 400 });
  }
  const { success, message } = await rejectInvitation(token);
  if (!success) {
    return NextResponse.json({ success: false, message }, { status: 400 });
  }
  return NextResponse.json(
    { success: true, message: 'Invitation rejected successfully' },
    { status: 200 },
  );
}
