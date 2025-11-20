import { Calendar, DollarSign, Users } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSession } from '@/app/actions/auth';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default async function GroupsPage() {
  const user = await getSession();
  if (!user) redirect('/sign-in');

  const communities: any[] = [];
  // await sql`
  //   SELECT
  //     g.*,
  //     gm.role,
  //     COUNT(DISTINCT gm2.id) as member_count
  //   FROM jamii.groups g
  //   JOIN jamii.group_members gm ON g.id = gm.group_id
  //   LEFT JOIN jamii.group_members gm2 ON g.id = gm2.group_id AND gm2.status = 'active'
  //   WHERE gm.user_id = ${user.id} AND gm.status = 'active'
  //   GROUP BY g.id, gm.role
  //   ORDER BY g.created_at DESC
  // `

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Community</h1>
          <p className="text-muted-foreground">Manage your savings groups</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/groups/create">Create Community</Link>
        </Button>
      </div>

      {communities.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No community yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Create your first savings community to start managing contributions and loans
            </p>
            <Button asChild>
              <Link href="/dashboard/community/create">Create Your First Community</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {communities.map((community: any) => (
            <Card key={community.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-xl">{community.name}</CardTitle>
                  <Badge variant={community.role === 'admin' ? 'default' : 'secondary'}>
                    {community.role}
                  </Badge>
                </div>
                {community.description && (
                  <CardDescription>{community.description}</CardDescription>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span>
                      ${Number(community.contribution_amount).toFixed(2)}{' '}
                      {community.contribution_frequency}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{community.member_count} members</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Created {new Date(community.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <Button asChild className="w-full">
                  <Link href={`/dashboard/community/${community.id}`}>View Details</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
