'use client';

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import z from "zod"
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { signIn } from '@/app/actions/auth';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoaderCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { SocialAuthButtons } from './social-auth-buttons';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { authClient, useSession } from '@/lib/auth-client';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const signInSchema = z.object({
	email: z.string().min(1, 'Email is required'),
	password: z.string().min(1, 'Password is required'),
});

type SignInFormType = z.infer<typeof signInSchema>


export function SignInForm({ className, ...props }: React.ComponentProps<'div'>) {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const form = useForm<SignInFormType>({
		resolver: zodResolver(signInSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	});

	useEffect(() => {
		authClient.getSession().then((session) => {
			console.debug("session", session)
			if (!session) router.push('/');
		});
	}, [router]);

	async function handleSignIn(formData: SignInFormType) {
		setIsLoading(true);
		await authClient.signIn.email({ ...formData, callbackURL: '' }, {
			onSuccess: () => {
				toast.success('Login successful');
				setIsLoading(false);
				router.push('/dashboard');
			},
			onError: (ctx) => {
				setIsLoading(false);
				if (ctx.error.status === 403) {
					toast.error("Please verify your email address");
				}
				toast.error(ctx.error?.message as string);
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
					<Form {...form}>
						<form onSubmit={form.handleSubmit(handleSignIn)}>
							<div className="grid gap-6">
								<div className="grid grid-cols-3 gap-4">
									<SocialAuthButtons />
								</div>
								<div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
									<span className="relative z-10 bg-background px-2 text-muted-foreground">
										Or continue with
									</span>
								</div>
								<div className="grid gap-6">
									<FormField
										control={form.control}
										name="email"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Email</FormLabel>
												<FormControl>
													<Input
														type="email"
														autoComplete="email webauthn"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<div className="grid gap-2">
										<FormField
											control={form.control}
											name="password"
											render={({ field }) => (
												<FormItem>
													<div className="flex justify-around items-center">
														<FormLabel>Password</FormLabel>
														<Link
															href="/forgot-password"
															className="ml-auto text-sm underline-offset-4 hover:underline"
														>
															Forgot your password?
														</Link>
													</div>
													<FormControl>
														<Input
															type="password"
															autoComplete="password webauthn"
															{...field}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
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
								</div>
								<div className="text-center text-sm">
									Don&apos;t have an account?{' '}
									<Link href="/sign-up" className="font-medium text-foreground hover:underline">
										Sign up
									</Link>
								</div>
							</div>
						</form>
					</Form>
				</CardContent>
			</Card>
			<div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
				By clicking continue, you agree to our <a href="#">Terms of Service</a> and{' '}
				<a href="#">Privacy Policy</a>.
			</div>
		</div>
	);
}
