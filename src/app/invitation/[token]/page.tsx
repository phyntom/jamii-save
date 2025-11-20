"use client";
import AuthBackgroundShape from "@/assets/svg/auth-background-shape";
import { Logo } from "@/components/commons";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getInvitationById, rejectInvitation } from "@/server/invitation";
import { redirect, useParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { InvitationCard } from "@/components/invitation/invitation-card";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Invitation } from "@/drizzle/schemas/invitation";

export default function InvitationPage() {
    const [invitationData, setInvitationData] = useState<Invitation | null>(null);
    const { token } = useParams<{ token: string }>();

    function handleReject() {
        fetch('/api/invitations/reject', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token }),
        }).then(() => {
            toast.success("Invitation rejected.");
            redirect("/sign-in");
        });
    }

    useEffect(() => {
        async function fetchInvitation() {
            const response = await fetch(`/api/invitation/${token}`);
            const { success, data } = await response.json();
            console.log(data)
            if (!success) {
                toast.error("Invalid or expired invitation token.");
                redirect("/sign-in");
            }
            setInvitationData(data);
        }
        fetchInvitation();
    }, [token]);

    if (!invitationData) {
        return (
            <div className="relative flex h-auto min-h-screen items-center justify-center overflow-x-hidden px-4 py-10 sm:px-6 lg:px-8">
                <div className="absolute">
                    <AuthBackgroundShape />
                </div>
                <InvitationCard
                    title="Community Invitation"
                    description={
                        <>
                            <p className="text-md text-muted-foreground mb-4">No invitation found with this link.</p>
                            <p>Please check the link or contact the inviter for assistance.</p>
                        </>
                    }
                />
            </div>
        );
    }
    return (
        <div className="relative flex h-auto min-h-screen items-center justify-center overflow-x-hidden px-4 py-10 sm:px-6 lg:px-8">
            <div className="absolute">
                <AuthBackgroundShape />
            </div>
            <InvitationCard
                title="Community Invitation"
                description={
                    <>
                        <p className="text-md text-muted-foreground mb-4">
                            You've been invited to join <strong>{invitationData?.community?.name}</strong> community!
                        </p>
                        <p>
                            To <strong>accept </strong> this invitation, you need to <strong><Link className="text-blue-500 underline" href={`/sign-in?redirect=/invitation/${token}`}>sign in</Link></strong> or <strong><Link className="text-blue-500 hover:underline" href={`/sign-up?redirect=/invitation/${token}`}>create an account</Link></strong> first.
                        </p>
                    </>
                }
                token={token}
            >
                <CardFooter className="flex flex-col gap-4">
                    <Button type="button" variant="outline" onClick={handleReject}>Reject Invitation</Button>
                </CardFooter>
            </InvitationCard>
        </div>
    );
}

