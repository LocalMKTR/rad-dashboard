"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSearchParams } from "next/navigation"
import { useEffect, useState, type ReactNode } from "react"

interface ProfileTabsProps {
  aboutTab: ReactNode
  buildsTab: ReactNode
  contactTab: ReactNode
  buildsCount?: number
}

export function ProfileTabs({ aboutTab, buildsTab, contactTab, buildsCount = 0 }: ProfileTabsProps) {
  const searchParams = useSearchParams()
  const tabParam = searchParams.get("tab")
  const [activeTab, setActiveTab] = useState("about")

  // Set the active tab based on the URL parameter
  useEffect(() => {
    if (tabParam && ["about", "Builds", "contact"].includes(tabParam)) {
      setActiveTab(tabParam)
    }
  }, [tabParam])

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-4">
        <TabsTrigger value="about">About</TabsTrigger>
        <TabsTrigger value="Builds">Builds {buildsCount > 0 && `(${buildsCount})`}</TabsTrigger>
        <TabsTrigger value="contact">Contact</TabsTrigger>
      </TabsList>
      <TabsContent value="about">{aboutTab}</TabsContent>
      <TabsContent value="Builds">{buildsTab}</TabsContent>
      <TabsContent value="contact">{contactTab}</TabsContent>
    </Tabs>
  )
}