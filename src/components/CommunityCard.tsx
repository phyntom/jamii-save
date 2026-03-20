import { Link } from "react-router";

interface CommunityCardProps {
  _id: string;
  name: string;
  description?: string;
  logo?: string;
  slug: string;
  isActive: boolean;
}

export function CommunityCard({
  _id,
  name,
  description,
  logo,
  slug,
  isActive,
}: CommunityCardProps) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="bg-background border border-border/50 rounded-xl p-5 flex flex-col gap-3 hover:border-border transition-colors cursor-pointer">
      <div className="flex items-start justify-between gap-2">
        {logo ? (
          <img
            src={logo}
            alt={name}
            className="w-10 h-10 rounded-[10px] object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-[10px] bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-sm font-medium text-blue-700 dark:text-blue-300 font-mono">
            {initials}
          </div>
        )}
        <span
          className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${
            isActive
              ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {isActive ? "Active" : "Inactive"}
        </span>
      </div>

      <div>
        <p className="text-[15px] font-medium text-foreground">{name}</p>
        <p className="text-xs text-muted-foreground font-mono mt-0.5">
          @{slug}
        </p>
      </div>

      <p className="text-[13px] text-muted-foreground leading-relaxed">
        {description ?? "No description provided."}
      </p>

      <div className="flex items-center justify-between pt-2.5 border-t border-border/50">
        <span className="text-xs text-muted-foreground">Community</span>
        <Link
          to={`/communities/${slug}/manage`}
          className="text-xs font-medium text-blue-600 dark:text-blue-400"
        >
          Manage →
        </Link>
      </div>
    </div>
  );
}
