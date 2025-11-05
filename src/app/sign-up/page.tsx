import AuthBackgroundShape from '@/assets/svg/auth-background-shape';
import { SignUpForm } from '@/components/auth/sign-up-form';
import { Logo } from '@/components/commons';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { redirect } from 'next/navigation';

export default function SignUpPage({ searchParams }: { searchParams: { redirect?: string } }) {
  const redirectUrl = searchParams.redirect || "/dashboard";
  console.log("redirectUrl", redirectUrl);
  return (
    <div className='relative flex h-auto min-h-screen items-center justify-center overflow-x-hidden px-4 py-10 sm:px-6 lg:px-8'>
      <div className='absolute'>
        <AuthBackgroundShape />
      </div>
      <Card className="z-1 w-full border-none shadow-md sm:max-w-md">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center">
            <Logo size="lg" />
          </div>
          <div>
            <CardTitle className="text-2xl">Create an account</CardTitle>
            <CardDescription>Join your community savings group today</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <SignUpForm redirectUrl={redirectUrl} />
        </CardContent>
      </Card>
    </div>
  );
}
