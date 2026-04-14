import {
  AlertCircle,
  CheckCircle2,
  Clock,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { mockLoans, type LoanStatus } from "@/lib/mock-data";
import { format } from "date-fns";

export default function Loans() {
  const loans = [...mockLoans].sort((a, b) => b.requestedAt - a.requestedAt);

  const active = loans.filter((l) => l.status === "active");
  const totalDisbursed = loans
    .filter((l) => l.disbursedAt)
    .reduce((s, l) => s + l.principal, 0);
  const totalRepaid = loans.reduce((s, l) => s + l.repaidAmount, 0);
  const totalOutstanding = loans
    .filter((l) => l.status === "active")
    .reduce((s, l) => s + (l.totalAmount - l.repaidAmount), 0);

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-medium text-foreground">Loans</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Track loan requests and repayment progress
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Disbursed
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              KES {totalDisbursed.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {loans.filter((l) => l.disbursedAt).length} loans
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Repaid</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              KES {totalRepaid.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Across all loans</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              KES {totalOutstanding.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {active.length} active loan{active.length !== 1 && "s"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loans.filter((l) => l.status === "pending").length}
            </div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>
      </div>

      {/* Loans List */}
      <Card>
        <CardHeader>
          <CardTitle>All Loans</CardTitle>
          <CardDescription>Loan requests and their status</CardDescription>
        </CardHeader>
        <CardContent>
          {loans.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No loans yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {loans.map((loan) => {
                const progress =
                  loan.totalAmount > 0
                    ? Math.round(
                        (loan.repaidAmount / loan.totalAmount) * 100,
                      )
                    : 0;

                return (
                  <Link
                    key={loan._id}
                    to={`/loans/${loan._id}`}
                    className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm">
                            {loan.borrowerName}
                          </p>
                          <LoanStatusBadge status={loan.status} />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {loan.purpose}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Requested {format(loan.requestedAt, "MMM d, yyyy")}
                          {loan.disbursedAt &&
                            ` · Disbursed ${format(loan.disbursedAt, "MMM d, yyyy")}`}
                        </p>
                      </div>
                      <div className="text-right shrink-0 ml-4">
                        <p className="text-lg font-bold">
                          KES {loan.principal.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {loan.interestRate}% interest ·{" "}
                          {loan.repaymentMonths}mo
                        </p>
                      </div>
                    </div>

                    {/* Progress bar for active/repaid loans */}
                    {(loan.status === "active" || loan.status === "repaid") && (
                      <div className="mt-3">
                        <div className="flex justify-between text-xs text-muted-foreground mb-1">
                          <span>
                            KES {loan.repaidAmount.toLocaleString()} repaid
                          </span>
                          <span>{progress}%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              loan.status === "repaid"
                                ? "bg-green-500"
                                : "bg-primary"
                            }`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
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
