import { passkeyClient } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';
import { organizationClient } from 'better-auth/client/plugins';

export const authClient = createAuthClient({
  baseURL: 'http://localhost:3000',
  plugins: [organizationClient()],
});

export const { signIn, signUp, signOut, useSession, sendVerificationEmail } = authClient;
