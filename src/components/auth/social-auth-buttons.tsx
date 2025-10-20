'use client';
import { authClient } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import {
  availableAuthProviders,
  getAuthProviderIcon,
  SupportedAuthProviders,
} from '@/lib/auth-providers';
import { toast } from 'sonner';

export function SocialAuthButtons() {
  const handleSignIn = async (provider: SupportedAuthProviders) => {
    const result = await authClient.signIn.social({
      provider,
      callbackURL: '/dashboard',
    });
    if (result?.error) {
      toast.error(result.error.message || 'Failed to sign in with social provider');
    }
    console.log(result);
    toast.success(`Login with ${provider} successful`);
  };
  return (
    <>
      {availableAuthProviders.map((provider) => {
        const Icon = getAuthProviderIcon[provider].Icon;
        return (
          <Button variant="outline" key={provider} onClick={() => handleSignIn(provider)}>
            <Icon size="default" title={`Login with ${provider}`} />
          </Button>
        );
      })}
    </>
  );
}
