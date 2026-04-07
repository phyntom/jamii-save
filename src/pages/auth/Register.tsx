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
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useSearchParams } from "react-router";
import z from "zod";
import { useAuthActions } from "@convex-dev/auth/react";
import { toast } from "sonner";

const signUpSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z
      .string()
      .min(8, "Confirm password must be at least 8 characters"),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });
    }
  });
type SignUpFormType = z.infer<typeof signUpSchema>;

interface RegisterProps {
  provider?: string;
}

export default function Register({ provider }: RegisterProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuthActions();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const form = useForm<SignUpFormType>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function handleSignUp(formData: SignUpFormType) {
    const { name, email, password } = formData;
    setIsLoading(true);
    try {
      await signIn(provider ?? "password", {
        name,
        email,
        password,
        flow: "signUp",
      });
      toast.success("Account created.");
      navigate(searchParams.get("redirect") ?? "/dashboard", { replace: true });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes("already exists")) {
          toast.error("An account with this email already exists.");
        } else {
          toast.error(error.message);
        }
      } else {
        toast.error("Unable to create your account.");
      }
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <div className="relative flex h-auto min-h-screen items-center justify-center overflow-x-hidden px-4 py-10 sm:px-6 lg:px-8">
      <div className="absolute">
        <AuthBackgroundShape />
      </div>
      <Card className="z-1 w-full border-none shadow-md sm:max-w-md">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center">{/* <Logo size="lg" /> */}</div>
          <div>
            <CardTitle className="text-2xl">Create an account</CardTitle>
            <CardDescription>
              Join your community savings group today
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSignUp)}
              className="space-y-4"
            >
              <div className="space-y-2">
                <FormInput
                  control={form.control}
                  name="name"
                  label="Names"
                  type="text"
                  placeHolder="Type your name"
                  autoComplete="name webauthn"
                />
              </div>

              <div className="space-y-2">
                <FormInput
                  control={form.control}
                  name="email"
                  label="Email"
                  type="email"
                  placeHolder="Type your email address"
                  autoComplete="email webauthn"
                />
              </div>

              <div className="space-y-2">
                <div className="grid gap-2">
                  <FormInput
                    control={form.control}
                    name="password"
                    label="Password"
                    type="password"
                    placeHolder="........."
                    autoComplete="password webauthn"
                  />
                  <FormInput
                    control={form.control}
                    name="confirmPassword"
                    label="Confirm Password"
                    type="password"
                    placeHolder="........."
                    autoComplete="password webauthn"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Must be at least 8 characters
                </p>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <LoaderCircle className="size-4 animate-spin mr-2" />
                    Creating account...
                  </>
                ) : (
                  "Create account"
                )}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  to="/sign-in"
                  className="font-medium text-foreground hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
