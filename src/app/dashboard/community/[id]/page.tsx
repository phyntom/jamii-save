import { Calendar, DollarSign, TrendingUp, Users } from 'lucide-react';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { getSession } from '@/app/actions/auth';
import { InviteMemberDialog } from '@/components/groups/invite-member-dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { sql } from '@/lib/db';

export default async function GroupDetailPage({ params }: { params: { id: string } }) {
  const user = await getSession();
  if (!user) redirect('/sign-in');

  const groupId = Number(params.id);

  // Fetch group details
  const groups = await sql`
    SELECT g.*, gm.role
    FROM jamii.groups g
    JOIN jamii.group_members gm ON g.id = gm.group_id
    WHERE g.id = ${groupId} AND gm.user_id = ${user.id} AND gm.status = 'active'
  `;

  if (groups.length === 0) {
    notFound();
  }

  const group = groups[0];
  const isAdmin = group.role === 'admin';

  // Fetch members
  const members = await sql`
    SELECT gm.*, us.name, us.email
    FROM jamii.group_members gm
    JOIN jamii.user us ON gm.user_id = us.id
    WHERE gm.group_id = ${groupId} AND gm.status = 'active'
    ORDER BY gm.role DESC, gm.joined_at ASC
  `;

  // Fetch group stats
  const stats = await sql`
    SELECT 
      COALESCE(SUM(CASE WHEN c.status = 'approved' THEN c.amount ELSE 0 END), 0) as total_contributions,
      COUNT(DISTINCT CASE WHEN c.status = 'approved' THEN c.id END) as contribution_count,
      COUNT(DISTINCT CASE WHEN l.status IN ('approved', 'active') THEN l.id END) as active_loans
    FROM jamii.group_members gm
    LEFT JOIN jamii.contributions c ON gm.group_id = c.group_id
    LEFT JOIN jamii.loans l ON gm.group_id = l.group_id
    WHERE gm.group_id = ${groupId}
  `;

  const groupStats = stats[0];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold tracking-tight">{group.name}</h1>
            <Badge variant={isAdmin ? 'default' : 'secondary'}>{group.role}</Badge>
          </div>
          {group.description && <p className="text-muted-foreground">{group.description}</p>}
        </div>
        {isAdmin && <InviteMemberDialog groupId={groupId} />}
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Contributions</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${Number(groupStats.total_contributions).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              {groupStats.contribution_count} contributions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
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
            <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{groupStats.active_loans}</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contribution</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${Number(group.contribution_amount).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground capitalize">
              {group.contribution_frequency}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Members</CardTitle>
            <CardDescription>People in this savings group</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {members.map((member: any) => {
                const initials = member.name
                  .split(' ')
                  .map((n: string) => n[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2);

                return (
                  <div key={member.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>{initials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-muted-foreground">{member.email}</p>
                      </div>
                    </div>
                    <Badge variant={member.role === 'admin' ? 'default' : 'secondary'}>
                      {member.role}
                    </Badge>
                  </div>
                );
              })}
            </div>
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
                <span className="text-muted-foreground">Contribution Amount</span>
                <span className="font-medium">${Number(group.contribution_amount).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Frequency</span>
                <span className="font-medium capitalize">{group.contribution_frequency}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Contribution Day</span>
                <span className="font-medium">{group.contribution_day}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Loan Interest Rate</span>
                <span className="font-medium">{Number(group.loan_interest_rate).toFixed(2)}%</span>
              </div>
              {group.max_loan_amount && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Max Loan Amount</span>
                  <span className="font-medium">${Number(group.max_loan_amount).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Late Fee</span>
                <span className="font-medium">${Number(group.late_fee_amount).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Grace Period</span>
                <span className="font-medium">{group.grace_period_days} days</span>
              </div>
            </div>

            <div className="pt-4 space-y-2">
              <Button asChild className="w-full">
                <Link href={`/dashboard/groups/${groupId}/contributions`}>View Contributions</Link>
              </Button>
              <Button asChild variant="outline" className="w-full bg-transparent">
                <Link href={`/dashboard/groups/${groupId}/loans`}>View Loans</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
