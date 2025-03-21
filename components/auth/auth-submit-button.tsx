"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { useFormStatus } from "react-dom"
import type { Message } from "./auth-form-message"

interface AuthSubmitButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "formAction"> {
  children: React.ReactNode
  pendingText?: string
  serverAction?: (formData: FormData) => Promise<Message | unknown> | void
}

export function AuthSubmitButton({
  children,
  className,
  serverAction,
  pendingText = "Please wait...",
  ...props
}: AuthSubmitButtonProps) {
  const { pending } = useFormStatus()

  // Use type assertion to ensure compatibility with the formAction attribute
  const typedServerAction = serverAction as unknown as ((formData: FormData) => void | Promise<void>) | undefined

  return (
    <Button type="submit" className={className} disabled={pending} formAction={typedServerAction} {...props}>
      {pending ? pendingText : children}
    </Button>
  )
}

