
import { auth, Session } from "./auth"
import { headers } from "next/headers"

export async function getSession(): Promise<Session | null>{
    const response = await auth.api.getSession({
      headers: await headers(),
    })
    return response || null
  }

export async function verifyToken(token: string) {
    const session = await auth.api.getSession({
      headers: await headers(),
    })
    return session
  }
  
export async function signOut() {
    await auth.api.signOut({
      headers: await headers(),
    })
  }
  