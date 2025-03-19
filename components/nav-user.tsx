"use client"

import * as React from "react"
import { SidebarMenu } from "@/components/ui/sidebar"
import { AuthDialog, type AuthMode } from "./auth/auth-dialog"
import { UserDropdown } from "./auth/user-dropdown"

export function NavUser({
  user,
  isLoggedIn = true,
  onLoginStatusChange,
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
  isLoggedIn?: boolean
  onLoginStatusChange?: (status: boolean) => void
}) {
  const [authOpen, setAuthOpen] = React.useState(false)
  const [authMode, setAuthMode] = React.useState<AuthMode>("login")

  // Reset to default mode when dialog/drawer is closed
  React.useEffect(() => {
    if (!authOpen) {
      setAuthMode(isLoggedIn ? "logout" : "login")
    }
  }, [authOpen, isLoggedIn])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (onLoginStatusChange) onLoginStatusChange(true)
    setAuthOpen(false)
  }

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault()
    if (onLoginStatusChange) onLoginStatusChange(true)
    setAuthOpen(false)
  }

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault()
    alert("Password reset link sent to your email!")
    setAuthMode("login")
  }

  const handleLogout = () => {
    if (onLoginStatusChange) onLoginStatusChange(false)
    setAuthOpen(false)
  }

  // When opening the dialog/drawer, set the appropriate mode
  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      setAuthMode("logout")
    }
    setAuthOpen(newOpen)
  }

  return (
    <SidebarMenu>
      <UserDropdown user={user} onLogoutClick={() => setAuthOpen(true)} />

      <AuthDialog
        open={authOpen}
        onOpenChange={handleOpenChange}
        authMode={authMode}
        onAuthModeChange={setAuthMode}
        onLogin={handleLogin}
        onSignup={handleSignup}
        onResetPassword={handleResetPassword}
        onLogout={handleLogout}
      />
    </SidebarMenu>
  )
}

