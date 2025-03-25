import Image from "next/image"
import { IconBuildingCommunity } from "@tabler/icons-react"
import { CardTitle, CardDescription } from "@/components/ui/card"

interface ProfileHeaderProps {
  name: string
  avatarUrl?: string
}

export function ProfileHeader({ name, avatarUrl }: ProfileHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
      <div className="relative h-24 w-24 rounded-xl overflow-hidden border-4 border-background shadow-sm">
        {avatarUrl ? (
          <Image src={avatarUrl || "/placeholder.svg"} alt={name} fill sizes="96px" priority className="object-cover" />
        ) : (
          <div className="w-full h-full bg-primary/10 flex items-center justify-center">
            <span className="text-3xl font-bold text-primary">{name.charAt(0)}</span>
          </div>
        )}
      </div>
      <div>
        <CardTitle className="text-2xl sm:text-3xl">{name}</CardTitle>
        <CardDescription className="text-base mt-1">
          <div className="flex items-center gap-2">
            <IconBuildingCommunity className="h-4 w-4" />
            <span>Professional Builder</span>
          </div>
        </CardDescription>
      </div>
    </div>
  )
}

