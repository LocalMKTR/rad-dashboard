"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/supabase/client"

export function AuthRedirect() {
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = createClient()
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session) {
          // User is logged in, redirect to dashboard
          router.push("/dashboard")
        }
      } catch (error) {
        console.error("Error checking authentication:", error)
      }
    }

    checkAuth()
  }, [router])

  return null
}

