"use server"

import { redirect } from "next/navigation"
import { getUserBasicData } from "@/components/auth/user-info"
import { createClient } from "@/supabase/server"

export async function createBuild(formData: FormData) {
  // Get the current user's ID
  const { id: userId } = await getUserBasicData()

  // Create Supabase client
  const supabase = await createClient()

  // Extract form data
  const buildData = {
    name: formData.get("name") as string,
    status: formData.get("status") as string,
    visibility: formData.get("visibility") as string,
    description: formData.get("description") as string,
    build_type: formData.get("buildType") as string,
    user_id: userId,
  }

  // Extract conditional fields based on build type
  let additionalData = {}

  if (buildData.build_type === "vehicle") {
    additionalData = {
      make: formData.get("make") as string,
      model: formData.get("model") as string,
      year: Number.parseInt(formData.get("year") as string, 10),
    }
  } else if (buildData.build_type === "construction") {
    additionalData = {
      construction_type: formData.get("constructionType") as string,
    }
  } else if (buildData.build_type === "craft") {
    additionalData = {
      craft_type: formData.get("craftType") as string,
    }
  }

  // Combine all data
  const completeData = {
    ...buildData,
    ...additionalData,
  }

  // Insert data into Supabase
  const { data, error } = await supabase.from("builds").insert(completeData).select().single()

  if (error) {
    console.error("Error creating build:", error)
    throw new Error(`Failed to create build: ${error.message}`)
  }

  // Redirect to the build detail page
  redirect(`/build/${data.id}`)
}

