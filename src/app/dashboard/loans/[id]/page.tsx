import { Plus } from 'lucide-react';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { getSession } from '@/server/authentication';
import { RecordRepaymentForm } from '@/components/loans/record-repayment-form';
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

export default async function LoanDetailPage({ params }: { params: { id: string } }) {
  const user = await getSession();
  if (!user) redirect('/sign-in');

  const loanId = Number(params.id);

  // Fetch loan details
  const loans = await sql`
    SELECT 
      l.*,
      g.name as group_name,
      g.id as group_id,
      COALESCE(SUM(lr.amount), 0) as total_repaid
    FROM jamii.loans l
    JOIN jamii.groups g ON l.group_id = g.id
    LEFT JOIN jamii.loan_repayments lr ON l.id = lr.loan_id AND lr.status = 'approved'
    WHERE l.id = ${loanId} AND l.user_id = ${user.id}
    GROUP BY l.id, g.name, g.id
  `;

  if (loans.length === 0) {
    notFound();
  }

  const loan = loans[0];
  const totalRepaid = Number(loan.total_repaid);
  const totalAmount = Number(loan.total_amount);
  const remainingBalance = totalAmount - totalRepaid;
  const progress = totalAmount > 0 ? (totalRepaid / totalAmount) * 100 : 0;

  // Fetch repayment history
  const repayments = await sql`
    SELECT *
    FROM jamii.loan_repayments
    WHERE loan_id = ${loanId}
    ORDER BY created_at DESC
  `;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Loan Details</h1>
          <p className="text-muted-foreground">{loan.group_name}</p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/dashboard/loans">Back to Loans</Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Loan Information</CardTitle>
            <CardDescription>Details about your loan</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Status</span>
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
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Principal Amount</span>
                <span className="font-medium">${Number(loan.amount).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Interest Rate</span>
                <span className="font-medium">{loan.interest_rate}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Amount</span>
                <span className="font-medium">${totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Repayment Period</span>
                <span className="font-medium">{loan.repayment_months} months</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Monthly Payment</span>
                <span className="font-medium">${Number(loan.monthly_payment).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Request Date</span>
                <span className="font-medium">
                  {new Date(loan.created_at).toLocaleDateString()}
                </span>
              </div>
              {loan.disbursed_at && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Disbursed Date</span>
                  <span className="font-medium">
                    {new Date(loan.disbursed_at).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
            <div className="pt-4 border-t">
              <p className="text-sm font-medium mb-2">Purpose</p>
              <p className="text-sm text-muted-foreground">{loan.purpose}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Repayment Progress</CardTitle>
            <CardDescription>Track your loan repayment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">{progress.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-4">
                <div className="bg-amber-500 h-4 rounded-full" style={{ width: `${progress}%` }} />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total Repaid</span>
                <span className="text-lg font-bold">${totalRepaid.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Remaining Balance</span>
                <span className="text-lg font-bold">${remainingBalance.toFixed(2)}</span>
              </div>
            </div>
            {(loan.status === 'approved' || loan.status === 'active') && remainingBalance > 0 && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Make Payment
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Record Repayment</DialogTitle>
                    <DialogDescription>Submit your loan repayment for approval</DialogDescription>
                  </DialogHeader>
                  <RecordRepaymentForm
                    loanId={loanId}
                    remainingBalance={remainingBalance}
                    monthlyPayment={Number(loan.monthly_payment)}
                  />
                </DialogContent>
              </Dialog>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Repayment History</CardTitle>
          <CardDescription>All your loan repayments</CardDescription>
        </CardHeader>
        <CardContent>
          {repayments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No repayments yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {repayments.map((repayment: any) => (
                <div
                  key={repayment.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">${Number(repayment.amount).toFixed(2)}</p>
                      <Badge
                        variant={
                          repayment.status === 'approved'
                            ? 'default'
                            : repayment.status === 'pending'
                              ? 'secondary'
                              : 'destructive'
                        }
                      >
                        {repayment.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {new Date(repayment.created_at).toLocaleDateString()} •{' '}
                      {repayment.payment_method.replace('_', ' ')}
                      {repayment.reference_number && ` • Ref: ${repayment.reference_number}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
