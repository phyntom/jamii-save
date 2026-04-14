import { cn } from "@/lib/utils";

export function StatsCard({
  label,
  value,
  description,
  icon: Icon,
  className,
}: {
  label: string;
  value: string | number;
  description: string;
  icon: React.ElementType;
  className?: string;
}) {
  return (
    <div className={cn("bg-card border rounded-lg p-4", className)}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-[11px] uppercase tracking-widest text-muted-foreground font-medium">
          {label}
        </p>
        <span className="p-2 bg-primary/10 rounded-sm">
          <Icon className="h-4 w-4 text-primary" />
        </span>
      </div>
      <p className="text-2xl font-medium dark:text-secondary-foreground">{value}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
    </div>
  );
}
