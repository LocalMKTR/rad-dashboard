"use server"

import { createClient } from "@/supabase/server"

export async function fetchBuilderById(builderID: string) {
  const supabase = await createClient()

  try {
    const { data: builderData } = await supabase.from("profiles").select("*").eq("id", builderID)

    return builderData
  } catch (err) {
    console.error("Error while fetching builder:", err)
    throw new Error("Unable to fetch builder")
  }
}
