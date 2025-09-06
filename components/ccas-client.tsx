"use client"

import { useState, useMemo } from "react"
import { Search, Clock, User, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import type { CCA } from "@/app/ccas/page"
import { formatYearGroups } from "@/app/ccas/page"

interface CCAsClientProps {
  initialCcas: CCA[]
  categories: string[]
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

export function CCAsClient({ initialCcas, categories }: CCAsClientProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

  const filteredCCAs = useMemo(() => {
    let filtered = initialCcas

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (cca) =>
          cca.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (cca.description && cca.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (cca.staff_members && cca.staff_members.toLowerCase().includes(searchQuery.toLowerCase())) ||
          cca.category.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter((cca) => cca.category === selectedCategory)
    }

    return filtered
  }, [initialCcas, searchQuery, selectedCategory])

  return (
    <>
      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search CCAs..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {(searchQuery || selectedCategory !== "All") && (
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            {filteredCCAs.length} {filteredCCAs.length === 1 ? "result" : "results"} found
            {searchQuery && ` for "${searchQuery}"`}
            {selectedCategory !== "All" && ` in ${selectedCategory}`}
          </p>
        </div>
      )}

      {/* CCA Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCCAs.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground">
              {searchQuery || selectedCategory !== "All"
                ? "No CCAs match your search criteria. Try adjusting your filters."
                : "No CCAs available at this time."}
            </p>
            {(searchQuery || selectedCategory !== "All") && (
              <Button
                variant="outline"
                className="mt-4 bg-transparent"
                onClick={() => {
                  setSearchQuery("")
                  setSelectedCategory("All")
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>
        ) : (
          filteredCCAs.map((cca) => (
            <Card key={cca.id} className="hover:shadow-lg transition-shadow">
              {cca.image_url && (
                <div className="aspect-video relative overflow-hidden rounded-t-lg">
                  <img
                    src={cca.image_url || "/placeholder.svg"}
                    alt={cca.name}
                    className="w-full h-full object-cover"
                  />
                  <Badge
                    className="absolute top-3 right-3"
                    variant={
                      cca.category === "Sports & Recreation"
                        ? "default"
                        : cca.category === "Arts & Creative"
                          ? "secondary"
                          : cca.category === "STEM & Engineering"
                            ? "destructive"
                            : "outline"
                    }
                  >
                    {cca.category}
                  </Badge>
                </div>
              )}

              <CardHeader>
                <CardTitle className="text-xl">{cca.name}</CardTitle>
                <CardDescription className="line-clamp-3">{cca.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-3">
                {cca.staff_members && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <User className="h-4 w-4 mr-2" />
                    <span>{cca.staff_members}</span>
                  </div>
                )}

                {cca.year_groups && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>Year Groups: {formatYearGroups(cca.year_groups)}</span>
                  </div>
                )}

                {cca.meeting_location && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{cca.meeting_location}</span>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <Button asChild className="flex-1">
                    <Link href={`/ccas/${nameToSlug(cca.name)}`}>View Details</Link>
                  </Button>
                  <Button asChild variant="outline" className="flex-1 bg-transparent">
                    <Link href="https://tinyurl.com/signup-cca" target="_blank">
                      Join
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </>
  )
}
