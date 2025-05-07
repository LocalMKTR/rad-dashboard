import type React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { createClient } from "@/supabase/server"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getUserBasicData } from "@/components/auth/user-info"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ThumbsUp, ThumbsDown, MessageSquare, Clock, PenLine } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface UpdatePageProps {
  params: { update: string }
  searchParams: { tab?: string }
}

export default async function UpdatePage({ params, searchParams }: UpdatePageProps) {
  // Await the params and searchParams objects
  const resolvedParams = await Promise.resolve(params)
  const resolvedSearchParams = await Promise.resolve(searchParams)

  const updateId = resolvedParams.update
  const activeTab = resolvedSearchParams?.tab || "details"

  const supabase = await createClient()

  // Fetch the update
  const { data: update, error: updateError } = await supabase
    .from("build_updates")
    .select("*, builds(name, id, user_id)")
    .eq("id", updateId)
    .single()

  if (updateError || !update) {
    notFound()
  }

  // Extract build information from the joined query
  const buildId = update.builds?.id
  const buildName = update.builds?.name || "Build"

  // Get current user to check if they're the owner
  const { id: userId, email: userEmail, name: userName, isAuthenticated } = await getUserBasicData()
  const isOwner = userId === update.builds?.user_id

  // Fetch update steps
  const { data: steps } = await supabase
    .from("build_update_steps")
    .select("*")
    .eq("update_id", updateId)
    .order("order_position", { ascending: true })

  // Fetch comments
  const { data: comments } = await supabase
    .from("build_update_comments")
    .select("*, profiles(name, avatar_url)")
    .eq("update_id", updateId)
    .order("created_at", { ascending: false })

  // Format dates
  const createdDate = new Date(update.created_at).toLocaleDateString()
  const updatedDate = update.updated_at ? new Date(update.updated_at).toLocaleDateString() : null

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in progress":
        return "bg-blue-100 text-blue-800"
      case "planned":
        return "bg-yellow-100 text-yellow-800"
      case "blocked":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
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
                  {buildId && (
                    <Link href={`/build/${buildId}`} className="text-sm text-muted-foreground hover:underline">
                      &larr; Back to {buildName}
                    </Link>
                  )}
                </div>

                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold">{update.title}</h1>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className={getStatusColor(update.status)}>{update.status}</Badge>
                      <span className="text-sm text-muted-foreground">
                        <Clock className="inline-block w-4 h-4 mr-1" />
                        {createdDate}
                        {updatedDate && updatedDate !== createdDate && ` (Updated: ${updatedDate})`}
                      </span>
                    </div>
                  </div>
                  {isOwner && buildId && (
                    <Button asChild variant="outline">
                      <Link href={`/update/${updateId}/edit`}>
                        <PenLine className="w-4 h-4 mr-2" />
                        Edit Update
                      </Link>
                    </Button>
                  )}
                </div>

                <Tabs defaultValue={activeTab} className="w-full">
                  <TabsList className="mb-6">
                    <TabsTrigger value="details" asChild>
                      <Link href={`/update/${updateId}?tab=details`}>Details</Link>
                    </TabsTrigger>
                    <TabsTrigger value="steps" asChild>
                      <Link href={`/update/${updateId}?tab=steps`}>Steps</Link>
                    </TabsTrigger>
                    <TabsTrigger value="comments" asChild>
                      <Link href={`/update/${updateId}?tab=comments`}>Comments</Link>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="details" className="mt-0">
                    <Card className="max-w-3xl mx-auto">
                      <CardHeader>
                        <CardTitle>Update Details</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="prose max-w-none">
                          <p>{update.description || "No description provided."}</p>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between border-t p-4">
                        <div className="flex items-center gap-4">
                          <Button variant="ghost" size="sm" className="flex items-center gap-1">
                            <ThumbsUp className="w-4 h-4" />
                            <span>{update.likes || 0}</span>
                          </Button>
                          <Button variant="ghost" size="sm" className="flex items-center gap-1">
                            <ThumbsDown className="w-4 h-4" />
                            <span>{update.dislikes || 0}</span>
                          </Button>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="w-4 h-4" />
                          <span className="text-sm text-muted-foreground">{comments?.length || 0} comments</span>
                        </div>
                      </CardFooter>
                    </Card>
                  </TabsContent>

                  <TabsContent value="steps" className="mt-0">
                    <Card className="max-w-3xl mx-auto">
                      <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Steps</CardTitle>
                        {isOwner && (
                          <Button asChild size="sm">
                            <Link href={`/update/${updateId}/steps/new`}>Add Step</Link>
                          </Button>
                        )}
                      </CardHeader>
                      <CardContent>
                        {steps && steps.length > 0 ? (
                          <div className="space-y-6">
                            {steps.map((step, index) => (
                              <div key={step.id} className="relative pl-8 pb-6">
                                {index < steps.length - 1 && (
                                  <div className="absolute left-3 top-0 bottom-0 w-px bg-border" />
                                )}
                                <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                                  <span className="text-xs font-medium">{index + 1}</span>
                                </div>
                                <div className="space-y-2">
                                  <h3 className="font-medium">{step.title}</h3>
                                  <p className="text-sm text-muted-foreground">{step.description}</p>
                                  {isOwner && (
                                    <div className="flex gap-2 mt-2">
                                      <Button variant="outline" size="sm" asChild>
                                        <Link href={`/update/${updateId}/steps/${step.id}/edit`}>Edit</Link>
                                      </Button>
                                      <Button variant="destructive" size="sm">
                                        Delete
                                      </Button>
                                      {index > 0 && (
                                        <Button variant="outline" size="sm">
                                          Move Up
                                        </Button>
                                      )}
                                      {index < steps.length - 1 && (
                                        <Button variant="outline" size="sm">
                                          Move Down
                                        </Button>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <p className="text-muted-foreground">No steps have been added yet.</p>
                            {isOwner && (
                              <Button asChild className="mt-4">
                                <Link href={`/update/${updateId}/steps/new`}>Add First Step</Link>
                              </Button>
                            )}
                          </div>
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
                        {isAuthenticated ? (
                          <div className="space-y-4 mb-8">
                            <textarea
                              className="w-full min-h-[100px] p-3 border rounded-md"
                              placeholder="Leave a comment..."
                            />
                            <Button>Post Comment</Button>
                          </div>
                        ) : (
                          <div className="mb-8 p-4 bg-muted rounded-md">
                            <p>
                              <Link href="/login" className="text-primary hover:underline">
                                Sign in
                              </Link>{" "}
                              to leave a comment.
                            </p>
                          </div>
                        )}

                        <Separator className="my-4" />

                        {comments && comments.length > 0 ? (
                          <div className="space-y-6">
                            {comments.map((comment) => (
                              <div key={comment.id} className="flex gap-4">
                                <Avatar>
                                  <AvatarImage src={comment.profiles?.avatar_url || "/placeholder.svg"} />
                                  <AvatarFallback>{comment.profiles?.name?.charAt(0) || "U"}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 space-y-1">
                                  <div className="flex items-center justify-between">
                                    <p className="font-medium">{comment.profiles?.name || "Anonymous"}</p>
                                    <span className="text-xs text-muted-foreground">
                                      {new Date(comment.created_at).toLocaleDateString()}
                                    </span>
                                  </div>
                                  <p className="text-sm">{comment.content}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-center py-4 text-muted-foreground">
                            No comments yet. Be the first to comment!
                          </p>
                        )}
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
