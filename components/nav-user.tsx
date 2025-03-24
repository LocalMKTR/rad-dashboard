"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { SidebarMenu } from "@/components/ui/sidebar"
import { AuthDialog } from "./auth/auth-dialog"
import { UserDropdown } from "./auth/user-dropdown"
import type { AuthMode } from "./auth/types"


export function NavUser({
  user,
  isLoggedIn = true,
  onLoginStatusChange,
}: {
  user?: {
    name?: string
    email?: string
    avatar?: string
  }
  isLoggedIn?: boolean
  onLoginStatusChange?: (status: boolean) => void
}) {
  //console.log("this is the user on nav-user: ",user)
  const router = useRouter()
  const [authOpen, setAuthOpen] = React.useState(false)
  const [authMode, setAuthMode] = React.useState<AuthMode>("login")
  const [currentUser] = React.useState(user)

  // Fetch user data if not provided
  // React.useEffect(() => {
  //   const fetchUserData = async () => {
  //     if (!user) {
  //       try {
  //         const supabase = createClient()
  //         const {
  //           data: { user: supabaseUser },
  //         } = await supabase.auth.getUser()

  //         if (supabaseUser) {
  //           // Get user profile data if available
  //           const { data: profile } = await supabase.from("profiles").select("*").eq("id", supabaseUser.id).single()

  //           setCurrentUser({
  //             name:
  //               profile?.display_name ||
  //               profile?.full_name ||
  //               supabaseUser.user_metadata?.full_name ||
  //               supabaseUser.email?.split("@")[0] ||
  //               "User",
  //             email: supabaseUser.email || "No email",
  //             avatar:
  //               profile?.avatar_url || supabaseUser.user_metadata?.avatar_url || "/placeholder.svg?height=32&width=32",
  //           })
  //         }
  //       } catch (error) {
  //         console.error("Error fetching user data:", error)
  //       }
  //     }
  //   }

  //   fetchUserData()
  // }, [user])

  // Reset to default mode when dialog/drawer is closed
  React.useEffect(() => {
    if (!authOpen) {
      setAuthMode(isLoggedIn ? "logout" : "login")
    }
  }, [authOpen, isLoggedIn])

  const handleLoginSuccess = () => {
    if (onLoginStatusChange) onLoginStatusChange(true)
    setAuthOpen(false)
  }

  const handleSignupSuccess = () => {
    if (onLoginStatusChange) onLoginStatusChange(true)
    setAuthOpen(false)
  }

  const handleLogout = () => {
    if (onLoginStatusChange) onLoginStatusChange(false)
    setAuthOpen(false)

    // Navigate to the root page and refresh
    router.push("/")
    // Use setTimeout to ensure the navigation happens before the refresh
    setTimeout(() => {
      window.location.reload()
    }, 100)
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
      <UserDropdown user={currentUser} onLogoutClick={() => setAuthOpen(true)} />

      <AuthDialog
        open={authOpen}
        onOpenChange={handleOpenChange}
        authMode={authMode}
        onAuthModeChange={setAuthMode}
        onLoginSuccess={handleLoginSuccess}
        onSignupSuccess={handleSignupSuccess}
        onLogout={handleLogout}
      />
    </SidebarMenu>
  )
}

