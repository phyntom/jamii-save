import { getSession } from "@/lib/auth-actions"
import { sql } from "@/lib/db"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DollarSign } from "lucide-react"

export default async function ContributionsPage() {
  const user = await getSession()
  if (!user) redirect("/sign-in")

  // Fetch user's contributions
  const contributions = await sql`
    SELECT 
      c.*,
      g.name as group_name,
      approver.name as approver_name
    FROM jamii.contributions c
    JOIN jamii.groups g ON c.group_id = g.id
    LEFT JOIN jamii.user approver ON c.approved_by = approver.id
    WHERE c.user_id = ${user.id}
    ORDER BY c.created_at DESC
  `

  // Calculate stats
  const stats = await sql`
    SELECT 
      COALESCE(SUM(CASE WHEN status = 'approved' THEN amount ELSE 0 END), 0) as total_approved,
      COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_count,
      COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved_count
    FROM jamii.contributions
    WHERE user_id = ${user.id}
  `

  const contributionStats = stats[0]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contributions</h1>
          <p className="text-muted-foreground">Track your contribution history</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Approved</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${Number(contributionStats.total_approved).toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">{contributionStats.approved_count} contributions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contributionStats.pending_count}</div>
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
                ? Math.round((Number(contributionStats.approved_count) / contributions.length) * 100)
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
                <div key={contribution.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{contribution.group_name}</p>
                      <Badge
                        variant={
                          contribution.status === "approved"
                            ? "default"
                            : contribution.status === "pending"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {contribution.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {new Date(contribution.created_at).toLocaleDateString()} •{" "}
                      {contribution.payment_method.replace("_", " ")}
                      {contribution.reference_number && ` • Ref: ${contribution.reference_number}`}
                    </p>
                    {contribution.notes && <p className="text-sm text-muted-foreground">{contribution.notes}</p>}
                    {contribution.approved_by && (
                      <p className="text-xs text-muted-foreground">
                        {contribution.status === "approved" ? "Approved" : "Rejected"} by {contribution.approver_name}{" "}
                        on {new Date(contribution.approved_at).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold">${Number(contribution.amount).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
