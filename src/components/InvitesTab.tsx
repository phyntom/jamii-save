import { useMutation, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { Mail, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Doc } from "convex/_generated/dataModel";
import { ColumnDef } from "@tanstack/react-table";
import { EntityTable } from "./EntityTable";

type InviteWithUser = Doc<"invites"> & {
  invitedByUser: Doc<"users"> | null;
};

interface InvitesTabProps {
  invites: InviteWithUser[];
  communityName: string;
  inviterName: string;
}

function formatDate(ts: number) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(ts));
}

function statusBadge(status: string) {
  const map: Record<string, string> = {
    pending:
      "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300",
    confirmed:
      "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-300",
    declined:
      "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300",
  };
  return map[status] ?? "border-border bg-muted text-muted-foreground";
}

export function InvitesTab({
  invites,
  communityName,
  inviterName,
}: InvitesTabProps) {
  const cancelInvite = useMutation(api.invites.cancelInvite);
  const resendInvite = useAction(api.inviteActions.resendInvite);
  const [resending, setResending] = useState<string | null>(null);

  async function handleResend(invite: InviteWithUser) {
    setResending(invite._id);
    try {
      await resendInvite({ inviteId: invite._id, communityName, inviterName });
      toast.success(`Invite resent to ${invite.email}`);
    } catch {
      toast.error("Failed to resend invite.");
    } finally {
      setResending(null);
    }
  }

  async function handleCancel(inviteId: Doc<"invites">["_id"]) {
    try {
      await cancelInvite({ inviteId });
      toast.success("Invite cancelled.");
    } catch {
      toast.error("Failed to cancel invite.");
    }
  }

  const columns: ColumnDef<InviteWithUser>[] = useMemo(
    () => [
      {
        header: "Email",
        accessorKey: "email",
        cell: ({ row }) => (
          <span className="font-mono text-xs">
            {row.getValue("email")}
          </span>
        ),
      },
      {
        header: "Status",
        accessorKey: "status",
        cell: ({ row }) => {
          const status: string = row.getValue("status");
          return (
            <Badge variant="outline" className={statusBadge(status)}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
          );
        },
      },
      {
        header: "Invited by",
        id: "invitedByUser",
        accessorFn: (row) => row.invitedByUser?.name ?? "—",
        cell: ({ getValue }) => (
          <span className="text-muted-foreground text-xs">
            {getValue() as string}
          </span>
        ),
      },
      {
        header: "Expires",
        accessorKey: "expiresAt",
        cell: ({ row }) => {
          const expiresAt: number = row.getValue("expiresAt");
          return expiresAt < Date.now() ? (
            <span className="text-red-500 text-xs">Expired</span>
          ) : (
            <span className="text-muted-foreground text-xs">
              {formatDate(expiresAt)}
            </span>
          );
        },
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => {
          const invite = row.original;
          return (
            <div className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-1 rounded hover:bg-muted transition-colors">
                    <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {invite.status === "pending" && (
                    <DropdownMenuItem
                      onClick={() => handleResend(invite)}
                      disabled={resending === invite._id}
                    >
                      {resending === invite._id ? "Resending…" : "Resend"}
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    onClick={() => handleCancel(invite._id)}
                    className="text-destructive focus:text-destructive"
                  >
                    Cancel invite
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
      },
    ],
    [resending],
  );

  if (invites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-2 border border-dashed border-border rounded-xl">
        <Mail className="w-8 h-8 text-muted-foreground/50" />
        <p className="text-sm font-medium text-foreground">No invites yet</p>
        <p className="text-xs text-muted-foreground">
          Invited members will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="border border-border/50 rounded-xl overflow-hidden">
      <EntityTable columns={columns} data={invites} />
    </div>
  );
}
