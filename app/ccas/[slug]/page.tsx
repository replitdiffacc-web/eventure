"use client"

import { useEffect, useState } from "react"
import { ArrowLeft, User, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Navigation from "@/components/navigation"
import Link from "next/link"
import { notFound } from "next/navigation"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"
import { sampleActivities } from "@/lib/sample-data"

interface CCA {
  id: string
  name: string
  description: string
  category: string
  year_groups: string
  selection_method: string
  staff_members: string
  learning_objectives?: string
  meeting_location?: string
  image_url?: string
  logo_url?: string
  core_committee_signup_url?: string
  contact_email?: string
  slug?: string
}

interface PageProps {
  params: {
    slug: string
  }
}

function nameToSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/^ss\s+/i, "") // Remove "SS " prefix (case insensitive)
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/[^a-z0-9-]/g, "") // Remove special characters
    .replace(/-+/g, "-") // Replace multiple hyphens with single
    .replace(/^-|-$/g, "") // Remove leading/trailing hyphens
}

function slugToNamePattern(slug: string): string {
  // Convert slug back to a pattern that can match the original name
  const withSpaces = slug.replace(/-/g, " ")
  return `%${withSpaces}%`
}

export default function CCADetailPage({ params }: PageProps) {
  const [cca, setCca] = useState<CCA | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    async function fetchCCA() {
      try {
        if (!isSupabaseConfigured) {
          const fallback = sampleActivities.find((activity) => activity.slug === params.slug)
          if (fallback) {
            setCca({
              ...fallback,
              description: fallback.description,
              year_groups: fallback.year_groups,
              staff_members: fallback.staff_members ?? "",
              category: fallback.category,
              selection_method: fallback.selection_method ?? "",
            })
          }
          setLoading(false)
          return
        }

        const namePattern = slugToNamePattern(params.slug)
        const { data, error } = await supabase
          .from("activities")
          .select("*, learning_objectives, meeting_location")
          .ilike("name", namePattern)

        if (error) {
          console.error("Error fetching CCA:", error)
          const fallback = sampleActivities.find((activity) => activity.slug === params.slug)
          if (fallback) {
            setCca({
              ...fallback,
              description: fallback.description,
              year_groups: fallback.year_groups,
              staff_members: fallback.staff_members ?? "",
              category: fallback.category,
              selection_method: fallback.selection_method ?? "",
            })
          }
          return
        }

        const matchingCca = data?.find((cca) => nameToSlug(cca.name) === params.slug)

        if (matchingCca) {
          setCca(matchingCca)
        } else {
          const fallback = sampleActivities.find((activity) => activity.slug === params.slug)
          if (fallback) {
            setCca({
              ...fallback,
              description: fallback.description,
              year_groups: fallback.year_groups,
              staff_members: fallback.staff_members ?? "",
              category: fallback.category,
              selection_method: fallback.selection_method ?? "",
            })
          }
        }
      } catch (error) {
        console.error("Error:", error)
        const fallback = sampleActivities.find((activity) => activity.slug === params.slug)
        if (fallback) {
          setCca({
            ...fallback,
            description: fallback.description,
            year_groups: fallback.year_groups,
            staff_members: fallback.staff_members ?? "",
            category: fallback.category,
            selection_method: fallback.selection_method ?? "",
          })
        }
      } finally {
        setLoading(false)
      }
    }

    fetchCCA()
  }, [params.slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    )
  }

  if (!cca) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button asChild variant="ghost" className="mb-6">
          <Link href="/ccas">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to CCAs
          </Link>
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {cca.image_url && (
              <div className="aspect-video relative overflow-hidden rounded-lg">
                <img src={cca.image_url || "/placeholder.svg"} alt={cca.name} className="w-full h-full object-cover" />
                <Badge className="absolute top-4 right-4 text-lg px-3 py-1" variant="outline">
                  {cca.category}
                </Badge>
              </div>
            )}

            {/* Title and Description */}
            <div>
              <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">{cca.name}</h1>
              <p className="text-lg text-muted-foreground leading-relaxed">{cca.description}</p>

              {cca.learning_objectives && (
                <div className="mt-6">
                  <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">Learning Objectives</h2>
                  <p className="text-muted-foreground leading-relaxed">{cca.learning_objectives}</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Join CCA Card */}
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Join {cca.name}</CardTitle>
                <CardDescription>Open for registration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center text-sm">
                  <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-muted-foreground">Year Groups: {cca.year_groups?.replace(/,/g, ", ")}</span>
                </div>

                <Button asChild className="w-full" size="lg">
                  <a href="https://tinyurl.com/signup-cca" target="_blank" rel="noopener noreferrer">
                    Join CCA
                  </a>
                </Button>

                {cca.core_committee_signup_url && (
                  <Button asChild variant="outline" className="w-full bg-transparent">
                    <a href={cca.core_committee_signup_url} target="_blank" rel="noopener noreferrer">
                      Core Committee Signup
                    </a>
                  </Button>
                )}

                <p className="text-xs text-muted-foreground text-center">
                  Registration requires parent/guardian consent
                </p>
              </CardContent>
            </Card>

            {/* Details Card */}
            <Card>
              <CardHeader>
                <CardTitle>Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {cca.staff_members && (
                    <div className="flex items-start">
                      <User className="h-4 w-4 mr-3 mt-1 text-muted-foreground" />
                      <div>
                        <div className="font-medium">Staff</div>
                        <div className="text-sm text-muted-foreground">{cca.staff_members}</div>
                      </div>
                    </div>
                  )}

                  {cca.year_groups && (
                    <div className="flex items-start">
                      <Users className="h-4 w-4 mr-3 mt-1 text-muted-foreground" />
                      <div>
                        <div className="font-medium">Year Groups</div>
                        <div className="text-sm text-muted-foreground">{cca.year_groups.replace(/,/g, ", ")}</div>
                      </div>
                    </div>
                  )}

                  {cca.meeting_location && (
                    <div className="flex items-start">
                      <div>
                        <div className="font-medium">Meeting Location</div>
                        <div className="text-sm text-muted-foreground">{cca.meeting_location}</div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
