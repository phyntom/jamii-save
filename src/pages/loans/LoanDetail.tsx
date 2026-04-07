import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import { Link, useParams } from "react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  mockLoans,
  mockLoanRepayments,
  mockCommunities,
  type LoanStatus,
} from "@/lib/mock-data";
import { format } from "date-fns";

export default function LoanDetail() {
  const { id } = useParams<{ id: string }>();
  const loan = mockLoans.find((l) => l._id === id);

  if (!loan) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-10 text-center">
        <h1 className="text-2xl font-medium text-foreground">
          Loan not found
        </h1>
        <p className="text-muted-foreground mt-2">
          The loan you're looking for doesn't exist.
        </p>
        <Button asChild className="mt-4">
          <Link to="/loans">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Loans
          </Link>
        </Button>
      </div>
    );
  }

  const community = mockCommunities.find((c) => c._id === loan.communityId);
  const repayments = mockLoanRepayments
    .filter((r) => r.loanId === loan._id)
    .sort((a, b) => b.paidAt - a.paidAt);

  const progress =
    loan.totalAmount > 0
      ? Math.round((loan.repaidAmount / loan.totalAmount) * 100)
      : 0;
  const remaining = loan.totalAmount - loan.repaidAmount;

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">
      {/* Back link + header */}
      <div>
        <Button variant="ghost" size="sm" asChild className="mb-4 -ml-2">
          <Link to="/loans">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Loans
          </Link>
        </Button>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-medium text-foreground">
            Loan — {loan.borrowerName}
          </h1>
          <LoanStatusBadge status={loan.status} />
        </div>
        <p className="text-sm text-muted-foreground mt-1">{loan.purpose}</p>
      </div>

      {/* Info + Progress side by side */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Loan Info */}
        <Card>
          <CardHeader>
            <CardTitle>Loan Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <InfoRow label="Community" value={community?.name ?? "—"} />
            <InfoRow
              label="Principal"
              value={`KES ${loan.principal.toLocaleString()}`}
            />
            <InfoRow label="Interest Rate" value={`${loan.interestRate}%`} />
            <InfoRow
              label="Total Amount"
              value={`KES ${loan.totalAmount.toLocaleString()}`}
            />
            <InfoRow
              label="Repayment Period"
              value={`${loan.repaymentMonths} months`}
            />
            <InfoRow
              label="Requested"
              value={format(loan.requestedAt, "MMM d, yyyy")}
            />
            {loan.disbursedAt && (
              <InfoRow
                label="Disbursed"
                value={format(loan.disbursedAt, "MMM d, yyyy")}
              />
            )}
          </CardContent>
        </Card>

        {/* Repayment Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Repayment Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Progress ring / bar */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">
                  KES {loan.repaidAmount.toLocaleString()} of KES{" "}
                  {loan.totalAmount.toLocaleString()}
                </span>
                <span className="font-medium">{progress}%</span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    loan.status === "repaid" ? "bg-green-500" : "bg-primary"
                  }`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Repaid</p>
                <p className="text-lg font-bold text-green-600 dark:text-green-400">
                  KES {loan.repaidAmount.toLocaleString()}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Remaining</p>
                <p className="text-lg font-bold">
                  KES {remaining.toLocaleString()}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Payments Made</p>
                <p className="text-lg font-bold">{repayments.length}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">
                  Monthly Instalment
                </p>
                <p className="text-lg font-bold">
                  KES{" "}
                  {Math.ceil(
                    loan.totalAmount / loan.repaymentMonths,
                  ).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Repayment History */}
      <Card>
        <CardHeader>
          <CardTitle>Repayment History</CardTitle>
          <CardDescription>All recorded repayments for this loan</CardDescription>
        </CardHeader>
        <CardContent>
          {repayments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No repayments recorded yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {repayments.map((r) => (
                <div
                  key={r._id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm">
                        Ref: {r.reference}
                      </p>
                      <Badge
                        variant={
                          r.status === "completed" ? "default" : "secondary"
                        }
                        className="capitalize text-[11px]"
                      >
                        {r.status === "completed" ? (
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                        ) : (
                          <Clock className="h-3 w-3 mr-1" />
                        )}
                        {r.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {format(r.paidAt, "MMM d, yyyy")} · {r.paymentMethod}
                    </p>
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    <p className="text-lg font-bold">
                      KES {r.amount.toLocaleString()}
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

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}

function LoanStatusBadge({ status }: { status: LoanStatus }) {
  const config: Record<
    LoanStatus,
    { variant: "default" | "secondary" | "destructive" | "outline"; icon: React.ReactNode }
  > = {
    active: {
      variant: "default",
      icon: <TrendingUp className="h-3 w-3 mr-1" />,
    },
    repaid: {
      variant: "outline",
      icon: <CheckCircle2 className="h-3 w-3 mr-1" />,
    },
    pending: {
      variant: "secondary",
      icon: <Clock className="h-3 w-3 mr-1" />,
    },
    rejected: { variant: "destructive", icon: null },
    defaulted: { variant: "destructive", icon: null },
  };

  const { variant, icon } = config[status];
  return (
    <Badge variant={variant} className="capitalize text-[11px]">
      {icon}
      {status}
    </Badge>
  );
}
