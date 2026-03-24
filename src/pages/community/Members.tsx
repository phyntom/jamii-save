import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useNavigate, useOutletContext, useParams } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { toast } from "sonner";
import {
  UserPlus,
  Mail,
  Users,
  Activity,
  MoreHorizontal,
  ArrowLeft,
} from "lucide-react";
import { OutletContext } from "@/types";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Doc } from "convex/_generated/dataModel";

// ── Types ─────────────────────────────────────────────────────────────────────

type InviteWithUser = Doc<"invites"> & {
  invitedByUser: Doc<"users"> | null;
};

type MemberWithUser = Doc<"memberships"> & {
  user: Doc<"users"> | null;
};

// ── Invite form schema ────────────────────────────────────────────────────────

const inviteSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});
type InviteFormValues = z.infer<typeof inviteSchema>;

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(ts: number) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(ts));
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

function statusBadge(status: string) {
  const map: Record<string, string> = {
    pending: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
    confirmed:
      "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300",
    declined: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
  };
  return map[status] ?? "bg-muted text-muted-foreground";
}

function initials(name?: string | null) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

// ── InviteDialog ─────────────────────────────────────────────────────────────

interface InviteDialogProps {
  open: boolean;
  onClose: () => void;
  communityId: Doc<"communities">["_id"];
  communityName: string;
  inviterName: string;
}

