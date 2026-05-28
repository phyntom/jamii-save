import AuthBackgroundShape from "@/components/auth-background-shape";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Mail, CheckCircle2, LoaderCircle } from "lucide-react";
import { useState } from "react";
import { Link, useSearchParams } from "react-router";
import { toast } from "sonner";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") ?? "your email";

  // Faked verification state — will be wired to backend later
  const [isVerified] = useState(false);
  const [isResending, setIsResending] = useState(false);

  async function handleResend() {
    setIsResending(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsResending(false);
    toast.success("Verification email resent");
  }

  return (
    <div className="relative flex h-auto min-h-screen items-center justify-center overflow-x-hidden px-4 py-10 sm:px-6 lg:px-8">
      <div className="absolute">
        <AuthBackgroundShape />
      </div>
      <div className="z-1 flex w-full max-w-sm flex-col gap-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">
              {isVerified ? "Email verified!" : "Check your email"}
            </CardTitle>
            <CardDescription>
              {isVerified
                ? "Your email has been verified successfully"
                : `We sent a verification link to ${email}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isVerified ? (
              <div className="grid gap-6 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-950">
                  <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <p className="text-sm text-muted-foreground">
                  You can now access all features of your account.
                </p>
                <Link to="/sign-in">
                  <Button className="w-full">Continue to sign in</Button>
                </Link>
              </div>
            ) : (
              <div className="grid gap-6 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Click the link in the email to verify your account. If you
                  don't see it, check your spam folder.
                </p>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleResend}
                  disabled={isResending}
                >
                  {isResending ? (
                    <>
                      <LoaderCircle className="size-4 animate-spin mr-2" />
                      Resending...
                    </>
                  ) : (
                    "Resend verification email"
                  )}
                </Button>
                <Link
                  to="/sign-in"
                  className="text-sm font-medium text-foreground hover:underline"
                >
                  Back to sign in
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
