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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface NewUpdatePageProps {
  searchParams?: { buildId?: string; error?: string }
}

export default async function NewUpdatePage({ searchParams }: NewUpdatePageProps) {
  // Await the searchParams object
  const resolvedSearchParams = await Promise.resolve(searchParams || {})
  const buildId = resolvedSearchParams.buildId
  const error = resolvedSearchParams.error

  // Redirect if no buildId is provided
  if (!buildId) {
    redirect("/builds")
  }

  const supabase = await createClient()

  // Fetch the build to get build name and check ownership
  const { data: build, error: buildError } = await supabase
    .from("builds")
    .select("name, user_id")
    .eq("id", buildId)
    .single()

  if (buildError || !build) {
    notFound()
  }

  // Get current user to check if they're the owner
  const { id: userId, email: userEmail, name: userName, isAuthenticated } = await getUserBasicData()

  // If user is not the owner, redirect to the build page
  if (userId !== build.user_id) {
    redirect(`/build/${buildId}`)
  }

  // Handle form submission (this would be a server action in a real app)
  async function createBuildUpdate(formData: FormData) {
    "use server"

    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const status = formData.get("status") as string
    const buildId = formData.get("buildId") as string

    if (!title || !description || !status || !buildId) {
      redirect(`/update/new?buildId=${buildId}&error=All fields are required`)
    }

    const supabase = await createClient()

    const { data, error } = await supabase
      .from("build_updates")
      .insert({
        build_id: buildId,
        title,
        description,
        status,
        likes: 0,
        dislikes: 0,
      })
      .select()

    if (error) {
      redirect(`/update/new?buildId=${buildId}&error=Failed to create update`)
    }

    const newUpdateId = data[0].id
    redirect(`/update/${newUpdateId}`)
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
                  <Link href={`/build/${buildId}`} className="text-sm text-muted-foreground hover:underline">
                    &larr; Back to {build.name}
                  </Link>
                </div>

                <div className="mb-6">
                  <h1 className="text-3xl font-bold">New Update</h1>
                  <p className="text-muted-foreground mt-2">
                    Create a new update for{" "}
                    <Link href={`/build/${buildId}`} className="text-primary hover:underline">
                      {build.name}
                    </Link>
                  </p>
                </div>

                {error && (
                  <div className="mb-6 p-4 bg-destructive/10 text-destructive rounded-md max-w-3xl mx-auto">
                    {error}
                  </div>
                )}

                <Card className="max-w-3xl mx-auto">
                  <CardHeader>
                    <CardTitle>Update Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form action={createBuildUpdate} className="space-y-6">
                      {/* Hidden input to pass the buildId */}
                      <input type="hidden" name="buildId" value={buildId} />

                      <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" name="title" placeholder="e.g., Completed the foundation" required />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          name="description"
                          placeholder="Describe your progress, challenges, or next steps..."
                          rows={6}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select name="status" defaultValue="In Progress">
                          <SelectTrigger>
                            <SelectValue placeholder="Select a status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Planned">Planned</SelectItem>
                            <SelectItem value="In Progress">In Progress</SelectItem>
                            <SelectItem value="Completed">Completed</SelectItem>
                            <SelectItem value="Blocked">Blocked</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex justify-end gap-4">
                        <Button variant="outline" asChild>
                          <Link href={`/build/${buildId}`}>Cancel</Link>
                        </Button>
                        <Button type="submit">Create Update</Button>
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
