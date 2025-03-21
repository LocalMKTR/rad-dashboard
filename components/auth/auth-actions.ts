"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/supabase/server"
import { hasEnvVars } from "@/supabase/check-env-vars"

export type Message = {
  type: "success" | "error"
  text: string
  message?: string
} | null

export async function forgotPasswordAction(formData: FormData): Promise<Message> {
  try {
    const email = formData.get("email") as string

    if (!email || !email.includes("@")) {
      return {
        type: "error",
        text: "Please enter a valid email address",
      }
    }

    // If Supabase is configured, use it for password reset
    if (hasEnvVars) {
      const supabase = await createClient()
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`,
      })

      if (error) {
        return {
          type: "error",
          text: error.message,
        }
      }
    } else {
      // Simulate sending a password reset email
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log(`Password reset email sent to ${email}`)
    }

    return {
      type: "success",
      text: "Password reset instructions sent to your email",
    }
  } catch {
    return {
      type: "error",
      text: "Failed to send reset instructions. Please try again.",
    }
  }
}

export async function signInAction(formData: FormData): Promise<Message> {
  try {
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    if (!email || !password) {
      return {
        type: "error",
        text: "Email and password are required",
      }
    }

    // If Supabase is configured, use it for sign in
    if (hasEnvVars) {
      const supabase = await createClient()
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return {
          type: "error",
          text: error.message,
        }
      }
    } else {
      // Simulate authentication
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // In a real app, you would verify credentials here
      if (password !== "password") {
        return {
          type: "error",
          text: "Invalid credentials",
        }
      }

      // We'll use the Supabase client to set cookies even in fallback mode
      // This avoids the cookies() API issues
      const supabase = await createClient()
      await supabase.auth.setSession({
        access_token: "fallback-token",
        refresh_token: "fallback-refresh-token",
      })
    }

    revalidatePath("/")
    return {
      type: "success",
      text: "Successfully logged in",
    }
  } catch {
    return {
      type: "error",
      text: "Failed to log in. Please try again.",
    }
  }
}

export async function signUpAction(formData: FormData): Promise<Message> {
  try {
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    if (!email || !password) {
      return {
        type: "error",
        text: "All fields are required",
      }
    }

    if (password.length < 6) {
      return {
        type: "error",
        text: "Password must be at least 6 characters",
      }
    }

    // If Supabase is configured, use it for sign up
    if (hasEnvVars) {
      const supabase = await createClient()
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
        },
      })

      if (error) {
        return {
          type: "error",
          text: error.message,
        }
      }
    } else {
      // Simulate account creation
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // We'll use the Supabase client to set cookies even in fallback mode
      // This avoids the cookies() API issues
      const supabase = await createClient()
      await supabase.auth.setSession({
        access_token: "fallback-token",
        refresh_token: "fallback-refresh-token",
      })
    }

    // In a real app, you would create the account here
    revalidatePath("/")
    return {
      type: "success",
      text: "Account created successfully",
      message: "Account created successfully! Please check your email to verify your account.",
    }
  } catch {
    return {
      type: "error",
      text: "Failed to create account. Please try again.",
    }
  }
}

// Add a logout action
export async function logoutAction(): Promise<void> {
  // Always use Supabase for logout, even in fallback mode
  // This avoids the cookies() API issues
  const supabase = await createClient()
  await supabase.auth.signOut()

  revalidatePath("/")
}

