"use client"
import { useActionState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AuthSubmitButton } from "@/components/auth/auth-submit-button"
import { AuthFormMessage, type Message } from "@/components/auth/auth-form-message"
import { forgotPasswordAction } from "@/components/auth/auth-actions"
import { AuthSmtpMessage } from "@/components/auth/auth-smtp-message"
import type { AuthFormProps } from "./types"

export function ResetPasswordForm({ className, onModeChange }: AuthFormProps) {
  const [message, formAction] = useActionState(async (prevState: Message, formData: FormData) => {
    return forgotPasswordAction(formData)
  }, null)

  return (
    <div className={className}>
      <form action={formAction} className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-medium">Reset Password</h1>
          <p className="text-sm text-foreground">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => onModeChange("login")}
              className="text-foreground font-medium underline"
            >
              Sign in
            </button>
          </p>
        </div>

        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-4">
          <Label htmlFor="email">Email</Label>
          <Input type="email" id="email" name="email" placeholder="you@example.com" required />

          <AuthSubmitButton className="w-full" pendingText="Sending Reset Link...">
            Reset Password
          </AuthSubmitButton>

          <AuthFormMessage message={message} />
        </div>
      </form>
      <AuthSmtpMessage />
    </div>
  )
}

