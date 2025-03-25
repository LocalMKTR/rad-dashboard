import { getUserBasicData } from "@/components/auth/user-info"
import { redirect } from "next/navigation"
import { BuildForm } from "./build-form"

export default async function NewBuildPage() {
  // Get the current user's ID for the cancel button redirection
  const { id: userId } = await getUserBasicData()

  // If no user ID is available, redirect to the builders page
  if (!userId) {
    redirect("/builders")
  }

  return (
    <main className="container py-8 max-w-2xl mx-auto">
      <BuildForm userId={userId} />
    </main>
  )
}

