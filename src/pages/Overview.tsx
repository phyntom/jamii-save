import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { CreditCard, DollarSign, Plus, TrendingUp, Users } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { StatsCard } from "@/components/ui/StatsCard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getDashboardStats, mockContributions } from "@/lib/mock-data";
import { formatDistanceToNow } from "date-fns";

export default function Overview() {
  const user = useQuery(api.users.currentUser);
  const communities = useQuery(
    api.memberships.getUserCommunities,
    user ? { userId: user._id } : "skip",
  );

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground text-sm">
        Loading...
      </div>
    );
  }

  const stats = getDashboardStats();

  // Recent contributions (last 5, sorted by date)
  const recentContributions = [...mockContributions]
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 5);

  // Community quick-view: use real data if available, fall back to mock
  const communitiesList = communities ?? [];

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Top bar */}
      <div className="flex items-start justify-between mb-10">
        <div>
          <h1 className="text-2xl font-medium text-foreground">
            Welcome back, {user.name?.split(" ")[0] ?? "there"}!
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Here's an overview of your savings activity
          </p>
        </div>
        <CreateButton />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatsCard
          label="Total Communities"
          value={communitiesList.length || stats.totalCommunities}
          description="Active savings groups"
          icon={Users}
        />
        <StatsCard
          label="Total Contributions"
          value={`KES ${stats.totalContributions.toLocaleString()}`}
          description="All-time contributions"
          icon={DollarSign}
        />
        <StatsCard
          label="Active Loans"
          value={stats.activeLoans}
          description="Currently outstanding"
          icon={CreditCard}
        />
        <StatsCard
          label="Savings Rate"
          value={`${stats.savingsRate}%`}
          description="On-time contributions"
          icon={TrendingUp}
        />
      </div>

      {/* Two-column: Communities + Recent Contributions */}
      <div className="grid gap-6 md:grid-cols-2 mb-10">
        {/* Your Communities */}
        <Card>
          <CardHeader>
            <CardTitle>Your Communities</CardTitle>
            <CardDescription>
              Savings communities you're part of
            </CardDescription>
          </CardHeader>
          <CardContent>
            {communitiesList.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  You're not part of any communities yet
                </p>
                <Button asChild>
                  <Link to="/communities/new">Create a Community</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {communitiesList.map(
                  (community) =>
                    community && (
                      <div
                        key={community._id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="min-w-0">
                          <h3 className="font-medium text-sm truncate">
                            {community.name}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            Target: {community.currency}{" "}
                            {community.targetAmount?.toLocaleString()}{" "}
                            {community.contributionFrequency?.toLowerCase()}
                          </p>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/communities/${community.slug}`}>
                            View
                          </Link>
                        </Button>
                      </div>
                    ),
                )}
                {communitiesList.length > 3 && (
                  <Button variant="ghost" className="w-full" asChild>
                    <Link to="/overview">View all communities</Link>
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Contributions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Contributions</CardTitle>
            <CardDescription>Your latest contribution activity</CardDescription>
          </CardHeader>
          <CardContent>
            {recentContributions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No contributions yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentContributions.map((contribution) => (
                  <div
                    key={contribution._id}
                    className="flex items-center justify-between"
                  >
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">
                        {contribution.userName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(contribution.createdAt, {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-medium text-sm">
                        KES {contribution.amount.toLocaleString()}
                      </p>
                      <ContributionStatusBadge status={contribution.status} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ── Sub-components ───────────────────────────────────────────────────

function ContributionStatusBadge({
  status,
}: {
  status: "approved" | "pending" | "rejected";
}) {
  const styles = {
    approved: "text-green-600 dark:text-green-400",
    pending: "text-amber-600 dark:text-amber-400",
    rejected: "text-red-600 dark:text-red-400",
  };
  return <p className={`text-xs capitalize ${styles[status]}`}>{status}</p>;
}

function CreateButton() {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate("/communities/new")}
      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border border-border rounded-lg bg-background hover:bg-muted transition-colors"
    >
      <Plus className="w-4 h-4" />
      New community
    </button>
  );
}
