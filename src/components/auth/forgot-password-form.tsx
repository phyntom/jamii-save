'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { z } from 'zod';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { authClient } from '@/lib/auth-client';
import { Field, FieldContent, FieldError, FieldLabel } from '@/components/ui/field';
import { checkEmailExists } from '@/server/authentication';

const forgetPassword = z.object({
  email: z.string().email(),
});

export function ForgotPasswordForm({ className, ...props }: React.ComponentProps<'div'>) {
  const [isLoading, setIsLoading] = useState(false);
  const [disableResend, setDisableResend] = useState(false);
  const [countDown, setCountDown] = useState(0);

  const form = useForm({
    resolver: zodResolver(forgetPassword),
    defaultValues: {
      email: '',
    },
  });

  async function onSubmit(values: z.infer<typeof forgetPassword>) {
    setIsLoading(true);

    const emailExist = await checkEmailExists(values.email);
    if (!emailExist) {
      toast.error("Email does not exist");
      setIsLoading(false);
      return;
    }

    const { error } = await authClient.forgetPassword({
      email: values.email,
      redirectTo: '/reset-password',
    });
    console.error("error", error);

    if (error) {
      toast.error("Failed to send password reset email");
    } else {
      toast.success('Password reset email sent');
      setCountDown(30);
      setDisableResend(true);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (disableResend && countDown > 0) {
      timer = setInterval(() => {
        setCountDown((prev) => prev - 1);
      }, 1000);
    }
    else if (countDown === 0 && disableResend) {
      setDisableResend(false);
    }
    return () => {
      // Defensive: only clear if timer exists
      if (typeof timer !== "undefined") clearInterval(timer);
    };
  }, [countDown, disableResend]);


  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Forgot Password</CardTitle>
          <CardDescription>Enter your email to reset your password</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid gap-6">
              <div className="grid gap-3">
                <Controller
                  name="email"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Email</FieldLabel>
                      <FieldContent>
                        <Input
                          {...field}
                          placeholder="m@example.com"
                          aria-invalid={fieldState.invalid}
                        />
                      </FieldContent>
                      {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
                    </Field>
                  )}
                />
              </div>
              <Field orientation="horizontal">
                <Button variant="outline" asChild className="w-[20%]">
                  <Link href="/sign-in">Back</Link>
                </Button>
                <Button type="submit" className="w-[80%]" disabled={isLoading || disableResend}>
                  {isLoading ? <Loader2 className="size-4 animate-spin" /> : disableResend ? `Resend in ${countDown} seconds` : 'Reset Password'}
                </Button>
              </Field>
            </div>
            <div className="text-center text-sm">
              Don&apos;t have an account?{' '}
              <Link href="/sign-up" className="underline underline-offset-4">
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <Link href="#">Terms of Service</Link> and{' '}
        <Link href="#">Privacy Policy</Link>.
      </div>
    </div>
  );
}
