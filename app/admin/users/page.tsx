import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { verifyToken } from "@/lib/auth-actions"
import { neon } from "@neondatabase/serverless"
import { getAllUsers } from "@/app/actions/admin"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatDistanceToNow } from "date-fns"

const sql = neon(process.env.DATABASE_URL!)

async function checkAdminAccess() {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth_token")?.value

  if (!token) {
    redirect("/sign-in")
  }

  try {
    const payload = await verifyToken(token)
    const users = await sql`
      SELECT role FROM users WHERE id = ${payload.userId}
    `

    if (users.length === 0 || users[0].role !== "super_admin") {
      redirect("/dashboard")
    }
  } catch (error) {
    redirect("/sign-in")
  }
}

export default async function AdminUsersPage() {
  await checkAdminAccess()

  const users = await getAllUsers()

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">User Management</h1>
            <nav className="flex gap-4">
              <a href="/admin" className="text-sm text-muted-foreground hover:text-foreground">
                Overview
              </a>
              <a href="/admin/users" className="text-sm font-medium">
                Users
              </a>
              <a href="/admin/groups" className="text-sm text-muted-foreground hover:text-foreground">
                Groups
              </a>
              <a href="/admin/audit-logs" className="text-sm text-muted-foreground hover:text-foreground">
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
            <CardTitle>All Users ({users.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users.map((user: any) => (
                <div key={user.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{user.full_name}</span>
                      <Badge variant={user.role === "super_admin" ? "destructive" : "secondary"}>{user.role}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <p className="text-xs text-muted-foreground">
                      {user.phone} • {user.group_count} groups • Joined{" "}
                      {formatDistanceToNow(new Date(user.created_at), { addSuffix: true })}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Edit Role
                    </Button>
                    <Button variant="destructive" size="sm">
                      Suspend
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
