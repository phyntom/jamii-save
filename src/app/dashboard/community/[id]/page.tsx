import { Calendar, DollarSign, TrendingUp, Users } from 'lucide-react';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { getSession } from '@/server/authentication';
import { InviteMemberButton } from '@/components/community/invite-member-button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getCommunityById } from '@/server/community';
import { User } from '@/drizzle/schemas/auth';
import MembersTable from '@/components/community/members-table';

interface CommunityDetailPageProps {
  params: Promise<{
    id: string;
  }>
}

export default async function CommunityDetailPage({ params }: CommunityDetailPageProps) {
  const user = await getSession();
  if (!user) redirect('/sign-in');
  const { id: communityId } = await params;
  const { success, data: community, message } = await getCommunityById(communityId);
  if (!user) redirect('/sign-in');

  if (!community) {
    notFound();
  }
  // Fetch members
  const members = community.members;
  const userRole = community?.members?.find(
    (member: any) => member.user.id === user.user.id
  )?.role;

  const isAdmin = userRole === 'admin'
  const isOwner = userRole === 'owner';

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold tracking-tight">{community.name}</h1>
            <Badge variant={isAdmin ? 'default' : 'secondary'}>{userRole}</Badge>
          </div>
          {community.description && <p className="text-muted-foreground">{community.description}</p>}
        </div>

      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{members.length}</div>
            <p className="text-xs text-muted-foreground">Active members</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contribution</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${Number(community.targetAmount).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground capitalize">
              {community.contributionFrequency}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Members</CardTitle>
            <CardDescription>
              <div className="flex justify-between gap-1">
                People in this community
                {(isOwner || isAdmin) && <InviteMemberButton communityId={communityId} />}
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MembersTable members={members} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Group Settings</CardTitle>
            <CardDescription>Configuration and rules</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Visibilty</span>
                <span className="font-medium">{community.visibility}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Target Amount</span>
                <span className="font-medium">{community.currency} {community.targetAmount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Frequency</span>
                <span className="font-medium capitalize">{community.contributionFrequency}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Contribution Start Date</span>
                <span className="font-medium">
                  {community?.contributionStartDate
                    ? new Date(community.contributionStartDate).toLocaleDateString()
                    : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Maximum Members</span>
                <span className="font-medium">
                  {community?.maxMembers}
                </span>
              </div>
            </div>

            <div className="pt-4 space-y-2">
              <Button asChild className="w-full">
                <Link href={`/dashboard/groups/${communityId}/contributions`}>View Contributions</Link>
              </Button>
              <Button asChild variant="outline" className="w-full bg-transparent">
                <Link href={`/dashboard/groups/${communityId}/loans`}>View Loans</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
