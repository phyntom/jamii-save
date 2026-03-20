import { useParams } from "react-router";

// Placeholder types — replace with your Convex query return types
type StatCard = { label: string; value: string; delta: string; down?: boolean };
type Member = {
  id: string;
  initials: string;
  name: string;
  role: string;
  joinedAt: string;
};
type Activity = {
  id: string;
  type: "post" | "member" | "event";
  text: string;
  highlight: string;
  time: string;
};
type Category = { name: string; count: number; pct: number };

// ─── Placeholder data (swap with useQuery hooks) ────────────────────────────

const STATS: StatCard[] = [
  { label: "Total members", value: "1,248", delta: "+12 this week" },
  { label: "Posts this week", value: "84", delta: "+6 vs last week" },
  { label: "Active today", value: "37", delta: "−4 vs yesterday", down: true },
  { label: "Upcoming events", value: "3", delta: "next in 2 days" },
];

const MEMBERS: Member[] = [
  {
    id: "1",
    initials: "SL",
    name: "Sophie L.",
    role: "Developer",
    joinedAt: "2h ago",
  },
  {
    id: "2",
    initials: "MK",
    name: "Marc K.",
    role: "Designer",
    joinedAt: "5h ago",
  },
  {
    id: "3",
    initials: "AR",
    name: "Aiko R.",
    role: "Founder",
    joinedAt: "1d ago",
  },
  {
    id: "4",
    initials: "TN",
    name: "Tom N.",
    role: "Developer",
    joinedAt: "1d ago",
  },
];

const ACTIVITY: Activity[] = [
  {
    id: "1",
    type: "post",
    text: "Sophie posted",
    highlight: '"Best tools for 2025"',
    time: "2h ago",
  },
  {
    id: "2",
    type: "member",
    text: "Marc joined the community",
    highlight: "",
    time: "5h ago",
  },
  {
    id: "3",
    type: "event",
    text: "New event:",
    highlight: "Live Q&A session",
    time: "8h ago",
  },
  {
    id: "4",
    type: "post",
    text: "Tom posted",
    highlight: '"Intro: I\'m new here!"',
    time: "1d ago",
  },
];

const CATEGORIES: Category[] = [
  { name: "General", count: 36, pct: 72 },
  { name: "Showcase", count: 24, pct: 48 },
  { name: "Help", count: 18, pct: 36 },
  { name: "Events", count: 6, pct: 12 },
];

const CATEGORY_COLORS = ["#378ADD", "#1D9E75", "#EF9F27", "#7F77DD"];

const AVATAR_STYLES = [
  "bg-blue-100 text-blue-700",
  "bg-green-100 text-green-700",
  "bg-amber-100 text-amber-700",
  "bg-red-100 text-red-700",
];

const ACTIVITY_ICONS: Record<Activity["type"], { bg: string; symbol: string }> =
  {
    post: { bg: "bg-blue-100", symbol: "✏" },
    member: { bg: "bg-green-100", symbol: "+" },
    event: { bg: "bg-amber-100", symbol: "◆" },
  };

// ─── Sub-components ──────────────────────────────────────────────────────────

function StatCard({ label, value, delta, down }: StatCard) {
  return (
    <div className="bg-muted rounded-md p-4">
      <p className="text-xs text-muted-foreground mb-1.5">{label}</p>
      <p className="text-2xl font-medium">{value}</p>
      <p
        className={`text-xs mt-1 ${down ? "text-destructive" : "text-green-600"}`}
      >
        {delta}
      </p>
    </div>
  );
}

function MemberRow({ member, index }: { member: Member; index: number }) {
  return (
    <div className="flex items-center gap-2.5 border-b border-border last:border-0 last:pb-0">
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium shrink-0 ${
          AVATAR_STYLES[index % AVATAR_STYLES.length]
        }`}
      >
        {member.initials}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium truncate">{member.name}</p>
        <p className="text-xs text-muted-foreground">{member.role}</p>
      </div>
      <p className="text-xs text-muted-foreground ml-auto shrink-0">
        {member.joinedAt}
      </p>
    </div>
  );
}

function ActivityRow({ item }: { item: Activity }) {
  const icon = ACTIVITY_ICONS[item.type];
  return (
    <div className="flex items-start gap-2.5 py-2 border-b border-border last:border-0 last:pb-0">
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 mt-0.5 ${icon.bg}`}
      >
        {icon.symbol}
      </div>
      <div>
        <p className="text-sm leading-snug">
          {item.text}{" "}
          {item.highlight && (
            <span className="text-muted-foreground">{item.highlight}</span>
          )}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">{item.time}</p>
      </div>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function CommunityDashboard() {
  const { communityId } = useParams<{ communityId: string }>();

  // TODO: replace placeholders with real queries, e.g.:
  // const community = useQuery(api.communities.get, { id: communityId });
  // const stats     = useQuery(api.communities.stats, { id: communityId });
  // const members   = useQuery(api.communities.recentMembers, { id: communityId });
  // const activity  = useQuery(api.communities.recentActivity, { id: communityId });
  // const categories = useQuery(api.communities.topCategories, { id: communityId });

  const communityName = "Dev community"; // community?.name

  return (
    <div className="mx-8 py-6 px-0 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-lg font-medium border border-border shrink-0">
          {communityName.slice(0, 2).toUpperCase()}
        </div>
        <div>
          <h1 className="text-lg font-medium">{communityName}</h1>
          <p className="text-sm text-muted-foreground">Community dashboard</p>
        </div>
        <span className="ml-auto flex items-center gap-1.5 text-xs px-2 py-1 rounded-md bg-green-100 text-green-700 border border-green-200 shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-green-600 inline-block" />
          Active
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {STATS.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* Recent members + activity */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="rounded-xl border border-border bg-card p-4 px-5">
          <p className="text-xs font-medium text-muted-foreground mb-2">
            Recent members
          </p>
          {MEMBERS.map((m, i) => (
            <MemberRow key={m.id} member={m} index={i} />
          ))}
        </div>

        <div className="rounded-xl border border-border bg-card p-4 px-5">
          <p className="text-xs font-medium text-muted-foreground mb-2">
            Recent activity
          </p>
          {ACTIVITY.map((a) => (
            <ActivityRow key={a.id} item={a} />
          ))}
        </div>
      </div>

      {/* Top categories */}
      <div className="rounded-xl border border-border bg-card p-4 px-5">
        <p className="text-xs font-medium text-muted-foreground mb-3">
          Top categories
        </p>
        <div className="space-y-2.5">
          {CATEGORIES.map((c, i) => (
            <div key={c.name} className="flex items-center gap-2.5">
              <span className="text-xs text-muted-foreground w-16 shrink-0 truncate">
                {c.name}
              </span>
              <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${c.pct}%`,
                    background: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
                  }}
                />
              </div>
              <span className="text-xs text-muted-foreground w-6 text-right shrink-0">
                {c.count}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
