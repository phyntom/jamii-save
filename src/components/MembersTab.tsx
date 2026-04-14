import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { useMemo } from "react";
import { EntityTable } from "./EntityTable";
import { Doc } from "convex/_generated/dataModel";
import { Users } from "lucide-react";
import { roleBadgeClass } from "@/lib/role-badge";

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
        cell: ({ row }) => (
          <Badge
            variant="outline"
            className={roleBadgeClass(row.getValue("role"))}
          >
            {row.getValue("role")}
          </Badge>
        ),
      },
      {
        header: "Joined",
        accessorKey: "joinedAt",
        cell: ({ row }) => (
          <span className="text-muted-foreground text-xs">
            {formatDate(row.getValue("joinedAt"))}
          </span>
        ),
      },
    ],
    [],
  );

  if (members.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-2 border border-dashed border-border rounded-xl">
        <Users className="w-8 h-8 text-muted-foreground/50" />
        <p className="text-sm font-medium text-foreground">No members yet</p>
      </div>
    );
  }

  return (
    <div className="border border-border/50 rounded-xl overflow-hidden">
      <EntityTable columns={columns} data={members} />
    </div>
  );
}
