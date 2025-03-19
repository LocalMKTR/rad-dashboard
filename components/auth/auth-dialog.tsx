"use client"

import type * as React from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { useMediaQuery } from "@/hooks/use-media-query"
import { LoginForm, LogoutConfirmation, ResetPasswordForm, SignupForm } from "./auth-forms"

export type AuthMode = "login" | "signup" | "reset" | "logout"

interface AuthDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  authMode: AuthMode
  onAuthModeChange: (mode: AuthMode) => void
  onLogin: (e: React.FormEvent) => void
  onSignup: (e: React.FormEvent) => void
  onResetPassword: (e: React.FormEvent) => void
  onLogout: () => void
}

export function AuthDialog({
  open,
  onOpenChange,
  authMode,
  onAuthModeChange,
  onLogin,
  onSignup,
  onResetPassword,
  onLogout,
}: AuthDialogProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)")

  // Get title and description based on current mode
  const getDialogContent = () => {
    switch (authMode) {
      case "login":
        return {
          title: "Log in",
          description: "Enter your credentials to log in to your account.",
        }
      case "signup":
        return {
          title: "Sign up",
          description: "Create a new account to get started.",
        }
      case "reset":
        return {
          title: "Reset password",
          description: "Enter your email to receive a password reset link.",
        }
      case "logout":
        return {
          title: "Log out",
          description: "Confirm that you want to log out of your account.",
        }
    }
  }

  // Get the appropriate form based on auth mode
  const getFormContent = () => {
    switch (authMode) {
      case "login":
        return <LoginForm onLogin={onLogin} onModeChange={onAuthModeChange} />
      case "signup":
        return <SignupForm onSignup={onSignup} onModeChange={onAuthModeChange} />
      case "reset":
        return <ResetPasswordForm onResetPassword={onResetPassword} onModeChange={onAuthModeChange} />
      case "logout":
        return <LogoutConfirmation onCancel={() => onOpenChange(false)} onLogout={onLogout} />
    }
  }

  const dialogContent = getDialogContent()

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{dialogContent.title}</DialogTitle>
            <DialogDescription>{dialogContent.description}</DialogDescription>
          </DialogHeader>
          {getFormContent()}
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{dialogContent.title}</DrawerTitle>
          <DrawerDescription>{dialogContent.description}</DrawerDescription>
        </DrawerHeader>
        <div className="px-4 pb-6">{getFormContent()}</div>
        {authMode !== "logout" && (
          <DrawerFooter className="pt-2">
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        )}
      </DrawerContent>
    </Drawer>
  )
}

