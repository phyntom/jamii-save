import { Calendar, DollarSign, Plus, User, Users } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSession } from '@/server/authentication';
import { Button } from '@/components/ui/button';
import { getCommunities } from '@/server/community';
import { CommunitySelect } from '@/components/community/community-select';
import { CommunityTabs } from '@/components/community/community-tabs';
import { CreateCommunityForm } from '@/components/community/create-community-form';

export default async function CommunityPage() {
  const user = await getSession();
  if (!user) redirect('/sign-in');

  const { success, data: userCommunities, message } = await getCommunities();

  if (!success) {
    return <div>{message}</div>;
  }
  const communitiesData = userCommunities;

  return (
    <div className="space-y-6">
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
