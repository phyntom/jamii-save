"use client"

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { authClient } from '@/lib/auth-client'
import AuthBackgroundShape from '@/assets/svg/auth-background-shape'
import Link from 'next/link'
import { toast } from 'sonner'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const VerifyEmail = ({ email }: { email: string }) => {
    const [countDown, setCountDown] = useState(0);
    const router = useRouter();
    async function handleResendEmail() {
        const { error } = await authClient.sendVerificationEmail({
            email: email,
        }, {
            onSuccess: () => {
                toast.success('Verification email sent');
                router.push("/dashboard")
            },
            onError: (ctx) => {
                toast.error(ctx.error.message);
            },
        });
    }
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (countDown > 0) {
            timer = setInterval(() => {
                setCountDown(countDown - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [countDown]);
    return (
        <div className='relative flex h-auto min-h-screen items-center justify-center overflow-x-hidden px-4 py-10 sm:px-6 lg:px-8'>
            <div className='absolute'>
                <AuthBackgroundShape />
            </div>

            <Card className='z-1 w-full border-none shadow-md sm:max-w-md'>
                <CardHeader className='gap-6'>
                    {/* <Logo className='gap-3' /> */}
                    <div>
                        <CardTitle className='mb-1.5 text-2xl'>Verify your email</CardTitle>
                        <CardDescription className='text-base'>
                            An activation link has been sent to your email address: <span className='font-bold text-primary'>{email}</span> Please check your inbox and
                            click on the link to complete the activation process.
                        </CardDescription>
                    </div>
                </CardHeader>

                <CardContent>
                    <div className='space-y-4'>
                        <Button className='w-full' onClick={async () => await handleResendEmail()} disabled={countDown > 0}>
                            {countDown > 0 ? `Resend in ${countDown} seconds` : 'Resend Email'}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default VerifyEmail
