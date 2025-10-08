import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { verifyToken } from "@/lib/auth-actions"
import { neon } from "@neondatabase/serverless"
import { getSystemStats, getRecentActivity } from "@/app/actions/admin"
import { StatsOverview } from "@/components/admin/stats-overview"
import { RecentActivity } from "@/components/admin/recent-activity"

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

export default async function AdminPage() {
  await checkAdminAccess()

  const stats = await getSystemStats()
  const activities = await getRecentActivity()

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <nav className="flex gap-4">
              <a href="/admin" className="text-sm font-medium">
                Overview
              </a>
              <a href="/admin/users" className="text-sm text-muted-foreground hover:text-foreground">
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
        <div className="space-y-8">
          <StatsOverview stats={stats} />
          <RecentActivity activities={activities} />
        </div>
      </main>
    </div>
  )
}
