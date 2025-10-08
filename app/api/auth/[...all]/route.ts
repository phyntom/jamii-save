import { auth } from "@/lib/auth"
import { toNextJsHandler } from "better-auth/next-js"
import { NextRequest } from "next/server"

export const { GET, POST } = toNextJsHandler(auth.handler);