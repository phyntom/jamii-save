import { useQuery, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useNavigate, useOutletContext, useParams } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { toast } from "sonner";
import { UserPlus, Mail, Users, Activity, ArrowLeft } from "lucide-react";
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
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/FormInput";
import { Doc } from "convex/_generated/dataModel";
import { MembersTab } from "@/components/MembersTab";
import { InvitesTab } from "@/components/InvitesTab";
import { ActivityLogsTab } from "@/components/ActivityLogsTab";

type InviteWithUser = Doc<"invites"> & {
  invitedByUser: Doc<"users"> | null;
};

type MemberWithUser = Doc<"memberships"> & {
  user: Doc<"users"> | null;
};

type ActivityLogWithUser = Doc<"activity"> & {
  userEmail: string | null;
};

const inviteSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});
type InviteFormValues = z.infer<typeof inviteSchema>;

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
            <FormInput
              control={form.control}
              name="email"
              label="Email address"
              type="email"
              placeHolder="colleague@example.com"
              autoComplete="off"
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

  const activityLogsData = useQuery(api.activities.getActivitiesByCommunity, {
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
  const activityLogs = (activityLogsData ?? []) as ActivityLogWithUser[];
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
            <ActivityLogsTab activityLogs={activityLogs} />
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
