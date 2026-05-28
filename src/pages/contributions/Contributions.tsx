import {
  CheckCircle2,
  Clock,
  DollarSign,
  Plus,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router";
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
  mockContributions,
  type ContributionStatus,
} from "@/lib/mock-data";
import { format } from "date-fns";

export default function Contributions() {
  const contributions = [...mockContributions].sort(
    (a, b) => b.createdAt - a.createdAt,
  );

  const approved = contributions.filter((c) => c.status === "approved");
  const pending = contributions.filter((c) => c.status === "pending");
  const totalApproved = approved.reduce((s, c) => s + c.amount, 0);
  const successRate =
    contributions.length > 0
      ? Math.round((approved.length / contributions.length) * 100)
      : 0;

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium text-foreground">
            Contributions
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track and manage your community contributions
          </p>
        </div>
        <Button asChild>
          <Link to="/contributions/new">
            <Plus className="mr-2 h-4 w-4" />
            New Contribution
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Approved
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              KES {totalApproved.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {approved.length} contributions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Approval
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pending.length}</div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{successRate}%</div>
            <p className="text-xs text-muted-foreground">Approval rate</p>
          </CardContent>
        </Card>
      </div>

      {/* History */}
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
              {contributions.map((c) => (
                <div
                  key={c._id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm">{c.userName}</p>
                      <StatusBadge status={c.status} />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {format(c.createdAt, "MMM d, yyyy")} &middot;{" "}
                      {c.paymentMethod}
                      {c.reference && ` \u00B7 Ref: ${c.reference}`}
                    </p>
                    {c.notes && (
                      <p className="text-xs text-muted-foreground">{c.notes}</p>
                    )}
                    {c.approvedBy && (
                      <p className="text-[11px] text-muted-foreground">
                        {c.status === "approved" ? "Approved" : "Rejected"} by{" "}
                        {c.approvedBy}
                        {c.approvedAt &&
                          ` on ${format(c.approvedAt, "MMM d, yyyy")}`}
                      </p>
                    )}
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    <p className="text-lg font-bold">
                      KES {c.amount.toLocaleString()}
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

function StatusBadge({ status }: { status: ContributionStatus }) {
  const variant = {
    approved: "default" as const,
    pending: "secondary" as const,
    rejected: "destructive" as const,
  };
  const icon = {
    approved: <CheckCircle2 className="h-3 w-3 mr-1" />,
    pending: <Clock className="h-3 w-3 mr-1" />,
    rejected: null,
  };
  return (
    <Badge variant={variant[status]} className="capitalize text-[11px]">
      {icon[status]}
      {status}
    </Badge>
  );
}
