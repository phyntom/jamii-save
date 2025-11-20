import AuthBackgroundShape from '@/assets/svg/auth-background-shape';
import { ForgotPasswordForm } from '@/components/auth/forgot-password-form';
import { Logo } from '@/components/commons/logo';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  return (
    <div className="relative flex h-auto min-h-screen items-center justify-center overflow-x-hidden px-4 py-10 sm:px-6 lg:px-8">
      <div className='absolute'>
        <AuthBackgroundShape />
      </div>
      <div className="z-1 flex w-full max-w-sm flex-col gap-6">
        <Link href="#" className="self-center">
          <Logo size="default" />
        </Link>
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
