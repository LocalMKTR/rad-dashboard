"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { AuthDialog } from "@/components/auth/auth-dialog"
import { AuthRedirect } from "@/components/auth/auth-redirect"
import { Hero } from "@/components/home/hero"
import type { AuthMode } from "@/components/auth/types"

export default function Home() {
  const router = useRouter()
  const [authOpen, setAuthOpen] = useState(false)
  const [authMode, setAuthMode] = useState<AuthMode>("login")
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const handleLoginSuccess = () => {
    setIsLoggedIn(true)
    setAuthOpen(false)
    // Navigate to dashboard after successful login
    router.push("/dashboard")
  }

  const handleSignupSuccess = () => {
    setIsLoggedIn(true)
    setAuthOpen(false)
    // Navigate to dashboard after successful signup
    router.push("/dashboard")
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setAuthOpen(false)
  }

  const handleSignIn = () => {
    setAuthMode("login")
    setAuthOpen(true)
  }

  const handleSignUp = () => {
    setAuthMode("signup")
    setAuthOpen(true)
  }

  return (
    <>
      <AuthRedirect />

      <div className="flex flex-col items-center">
        <Hero onSignIn={handleSignIn} onSignUp={handleSignUp} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl py-16">
          <div className="flex flex-col items-center text-center p-6 border rounded-lg">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Secure</h3>
            <p className="text-muted-foreground">Built with security in mind, protecting your data at every step.</p>
          </div>

          <div className="flex flex-col items-center text-center p-6 border rounded-lg">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary"
              >
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Fast</h3>
            <p className="text-muted-foreground">Optimized for performance, delivering a smooth user experience.</p>
          </div>

          <div className="flex flex-col items-center text-center p-6 border rounded-lg">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary"
              >
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Reliable</h3>
            <p className="text-muted-foreground">Built on a robust foundation, ensuring uptime and consistency.</p>
          </div>
        </div>
      </div>

      <AuthDialog
        open={authOpen}
        onOpenChange={setAuthOpen}
        authMode={authMode}
        onAuthModeChange={setAuthMode}
        onLoginSuccess={handleLoginSuccess}
        onSignupSuccess={handleSignupSuccess}
        onLogout={handleLogout}
      />
    </>
  )
}

