import Link from 'next/link';
import { SignInForm } from '@/components/auth/sign-in-form';
import { Logo } from '@/components/commons';

export default function SignInPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link href="#" className="self-center">
          <Logo size="default" />
        </Link>
        <SignInForm />
      </div>
    </div>
  );
}
