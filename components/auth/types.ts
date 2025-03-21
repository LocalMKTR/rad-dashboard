export type AuthMode = "login" | "signup" | "reset" | "logout"

export interface AuthFormProps {
  className?: string
  onModeChange: (mode: AuthMode) => void
  onSuccess?: () => void
}

