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

interface UpdateEditPageProps {
  params: { build: string; update: string }
}

export default async function UpdateEditPage({ params }: UpdateEditPageProps) {
  // Await the params object
  const resolvedParams = await Promise.resolve(params)
  const buildId = resolvedParams.build
  const updateId = resolvedParams.update

  const supabase = await createClient()

  // Fetch the update
  const { data: update, error: updateError } = await supabase
    .from("build_updates")
    .select("*")
    .eq("id", updateId)
    .eq("build_id", buildId)
    .single()

  if (updateError || !update) {
    notFound()
  }

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

  // If user is not the owner, redirect to the update page
  if (userId !== build.user_id) {
    redirect(`/build/${buildId}/update/${updateId}`)
  }

  // Handle form submission (this would be a server action in a real app)
  async function updateBuildUpdate(formData: FormData) {
    "use server"

    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const status = formData.get("status") as string

    if (!title || !description || !status) {
      // Instead of returning an error object, we could throw an error
      // or redirect with a query parameter for error handling
      redirect(`/build/${buildId}/update/${updateId}/edit?error=All fields are required`)
    }

    const supabase = await createClient()

    const { error } = await supabase
      .from("build_updates")
      .update({
        title,
        description,
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", updateId)
      .eq("build_id", buildId)

    if (error) {
      redirect(`/build/${buildId}/update/${updateId}/edit?error=Failed to update`)
    }

    redirect(`/build/${buildId}/update/${updateId}`)
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
                    href={`/build/${buildId}/update/${updateId}`}
                    className="text-sm text-muted-foreground hover:underline"
                  >
                    &larr; Back to update
                  </Link>
                </div>

                <div className="mb-6">
                  <h1 className="text-3xl font-bold">Edit Update</h1>
                  <p className="text-muted-foreground mt-2">
                    Editing update for{" "}
                    <Link href={`/build/${buildId}`} className="text-primary hover:underline">
                      {build.name}
                    </Link>
                  </p>
                </div>

                <Card className="max-w-3xl mx-auto">
                  <CardHeader>
                    <CardTitle>Update Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form action={updateBuildUpdate} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" name="title" defaultValue={update.title} required />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          name="description"
                          defaultValue={update.description}
                          rows={6}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select name="status" defaultValue={update.status}>
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
                          <Link href={`/build/${buildId}/update/${updateId}`}>Cancel</Link>
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
