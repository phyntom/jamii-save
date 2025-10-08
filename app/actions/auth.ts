"use server"

import { auth } from "@/lib/auth"
import { signOut as authSignOut } from "@/lib/auth-actions"
import { redirect } from "next/navigation"
import { z } from "zod"
import { headers } from "next/headers"

const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
})

export async function signUp(formData: FormData) {
  const data = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  }

  const validation = signUpSchema.safeParse(data)
  if (!validation.success) {
    return { error: validation.error.errors[0].message }
  }

  const { name, email, password } = validation.data

  try {
    const result = await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
      },
      headers: await headers(),
    })

    if (!result) {
      return { error: "Failed to create account. Please try again." }
    }

    // Note: Better-auth will handle user creation and session automatically
    // You may want to create the default subscription in a separate step
  } catch (error: any) {
    console.error("[v0] Sign up error:", error)
    if (error.message?.includes("already exists")) {
      return { error: "Email already registered" }
    }
    return { error: "Failed to create account. Please try again." }
  }

  redirect("/dashboard")
}

export async function signIn(formData: FormData) {
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  }

  const validation = signInSchema.safeParse(data)
  if (!validation.success) {
    return { error: validation.error.errors[0].message }
  }

  const { email, password } = validation.data

  try {
    const result = await auth.api.signInEmail({
      body: {
        email,
        password,
      },
      headers: await headers(),
    })
    if (!result) {
      return { error: "Invalid email or password" }
    }
  } catch (error: any) {
    console.error("[v0] Sign in error:", error)
    return { error: "Invalid email or password" }
  }

  redirect("/dashboard")
}

export async function signOut() {
  await authSignOut()
  redirect("/sign-in")
}

export async function forgotPassword(formData: FormData) {
  const data = {
    email: formData.get("email") as string,
  }

  const validation = forgotPasswordSchema.safeParse(data)
  if (!validation.success) {
    return { error: validation.error.errors[0].message }
  }

  const { email } = validation.data

  try {
    // Better-auth will handle password reset
    // You'll need to configure email provider in better-auth config
    // For now, return success message
    return {
      success: "If an account exists with this email, you will receive password reset instructions.",
    }
  } catch (error) {
    console.error("[v0] Forgot password error:", error)
    return { error: "Failed to process request. Please try again." }
  }
}
