
import { AppSidebar } from "@/components/app-sidebar"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

import data from "@/app/dashboard/data.json"


import { getUserBasicData } from "@/components/auth/user-info"
import { fetchBuilderById } from "../../builder/[builder]/builderactions"
interface BuildDetailPageProps {
  params: { builder: string }
  searchParams: { tab?: string; comment?: string }
}

export default async function BuilderDetailPage({ params, searchParams }: BuildDetailPageProps) {
  const builder = await fetchBuilderById(params.builder)
  const builderfirst = builder?.shift()
  console.log("this is Builder First Data:",builderfirst)
  const builderdescription = builderfirst?.description
  const buildername = builderfirst?.name
  const builderavatar = builderfirst?.avatar
  console.log(searchParams)

  const { id: userId, email: userEmail, name: userName, isAuthenticated } = await getUserBasicData()
  console.log("This is the getUserBasicData", getUserBasicData)
  console.log("This is the Authinfo", isAuthenticated)
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset"        
      userData={{
          id: userId,
          name: userName || "User",
          email: userEmail || "No email",
          isAuthenticated,
        }}/>
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="p-4">
      <p>builder</p>
      <p>{builderdescription}</p>
      <p>{buildername}</p>
      <p>{builderavatar}</p>
    </div>

              
              <SectionCards />
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
              </div>
              <DataTable data={data} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
