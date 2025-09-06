"use client"

import { useState, useMemo } from "react"
import { Search, Filter, Calendar, MapPin, Users, Clock, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import Navigation from "@/components/navigation"
import Link from "next/link"

// Mock data combining all content types
const allContent = [
  // CCAs
  {
    id: "cca-1",
    type: "cca",
    title: "Basketball Club",
    description: "Develop basketball skills through training and competitive matches. Open to all skill levels.",
    category: "Sports",
    teacher: "Mr. Johnson",
    schedule: "Tuesdays & Thursdays, 3:30-5:00 PM",
    location: "Sports Complex",
    members: 24,
    maxMembers: 30,
    tags: ["basketball", "sports", "team", "competition"],
    href: "/ccas/1",
  },
  {
    id: "cca-2",
    type: "cca",
    title: "Drama Club",
    description: "Express creativity through theatrical performances, script writing, and stage production.",
    category: "Arts",
    teacher: "Ms. Chen",
    schedule: "Wednesdays & Fridays, 3:00-5:30 PM",
    location: "Auditorium",
    members: 18,
    maxMembers: 25,
    tags: ["drama", "theater", "performance", "arts"],
    href: "/ccas/2",
  },
  {
    id: "cca-3",
    type: "cca",
    title: "Robotics Club",
    description: "Build and program robots for competitions. Learn engineering and coding skills.",
    category: "STEM",
    teacher: "Mr. Patel",
    schedule: "Mondays & Wednesdays, 3:30-5:30 PM",
    location: "Computer Lab 2",
    members: 15,
    maxMembers: 20,
    tags: ["robotics", "programming", "engineering", "technology"],
    href: "/ccas/3",
  },
  // Events
  {
    id: "event-1",
    type: "event",
    title: "Science Fair 2024",
    description: "Annual science fair showcasing student projects and innovations.",
    category: "Academic",
    date: "2024-03-15",
    time: "9:00 AM - 4:00 PM",
    location: "Main Hall",
    organizer: "Science Department",
    capacity: 200,
    rsvpCount: 145,
    tags: ["science", "fair", "projects", "innovation"],
    href: "/events/1",
  },
  {
    id: "event-2",
    type: "event",
    title: "Basketball Championship Finals",
    description: "Final match of the inter-house basketball tournament.",
    category: "Sports",
    date: "2024-03-20",
    time: "3:00 PM - 5:00 PM",
    location: "Sports Complex",
    organizer: "Sports Department",
    capacity: 300,
    rsvpCount: 287,
    tags: ["basketball", "championship", "tournament", "sports"],
    href: "/events/2",
  },
  {
    id: "event-3",
    type: "event",
    title: "Spring Drama Performance",
    description: "Spring theatrical performance by the Drama Club.",
    category: "Arts",
    date: "2024-03-25",
    time: "7:00 PM - 9:00 PM",
    location: "Auditorium",
    organizer: "Drama Club",
    capacity: 150,
    rsvpCount: 98,
    tags: ["drama", "performance", "theater", "spring"],
    href: "/events/3",
  },
  // Committees
  {
    id: "committee-1",
    type: "committee",
    title: "Student Council",
    description: "Represents student voice in school decisions and organizes school-wide events and initiatives.",
    category: "Leadership",
    openPositions: 2,
    applicationDeadline: "2024-04-15",
    members: 4,
    tags: ["leadership", "student council", "governance", "events"],
    href: "/committees/1",
  },
  {
    id: "committee-2",
    type: "committee",
    title: "Environmental Committee",
    description: "Promotes sustainability initiatives and environmental awareness throughout the school.",
    category: "Service",
    openPositions: 4,
    applicationDeadline: "2024-04-10",
    members: 3,
    tags: ["environment", "sustainability", "service", "green"],
    href: "/committees/3",
  },
  {
    id: "committee-3",
    type: "committee",
    title: "Technology Committee",
    description: "Supports school technology initiatives and assists with digital learning platforms.",
    category: "Technology",
    openPositions: 4,
    applicationDeadline: "2024-04-18",
    members: 3,
    tags: ["technology", "digital", "support", "learning"],
    href: "/committees/6",
  },
]

const contentTypes = ["All", "CCAs", "Events", "Committees"]
const categories = [
  "All",
  "Academic",
  "Sports",
  "Arts",
  "STEM",
  "Leadership",
  "Service",
  "Technology",
  "Community Service",
]
const locations = [
  "All",
  "Main Hall",
  "Sports Complex",
  "Auditorium",
  "Computer Lab 2",
  "Library",
  "Art Room",
  "Gymnasium",
]

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState("All")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedLocation, setSelectedLocation] = useState("All")
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [activeFilters, setActiveFilters] = useState<string[]>([])

  // Filter and search logic
  const filteredResults = useMemo(() => {
    let results = allContent

    // Filter by search query
    if (searchQuery.trim()) {
      results = results.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    }

    // Filter by content type
    if (selectedType !== "All") {
      const typeMap = { CCAs: "cca", Events: "event", Committees: "committee" }
      results = results.filter((item) => item.type === typeMap[selectedType as keyof typeof typeMap])
    }

    // Filter by category
    if (selectedCategory !== "All") {
      results = results.filter((item) => item.category === selectedCategory)
    }

    // Filter by location
    if (selectedLocation !== "All") {
      results = results.filter((item) => "location" in item && item.location === selectedLocation)
    }

    return results
  }, [searchQuery, selectedType, selectedCategory, selectedLocation])

  const clearAllFilters = () => {
    setSearchQuery("")
    setSelectedType("All")
    setSelectedCategory("All")
    setSelectedLocation("All")
    setActiveFilters([])
  }

  const removeFilter = (filterType: string) => {
    switch (filterType) {
      case "type":
        setSelectedType("All")
        break
      case "category":
        setSelectedCategory("All")
        break
      case "location":
        setSelectedLocation("All")
        break
    }
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (selectedType !== "All") count++
    if (selectedCategory !== "All") count++
    if (selectedLocation !== "All") count++
    return count
  }

  const renderResultCard = (item: any) => {
    const getTypeColor = (type: string) => {
      switch (type) {
        case "cca":
          return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
        case "event":
          return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
        case "committee":
          return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
        default:
          return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
      }
    }

    return (
      <Card key={item.id} className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge className={getTypeColor(item.type)}>{item.type.toUpperCase()}</Badge>
                <Badge variant="outline">{item.category}</Badge>
              </div>
              <CardTitle className="text-xl">{item.title}</CardTitle>
              <CardDescription className="mt-2">{item.description}</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {/* Type-specific information */}
          {item.type === "cca" && (
            <div className="space-y-2">
              <div className="flex items-center text-sm text-muted-foreground">
                <Users className="h-4 w-4 mr-2" />
                <span>
                  {item.members}/{item.maxMembers} members
                </span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="h-4 w-4 mr-2" />
                <span>{item.schedule}</span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mr-2" />
                <span>{item.location}</span>
              </div>
            </div>
          )}

          {item.type === "event" && (
            <div className="space-y-2">
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mr-2" />
                <span>
                  {new Date(item.date).toLocaleDateString()} at {item.time}
                </span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mr-2" />
                <span>{item.location}</span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Users className="h-4 w-4 mr-2" />
                <span>
                  {item.rsvpCount}/{item.capacity} registered
                </span>
              </div>
            </div>
          )}

          {item.type === "committee" && (
            <div className="space-y-2">
              <div className="flex items-center text-sm text-muted-foreground">
                <Users className="h-4 w-4 mr-2" />
                <span>{item.members} current members</span>
              </div>
              <div className="flex items-center text-sm text-green-600">
                <Calendar className="h-4 w-4 mr-2" />
                <span>{item.openPositions} positions open</span>
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <Button asChild className="flex-1">
              <Link href={item.href}>View Details</Link>
            </Button>
            {item.type === "cca" && (
              <Button variant="outline" className="flex-1 bg-transparent">
                Join
              </Button>
            )}
            {item.type === "event" && (
              <Button variant="outline" className="flex-1 bg-transparent">
                RSVP
              </Button>
            )}
            {item.type === "committee" && (
              <Button variant="outline" className="flex-1 bg-transparent">
                Apply
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Header */}
      <section className="bg-gradient-to-r from-indigo-50 to-cyan-50 dark:from-indigo-950 dark:to-cyan-950 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-balance mb-4 text-gray-900 dark:text-gray-100">
              Search & Discover
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 text-pretty">
              Find CCAs, events, and committees that match your interests
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Search for CCAs, events, committees..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-3 text-lg"
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Filter className="h-5 w-5 mr-2" />
                    Filters
                    {getActiveFiltersCount() > 0 && (
                      <Badge variant="secondary" className="ml-2">
                        {getActiveFiltersCount()}
                      </Badge>
                    )}
                  </CardTitle>
                  {getActiveFiltersCount() > 0 && (
                    <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                      Clear All
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Content Type Filter */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">Content Type</Label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {contentTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                {/* Category Filter */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">Category</Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue />
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

                <Separator />

                {/* Location Filter */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">Location</Label>
                  <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((location) => (
                        <SelectItem key={location} value={location}>
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Advanced Filters Toggle */}
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                >
                  {showAdvancedFilters ? "Hide" : "Show"} Advanced Filters
                </Button>

                {showAdvancedFilters && (
                  <div className="space-y-4 pt-4 border-t">
                    <div>
                      <Label className="text-sm font-medium mb-3 block">Availability</Label>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="open-spots" />
                          <Label htmlFor="open-spots" className="text-sm">
                            Has open spots
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="upcoming" />
                          <Label htmlFor="upcoming" className="text-sm">
                            Upcoming events only
                          </Label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            {/* Active Filters */}
            {getActiveFiltersCount() > 0 && (
              <div className="mb-6">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium">Active filters:</span>
                  {selectedType !== "All" && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      Type: {selectedType}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => removeFilter("type")} />
                    </Badge>
                  )}
                  {selectedCategory !== "All" && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      Category: {selectedCategory}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => removeFilter("category")} />
                    </Badge>
                  )}
                  {selectedLocation !== "All" && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      Location: {selectedLocation}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => removeFilter("location")} />
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">
                {filteredResults.length} {filteredResults.length === 1 ? "result" : "results"}
                {searchQuery && ` for "${searchQuery}"`}
              </h2>
              <Select defaultValue="relevance">
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Sort by Relevance</SelectItem>
                  <SelectItem value="date">Sort by Date</SelectItem>
                  <SelectItem value="name">Sort by Name</SelectItem>
                  <SelectItem value="category">Sort by Category</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Results Grid */}
            {filteredResults.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6">{filteredResults.map(renderResultCard)}</div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold mb-2">No results found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your search terms or filters to find what you're looking for.
                </p>
                <Button onClick={clearAllFilters}>Clear All Filters</Button>
              </div>
            )}
          </div>
        </div>

        {/* Popular Searches */}
        <div className="mt-16 text-center">
          <h3 className="text-xl font-semibold mb-4">Popular Searches</h3>
          <div className="flex flex-wrap gap-2 justify-center">
            {["Basketball", "Drama", "Science Fair", "Student Council", "Robotics", "Art Exhibition"].map((term) => (
              <Button
                key={term}
                variant="outline"
                size="sm"
                onClick={() => setSearchQuery(term)}
                className="rounded-full bg-transparent"
              >
                {term}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
