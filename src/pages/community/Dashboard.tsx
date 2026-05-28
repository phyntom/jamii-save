import { useOutletContext } from "react-router";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { OutletContext } from "@/types";
import { StatsCard } from "@/components/ui/StatsCard";
import { MembersList } from "@/components/MembersList";
import { Badge } from "@/components/ui/badge";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty";
import {
  Users,
  Activity,
  Mail,
  DollarSign,
  Clock3,
} from "lucide-react";
import { Doc } from "convex/_generated/dataModel";

function formatDateTime(ts: number) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(ts));
}

function ActivityRow({ log }: { log: Doc<"activity"> & { userEmail?: string } }) {
  return (
    <div className="flex items-start gap-2.5 py-2 border-b border-border last:border-0">
      <div className="mt-0.5 rounded-full bg-primary/10 p-1.5 shrink-0">
        <Activity className="h-3.5 w-3.5 text-primary" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm leading-snug">
          <span className="font-medium">{log.userEmail ?? "Unknown"}</span>{" "}
          <span className="text-muted-foreground">
            {log.action} {log.entity}
          </span>
        </p>
        {log.metadata && (
          <p className="text-xs text-muted-foreground mt-0.5 truncate">
            {log.metadata}
          </p>
        )}
      </div>
      <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
        <Clock3 className="h-3 w-3" />
        <span>{formatDateTime(log._creationTime)}</span>
      </div>
    </div>
  );
}

export default function CommunityDashboard() {
  const { community } = useOutletContext<OutletContext>();

  const members = useQuery(
    api.memberships.getCommunityMembers,
    community ? { communityId: community._id } : "skip",
  );
  const activityLogs = useQuery(
    api.activities.getActivitiesByCommunity,
    community ? { communityId: community._id } : "skip",
  );
  const invites = useQuery(
    api.invites.getInvitesByCommunity,
    community ? { communityId: community._id } : "skip",
  );

  const memberCount = members?.length ?? 0;
  const activityCount = activityLogs?.length ?? 0;
  const pendingInvites =
    invites?.filter((i) => i.status === "pending").length ?? 0;
  const recentActivity = activityLogs?.slice(0, 5) ?? [];

  return (
    <div className="mx-8 py-6 px-0 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-lg font-medium border border-border shrink-0">
          {community?.name.slice(0, 2).toUpperCase()}
        </div>
        <div>
          <h1 className="text-lg font-medium">{community?.name}</h1>
          <p className="text-sm text-muted-foreground">Community dashboard</p>
        </div>
        <Badge
          variant="outline"
          className={
            community?.isActive
              ? "ml-auto bg-green-100 text-green-700 border-green-200"
              : "ml-auto bg-muted text-muted-foreground"
          }
        >
          <span
            className={`w-1.5 h-1.5 rounded-full inline-block mr-1.5 ${community?.isActive ? "bg-green-600" : "bg-muted-foreground"}`}
          />
          {community?.isActive ? "Active" : "Inactive"}
        </Badge>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <StatsCard
          label="Total Members"
          value={memberCount}
          description={`${memberCount} ${memberCount === 1 ? "member" : "members"} in this community`}
          icon={Users}
        />
        <StatsCard
          label="Activity"
          value={activityCount}
          description="Total logged actions"
          icon={Activity}
        />
        <StatsCard
          label="Pending Invites"
          value={pendingInvites}
          description="Awaiting response"
          icon={Mail}
        />
        <StatsCard
          label="Contributions"
          value={0}
          description="Coming soon"
          icon={DollarSign}
        />
      </div>

      {/* Recent members + activity */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="rounded-xl border border-border bg-card p-4 px-5">
          <p className="text-xs font-medium text-muted-foreground mb-2">
            Recent members
          </p>
          <MembersList members={members ?? []} limit={5} />
        </div>

        <div className="rounded-xl border border-border bg-card p-4 px-5">
          <p className="text-xs font-medium text-muted-foreground mb-2">
            Recent activity
          </p>
          {recentActivity.length === 0 ? (
            <Empty className="py-8">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Activity />
                </EmptyMedia>
                <EmptyTitle>No activity yet</EmptyTitle>
                <EmptyDescription>
                  Actions will be logged here as they happen.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <div>
              {recentActivity.map((log) => (
                <ActivityRow key={log._id} log={log} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
