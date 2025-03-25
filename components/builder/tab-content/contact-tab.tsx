import { IconMail, IconMapPin } from "@tabler/icons-react"

interface ContactTabProps {
  email?: string
  location?: string
}

export function ContactTab({ email, location }: ContactTabProps) {
  const hasContactInfo = email || location

  return (
    <div className="space-y-4">
      {hasContactInfo ? (
        <>
          {email && (
            <div className="flex items-center gap-2">
              <IconMail className="h-5 w-5 text-muted-foreground" />
              <span>{email}</span>
            </div>
          )}
          {location && (
            <div className="flex items-center gap-2">
              <IconMapPin className="h-5 w-5 text-muted-foreground" />
              <span>{location}</span>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-4">
          <p className="text-muted-foreground">No contact information available</p>
        </div>
      )}
    </div>
  )
}

