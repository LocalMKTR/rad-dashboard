import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { ActiveThemeProvider } from "@/components/active-theme"
import { cookies } from "next/headers"
import { cn } from "@/lib/utils"
import { createClient } from "@/supabase/server"
import { AuthProvider } from "@/components/providers/auth-providers"

const META_THEME_COLORS = {
  light: "#ffffff",
  dark: "#09090b",
}

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "BuildTracker 5.0",
  description: "Track and share your builds with the community",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: META_THEME_COLORS.light },
    { media: "(prefers-color-scheme: dark)", color: META_THEME_COLORS.dark },
  ],
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Safely get the active theme from cookies
  let activeThemeValue
  let isScaled = false

  try {
    const cookieStore = await cookies()
    const activeThemeCookie = cookieStore.get("active_theme")
    activeThemeValue = activeThemeCookie?.value
    isScaled = activeThemeValue?.endsWith("-scaled") || false
  } catch (error) {
    console.error("Error reading cookies:", error)
    // Fallback to no specific theme if there's an error
  }

  // Get the current user
  let userId = null
  let userEmail = null

  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) {
      userId = user.id
      // Fix: Convert undefined to null using nullish coalescing
      userEmail = user.email ?? null
      console.log("Authenticated user:", userId)
    } else {
      console.log("No authenticated user")
    }
  } catch (error) {
    console.error("Error fetching user:", error)
  }

  return (
    <html lang="en" suppressHydrationWarning className={cn(geistSans.variable, geistMono.variable)}>
      <body
        className={cn(
          "bg-background overscroll-none font-sans antialiased",
          activeThemeValue ? `theme-${activeThemeValue}` : "",
          isScaled ? "theme-scaled" : "",
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange enableColorScheme>
          <ActiveThemeProvider initialTheme={activeThemeValue}>
            <AuthProvider initialUserId={userId} initialUserEmail={userEmail}>
              {children}
            </AuthProvider>
          </ActiveThemeProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

