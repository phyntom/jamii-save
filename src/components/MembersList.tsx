import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { useMemo } from "react";
import { EntityTable } from "./EntityTable";
import { Doc } from "convex/_generated/dataModel";
import { Users } from "lucide-react";
import { roleBadgeClass } from "@/lib/role-badge";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty";

type MemberWithUser = Doc<"memberships"> & {
  user: Doc<"users"> | null;
};

function formatDate(ts: number) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(ts));
}

export function MembersList({
  members,
  limit,
}: {
  members: MemberWithUser[];
  limit?: number;
}) {
  const columns: ColumnDef<MemberWithUser>[] = useMemo(
    () => [
      {
        header: "Name",
        accessorKey: "user.name",
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
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Users />
          </EmptyMedia>
          <EmptyTitle>No members yet</EmptyTitle>
          <EmptyDescription>
            Members will appear here once they join.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  const visible = limit ? members.slice(0, limit) : members;

  return (
    <div className="border border-border/50 rounded-xl overflow-hidden">
      <EntityTable columns={columns} data={visible} />
    </div>
  );
}
