import { Session } from 'better-auth';
import { CreditCard, DollarSign, TrendingUp, Users } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSession } from '@/server/authentication';
import { StatsCard } from '@/components/dashboard/stats-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getCommunities } from '@/server/community';

export default async function DashboardPage() {
  const session = (await getSession()) || null;
  const user = session?.user;
  if (!session) redirect('/sign-in');

  const { success, data: userCommunities, message } = await getCommunities();
  if (!success) {
    return <div>{message}</div>;
  }
  const communitiesData = userCommunities;
  if (!communitiesData || communitiesData?.length === 0) {
    return <div>No communities found</div>;
  }

  // Fetch total contributions
  const contributionsResult: any[] = [];
  // const contributionsResult = await sql`
  //   SELECT COALESCE(SUM(amount), 0) as total
  //   FROM jamii.contributions
  //   WHERE user_id = ${user?.id} AND status = 'approved'
  // `
  const totalContributions = Number(contributionsResult[0]?.total || 0);

  // Fetch active loans
  const loansResult: any[] = [];
  // const loansResult = await sql`
  //   SELECT COUNT(*) as count, COALESCE(SUM(total_amount), 0) as total
  //   FROM jamii.loans
  //   WHERE user_id = ${user?.id} AND status IN ('approved', 'active')
  // `
  const activeLoans = Number(loansResult[0]?.count || 0);
  const totalLoanAmount = Number(loansResult[0]?.total || 0);

  // Fetch recent contributions
  const recentContributions: any[] = [];
  // const recentContributions = await sql`
  //   SELECT c.*, g.name as group_name
  //   FROM jamii.contributions c
  //   JOIN jamii.groups g ON c.group_id = g.id
  //   WHERE c.user_id = ${user.id}
  //   ORDER BY c.created_at DESC
  //   LIMIT 5
  // `

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.name}!</h1>
        <p className="text-muted-foreground">Here's an overview of your savings activity</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total Groups" value={communitiesData.length} description="Active savings groups" icon={Users} />
        <StatsCard
          title="Total Contributions"
          value={`$${totalContributions.toFixed(2)}`}
          description="All-time contributions"
          icon={DollarSign}
        />
        <StatsCard
          title="Active Loans"
          value={activeLoans}
          description={`$${totalLoanAmount.toFixed(2)} total`}
          icon={CreditCard}
        />
        <StatsCard title="Savings Rate" value="85%" description="On-time contributions" icon={TrendingUp} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Your Communities</CardTitle>
            <CardDescription>Savings Communities you're part of</CardDescription>
          </CardHeader>
          <CardContent>
            {communitiesData?.length === 0 ? (
              <div className="text-center py-8 bg-muted-foreground rounded-bl-md rounded-br-md">
                <p className="text-muted-foreground mb-4">You're not part of any groups yet</p>
                <Button asChild>
                  <Link href="/dashboard/community/create">Create a Community</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {communitiesData.slice(0, 3).map((community: any) => (
                  <div
                    key={community.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <h3 className="font-medium">{community.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Target: ${Number(community.targetAmount).toFixed(2)}{' '}
                        {community.contributionFrequency}
                      </p>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/community/${community.id}`}>View</Link>
                    </Button>
                  </div>
                ))}
                {communitiesData.length > 3 && (
                  <Button variant="ghost" className="w-full" asChild>
                    <Link href="/dashboard/groups">View all groups</Link>
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Contributions</CardTitle>
            <CardDescription>Your latest contribution activity</CardDescription>
          </CardHeader>
          <CardContent>
            {recentContributions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No contributions yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentContributions.map((contribution: any) => (
                  <div key={contribution.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{contribution.group_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(contribution.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${Number(contribution.amount).toFixed(2)}</p>
                      <p
                        className={`text-xs ${contribution.status === 'approved'
                          ? 'text-green-600'
                          : contribution.status === 'pending'
                            ? 'text-amber-600'
                            : 'text-red-600'
                          }`}
                      >
                        {contribution.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
