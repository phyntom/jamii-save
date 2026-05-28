import {
  Activity,
  CreditCard,
  DollarSign,
  Users,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { mockAdminStats, mockAuditLogs } from "@/lib/mock-data";
import { formatDistanceToNow } from "date-fns";

export default function AdminDashboard() {
  const stats = [
    {
      label: "Total Users",
      value: mockAdminStats.totalUsers,
      icon: Users,
    },
    {
      label: "Communities",
      value: mockAdminStats.totalCommunities,
      icon: Activity,
    },
    {
      label: "Contributions",
      value: mockAdminStats.totalContributions.toLocaleString(),
      icon: DollarSign,
    },
    {
      label: "Active Loans",
      value: `${mockAdminStats.activeLoans} / ${mockAdminStats.totalLoans}`,
      icon: CreditCard,
    },
  ];

  const recentLogs = [...mockAuditLogs]
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 5);

  return (
    <div className="px-8 py-10 space-y-8">
      <div>
        <h1 className="text-2xl font-medium text-foreground">
          Admin Dashboard
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Platform overview and recent activity
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{s.label}</CardTitle>
              <s.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{s.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest actions across the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentLogs.map((log) => (
              <div
                key={log._id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="space-y-0.5 min-w-0">
                  <p className="text-sm font-medium">{log.action}</p>
                  <p className="text-xs text-muted-foreground">
                    {log.performedBy} &middot; {log.target}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground shrink-0 ml-4">
                  {formatDistanceToNow(log.timestamp, { addSuffix: true })}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
