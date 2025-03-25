import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"

interface BuildsTabProps {
  isCurrentUser: boolean
}

export function BuildsTab({ isCurrentUser }: BuildsTabProps) {
  return (
    <div className="space-y-6">
      {isCurrentUser && (
        <div className="flex justify-center">
          <Button asChild>
            <Link href="/build/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create New Build
            </Link>
          </Button>
        </div>
      )}

      <div className="text-center py-8">
        <p className="text-muted-foreground">No Builds available to display</p>
      </div>
    </div>
  )
}

