import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ProfileHeader } from "./profile-header"
import { ProfileTabs } from "./profile-tabs"
import { StatsCard } from "./stats-card"
import { AboutTab } from "./tab-content/about-tab"
import { BuildsTab } from "./tab-content/builds-tab"
import { ContactTab } from "./tab-content/contact-tab"
import { getUserBasicData } from "@/components/auth/user-info"

interface Builder {
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

interface BuilderProfileCardProps {
  builder: Builder
}

export async function BuilderProfileCard({ builder }: BuilderProfileCardProps) {
  // Get current user data to check if this is the user's own profile
  const { id: userId } = await getUserBasicData()
  const isCurrentUser = userId === builder.id

  // Default skills if none provided
  const builderSkills = builder.skills || ["Construction", "Design", "Project Management"]

  // Pre-render the tab contents as server components
  const aboutTab = <AboutTab description={builder.description} skills={builderSkills} />
  const buildsTab = <BuildsTab isCurrentUser={isCurrentUser} builderId={builder.id} />
  const contactTab = <ContactTab email={builder.email} location={builder.location} />

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {/* Main Profile Card */}
      <Card className="md:col-span-2 @container/card">
        <CardHeader className="pb-2">
          <ProfileHeader name={builder.name} avatarUrl={builder.avatar_url} />
        </CardHeader>
        <CardContent>
          <ProfileTabs aboutTab={aboutTab} buildsTab={buildsTab} contactTab={contactTab} />
        </CardContent>
      </Card>

      {/* Stats Card */}
      <StatsCard
        createdAt={builder.created_at}
        updatedAt={builder.updated_at}
        projectsCount={builder.projects_count || 0}
      />
    </div>
  )
}

