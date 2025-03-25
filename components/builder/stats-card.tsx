import { IconCalendarEvent } from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDate, getMembershipDuration } from "@/lib/date-utils"

interface StatsCardProps {
  createdAt: string
  updatedAt?: string
  projectsCount: number
}

export function StatsCard({ createdAt, updatedAt, projectsCount }: StatsCardProps) {
  return (
    <div className="grid gap-6">
      <Card className="@container/stats">
        <CardHeader>
          <CardDescription>Member Since</CardDescription>
          <CardTitle className="text-2xl font-semibold">{formatDate(createdAt)}</CardTitle>
          <CardAction>
            <Badge variant="outline">{getMembershipDuration(createdAt)}</Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="flex gap-2 font-medium">
            <IconCalendarEvent className="size-4" />
            Active member
          </div>
          <div className="text-muted-foreground">Last updated: {updatedAt ? formatDate(updatedAt) : "N/A"}</div>
        </CardFooter>
      </Card>

      <Card className="@container/stats">
        <CardHeader>
          <CardDescription>Projects Completed</CardDescription>
          <CardTitle className="text-2xl font-semibold">{projectsCount}</CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-muted-foreground">View all projects in the Projects tab</div>
        </CardFooter>
      </Card>
    </div>
  )
}

