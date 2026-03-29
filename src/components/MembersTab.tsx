import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { useMemo } from "react";
import { EntityTable } from "./EntityTable";
import { Doc } from "convex/_generated/dataModel";
import { Users } from "lucide-react";

function formatDate(ts: number) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(ts));
}

type MemberWithUser = Doc<"memberships"> & {
  user: Doc<"users"> | null;
};

export function MembersTab({ members }: { members: MemberWithUser[] }) {
  if (members.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-2 border border-dashed border-border rounded-xl">
        <Users className="w-8 h-8 text-muted-foreground/50" />
        <p className="text-sm font-medium text-foreground">No members yet</p>
      </div>
    );
  }

  const columns: ColumnDef<MemberWithUser>[] = useMemo(
    () => [
      {
        header: "Name",
        accessorKey: "user.name",
      },
      {
        header: "Email",
        accessorKey: "user.email",
      },
      {
        header: "Role",
        accessorKey: "role",
        cell: ({ row }) => {
          return (
            <Badge
              variant="outline"
              className={roleBadge(row.getValue("role"))}
            >
              {row.getValue("role")}
            </Badge>
          );
        },
      },
      {
        header: "Joined",
        accessorKey: "joinedAt",
        cell: ({ row }) => {
          return (
            <span className="text-muted-foreground text-xs">
              {formatDate(row.getValue("joinedAt"))}
            </span>
          );
        },
      },
    ],
    [members],
  );

  return (
    <div className="border border-border/50 rounded-xl overflow-hidden">
      <EntityTable columns={columns} data={members} />
    </div>
  );
}

function roleBadge(role: string) {
  const map: Record<string, string> = {
    owner:
      "bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
    admin: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
    treasurer:
      "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
    secretary: "bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300",
    member: "bg-muted text-muted-foreground",
  };
  return map[role] ?? map.member;
}
