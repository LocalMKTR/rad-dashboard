"use server"

import { redirect } from "next/navigation"
import { getUserBasicData } from "@/components/auth/user-info"

export async function createBuild(formData: FormData) {
  // Get the current user's ID
  const { id: userId } = await getUserBasicData()

  // In a real app, you would:
  // 1. Validate the form data
  // 2. Save the build to your database
  // 3. Handle any errors

  // For demonstration, we'll just log the data
  const name = formData.get("name")
  const description = formData.get("description")
  const location = formData.get("location")

  console.log("Creating build:", { name, description, location, userId })

  // Wait a moment to simulate saving to a database
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Redirect to the user's builds page
  redirect(`/builders/${userId}?tab=Builds`)
}

