import { neon } from '@neondatabase/serverless';
import { formatDistanceToNow } from 'date-fns';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getGroupsWithStats } from '@/app/actions/admin';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { verifyToken } from '@/app/actions/auth';

const sql = neon(process.env.DATABASE_URL!);

async function checkAdminAccess() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (!token) {
    redirect('/sign-in');
  }

  try {
    const payload = await verifyToken(token);
    const users = await sql`
      SELECT role FROM users WHERE id = ${payload.userId}
    `;

    if (users.length === 0 || users[0].role !== 'super_admin') {
      redirect('/dashboard');
    }
  } catch (_error) {
    redirect('/sign-in');
  }
}

export default async function AdminGroupsPage() {
  await checkAdminAccess();

  const groups = await getGroupsWithStats();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Group Management</h1>
            <nav className="flex gap-4">
              <a href="/admin" className="text-sm text-muted-foreground hover:text-foreground">
                Overview
              </a>
              <a
                href="/admin/users"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Users
              </a>
              <a href="/admin/groups" className="text-sm font-medium">
                Groups
              </a>
              <a
                href="/admin/audit-logs"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Audit Logs
              </a>
              <a href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">
                Back to Dashboard
              </a>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>All Groups ({groups.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {groups.map((group: any) => (
                <div
                  key={group.id}
                  className="flex items-center justify-between border-b pb-4 last:border-0"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{group.name}</span>
                      <Badge>{group.member_count} members</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{group.description}</p>
                    <div className="flex gap-4 text-xs text-muted-foreground">
                      <span>Created by {group.creator_name}</span>
                      <span>
                        Contributions: $
                        {Number.parseFloat(group.total_contributions).toLocaleString()}
                      </span>
                      <span>Loans: ${Number.parseFloat(group.total_loans).toLocaleString()}</span>
                      <span>
                        {formatDistanceToNow(new Date(group.created_at), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <a href={`/dashboard/groups/${group.id}`}>View</a>
                    </Button>
                    <Button variant="destructive" size="sm">
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
