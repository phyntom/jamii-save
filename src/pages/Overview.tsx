import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import {
  CreditCard,
  DollarSign,
  Plus,
  TrendingUp,
  Users,
} from "lucide-react";
import { Link, useNavigate } from "react-router";
import { CommunityCard } from "@/components/CommunityCard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  getDashboardStats,
  mockCommunities,
  mockContributions,
} from "@/lib/mock-data";
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
  const quickViewCommunities = mockCommunities.slice(0, 3);

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
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
            {quickViewCommunities.length === 0 ? (
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
                {quickViewCommunities.map((community) => (
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
                        {community.targetAmount.toLocaleString()}{" "}
                        {community.contributionFrequency.toLowerCase()}
                      </p>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/communities/${community.slug}`}>View</Link>
                    </Button>
                  </div>
                ))}
                {mockCommunities.length > 3 && (
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
            <CardDescription>
              Your latest contribution activity
            </CardDescription>
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

      {/* Full community grid */}
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-4">
        All communities
      </p>

      {communitiesList.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {communitiesList.map(
            (community) =>
              community && <CommunityCard key={community._id} {...community} />,
          )}
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}

// ── Sub-components ───────────────────────────────────────────────────

function StatsCard({
  label,
  value,
  description,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  description: string;
  icon: React.ElementType;
}) {
  return (
    <div className="bg-card border rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[11px] uppercase tracking-widest text-muted-foreground font-medium">
          {label}
        </p>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <p className="text-2xl font-medium text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
    </div>
  );
}

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
  return (
    <p className={`text-xs capitalize ${styles[status]}`}>{status}</p>
  );
}

function EmptyState() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 border border-dashed border-border rounded-xl">
      <p className="text-[15px] font-medium text-foreground">
        No communities yet
      </p>
      <p className="text-sm text-muted-foreground text-center max-w-xs leading-relaxed">
        Create your first community to start managing members and invites.
      </p>
      <button
        onClick={() => navigate("/communities/new")}
        className="mt-2 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border border-border rounded-lg bg-background hover:bg-muted transition-colors"
      >
        <Plus className="w-4 h-4" />
        Create a community
      </button>
    </div>
  );
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
