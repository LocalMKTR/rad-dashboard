"use client"
import { useEffect, useState } from "react"
import { IconCreditCard, IconDotsVertical, IconLogout, IconNotification, IconUserCircle } from "@tabler/icons-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar"
import { createClient } from "@/supabase/client"

interface UserDropdownProps {
  user?: {
    name?: string
    email?: string
    avatar?: string
  }
  onLogoutClick: () => void
}

export function UserDropdown({ user: initialUser, onLogoutClick }: UserDropdownProps) {
  const { isMobile } = useSidebar()
  const [user, setUser] = useState(
    initialUser || {
      name: "Guest User",
      email: "guest@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
  )
  const [isLoading, setIsLoading] = useState(!initialUser)

  // Fetch user data from Supabase if not provided
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true)
        const supabase = createClient()
        const {
          data: { user: supabaseUser },
        } = await supabase.auth.getUser()

        if (supabaseUser) {
          // Get user profile data if available
          const { data: profile } = await supabase.from("profiles").select("*").eq("id", supabaseUser.id).single()

          setUser({
            name:
              profile?.display_name ||
              profile?.full_name ||
              supabaseUser.user_metadata?.full_name ||
              supabaseUser.email?.split("@")[0] ||
              "User",
            email: supabaseUser.email || "No email",
            avatar:
              profile?.avatar_url || supabaseUser.user_metadata?.avatar_url || "/placeholder.svg?height=32&width=32",
          })
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (!initialUser) {
      fetchUserData()
    }
  }, [initialUser])

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  const initials = user.name ? getInitials(user.name) : "U"

  return (
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton
            size="lg"
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{isLoading ? "Loading..." : user.name}</span>
              <span className="text-muted-foreground truncate text-xs">{isLoading ? "..." : user.email}</span>
            </div>
            <IconDotsVertical className="ml-auto size-4" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
          side={isMobile ? "bottom" : "right"}
          align="end"
          sideOffset={4}
        >
          <DropdownMenuLabel className="p-0 font-normal">
            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{isLoading ? "Loading..." : user.name}</span>
                <span className="text-muted-foreground truncate text-xs">{isLoading ? "..." : user.email}</span>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <IconUserCircle className="mr-2 h-4 w-4" />
              Account
            </DropdownMenuItem>
            <DropdownMenuItem>
              <IconCreditCard className="mr-2 h-4 w-4" />
              Billing
            </DropdownMenuItem>
            <DropdownMenuItem>
              <IconNotification className="mr-2 h-4 w-4" />
              Notifications
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault()
              onLogoutClick()
            }}
          >
            <IconLogout className="mr-2 h-4 w-4" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  )
}

