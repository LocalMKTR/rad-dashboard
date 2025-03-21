"use client"

import { Button } from "@/components/ui/button"

interface HeroProps {
  onSignIn: () => void
  onSignUp: () => void
}

export function Hero({ onSignIn, onSignUp }: HeroProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
        Welcome to <span className="text-primary">Your App</span>
      </h1>

      <p className="mt-6 text-lg sm:text-xl max-w-3xl text-muted-foreground">
        A secure, fast, and reliable platform for managing your data and workflows. Sign in to access your personalized
        dashboard.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 mt-10">
        <Button size="lg" onClick={onSignIn}>
          Sign In
        </Button>
        <Button size="lg" variant="outline" onClick={onSignUp}>
          Create Account
        </Button>
      </div>
    </div>
  )
}

