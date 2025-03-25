"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { createBuild } from "./actions"

interface BuildFormProps {
  userId: string
}

export function BuildForm({ userId }: BuildFormProps) {
  const [buildType, setBuildType] = useState<string>("")

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Build</CardTitle>
        <CardDescription>Add details about your new construction project</CardDescription>
      </CardHeader>
      <form action={createBuild}>
        <CardContent className="space-y-6">
          {/* Build Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Build Name</Label>
            <Input id="name" name="name" placeholder="Enter build name" required />
          </div>

          {/* Build Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Build Status</Label>
            <Select name="status" defaultValue="planning">
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="planning">Planning</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="on-hold">On Hold</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Build View (Public/Private) */}
          <div className="space-y-2">
            <Label>Build View</Label>
            <RadioGroup defaultValue="public" name="visibility">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="public" id="public" />
                <Label htmlFor="public">Public</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="private" id="private" />
                <Label htmlFor="private">Private</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Build Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Build Description</Label>
            <Textarea id="description" name="description" placeholder="Describe your build project" rows={4} required />
          </div>

          {/* Build Type */}
          <div className="space-y-2">
            <Label htmlFor="buildType">Build Type</Label>
            <Select name="buildType" defaultValue="" onValueChange={(value) => setBuildType(value)}>
              <SelectTrigger id="buildType">
                <SelectValue placeholder="Select build type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vehicle">Vehicle</SelectItem>
                <SelectItem value="construction">Construction</SelectItem>
                <SelectItem value="craft">Craft</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Conditional Vehicle Fields */}
          {buildType === "vehicle" && (
            <div className="space-y-4 border rounded-md p-4 bg-muted/20">
              <h3 className="font-medium">Vehicle Details</h3>
              <div className="space-y-2">
                <Label htmlFor="make">Make</Label>
                <Input id="make" name="make" placeholder="e.g. Toyota" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="model">Model</Label>
                <Input id="model" name="model" placeholder="e.g. Corolla" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  name="year"
                  placeholder="e.g. 2023"
                  type="number"
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  required
                />
              </div>
            </div>
          )}

          {/* Construction Field */}
          {buildType === "construction" && (
            <div className="space-y-2">
              <Label htmlFor="constructionType">Construction Type</Label>
              <Select name="constructionType" defaultValue="residential">
                <SelectTrigger id="constructionType">
                  <SelectValue placeholder="Select construction type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="residential">Residential</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                  <SelectItem value="industrial">Industrial</SelectItem>
                  <SelectItem value="infrastructure">Infrastructure</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Craft Field */}
          {buildType === "craft" && (
            <div className="space-y-2">
              <Label htmlFor="craftType">Craft Type</Label>
              <Select name="craftType" defaultValue="woodworking">
                <SelectTrigger id="craftType">
                  <SelectValue placeholder="Select craft type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="woodworking">Woodworking</SelectItem>
                  <SelectItem value="metalworking">Metalworking</SelectItem>
                  <SelectItem value="electronics">Electronics</SelectItem>
                  <SelectItem value="textiles">Textiles</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between mt-6">
          <Button type="button" variant="outline" asChild>
            <Link href={`/builder/${userId}`}>Cancel</Link>
          </Button>
          <Button type="submit">Create Build</Button>
        </CardFooter>
      </form>
    </Card>
  )
}

