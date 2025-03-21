"use client"
import { useActionState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { AuthSubmitButton } from "@/components/auth/auth-submit-button"
import { AuthFormMessage, type Message } from "@/components/auth/auth-form-message"
import { signInAction } from "@/components/auth/auth-actions"
import type { AuthFormProps } from "./types"

export function LoginForm({ className, onModeChange, onSuccess }: AuthFormProps) {
  const [message, formAction] = useActionState(async (prevState: Message, formData: FormData) => {
    const result = await signInAction(formData)
    if (result?.type === "success" && onSuccess) {
      onSuccess()
    }
    return result
  }, null)

  return (
    <form action={formAction} className={cn("flex flex-col gap-4", className)}>
      <div>
        <h1 className="text-2xl font-medium">Sign in</h1>
        <p className="text-sm text-foreground">
          Don&apos;t have an account?{" "}
          <button
            type="button"
            onClick={() => onModeChange("signup")}
            className="text-foreground font-medium underline"
          >
            Sign up
          </button>
        </p>
      </div>

      <div className="flex flex-col gap-2 [&>input]:mb-3 mt-4">
        <Label htmlFor="email">Email</Label>
        <Input type="email" id="email" name="email" placeholder="you@example.com" required />

        <div className="flex justify-between items-center">
          <Label htmlFor="password">Password</Label>
          <button type="button" onClick={() => onModeChange("reset")} className="text-xs text-foreground underline">
            Forgot Password?
          </button>
        </div>

        <Input type="password" id="password" name="password" placeholder="Your password" required />

        <AuthSubmitButton className="w-full" pendingText="Signing In...">
          Sign in
        </AuthSubmitButton>

        <AuthFormMessage message={message} />
      </div>
    </form>
  )
}

