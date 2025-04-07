import { createClient } from "@/supabase/server"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getUserBasicData } from "@/components/auth/user-info"

export default async function BuildDetailPage({ params }: { params: { build: string } }) {
  const supabase = await createClient()

  // Fetch the build
  const { data: build, error } = await supabase.from("builds").select("*").eq("id", params.build).single()

  if (error || !build) {
    notFound()
  }

  // Get current user to check if they're the owner
  const { id: userId } = await getUserBasicData()
  const isOwner = userId === build.user_id

  // Format date
  const createdDate = new Date(build.created_at).toLocaleDateString()

  return (
    <main className="container py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">{build.name}</h1>
        {isOwner && (
          <Button asChild variant="outline">
            <Link href={`/build/${build.id}/edit`}>Edit Build</Link>
          </Button>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{build.description || "No description provided."}</p>
            </CardContent>
          </Card>

          {/* Conditional details based on build type */}
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

          {build.build_type === "construction" && (
            <Card>
              <CardHeader>
                <CardTitle>Construction Details</CardTitle>
              </CardHeader>
              <CardContent>
                <dl>
                  <dt className="text-sm font-medium text-muted-foreground">Construction Type</dt>
                  <dd>{build.construction_type}</dd>
                </dl>
              </CardContent>
            </Card>
          )}

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
        </div>

        <div className="space-y-6">
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
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Created</dt>
                  <dd>{createdDate}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Button asChild variant="outline" className="w-full">
            <Link href={`/builders/${build.user_id}`}>Back to Builder Profile</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}

