"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { createClient } from "@/supabase/client"

type AuthContextType = {
  userId: string | null
  userEmail: string | null
  isLoading: boolean
  isAuthenticated: boolean
  refreshUser: () => Promise<void>
}

// Export the AuthContext so it can be imported in use-auth.ts
export const AuthContext = createContext<AuthContextType>({
  userId: null,
  userEmail: null,
  isLoading: true,
  isAuthenticated: false,
  refreshUser: async () => {},
})

export const useAuth = () => useContext(AuthContext)

interface AuthProviderProps {
  children: React.ReactNode
  initialUserId: string | null
  initialUserEmail: string | null
}

export function AuthProvider({ children, initialUserId, initialUserEmail }: AuthProviderProps) {
  const [userId, setUserId] = useState<string | null>(initialUserId)
  const [userEmail, setUserEmail] = useState<string | null>(initialUserEmail)
  const [isLoading, setIsLoading] = useState(!initialUserId)

  const refreshUser = async () => {
    try {
      setIsLoading(true)
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        setUserId(user.id)
        // Fix: Convert undefined to null
        setUserEmail(user.email || null)
      } else {
        setUserId(null)
        setUserEmail(null)
      }
    } catch (error) {
      console.error("Error refreshing user:", error)
      setUserId(null)
      setUserEmail(null)
    } finally {
      setIsLoading(false)
    }
  }

  // Listen for auth state changes
  useEffect(() => {
    const supabase = createClient()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUserId(session.user.id)
        // Fix: Convert undefined to null
        setUserEmail(session.user.email || null)
      } else {
        setUserId(null)
        setUserEmail(null)
      }
      setIsLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        userId,
        userEmail,
        isLoading: isLoading && !userId,
        isAuthenticated: !!userId,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

