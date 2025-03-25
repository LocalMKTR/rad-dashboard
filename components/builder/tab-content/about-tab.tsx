import { Badge } from "@/components/ui/badge"

interface AboutTabProps {
  description: string
  skills: string[]
}

export function AboutTab({ description, skills }: AboutTabProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-medium mb-2">Bio</h3>
        <p className="text-muted-foreground">{description || "No bio available."}</p>
      </div>
      <div>
        <h3 className="font-medium mb-2">Skills</h3>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <Badge key={index} variant="secondary">
              {skill}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )
}

