type CommunityPreviewProps = {
  name: string;
  slug: string;
  description: string;
  isActive: boolean;
};

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function CommunityPreview({
  name,
  slug,
  description,
  isActive,
}: CommunityPreviewProps) {
  const initials = name ? getInitials(name) : "?";

  return (
    <div className="bg-background border border-border/50 rounded-xl p-6">
      <p className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground mb-4">
        Preview
      </p>
      <div className="flex items-start gap-3 bg-muted/50 rounded-lg p-4">
        <div className="w-10 h-10 rounded-[10px] bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-sm font-medium text-blue-700 dark:text-blue-300 font-mono shrink-0">
          {initials}
        </div>
        <div>
          <p
            className={`text-[15px] font-medium ${name ? "text-foreground" : "text-muted-foreground"}`}
          >
            {name || "Community name"}
          </p>
          <p className="text-xs text-muted-foreground font-mono mt-0.5">
            @{slug || "slug"}
          </p>
          <p
            className={`text-[13px] mt-1.5 leading-relaxed ${description ? "text-muted-foreground" : "text-muted-foreground/50"}`}
          >
            {description || "No description yet."}
          </p>
          <span
            className={`inline-block mt-2 text-[11px] font-medium px-2.5 py-1 rounded-full ${isActive ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300" : "bg-muted text-muted-foreground"}`}
          >
            {isActive ? "Active" : "Inactive"}
          </span>
        </div>
      </div>
    </div>
  );
}
