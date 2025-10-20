import { ForgotPasswordForm } from '@/components/auth/forgot-password-form';
import { Logo } from '@/components/commons/logo';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-foreground flex items-center justify-center">
                <Logo size="default" />
              </div>
              <span className="text-2xl font-bold text-amber-500">Jamii Save</span>
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl">Reset password</CardTitle>
            <CardDescription>
              Enter your email and we'll send you instructions to reset your password
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <ForgotPasswordForm />
        </CardContent>
      </Card>
    </div>
  );
}
