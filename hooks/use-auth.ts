"use client"

import { useContext } from "react"
import { AuthContext } from "@/components/providers/auth-providers"

// Use the exported AuthContext
export const useAuth = () => useContext(AuthContext)

