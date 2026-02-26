"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { Community } from "@/drizzle/schemas/community";
import { toast } from "sonner";
import { AlertCircleIcon } from "lucide-react";

interface InvitationHandlerProps {
    token: string;
    user: any;
    community: Community
}

export default function InvitationHandler({ token, user, community }: InvitationHandlerProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");


    const handleDecline = async () => {
        setLoading(true);
        setError("");
        await authClient.organization.rejectInvitation({
            invitationId: token
        }, {
            onSuccess: async () => {
                router.refresh();
            }
        })
        setLoading(false);
    };

    const handleAccept = async () => {
        setLoading(true);
        setError("");
        const { data, error } = await authClient.organization.acceptInvitation({
            invitationId: token
        }, {
            onSuccess: async () => {
                const { error } = await authClient.organization.setActive({
                    organizationId: community.id
                });
                router.refresh();
            },
            onError: (ctx) => {
                setError(ctx.error?.message || "An error occurred while accepting the invitation.");
                toast.error("Failed to accept the invitation.");
            }
        });
        setLoading(false);
    };

    return (
        <div className="grid w-full items-start gap-4">
            <Alert variant="destructive">
                <AlertCircleIcon />
                <AlertDescription>
                    <div className="mb-4">{user.name} ,you've been invited to join an {community.name} community. Would you like to accept or decline?</div>
                    {error && (
                        <div className="p-2 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800 mb-2">
                            {error}
                        </div>
                    )}
                    <div className="flex gap-2">
                        <Button
                            onClick={handleAccept}
                            disabled={loading}
                            className=""
                        >
                            {loading ? "Processing..." : "Accept Invitation"}
                        </Button>
                        <Button
                            onClick={handleDecline}
                            disabled={loading}
                            variant="outline"
                            className=""
                        >
                            Decline Invitation
                        </Button>
                    </div>
                </AlertDescription>
            </Alert>
        </div>
    );
}