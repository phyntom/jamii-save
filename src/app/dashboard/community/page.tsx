import { AlertCircleIcon, Calendar, DollarSign, Plus, User, Users } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSession } from '@/server/authentication';
import { Button } from '@/components/ui/button';
import { getCommunities } from '@/server/community';
import { CommunitySelect } from '@/components/community/community-select';
import { CommunityTabs } from '@/components/community/community-tabs';
import { CreateCommunityForm } from '@/components/community/create-community-form';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cookies } from 'next/headers';
import InvitationHandler from '@/components/invitation/invitation-handler';
import { getInvitationByEmail } from '@/server/invitation';

export default async function CommunityPage() {
  const session = await getSession();
  const cookiesStore = await cookies();
  let invitations: any[] = [];
  const { success, data: userCommunities, message } = await getCommunities();
  if (!session) {
    redirect('/sign-in');
  }
  const { success: invitationSuccess, data } = await getInvitationByEmail(session?.user?.email)
  if (invitationSuccess) {
    invitations = data ?? [];
  }
  return (
    <div className="space-y-6">
      {invitations.map(invitation => (
        <InvitationHandler key={invitation.id} token={invitation.id} user={session?.user} community={invitation.community} />
      ))}
      <div className="flex items-start justify-between mb-8 space-x-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Community</h1>
          <CommunitySelect />
        </div>
        <CreateCommunityForm />
      </div>
      <CommunityTabs />
    </div >
  );
}
