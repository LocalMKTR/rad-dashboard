import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { CalendarIcon, Tag } from "lucide-react"

interface Build {
  id: string
  name: string
  description: string
  status: string
  build_type: string
  created_at: string
}

interface BuildsTabProps {
  isCurrentUser: boolean
  builderId: string
}

export async function BuildsTab({ isCurrentUser, builderId }: BuildsTabProps) {
  // Fetch builds from Supabase
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("builds")
    .select("*")
    .eq("user_id", builderId)
    .order("created_at", { ascending: false })

  // Explicitly type the builds array with the Build interface
  const builds: Build[] = data || []
  const hasBuilds = builds.length > 0

  // Format date function
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-6">
      {isCurrentUser && (
        <div className="flex justify-center mb-6">
          <Button asChild>
            <Link href="/build/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create New Build
            </Link>
          </Button>
        </div>
      )}

      {error && (
        <div className="text-center py-8">
          <p className="text-red-500">Error loading builds</p>
        </div>
      )}

      {!error && !hasBuilds && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No builds available to display</p>
        </div>
      )}

      {hasBuilds && (
        <div className="grid gap-4 sm:grid-cols-2">
          {builds.map((build: Build) => (
            <Link key={build.id} href={`/build/${build.id}`} className="block group">
              <Card className="h-full overflow-hidden transition-all hover:shadow-md">
                <CardContent className="p-0">
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-lg group-hover:text-primary transition-colors">{build.name}</h3>
                      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-primary/10 text-primary">
                        {build.status}
                      </span>
                    </div>

                    {build.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{build.description}</p>
                    )}

                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                      <div className="flex items-center">
                        <Tag className="mr-1 h-3 w-3" />
                        {build.build_type}
                      </div>
                      <div className="flex items-center">
                        <CalendarIcon className="mr-1 h-3 w-3" />
                        {formatDate(build.created_at)}
                      </div>
                    </div>
                  </div>

                  <div className="h-1 w-full bg-primary/10 mt-2">
                    <div
                      className="h-full bg-primary"
                      style={{
                        width:
                          build.status === "completed"
                            ? "100%"
                            : build.status === "in-progress"
                              ? "50%"
                              : build.status === "planning"
                                ? "10%"
                                : "0%",
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

