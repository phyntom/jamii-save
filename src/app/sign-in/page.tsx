import Link from 'next/link';
import { SignInForm } from '@/components/auth/sign-in-form';
import { Logo } from '@/components/commons';
import AuthBackgroundShape from '@/assets/svg/auth-background-shape';

interface SignInPageProps {
  searchParams: Promise<{ redirect?: string }>
}

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const params = await searchParams;
  const redirectUrl = params.redirect || "/dashboard";
  return (
    <div className="relative flex h-auto min-h-screen items-center justify-center overflow-x-hidden px-4 py-10 sm:px-6 lg:px-6">
      <div className='absolute'>
        <AuthBackgroundShape />
      </div>
      <div className="z-1 flex w-full max-w-sm flex-col gap-6">
        <Link href="#" className="self-center">
          <Logo size="default" />
        </Link>
        <SignInForm redirectUrl={redirectUrl} />
      </div>
    </div>
  );
}
