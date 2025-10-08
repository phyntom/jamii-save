import { getSession } from "@/lib/auth-actions"
import { sql } from "@/lib/db"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Users, DollarSign, Calendar } from "lucide-react"

export default async function GroupsPage() {
  const user = await getSession()
  if (!user) redirect("/sign-in")

  const groups = await sql`
    SELECT 
      g.*,
      gm.role,
      COUNT(DISTINCT gm2.id) as member_count
    FROM jamii.groups g
    JOIN jamii.group_members gm ON g.id = gm.group_id
    LEFT JOIN jamii.group_members gm2 ON g.id = gm2.group_id AND gm2.status = 'active'
    WHERE gm.user_id = ${user.id} AND gm.status = 'active'
    GROUP BY g.id, gm.role
    ORDER BY g.created_at DESC
  `

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Groups</h1>
          <p className="text-muted-foreground">Manage your savings groups</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/groups/create">Create Group</Link>
        </Button>
      </div>

      {groups.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No groups yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Create your first savings group to start managing contributions and loans
            </p>
            <Button asChild>
              <Link href="/dashboard/groups/create">Create Your First Group</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {groups.map((group: any) => (
            <Card key={group.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-xl">{group.name}</CardTitle>
                  <Badge variant={group.role === "admin" ? "default" : "secondary"}>{group.role}</Badge>
                </div>
                {group.description && <CardDescription>{group.description}</CardDescription>}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span>
                      ${Number(group.contribution_amount).toFixed(2)} {group.contribution_frequency}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{group.member_count} members</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Created {new Date(group.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <Button asChild className="w-full">
                  <Link href={`/dashboard/groups/${group.id}`}>View Details</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
