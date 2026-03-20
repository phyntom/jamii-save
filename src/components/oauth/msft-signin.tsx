import { MicrosoftIcon } from "../icons/MicrosoftIcon";
import { useAuthActions } from "@convex-dev/auth/react";
import { Button } from "@/components/ui/button";

function SignInWithMicrosoft() {
  const { signIn } = useAuthActions();
  return (
    <Button
      className="flex-1"
      variant="outline"
      type="button"
      onClick={() =>
        void signIn("microsoft", {
          redirectTo: "/auth-callback?redirect=/overview",
        })
      }
    >
      <MicrosoftIcon className="mr-2 h-4 w-4" /> Microsoft
    </Button>
  );
}

export default SignInWithMicrosoft;
