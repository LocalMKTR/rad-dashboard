"use client"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface LogoutConfirmationProps {
  className?: string
  onCancel: () => void
  onLogout: () => void
}

export function LogoutConfirmation({ className, onCancel, onLogout }: LogoutConfirmationProps) {
  return (
    <div className={cn("grid gap-4", className)}>
      <h1 className="text-2xl font-medium text-center">Log out</h1>
      <p className="text-center">Are you sure you want to log out?</p>
      <div className="flex justify-center gap-4 mt-2 ">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="destructive" onClick={onLogout}>
          Log out
        </Button>
      </div>
    </div>
  )
}

