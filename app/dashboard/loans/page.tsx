import { getSession } from "@/lib/auth-actions"
import { sql } from "@/lib/db"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CreditCard, TrendingUp } from "lucide-react"
import Link from "next/link"

export default async function LoansPage() {
  const user = await getSession()
  if (!user) redirect("/sign-in")

  // Fetch user's loans
  const loans = await sql`
    SELECT 
      l.*,
      g.name as group_name,
      COALESCE(SUM(lr.amount), 0) as total_repaid
    FROM jamii.loans l
    JOIN jamii.groups g ON l.group_id = g.id
    LEFT JOIN jamii.loan_repayments lr ON l.id = lr.loan_id AND lr.status = 'approved'
    WHERE l.user_id = ${user.id}
    GROUP BY l.id, g.name
    ORDER BY l.created_at DESC
  `

  // Calculate stats
  const stats = await sql`
    SELECT 
      COUNT(CASE WHEN l.status IN ('approved', 'active') THEN 1 END) as active_count,
      COALESCE(SUM(CASE WHEN l.status IN ('approved', 'active') THEN l.total_amount ELSE 0 END), 0) as total_borrowed,
      COALESCE(SUM(CASE WHEN l.status IN ('approved', 'active') THEN lr.amount ELSE 0 END), 0) as total_repaid
    FROM jamii.loans l
    LEFT JOIN jamii.loan_repayments lr ON l.id = lr.loan_id AND lr.status = 'approved'
    WHERE l.user_id = ${user.id}
  `

  const loanStats = stats[0]
  const totalBorrowed = Number(loanStats.total_borrowed)
  const totalRepaid = Number(loanStats.total_repaid)
  const remainingBalance = totalBorrowed - totalRepaid

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Loans</h1>
          <p className="text-muted-foreground">Manage your loan requests and repayments</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loanStats.active_count}</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Borrowed</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalBorrowed.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">All active loans</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Remaining Balance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${remainingBalance.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">${totalRepaid.toFixed(2)} repaid</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Loan History</CardTitle>
          <CardDescription>All your loan requests and their status</CardDescription>
        </CardHeader>
        <CardContent>
          {loans.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No loans yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {loans.map((loan: any) => {
                const totalRepaid = Number(loan.total_repaid)
                const totalAmount = Number(loan.total_amount)
                const remaining = totalAmount - totalRepaid
                const progress = totalAmount > 0 ? (totalRepaid / totalAmount) * 100 : 0

                return (
                  <div key={loan.id} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{loan.group_name}</p>
                          <Badge
                            variant={
                              loan.status === "approved" || loan.status === "active"
                                ? "default"
                                : loan.status === "pending"
                                  ? "secondary"
                                  : loan.status === "completed"
                                    ? "outline"
                                    : "destructive"
                            }
                          >
                            {loan.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{loan.purpose}</p>
                        <p className="text-xs text-muted-foreground">
                          Requested {new Date(loan.created_at).toLocaleDateString()} • {loan.repayment_months} months •{" "}
                          {loan.interest_rate}% interest
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold">${Number(loan.amount).toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">Total: ${totalAmount.toFixed(2)}</p>
                      </div>
                    </div>

                    {(loan.status === "approved" || loan.status === "active") && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Repayment Progress</span>
                          <span className="font-medium">{progress.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div className="bg-amber-500 h-2 rounded-full" style={{ width: `${progress}%` }} />
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Repaid: ${totalRepaid.toFixed(2)}</span>
                          <span>Remaining: ${remaining.toFixed(2)}</span>
                        </div>
                        <Button asChild size="sm" className="w-full">
                          <Link href={`/dashboard/loans/${loan.id}`}>View Details & Make Payment</Link>
                        </Button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
