
import AuthBackgroundShape from "@/assets/svg/auth-background-shape";
import { Logo } from "@/components/commons";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";
import { getInvitation } from "@/server/invitation";

interface InvitationPageProps {
    params: Promise<{
        token: string;
    }>
}


export default async function InvitationPage({ params }: InvitationPageProps) {

    const { token } = await params;
    const session = await auth.api.getSession({ headers: await headers() });
    const { data } = await getInvitation(token);

    // If no invitation found, show error card
    if (!data) {
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

    // If user is already logged in, show info (TODO: implement accept/decline for logged in users)
    if (session?.user) {
        return (
            <div className="flex min-h-screen items-center justify-center px-4 py-10">
                <p>
                    TODO: Implement invitation acceptance for logged in users.{' '}
                    <Link href={`/sign-in?redirect=/invitation/${token}`} className="text-blue-600 hover:underline">
                        Sign in
                    </Link>{' '}
                    with a different account if needed.
                </p>
            </div>
        );
    }

    // Invitation found, user not logged in
    const { community } = data;
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
                            You've been invited to join <strong>{community.name}</strong> community!
                        </p>
                        <p>
                            To <strong>accept or decline</strong> this invitation, you need to <strong>sign in</strong> or <strong>create an account</strong> first.
                        </p>
                    </>
                }
            >
                <CardFooter className="flex flex-col gap-4">
                    <Button asChild>
                        <Link href={`/sign-in?redirect=/invitation/${token}`} className="w-full">
                            Sign In to Accept Invitation
                        </Link>
                    </Button>
                    <Button variant="secondary" asChild>
                        <Link href={`/sign-up?redirect=/invitation/${token}`} className="w-full">
                            Create Account to Accept Invitation
                        </Link>
                    </Button>
                </CardFooter>
            </InvitationCard>
        </div>
    );
}

function InvitationCard({
    title,
    description,
    children
}: {
    title: string;
    description: React.ReactNode;
    children?: React.ReactNode;
}) {
    return (
        <Card className="z-1 w-full border-none shadow-md sm:max-w-md">
            <CardHeader className="space-y-4 text-center">
                <div className="flex justify-center">
                    <Logo size="lg" />
                </div>
                <div>
                    <CardTitle className="text-2xl">{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </div>
            </CardHeader>
            <CardContent />
            {children}
        </Card>
    );
}