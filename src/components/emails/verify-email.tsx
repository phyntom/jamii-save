import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

import AuthBackgroundShape from '@/assets/svg/auth-background-shape'
import Link from 'next/link'

const VerifyEmail = ({ email }: { email: string }) => {
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
                        <Button className='w-full' asChild>
                            <Link href={"/sign-in"}>Skip for now</Link>
                        </Button>

                        <p className='text-muted-foreground text-center'>
                            Didn&apos;t get the mail?{' '}
                            <a href='#' className='text-card-foreground hover:underline'>
                                Resend
                            </a>
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default VerifyEmail
