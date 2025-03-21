import type { Message } from "@/components/auth/auth-actions"
import { cn } from "@/lib/utils"

export type { Message }

export function AuthFormMessage({ message, className }: { message: Message; className?: string }) {
  if (!message) return null

  // Use message.message if available, otherwise use message.text
  const displayText = message.message || message.text

  return (
    <div
      className={cn(
        "text-sm p-2 rounded-md mt-2",
        message.type === "error" ? "bg-destructive/10 text-destructive" : "bg-green-100 text-green-800",
        className,
      )}
    >
      {displayText}
    </div>
  )
}

