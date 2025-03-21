"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { useMediaQuery } from "@/hooks/use-media-query"
import type { AuthMode } from "./types"
import { LoginForm } from "./login-form"
import { SignupForm } from "./signup-form"
import { ResetPasswordForm } from "./reset-password-form"
import { LogoutConfirmation } from "./logout-confirmation"

interface AuthDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  authMode: AuthMode
  onAuthModeChange: (mode: AuthMode) => void
  onLoginSuccess: () => void
  onSignupSuccess: () => void
  onLogout: () => void
}

export function AuthDialog({
  open,
  onOpenChange,
  authMode,
  onAuthModeChange,
  onLoginSuccess,
  onSignupSuccess,
  onLogout,
}: AuthDialogProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)")

  // Get title based on auth mode
  const getTitle = () => {
    switch (authMode) {
      case "login":
        return "Sign in"
      case "signup":
        return "Sign up"
      case "reset":
        return "Reset Password"
      case "logout":
        return "Log out"
    }
  }

  // Get the appropriate form based on auth mode
  const getFormContent = () => {
    switch (authMode) {
      case "login":
        return <LoginForm onModeChange={onAuthModeChange} onSuccess={onLoginSuccess} />
      case "signup":
        return <SignupForm onModeChange={onAuthModeChange} onSuccess={onSignupSuccess} />
      case "reset":
        return <ResetPasswordForm onModeChange={onAuthModeChange} />
      case "logout":
        return <LogoutConfirmation onCancel={() => onOpenChange(false)} onLogout={onLogout} />
    }
  }

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader className="p-0">
            <DialogTitle className="sr-only">{getTitle()}</DialogTitle>
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
          <DrawerTitle className="sr-only">{getTitle()}</DrawerTitle>
        </DrawerHeader>
        <div className={`px-4 ${authMode === "logout" ? "pb-10" : "pb-6"}`}>{getFormContent()}</div>
        {authMode !== "logout" && authMode !== "reset" && (
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

