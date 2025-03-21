"use client"
import { useActionState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AuthSubmitButton } from "@/components/auth/auth-submit-button"
import { AuthFormMessage, type Message } from "@/components/auth/auth-form-message"
import { signUpAction } from "@/components/auth/auth-actions"
import type { AuthFormProps } from "./types"
import { AuthSmtpMessage } from "@/components/auth/auth-smtp-message"

export function SignupForm({ className, onModeChange, onSuccess }: AuthFormProps) {
  const [message, formAction] = useActionState(async (prevState: Message, formData: FormData) => {
    const result = await signUpAction(formData)
    if (result?.type === "success" && onSuccess) {
      onSuccess()
    }
    return result
  }, null)

  // If we have a success message with the 'message' property, show it full screen
  if (message?.type === "success" && message.message) {
    return (
      <div className="w-full flex-1 flex items-center justify-center gap-2 p-4">
        <AuthFormMessage message={message} />
      </div>
    )
  }

  return (
    <div className={className}>
      <form action={formAction} className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-medium">Sign up</h1>
          <p className="text-sm text-foreground">
            Already have an account?{" "}
            <button type="button" onClick={() => onModeChange("login")} className="text-primary font-medium underline">
              Sign in
            </button>
          </p>
        </div>

        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-4">
          <Label htmlFor="email">Email</Label>
          <Input type="email" id="email" name="email" placeholder="you@example.com" required />

          <Label htmlFor="password">Password</Label>
          <Input type="password" id="password" name="password" placeholder="Your password" minLength={6} required />

          <AuthSubmitButton className="w-full" pendingText="Signing up...">
            Sign up
          </AuthSubmitButton>

          <AuthFormMessage message={message} />
        </div>
      </form>
      <AuthSmtpMessage />
    </div>
  )
}

