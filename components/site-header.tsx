"use client"
import { Separator } from "@/components/ui/separator"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { ModeToggle } from "./ui/mode-toggle"
import { ThemeSelector } from "./theme-selector"
import { NavUser } from "./nav-user"
import { useEffect, useState } from "react"
import { createClient } from "@/supabase/client"
import { Skeleton } from "./ui/skeleton"

export function SiteHeader() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Check if user is logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true)
        const supabase = createClient()
        const {
          data: { session },
        } = await supabase.auth.getSession()
        setIsLoggedIn(!!session)
      } catch (error) {
        console.error("Error checking authentication:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const handleLoginStatusChange = (status: boolean) => {
    setIsLoggedIn(status)
  }

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
        <h1 className="text-base font-medium">Documents</h1>
        <div className="ml-auto flex items-center gap-4">
          <ThemeSelector />
          <ModeToggle />
          <Separator orientation="vertical" className="h-6" />
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          ) : (
            <SidebarProvider>
              <NavUser isLoggedIn={isLoggedIn} onLoginStatusChange={handleLoginStatusChange} />
            </SidebarProvider>
          )}
        </div>
      </div>
    </header>
  )
}