function InviteDialog({
  open,
  onClose,
  communityId,
  communityName,
  inviterName,
}: InviteDialogProps) {
  const sendInvite = useAction(api.inviteActions.sendInvite);

  const form = useForm<InviteFormValues>({
    resolver: zodResolver(inviteSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit(data: InviteFormValues) {
    try {
      await sendInvite({
        email: data.email,
        communityId,
        communityName,
        inviterName,
      });
      toast.success(`Invite sent to ${data.email}`);
      form.reset();
      onClose();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to send invite.";
      toast.error(message);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invite a member</DialogTitle>
          <DialogDescription>
            Enter the email address of the person you'd like to invite to{" "}
            <strong>{communityName}</strong>.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email address</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="colleague@example.com"
                      autoComplete="off"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Sending…" : "Send invite"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

// ── InvitesTab ────────────────────────────────────────────────────────────────

interface InvitesTabProps {
  invites: InviteWithUser[];
  communityName: string;
  inviterName: string;
}

function InvitesTab({ invites, communityName, inviterName }: InvitesTabProps) {
  const cancelInvite = useMutation(api.invites.cancelInvite);
  const resendInvite = useAction(api.inviteActions.resendInvite);
  const [resending, setResending] = useState<string | null>(null);

  async function handleResend(invite: InviteWithUser) {
    setResending(invite._id);
    try {
      await resendInvite({
        inviteId: invite._id,
        communityName,
        inviterName,
      });
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
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border/50 bg-muted/30">
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Email
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Status
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Invited by
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Expires
            </th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-border/50">
          {invites.map((invite) => (
            <tr
              key={invite._id}
              className="bg-background hover:bg-muted/20 transition-colors"
            >
              <td className="px-4 py-3 font-mono text-xs text-foreground">
                {invite.email}
              </td>
              <td className="px-4 py-3">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium ${statusBadge(invite.status)}`}
                >
                  {invite.status.charAt(0).toUpperCase() +
                    invite.status.slice(1)}
                </span>
              </td>
              <td className="px-4 py-3 text-muted-foreground text-xs">
                {invite.invitedByUser?.name ?? "—"}
              </td>
              <td className="px-4 py-3 text-muted-foreground text-xs">
                {invite.expiresAt < Date.now() ? (
                  <span className="text-red-500">Expired</span>
                ) : (
                  formatDate(invite.expiresAt)
                )}
              </td>
              <td className="px-4 py-3 text-right">
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── MembersTab ────────────────────────────────────────────────────────────────

function MembersTab({ members }: { members: MemberWithUser[] }) {
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
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border/50 bg-muted/30">
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Member
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Role
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Joined
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/50">
          {members.map((m) => (
            <tr
              key={m._id}
              className="bg-background hover:bg-muted/20 transition-colors"
            >
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-xs font-medium text-blue-700 dark:text-blue-300 font-mono shrink-0">
                    {initials(m.user?.name)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground leading-none">
                      {m.user?.name ?? "Unknown"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {m.user?.email ?? "—"}
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium ${roleBadge(m.role)}`}
                >
                  {m.role.charAt(0).toUpperCase() + m.role.slice(1)}
                </span>
              </td>
              <td className="px-4 py-3 text-xs text-muted-foreground">
                {formatDate(m.joinedAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── ActivityLogsTab ───────────────────────────────────────────────────────────

function ActivityLogsTab() {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-2 border border-dashed border-border rounded-xl">
      <Activity className="w-8 h-8 text-muted-foreground/50" />
      <p className="text-sm font-medium text-foreground">Activity logs</p>
      <p className="text-xs text-muted-foreground">Coming soon.</p>
    </div>
  );
}

// ── Members page ──────────────────────────────────────────────────────────────

export default function Members() {
  const { community, membership } = useOutletContext<OutletContext>();
  const [inviteOpen, setInviteOpen] = useState(false);
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();

  const currentUser = useQuery(api.users.currentUser);

  const membersData = useQuery(api.memberships.getCommunityMembers, {
    communityId: community._id,
  });

  const invitesData = useQuery(api.invites.getInvitesByCommunity, {
    communityId: community._id,
  });

  const isLoading =
    membersData === undefined ||
    invitesData === undefined ||
    currentUser === undefined;

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-sm text-muted-foreground">
        Loading…
      </div>
    );
  }

  const members = (membersData ?? []) as MemberWithUser[];
  const invites = (invitesData ?? []) as InviteWithUser[];
  const inviterName = currentUser?.name ?? "A community admin";

  // Show tabs when there are other members besides the owner OR any invites exist
  const hasTabs = members.length > 1 || invites.length > 0;

  const canManage = ["owner", "admin"].includes(membership.role);

  return (
    <div className="bg-card border border-border/50 rounded-xl w-2xl lg:w-4xl mx-auto px-6 py-10 my-4">
      <button
        onClick={() => navigate(`/communities/${slug}`)}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to community
      </button>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-medium text-foreground">Members</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage who has access to <strong>{community.name}</strong>.
          </p>
        </div>
        {canManage && (
          <Button onClick={() => setInviteOpen(true)} className="gap-2">
            <UserPlus className="w-4 h-4" />
            Invite member
          </Button>
        )}
      </div>

      {/* Content */}
      {!hasTabs ? (
        <EmptyState
          onInvite={() => setInviteOpen(true)}
          canManage={canManage}
        />
      ) : (
        <Tabs defaultValue="members">
          <TabsList variant="line" className="mb-6">
            <TabsTrigger value="members">
              <Users className="w-4 h-4" />
              Members
              {members.length > 0 && (
                <span className="ml-1.5 text-[11px] bg-muted px-1.5 py-0.5 rounded-full">
                  {members.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="invites">
              <Mail className="w-4 h-4" />
              Invites
              {invites.length > 0 && (
                <span className="ml-1.5 text-[11px] bg-muted px-1.5 py-0.5 rounded-full">
                  {invites.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="activity">
              <Activity className="w-4 h-4" />
              Activity Logs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="members">
            <MembersTab members={members} />
          </TabsContent>

          <TabsContent value="invites">
            <InvitesTab
              invites={invites}
              communityName={community.name}
              inviterName={inviterName}
            />
          </TabsContent>

          <TabsContent value="activity">
            <ActivityLogsTab />
          </TabsContent>
        </Tabs>
      )}

      {/* Invite dialog */}
      <InviteDialog
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        communityId={community._id}
        communityName={community.name}
        inviterName={inviterName}
      />
    </div>
  );
}

// ── EmptyState ────────────────────────────────────────────────────────────────

function EmptyState({
  onInvite,
  canManage,
}: {
  onInvite: () => void;
  canManage: boolean;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3 border border-dashed border-border rounded-xl">
      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
        <Users className="w-6 h-6 text-muted-foreground" />
      </div>
      <p className="text-[15px] font-medium text-foreground">
        No other members yet
      </p>
      <p className="text-sm text-muted-foreground text-center max-w-xs leading-relaxed">
        Invite people to join this community and start saving together.
      </p>
      {canManage && (
        <Button onClick={onInvite} className="mt-2 gap-2">
          <UserPlus className="w-4 h-4" />
          Invite member
        </Button>
      )}
    </div>
  );
}
