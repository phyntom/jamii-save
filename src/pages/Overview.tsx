import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router";
import { CommunityCard } from "@/components/CommunityCard";

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

  const activeCommunities = communities?.filter((c) => c?.isActive).length ?? 0;

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      {/* Top bar */}
      <div className="flex items-start justify-between mb-10">
        <div>
          <h1 className="text-2xl font-medium text-foreground">
            Good morning, {user.name?.split(" ")[0] ?? "there"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Here's what's happening with your communities.
          </p>
        </div>
        <CreateButton />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-10">
        <StatCard label="Communities" value={communities?.length ?? 0} />
        <StatCard label="Active" value={activeCommunities} />
        <StatCard label="Pending invites" value={0} />
      </div>

      {/* Community grid */}
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-4">
        Your communities
      </p>

      {communities && communities.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {communities.map(
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

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-secondary border rounded-lg p-4">
      <p className="text-[11px] uppercase tracking-widest text-muted-foreground font-medium mb-1.5">
        {label}
      </p>
      <p className="text-2xl font-medium text-foreground">{value}</p>
    </div>
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
