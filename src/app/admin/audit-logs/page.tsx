import { neon } from '@neondatabase/serverless';
import { formatDistanceToNow } from 'date-fns';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getAuditLogs } from '@/app/actions/admin';
import { Badge } from '@/components/ui/badge';
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

export default async function AdminAuditLogsPage() {
  await checkAdminAccess();

  const logs = await getAuditLogs(200);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Audit Logs</h1>
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
              <a
                href="/admin/groups"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Groups
              </a>
              <a href="/admin/audit-logs" className="text-sm font-medium">
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
            <CardTitle>System Audit Logs (Last 200)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {logs.map((log: any) => (
                <div
                  key={log.id}
                  className="flex items-start justify-between border-b pb-3 last:border-0"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          log.action === 'delete' || log.action === 'suspend'
                            ? 'destructive'
                            : log.action === 'approve'
                              ? 'default'
                              : 'secondary'
                        }
                      >
                        {log.action}
                      </Badge>
                      <span className="text-sm font-medium">{log.entity_type}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      By {log.user_name || log.user_email} •{' '}
                      {formatDistanceToNow(new Date(log.created_at), {
                        addSuffix: true,
                      })}
                    </p>
                    {log.details && (
                      <p className="text-xs text-muted-foreground font-mono">
                        {JSON.stringify(JSON.parse(log.details), null, 2)}
                      </p>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">{log.entity_id}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
