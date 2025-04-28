import type React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { createClient } from "@/supabase/server"
import { notFound, redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getUserBasicData } from "@/components/auth/user-info"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface EditStepPageProps {
  params: { build: string; update: string; step: string }
  searchParams?: { error?: string }
}

export default async function EditStepPage({ params, searchParams }: EditStepPageProps) {
  // Await the params object
  const resolvedParams = await Promise.resolve(params)
  const resolvedSearchParams = await Promise.resolve(searchParams || {})
  const buildId = resolvedParams.build
  const updateId = resolvedParams.update
  const stepId = resolvedParams.step
  const error = resolvedSearchParams.error

  const supabase = await createClient()

  // Fetch the step
  const { data: step, error: stepError } = await supabase
    .from("build_update_steps")
    .select("*")
    .eq("id", stepId)
    .eq("update_id", updateId)
    .single()

  if (stepError || !step) {
    notFound()
  }

  // Fetch the update
  const { data: update, error: updateError } = await supabase
    .from("build_updates")
    .select("title, build_id")
    .eq("id", updateId)
    .single()

  if (updateError || !update) {
    notFound()
  }

  // Fetch the build to check ownership
  const { data: build, error: buildError } = await supabase
    .from("builds")
    .select("user_id")
    .eq("id", update.build_id)
    .single()

  if (buildError || !build) {
    notFound()
  }

  // Get current user to check if they're the owner
  const { id: userId, email: userEmail, name: userName, isAuthenticated } = await getUserBasicData()

  // If user is not the owner, redirect to the update page
  if (userId !== build.user_id) {
    redirect(`/build/${buildId}/update/${updateId}`)
  }

  // Handle form submission (this would be a server action in a real app)
  async function updateStep(formData: FormData) {
    "use server"

    const title = formData.get("title") as string
    const description = formData.get("description") as string

    if (!title) {
      redirect(`/build/${buildId}/update/${updateId}/steps/${stepId}/edit?error=Title is required`)
    }

    const supabase = await createClient()

    const { error } = await supabase
      .from("build_update_steps")
      .update({
        title,
        description,
      })
      .eq("id", stepId)
      .eq("update_id", updateId)

    if (error) {
      redirect(`/build/${buildId}/update/${updateId}/steps/${stepId}/edit?error=Failed to update step`)
    }

    redirect(`/build/${buildId}/update/${updateId}?tab=steps`)
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar
        variant="inset"
        userData={{
          id: userId,
          name: userName || "User",
          email: userEmail || "No email",
          isAuthenticated,
        }}
      />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="container mx-auto p-1">
                <div className="mb-2">
                  <Link
                    href={`/build/${buildId}/update/${updateId}?tab=steps`}
                    className="text-sm text-muted-foreground hover:underline"
                  >
                    &larr; Back to steps
                  </Link>
                </div>

                <div className="mb-6">
                  <h1 className="text-3xl font-bold">Edit Step</h1>
                  <p className="text-muted-foreground mt-2">
                    Editing step for <span className="font-medium">{update.title}</span>
                  </p>
                </div>

                {error && (
                  <div className="mb-6 p-4 bg-destructive/10 text-destructive rounded-md max-w-3xl mx-auto">
                    {error}
                  </div>
                )}

                <Card className="max-w-3xl mx-auto">
                  <CardHeader>
                    <CardTitle>Step Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form action={updateStep} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" name="title" defaultValue={step.title} required />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" name="description" defaultValue={step.description || ""} rows={4} />
                      </div>

                      <div className="flex justify-end gap-4">
                        <Button variant="outline" asChild>
                          <Link href={`/build/${buildId}/update/${updateId}?tab=steps`}>Cancel</Link>
                        </Button>
                        <Button type="submit">Save Changes</Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
