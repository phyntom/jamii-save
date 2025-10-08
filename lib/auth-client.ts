
import { createAuthClient } from "better-auth/client"
import { passkeyClient } from 'better-auth/client/plugins';

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  plugins: [passkeyClient()],
})

export const { signIn, signUp, signOut, useSession } = authClient
