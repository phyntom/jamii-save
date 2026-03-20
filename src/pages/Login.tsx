import AuthBackgroundShape from "@/components/auth-background-shape";
import { FormInput } from "@/components/FormInput";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useSearchParams } from "react-router";
import z from "zod";
import { useAuthActions } from "@convex-dev/auth/react";
import { toast } from "sonner";
import SignInWithGoogle from "@/components/oauth/google-signin";
import SignInWithMicrosoft from "@/components/oauth/msft-signin";

const signInSchema = z.object({
  email: z.string().min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
});

type SignInFormType = z.infer<typeof signInSchema>;

interface LoginProps {
  provider?: string;
}

export default function Login({ provider }: LoginProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuthActions();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const form = useForm<SignInFormType>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function handleSignIn(formData: SignInFormType) {
    const { email, password } = formData;
    setIsLoading(true);
    try {
      await signIn(provider ?? "password", { email, password, flow: "signIn" });
      navigate(searchParams.get("redirect") ?? "/overview", { replace: true });
    } catch (error) {
      if (error instanceof Error) {
        const msg = error.message;

        if (msg.includes("InvalidSecret")) {
          toast.error("Incorrect password. Please try again.", {
            className: "bg-red-100 text-red-800 border border-red-400",
          });
        } else if (msg.includes("InvalidAccountId")) {
          toast.error("No account found with this email.");
        } else if (msg.includes("Invalid credentials")) {
          toast.error("Incorrect email or password.");
        } else if (msg.includes("TooManyFailedAttempts")) {
          toast.error("Too many failed attempts. Please wait and try again.", {
            className: "bg-red-100 text-red-800 border border-red-400",
          });
        } else {
          toast.error("An unexpected error occurred. Please try again.");
        }
      }
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <div className="relative flex h-auto min-h-screen items-center justify-center overflow-x-hidden px-4 py-10 sm:px-6 lg:px-6">
      <div className="absolute">
        <AuthBackgroundShape />
      </div>
      <div className="z-1 flex w-full max-w-sm flex-col gap-6">
        {/* <Link href="#" className="self-center">
          <Logo size="default" />
        </Link> */}
        <div className={cn("flex flex-col gap-6")}>
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Welcome</CardTitle>
              <CardDescription>
                Sign in to manage your communities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSignIn)}>
                  <div className="grid gap-6">
                    <div className="flex">
                      <SignInWithGoogle />
                      <SignInWithMicrosoft />
                    </div>
                    <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                      <span className="relative z-10 bg-background px-2 text-muted-foreground">
                        Or continue with
                      </span>
                    </div>
                    <div className="grid gap-6">
                      <FormInput
                        control={form.control}
                        name="email"
                        label="Email"
                        type="email"
                        autoComplete="email webauthn"
                      />
                      <div className="grid gap-2">
                        <FormInput
                          control={form.control}
                          name="password"
                          label="Password"
                          type="password"
                          autoComplete="email webauthn"
                        />
                      </div>
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <LoaderCircle className="size-4 animate-spin mr-2" />
                            Signing in...
                          </>
                        ) : (
                          "Login"
                        )}
                      </Button>
                    </div>
                    <div className="text-center text-sm">
                      Don&apos;t have an account?{" "}
                      <Link
                        to="/sign-up"
                        className="font-medium text-foreground hover:underline"
                      >
                        Sign up
                      </Link>
                    </div>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
          <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
            By clicking continue, you agree to our{" "}
            <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
          </div>
        </div>
      </div>
    </div>
  );
}
