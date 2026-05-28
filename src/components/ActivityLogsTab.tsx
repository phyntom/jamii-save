import { Doc } from "convex/_generated/dataModel";
import { Activity, Clock3 } from "lucide-react";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";

interface ActivityLogsTabProps {
  activityLogs: Array<Doc<"activity"> & { userEmail?: string }>;
}

function formatDate(ts: number) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(ts));
}

function prettifyLabel(value: string) {
  return value
    .replace(/[._]/g, " ")
    .replace(/\b\w/g, (match) => match.toUpperCase());
}

export function ActivityLogsTab({ activityLogs }: ActivityLogsTabProps) {
  if (activityLogs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-2 border border-dashed border-border rounded-xl">
        <Activity className="w-8 h-8 text-muted-foreground/50" />
        <p className="text-sm font-medium text-foreground">Activity logs</p>
        <p className="text-xs text-muted-foreground">No activity logs yet.</p>
      </div>
    );
  }
  return (
    <div className="space-y-3">
      {activityLogs.map((log) => (
        <Card
          key={log._id}
          className="py-0 overflow-hidden border-border/80 transition-colors hover:border-primary/40"
        >
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-full bg-primary/10 p-2">
                <Activity className="h-4 w-4 text-primary" />
              </div>
              <div className="min-w-0 flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary">{prettifyLabel(log.entity)}</Badge>
                  <Badge variant="outline" className="font-medium">
                    {prettifyLabel(log.action)}
                  </Badge>
                </div>
                <p className="text-sm text-foreground">
                  <span className="font-medium">
                    {log.userEmail ?? "Unknown user"}
                  </span>{" "}
                  performed this action.
                </p>
                {log.metadata ? (
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {log.metadata}
                  </p>
                ) : null}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock3 className="h-3.5 w-3.5" />
                <span>{formatDate(log._creationTime)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
