import { DollarSign } from 'lucide-react';
import { redirect } from 'next/navigation';
import { getSession } from '@/server/authentication';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { getUserContributions } from '@/server/contributions';
import { authClient } from '@/lib/auth-client';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export default async function ContributionsPage() {
  const userSession = await getSession();
  if (!userSession) redirect('/sign-in');

  const { session, user } = userSession;

  // if no active organization, redirect to community selection
  if (!session.activeOrganizationId) redirect('/dashboard/community');

  // Fetch user's contributions
  const { contributions, contributionStats } = await getUserContributions(user.id, session.activeOrganizationId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contributions</h1>
          <p className="text-muted-foreground">Track and manage your community contributions</p>
        </div>
        <Button variant='default' asChild>
          <Link href="/dashboard/contributions/create">
            <Plus /> New Contribution
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Approved</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${Number(contributionStats?.totalApproved || 0).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              {Number(contributionStats?.approvedCount || 0)} contributions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Number(contributionStats?.pendingCount || 0)}</div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {contributions.length > 0
                ? Math.round(
                  (Number(contributionStats.approvedCount) / contributions.length) * 100,
                )
                : 0}
              %
            </div>
            <p className="text-xs text-muted-foreground">Approval rate</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Contribution History</CardTitle>
          <CardDescription>All your recorded contributions</CardDescription>
        </CardHeader>
        <CardContent>
          {contributions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No contributions yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {contributions.map((contribution: any) => (
                <div
                  key={contribution.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{contribution.group_name}</p>
                      <Badge
                        variant={
                          contribution.status === 'approved'
                            ? 'default'
                            : contribution.status === 'pending'
                              ? 'secondary'
                              : 'destructive'
                        }
                      >
                        {contribution.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {new Date(contribution.created_at).toLocaleDateString()} •{' '}
                      {contribution.payment_method.replace('_', ' ')}
                      {contribution.reference_number && ` • Ref: ${contribution.reference_number}`}
                    </p>
                    {contribution.notes && (
                      <p className="text-sm text-muted-foreground">{contribution.notes}</p>
                    )}
                    {contribution.approved_by && (
                      <p className="text-xs text-muted-foreground">
                        {contribution.status === 'approved' ? 'Approved' : 'Rejected'} by{' '}
                        {contribution.approver_name} on{' '}
                        {new Date(contribution.approved_at).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold">${Number(contribution.contribution_amount).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
