'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { FieldGroup, Field, FieldLabel, FieldError, FieldContent } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { authClient } from '@/lib/auth-client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { Loader2 } from 'lucide-react';

const resetPasswordSchema = z.object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(8, 'Confirm password must be at least 8 characters'),
}).superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Passwords do not match',
            path: ['confirmPassword'],
        });
    }
});

type ResetPasswordFormType = z.infer<typeof resetPasswordSchema>

export function ResetPasswordForm({ className, ...props }: React.ComponentProps<'div'>) {
    const [isLoading, setIsLoading] = useState(false);
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const router = useRouter();
    const form = useForm({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            password: '',
            confirmPassword: '',
        },
    });
    async function onSubmit(values: ResetPasswordFormType) {
        setIsLoading(true);
        const { error } = await authClient.resetPassword({
            newPassword: values.password,
            token: token ?? '',
        });
        if (error) {
            toast.error(error.message);
        } else {
            toast.success('Password reset successfully');
            router.push('/sign-in');
        }
        setIsLoading(false);
    }
    return (
        <div className={cn('flex flex-col gap-6', className)} {...props}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Forgot Password</CardTitle>
                    <CardDescription>Enter your email to reset your password</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FieldGroup>
                            <Controller
                                name="password"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                                        <FieldContent>
                                            <Input
                                                {...field}
                                                type="password"
                                                aria-invalid={fieldState.invalid}
                                                id={field.name}
                                            />
                                        </FieldContent>
                                        {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="confirmPassword"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor={field.name}>Comfirm Password</FieldLabel>
                                        <FieldContent>
                                            <Input
                                                type="password"
                                                {...field}
                                                aria-invalid={fieldState.invalid}
                                                id={field.name}
                                            />
                                        </FieldContent>
                                        {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
                                    </Field>
                                )}
                            />
                        </FieldGroup>
                        <Field orientation="horizontal">
                            <Button type="submit" className="mx-auto w-[50%]" disabled={isLoading}>
                                {isLoading ? <Loader2 className="size-4 animate-spin" /> : 'Reset Password'}
                            </Button>
                        </Field>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
