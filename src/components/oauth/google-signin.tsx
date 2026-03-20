import { Button } from "@/components/ui/button";
import { useAuthActions } from "@convex-dev/auth/react";
import { GoogleIcon } from "@/components/icons/GoogleIcon";

export default function SignInWithGoogle() {
  const { signIn } = useAuthActions();
  return (
    <Button
      className="flex-1"
      variant="outline"
      type="button"
      onClick={() =>
        void signIn("google", {
          redirectTo: "/overview",
          flow: "sign-in",
        })
      }
    >
      <GoogleIcon className="mr-2 h-4 w-4" />
      Google
    </Button>
  );
}
