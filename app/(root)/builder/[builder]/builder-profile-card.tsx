"use client"

import { IconBuildingCommunity, IconCalendarEvent, IconMail, IconMapPin } from "@tabler/icons-react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface BuilderProfileCardProps {
  builder: {
    id: string
    name: string
    description: string
    avatar_url?: string
    created_at: string
    updated_at?: string
    location?: string
    email?: string
    projects_count?: number
    skills?: string[]
  }
}

export function BuilderProfileCard({ builder }: BuilderProfileCardProps) {
  // Format dates
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Calculate membership duration
  const getMembershipDuration = (dateString: string) => {
    const startDate = new Date(dateString)
    const currentDate = new Date()
    const diffTime = Math.abs(currentDate.getTime() - startDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 30) {
      return `${diffDays} days`
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30)
      return `${months} month${months > 1 ? "s" : ""}`
    } else {
      const years = Math.floor(diffDays / 365)
      const remainingMonths = Math.floor((diffDays % 365) / 30)
      return `${years} year${years > 1 ? "s" : ""}${remainingMonths > 0 ? ` ${remainingMonths} month${remainingMonths > 1 ? "s" : ""}` : ""}`
    }
  }

  // Default skills if none provided
  const builderSkills = builder.skills || ["Construction", "Design", "Project Management"]

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {/* Main Profile Card */}
      <Card className="md:col-span-2 @container/card">
        <CardHeader className="pb-2">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="relative h-24 w-24 rounded-xl overflow-hidden border-4 border-background shadow-sm">
              {builder.avatar_url ? (
                <Image
                  src={builder.avatar_url || "/placeholder.svg"}
                  alt={builder.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                  <span className="text-3xl font-bold text-primary">{builder.name.charAt(0)}</span>
                </div>
              )}
            </div>
            <div>
              <CardTitle className="text-2xl sm:text-3xl">{builder.name}</CardTitle>
              <CardDescription className="text-base mt-1">
                <div className="flex items-center gap-2">
                  <IconBuildingCommunity className="h-4 w-4" />
                  <span>Professional Builder</span>
                </div>
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="about" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="Builds">Builds</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
            </TabsList>
            <TabsContent value="about" className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Bio</h3>
                <p className="text-muted-foreground">{builder.description}</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {builderSkills.map((skill, index) => (
                    <Badge key={index} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="Builds">
              <div className="text-center py-8">
                <p className="text-muted-foreground">No Builds available to display</p>
              </div>
            </TabsContent>
            <TabsContent value="contact">
              <div className="space-y-4">
                {builder.email && (
                  <div className="flex items-center gap-2">
                    <IconMail className="h-5 w-5 text-muted-foreground" />
                    <span>{builder.email}</span>
                  </div>
                )}
                {builder.location && (
                  <div className="flex items-center gap-2">
                    <IconMapPin className="h-5 w-5 text-muted-foreground" />
                    <span>{builder.location}</span>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Stats Card */}
      <div className="grid gap-6">
        <Card className="@container/stats">
          <CardHeader>
            <CardDescription>Member Since</CardDescription>
            <CardTitle className="text-2xl font-semibold">{formatDate(builder.created_at)}</CardTitle>
            <CardAction>
              <Badge variant="outline">{getMembershipDuration(builder.created_at)}</Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="flex gap-2 font-medium">
              <IconCalendarEvent className="size-4" />
              Active member
            </div>
            <div className="text-muted-foreground">
              Last updated: {builder.updated_at ? formatDate(builder.updated_at) : "N/A"}
            </div>
          </CardFooter>
        </Card>

        <Card className="@container/stats">
          <CardHeader>
            <CardDescription>Projects Completed</CardDescription>
            <CardTitle className="text-2xl font-semibold">{builder.projects_count || 0}</CardTitle>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="text-muted-foreground">View all projects in the Projects tab</div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

