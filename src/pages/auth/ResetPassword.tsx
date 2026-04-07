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
import { CheckCircle2, LoaderCircle } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import z from "zod";
import { toast } from "sonner";

const resetPasswordSchema = z
  .object({
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

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

export default function ResetPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [isReset, setIsReset] = useState(false);
  const form = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  async function handleSubmit(_data: ResetPasswordForm) {
    setIsLoading(true);
    // Faked — will be wired to backend later
    await new Promise((r) => setTimeout(r, 1000));
    setIsLoading(false);
    setIsReset(true);
    toast.success("Your password has been reset successfully");
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
              {isReset ? "Password reset!" : "Reset your password"}
            </CardTitle>
            <CardDescription>
              {isReset
                ? "You can now sign in with your new password"
                : "Enter your new password below"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isReset ? (
              <div className="grid gap-6 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-950">
                  <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <Link to="/sign-in">
                  <Button className="w-full">Go to sign in</Button>
                </Link>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)}>
                  <div className="grid gap-6">
                    <FormInput
                      control={form.control}
                      name="password"
                      label="New password"
                      type="password"
                      placeHolder="........."
                    />
                    <div className="grid gap-2">
                      <FormInput
                        control={form.control}
                        name="confirmPassword"
                        label="Confirm new password"
                        type="password"
                        placeHolder="........."
                      />
                      <p className="text-xs text-muted-foreground">
                        Must be at least 8 characters
                      </p>
                    </div>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <LoaderCircle className="size-4 animate-spin mr-2" />
                          Resetting...
                        </>
                      ) : (
                        "Reset password"
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
