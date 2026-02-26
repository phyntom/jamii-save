"use client";
import Link from 'next/link';
import { SignInForm } from '@/components/auth/sign-in-form';
import { Logo } from '@/components/commons';
import AuthBackgroundShape from '@/assets/svg/auth-background-shape';
import { useSearchParams } from 'next/navigation';


export default async function SignInPage() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard/community";
  return (
    <div className="relative flex h-auto min-h-screen items-center justify-center overflow-x-hidden px-4 py-10 sm:px-6 lg:px-6">
      <div className='absolute'>
        <AuthBackgroundShape />
      </div>
      <div className="z-1 flex w-full max-w-sm flex-col gap-6">
        <Link href="#" className="self-center">
          <Logo size="default" />
        </Link>
        <SignInForm redirectUrl={redirect} />
      </div>
    </div>
  );
}
