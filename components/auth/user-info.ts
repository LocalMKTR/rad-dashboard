"use server"

import { createClient } from "@/supabase/server"

export type UserBasicData = {
  id: string | null
  email: string | null
  name: string | null
  isAuthenticated: boolean
}

export async function getUserBasicData(): Promise<UserBasicData> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return {
        id: null,
        email: null,
        name: null,
        isAuthenticated: false,
      }
    }

    // Get user name from profile if available
    let name = null
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("display_name, full_name")
        .eq("id", user.id)
        .single()

      if (profile) {
        name = profile.display_name || profile.full_name
      }
    } catch  {
      // Fallback to user metadata if profile fetch fails
      console.log("Profile fetch failed, using metadata")
    }

    return {
      id: user.id,
      email: user.email ?? null,
      name: name || user.user_metadata?.full_name || user.email?.split("@")[0] || null,
      isAuthenticated: true,
    }
  } catch  {
    console.error("Error fetching user data:")
    return {
      id: null,
      email: null,
      name: null,
      isAuthenticated: false,
    }
  }
}

