import type React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { createClient } from "@/supabase/server"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getUserBasicData } from "@/components/auth/user-info"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface BuildDetailPageProps {
  params: { build: string }
  searchParams: { tab?: string }
}

export default async function BuildDetailPage({ params, searchParams }: BuildDetailPageProps) {
  // Await the params object before destructuring
  const resolvedParams = await Promise.resolve(params)
  const buildId = resolvedParams.build

  // Await the searchParams object before accessing its properties
  const resolvedSearchParams = await Promise.resolve(searchParams)
  const activeTab = resolvedSearchParams?.tab || "about"

  const supabase = await createClient()

  // Fetch the build
  const { data: build, error } = await supabase.from("builds").select("*").eq("id", buildId).single()

  if (error || !build) {
    notFound()
  }

  // Get current user to check if they're the owner
  const { id: userId, email: userEmail, name: userName, isAuthenticated } = await getUserBasicData()
  const isOwner = userId === build.user_id

  // Format date
  const createdDate = new Date(build.created_at).toLocaleDateString()

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
                <div className="mb-6 flex items-center justify-between">
                  <h1 className="text-3xl font-bold">{build.name}</h1>
                  {isOwner && (
                    <Button asChild variant="outline">
                      <Link href={`/build/${build.id}/edit`}>Edit Build</Link>
                    </Button>
                  )}
                </div>

                <Tabs defaultValue={activeTab} className="w-full">
                  <TabsList className="mb-6">
                    <TabsTrigger value="about" asChild>
                      <Link href={`/build/${buildId}?tab=about`}>About</Link>
                    </TabsTrigger>
                    <TabsTrigger value="updates" asChild>
                      <Link href={`/build/${buildId}?tab=updates`}>Updates</Link>
                    </TabsTrigger>
                    <TabsTrigger value="comments" asChild>
                      <Link href={`/build/${buildId}?tab=comments`}>Comments</Link>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="about" className="mt-0">
                    <div className="space-y-6 max-w-3xl mx-auto">
                      <Card>
                        <CardHeader>
                          <CardTitle>Description</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p>{build.description || "No description provided."}</p>
                        </CardContent>
                      </Card>

                      {/* Vehicle details - kept as a separate card */}
                      {build.build_type === "vehicle" && (
                        <Card>
                          <CardHeader>
                            <CardTitle>Vehicle Details</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <dl className="grid grid-cols-2 gap-4">
                              <div>
                                <dt className="text-sm font-medium text-muted-foreground">Make</dt>
                                <dd>{build.make}</dd>
                              </div>
                              <div>
                                <dt className="text-sm font-medium text-muted-foreground">Model</dt>
                                <dd>{build.model}</dd>
                              </div>
                              <div>
                                <dt className="text-sm font-medium text-muted-foreground">Year</dt>
                                <dd>{build.year}</dd>
                              </div>
                            </dl>
                          </CardContent>
                        </Card>
                      )}

                      {/* Craft details - kept as a separate card */}
                      {build.build_type === "craft" && (
                        <Card>
                          <CardHeader>
                            <CardTitle>Craft Details</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <dl>
                              <dt className="text-sm font-medium text-muted-foreground">Craft Type</dt>
                              <dd>{build.craft_type}</dd>
                            </dl>
                          </CardContent>
                        </Card>
                      )}

                      <Card>
                        <CardHeader>
                          <CardTitle>Build Info</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <dl className="space-y-4">
                            <div>
                              <dt className="text-sm font-medium text-muted-foreground">Status</dt>
                              <dd>
                                <span className="inline-block px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">
                                  {build.status}
                                </span>
                              </dd>
                            </div>
                            <div>
                              <dt className="text-sm font-medium text-muted-foreground">Visibility</dt>
                              <dd>
                                <span className="inline-block px-2 py-1 text-xs rounded-full bg-secondary/10 text-secondary">
                                  {build.visibility}
                                </span>
                              </dd>
                            </div>
                            <div>
                              <dt className="text-sm font-medium text-muted-foreground">Build Type</dt>
                              <dd>{build.build_type}</dd>
                            </div>
                            {/* Construction type moved to Build Info */}
                            {build.build_type === "construction" && (
                              <div>
                                <dt className="text-sm font-medium text-muted-foreground">Construction Type</dt>
                                <dd>{build.construction_type}</dd>
                              </div>
                            )}
                            <div>
                              <dt className="text-sm font-medium text-muted-foreground">Created</dt>
                              <dd>{createdDate}</dd>
                            </div>
                          </dl>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>Builder Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <Link
                              href={`/builders/${build.user_id}`}
                              className="flex items-center gap-2 hover:underline"
                            >
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                                {userName ? userName.charAt(0).toUpperCase() : "B"}
                              </div>
                              <span>{userName || "Builder"}</span>
                            </Link>
                            <Button asChild variant="outline" className="w-full">
                              <Link href={`/builders/${build.user_id}`}>View Builder Profile</Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="updates" className="mt-0">
                    <Card className="max-w-3xl mx-auto">
                      <CardHeader>
                        <CardTitle>Build Updates</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {isOwner ? (
                          <div className="space-y-4">
                            <p className="text-muted-foreground">Share progress updates about your build here.</p>
                            <Button asChild>
                              <Link href={`/update/new?buildId=${buildId}`}>Add Update</Link>
                            </Button>
                          </div>
                        ) : (
                          <p className="text-muted-foreground">No updates available for this build yet.</p>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="comments" className="mt-0">
                    <Card className="max-w-3xl mx-auto">
                      <CardHeader>
                        <CardTitle>Comments</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <p className="text-muted-foreground">Join the conversation about this build.</p>
                          {isAuthenticated ? (
                            <div className="space-y-4">
                              <textarea
                                className="w-full min-h-[100px] p-3 border rounded-md"
                                placeholder="Leave a comment..."
                              />
                              <Button>Post Comment</Button>
                            </div>
                          ) : (
                            <p>
                              <Link href="/login" className="text-primary hover:underline">
                                Sign in
                              </Link>{" "}
                              to leave a comment.
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
