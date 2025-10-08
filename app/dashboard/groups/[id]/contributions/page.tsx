import { getSession } from "@/lib/auth-actions"
import { sql } from "@/lib/db"
import { redirect, notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RecordContributionForm } from "@/components/contributions/record-contribution-form"
import { ApproveContributionDialog } from "@/components/contributions/approve-contribution-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import Link from "next/link"

export default async function GroupContributionsPage({ params }: { params: { id: string } }) {
  const user = await getSession()
  if (!user) redirect("/sign-in")

  const groupId = Number(params.id)

  // Fetch group details and user role
  const groups = await sql`
    SELECT g.*, gm.role
    FROM jamii.groups g
    JOIN jamii.group_members gm ON g.id = gm.group_id
    WHERE g.id = ${groupId} AND gm.user_id = ${user.id} AND gm.status = 'active'
  `

  if (groups.length === 0) {
    notFound()
  }

  const group = groups[0]
  const isAdmin = group.role === "admin"

  // Fetch contributions
  const contributions = await sql`
    SELECT 
      c.*,
      u.name as contributor_name,
      approver.name as approver_name
    FROM jamii.contributions c
    JOIN jamii.user u ON c.user_id = u.id
    LEFT JOIN jamii.user approver ON c.approved_by = approver.id
    WHERE c.group_id = ${groupId}
    ORDER BY c.created_at DESC
  `

  // Calculate stats
  const stats = await sql`
    SELECT 
      COALESCE(SUM(CASE WHEN status = 'approved' THEN amount ELSE 0 END), 0) as total_approved,
      COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_count
    FROM jamii.contributions
    WHERE group_id = ${groupId}
  `

  const contributionStats = stats[0]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{group.name} - Contributions</h1>
          <p className="text-muted-foreground">Manage group contributions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/dashboard/groups/${groupId}`}>Back to Group</Link>
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Record Contribution
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Record Contribution</DialogTitle>
                <DialogDescription>Submit your contribution for approval</DialogDescription>
              </DialogHeader>
              <RecordContributionForm groupId={groupId} contributionAmount={Number(group.contribution_amount)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Total Approved</CardTitle>
            <CardDescription>All approved contributions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${Number(contributionStats.total_approved).toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending Approval</CardTitle>
            <CardDescription>Awaiting admin review</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{contributionStats.pending_count}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Contributions</CardTitle>
          <CardDescription>Complete contribution history for this group</CardDescription>
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
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{contribution.contributor_name}</p>
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
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-xl font-bold">${Number(contribution.amount).toFixed(2)}</p>
                    </div>
                    {isAdmin && contribution.status === "pending" && (
                      <div className="flex gap-2">
                        <ApproveContributionDialog contributionId={contribution.id} action="approve" />
                        <ApproveContributionDialog contributionId={contribution.id} action="reject" />
                      </div>
                    )}
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
