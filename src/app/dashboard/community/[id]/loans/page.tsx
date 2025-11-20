import { Plus } from 'lucide-react';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { getSession } from '@/server/authentication';
import { ApproveLoanDialog } from '@/components/loans/approve-loan-dialog';
import { RequestLoanForm } from '@/components/loans/request-loan-form';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { sql } from '@/lib/db';

export default async function GroupLoansPage({ params }: { params: { id: string } }) {
  const user = await getSession();
  if (!user) redirect('/sign-in');

  const groupId = Number(params.id);

  // Fetch group details and user role
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

  // Fetch loans
  const loans = await sql`
    SELECT 
      l.*,
      u.name as borrower_name,
      COALESCE(SUM(lr.amount), 0) as total_repaid
    FROM jamii.loans l
    JOIN jamii.user u ON l.user_id = u.id
    LEFT JOIN jamii.loan_repayments lr ON l.id = lr.loan_id AND lr.status = 'approved'
    WHERE l.group_id = ${groupId}
    GROUP BY l.id, u.name
    ORDER BY l.created_at DESC
  `;

  // Calculate stats
  const stats = await sql`
    SELECT 
      COUNT(CASE WHEN status IN ('approved', 'active') THEN 1 END) as active_count,
      COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_count,
      COALESCE(SUM(CASE WHEN status IN ('approved', 'active') THEN total_amount ELSE 0 END), 0) as total_disbursed
    FROM jamii.loans
    WHERE group_id = ${groupId}
  `;

  const loanStats = stats[0];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{group.name} - Loans</h1>
          <p className="text-muted-foreground">Manage group loans</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/dashboard/groups/${groupId}`}>Back to Group</Link>
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Request Loan
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Request Loan</DialogTitle>
                <DialogDescription>Submit a loan request for admin approval</DialogDescription>
              </DialogHeader>
              <RequestLoanForm
                groupId={groupId}
                maxLoanAmount={group.max_loan_amount ? Number(group.max_loan_amount) : undefined}
                interestRate={Number(group.loan_interest_rate)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Active Loans</CardTitle>
            <CardDescription>Currently active</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{loanStats.active_count}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending Approval</CardTitle>
            <CardDescription>Awaiting review</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{loanStats.pending_count}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Disbursed</CardTitle>
            <CardDescription>All active loans</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              ${Number(loanStats.total_disbursed).toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Loans</CardTitle>
          <CardDescription>Complete loan history for this group</CardDescription>
        </CardHeader>
        <CardContent>
          {loans.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No loans yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {loans.map((loan: any) => {
                const totalRepaid = Number(loan.total_repaid);
                const totalAmount = Number(loan.total_amount);
                const remaining = totalAmount - totalRepaid;
                const progress = totalAmount > 0 ? (totalRepaid / totalAmount) * 100 : 0;

                return (
                  <div key={loan.id} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{loan.borrower_name}</p>
                          <Badge
                            variant={
                              loan.status === 'approved' || loan.status === 'active'
                                ? 'default'
                                : loan.status === 'pending'
                                  ? 'secondary'
                                  : loan.status === 'completed'
                                    ? 'outline'
                                    : 'destructive'
                            }
                          >
                            {loan.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{loan.purpose}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(loan.created_at).toLocaleDateString()} • {loan.repayment_months}{' '}
                          months • {loan.interest_rate}% interest
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-xl font-bold">${Number(loan.amount).toFixed(2)}</p>
                          <p className="text-sm text-muted-foreground">
                            Total: ${totalAmount.toFixed(2)}
                          </p>
                        </div>
                        {isAdmin && loan.status === 'pending' && (
                          <div className="flex gap-2">
                            <ApproveLoanDialog loanId={loan.id} action="approve" />
                            <ApproveLoanDialog loanId={loan.id} action="reject" />
                          </div>
                        )}
                      </div>
                    </div>

                    {(loan.status === 'approved' || loan.status === 'active') && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Repayment Progress</span>
                          <span className="font-medium">{progress.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-amber-500 h-2 rounded-full"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Repaid: ${totalRepaid.toFixed(2)}</span>
                          <span>Remaining: ${remaining.toFixed(2)}</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
