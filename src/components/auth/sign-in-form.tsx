'use client';

import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import z from "zod"
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LoaderCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { SocialAuthButtons } from './social-auth-buttons';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { authClient, useSession } from '@/lib/auth-client';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { usePathname } from 'next/navigation';
import { FieldGroup, Field, FieldLabel, FieldContent, FieldError } from "@/components/ui/field";

const signInSchema = z.object({
	email: z.string().min(1, 'Email is required'),
	password: z.string().min(1, 'Password is required'),
});

type SignInFormType = z.infer<typeof signInSchema>

interface SignInFormProps extends React.ComponentProps<'div'> {
	redirectUrl?: string;
}

export function SignInForm({ className, redirectUrl, ...props }: SignInFormProps) {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const form = useForm<SignInFormType>({
		resolver: zodResolver(signInSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	});

	const pathname = usePathname();
	useEffect(() => {
		authClient.getSession().then((session) => {
			// Don't redirect if already on the intended path
			if (!session && pathname !== '/') {
				router.push('/');
				return;
			}
			else {
				const isEmailVerified = session?.data?.user?.emailVerified
				router.push('/dashboard/community');
			}

		});
	}, [router, pathname]);

	async function handleSignIn(formData: SignInFormType) {
		setIsLoading(true);
		await authClient.signIn.email({ ...formData, callbackURL: redirectUrl }, {
			onSuccess: () => {
				toast.success('Login successful');
				setIsLoading(false);
			},
			onError: (ctx) => {
				setIsLoading(false);
				if (ctx.error.status === 403) {
					toast.error("Please verify your email address");
					router.push(`/verify-email?email=${form.getValues('email')}`);
				}
				else {
					toast.error(ctx.error?.message as string)
				}

			},
		});
	}

	return (
		<div className={cn('flex flex-col gap-6', className)} {...props}>
			<Card>
				<CardHeader className="text-center">
					<CardTitle className="text-xl">Welcome</CardTitle>
					<CardDescription>Login with your social accounts</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid gap-6">
						<div className="grid grid-cols-3 gap-4">
							<SocialAuthButtons />
						</div>
						<div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
							<span className="relative z-10 bg-background px-2 text-muted-foreground">
								Or continue with
							</span>
						</div>
						{/* <form onSubmit={form.handleSubmit(handleSignIn)}> */}
						<div className="grid gap-6">
							<form id="sign-in-form" onSubmit={form.handleSubmit(handleSignIn)}>
								<FieldGroup>
									<Controller
										control={form.control}
										name="email"
										render={({ field, fieldState }) => (
											<Field data-invalid={fieldState.invalid}>
												<FieldLabel>Email</FieldLabel>
												<FieldContent>
													<Input type="email" autoComplete="email webauthn" {...field} />
												</FieldContent>
												{fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
											</Field>
										)} />
									<Controller
										control={form.control}
										name="password"
										render={({ field, fieldState }) => (
											<Field data-invalid={fieldState.invalid}>
												<div className="flex items-center gap-2">
													<FieldLabel>Password</FieldLabel>
													<Button variant="link"
														asChild
														className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
													>
														<Link href="/forgot-password">Forgot password</Link>
													</Button>
												</div>
												<FieldContent>
													<Input type="password" autoComplete="password webauthn" {...field} placeholder="******************" />
												</FieldContent>
												{fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
											</Field>
										)} />

									<Field orientation="horizontal">
										<Button type="submit" className="w-full" disabled={isLoading}>
											{isLoading ? (
												<>
													<LoaderCircle className="size-4 animate-spin mr-2" />
													Signing in...
												</>
											) : (
												'Login'
											)}
										</Button>
									</Field>
								</FieldGroup>
							</form>
						</div>
					</div>
					<div className="text-center text-sm">
						Don&apos;t have an account?{' '}
						<Link href="/sign-up" className="font-medium text-foreground hover:underline">
							Sign up
						</Link>
					</div>
				</CardContent>
			</Card>
			<div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
				By clicking continue, you agree to our <a href="#">Terms of Service</a> and{' '}
				<a href="#">Privacy Policy</a>.
			</div>
		</div >
	);
}
