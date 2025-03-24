"use client"
import { useTransition } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { signOutAction } from "./auth-actions"

interface LogoutConfirmationProps {
  className?: string
  onCancel: () => void
  onLogout: () => void
}

export function LogoutConfirmation({ className, onCancel, onLogout }: LogoutConfirmationProps) {
  const [isPending, startTransition] = useTransition()

  const handleLogout = () => {
    // First call the onLogout prop to close dialogs/drawers
    onLogout()

    // Then start the server action in a transition
    startTransition(async () => {
      try {
        await signOutAction()
        // Note: The redirect happens in the server action,
        // so we don't need to do anything else here
      } catch (error) {
        console.error("Error signing out:", error)
        // If there's an error with the server action,
        // we could handle it here (show a toast, etc.)
      }
    })
  }

  return (
    <div className={cn("grid gap-4", className)}>
      <h1 className="text-2xl font-medium text-center">Log out</h1>
      <p className="text-center">Are you sure you want to log out?</p>
      <div className="flex justify-center gap-4 mt-2">
        <Button variant="outline" onClick={onCancel} disabled={isPending}>
          Cancel
        </Button>
        <Button variant="destructive" onClick={handleLogout} disabled={isPending}>
          {isPending ? "Logging out..." : "Log out"}
        </Button>
      </div>
    </div>
  )
}

