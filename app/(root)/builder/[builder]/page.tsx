import type React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

import { getUserBasicData } from "@/components/auth/user-info"
import { fetchBuilderById } from "../../builder/[builder]/builderactions"
import { BuilderProfileCard } from "@/components/builder/builder-profile-card"

interface BuildDetailPageProps {
  params: { builder: string }
  // searchParams: { tab?: string; comment?: string }
}

export default async function BuilderDetailPage({ params }: BuildDetailPageProps) {
  // Await the params object before destructuring
  const resolvedParams = await Promise.resolve(params)
  const builderId = resolvedParams.builder

  const builder = await fetchBuilderById(builderId)
  const builderfirst = builder?.shift()
  // console.log("this is Builder First Data:",builderfirst)

  const { id: userId, email: userEmail, name: userName, isAuthenticated } = await getUserBasicData()
  //console.log("This is the getUserBasicData", getUserBasicData)
  //console.log("This is the Authinfo", isAuthenticated)

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
                {builderfirst ? (
                  <BuilderProfileCard
                    builder={{
                      id: builderfirst.id,
                      name: builderfirst.name,
                      description: builderfirst.description,
                      avatar_url: builderfirst.avatar_url,
                      created_at: builderfirst.created_at,
                      updated_at: builderfirst.updated_at,
                      // You can add more fields here as they become available
                      projects_count: 0, // Placeholder
                    }}
                  />
                ) : (
                  <div className="text-center p-1">
                    <h2 className="text-2xl font-semibold">Builder not found</h2>
                    <p className="text-muted-foreground mt-2">
                      The builder you&apos;re looking for doesn&apos;t exist or has been removed.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
