"use client"

import type * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

type AuthMode = "login" | "signup" | "reset" | "logout"

interface AuthFormProps {
  className?: string
  onModeChange: (mode: AuthMode) => void
}

interface LoginFormProps extends AuthFormProps {
  onLogin: (e: React.FormEvent) => void
}

export function LoginForm({ className, onLogin, onModeChange }: LoginFormProps) {
  return (
    <form onSubmit={onLogin} className={cn("grid items-start gap-4", className)}>
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input type="email" id="email" defaultValue="user@example.com" required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="password">Password</Label>
        <Input type="password" id="password" defaultValue="password" required />
      </div>
      <Button type="submit" className="w-full">
        Log in
      </Button>
      <div className="flex justify-between text-sm">
        <button type="button" onClick={() => onModeChange("signup")} className="text-primary hover:underline">
          Create account
        </button>
        <button type="button" onClick={() => onModeChange("reset")} className="text-primary hover:underline">
          Forgot password?
        </button>
      </div>
    </form>
  )
}

interface SignupFormProps extends AuthFormProps {
  onSignup: (e: React.FormEvent) => void
}

export function SignupForm({ className, onSignup, onModeChange }: SignupFormProps) {
  return (
    <form onSubmit={onSignup} className={cn("grid items-start gap-4", className)}>
      <div className="grid gap-2">
        <Label htmlFor="name">Full Name</Label>
        <Input type="text" id="name" required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input type="email" id="email" required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="password">Password</Label>
        <Input type="password" id="password" required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input type="password" id="confirmPassword" required />
      </div>
      <Button type="submit" className="w-full">
        Sign up
      </Button>
      <div className="text-center text-sm">
        <button type="button" onClick={() => onModeChange("login")} className="text-primary hover:underline">
          Already have an account? Log in
        </button>
      </div>
    </form>
  )
}

interface ResetPasswordFormProps extends AuthFormProps {
  onResetPassword: (e: React.FormEvent) => void
}

export function ResetPasswordForm({ className, onResetPassword, onModeChange }: ResetPasswordFormProps) {
  return (
    <form onSubmit={onResetPassword} className={cn("grid items-start gap-4", className)}>
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input type="email" id="email" required />
      </div>
      <Button type="submit" className="w-full">
        Send reset link
      </Button>
      <div className="text-center text-sm">
        <button type="button" onClick={() => onModeChange("login")} className="text-primary hover:underline">
          Back to login
        </button>
      </div>
    </form>
  )
}

interface LogoutConfirmationProps {
  className?: string
  onCancel: () => void
  onLogout: () => void
}

export function LogoutConfirmation({ className, onCancel, onLogout }: LogoutConfirmationProps) {
  return (
    <div className={cn("grid gap-4", className)}>
      <p className="text-center">Are you sure you want to log out?</p>
      <div className="flex justify-center gap-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="destructive" onClick={onLogout}>
          Log out
        </Button>
      </div>
    </div>
  )
}

