"use client"

import { useState, useEffect, useMemo } from "react"
import { ChevronLeft, ChevronRight, Calendar, Clock, MapPin, Filter, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Navigation from "@/components/navigation"
import Link from "next/link"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"
import { sampleEvents } from "@/lib/sample-data"

interface Event {
  id: string
  title: string
  description: string | null
  event_date: string
  event_time: string | null
  location: string | null
  image_url: string | null
  is_featured: boolean
  activities?: {
    name: string
    category: string
  }
}

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

export default function EventsPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"calendar" | "list">("list")
  const [events, setEvents] = useState<Event[]>([])
  const [categories, setCategories] = useState<string[]>(["All"])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchEvents() {
      try {
        if (!isSupabaseConfigured) {
          setEvents(sampleEvents)
          const uniqueCategories = Array.from(
            new Set(sampleEvents.map((event) => event.activities?.category).filter(Boolean) as string[]),
          )
          setCategories(["All", ...uniqueCategories.sort()])
          return
        }

        const { data: eventsData, error } = await supabase
          .from("events")
          .select(`
            *,
            activities (name, category)
          `)
          .gte("event_date", new Date().toISOString().split("T")[0])
          .order("event_date", { ascending: true })

        if (error) {
          console.error("Error fetching events:", error)
          setEvents(sampleEvents)
          const uniqueCategories = Array.from(
            new Set(sampleEvents.map((event) => event.activities?.category).filter(Boolean) as string[]),
          )
          setCategories(["All", ...uniqueCategories.sort()])
          return
        }

        setEvents(eventsData && eventsData.length > 0 ? eventsData : sampleEvents)

        // Extract unique categories
        const uniqueCategories = Array.from(
          new Set(
            (eventsData && eventsData.length > 0 ? eventsData : sampleEvents)
              .map((e) => e.activities?.category)
              .filter(Boolean) || [],
          ),
        )
        setCategories(["All", ...uniqueCategories.sort()])
      } catch (error) {
        console.error("Error fetching events:", error)
        setEvents(sampleEvents)
        const uniqueCategories = Array.from(
          new Set(sampleEvents.map((event) => event.activities?.category).filter(Boolean) as string[]),
        )
        setCategories(["All", ...uniqueCategories.sort()])
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  const filteredEvents = useMemo(() => {
    let filtered = events

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (event.description && event.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (event.location && event.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (event.activities?.name && event.activities.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (event.activities?.category && event.activities.category.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    }

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter((event) => event.activities?.category === selectedCategory)
    }

    return filtered
  }, [events, searchQuery, selectedCategory])

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading events...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Header */}
      <section className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-balance mb-4 text-gray-900 dark:text-gray-100">
              School Events
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 text-pretty">
              Stay updated with all school activities and never miss an important event
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Search events by title, description, location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-3 text-lg"
            />
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant={viewMode === "list" ? "default" : "outline"} onClick={() => setViewMode("list")}>
              List View
            </Button>
            <Button variant={viewMode === "calendar" ? "default" : "outline"} onClick={() => setViewMode("calendar")}>
              Calendar View
            </Button>
          </div>

          <div className="flex items-center gap-4">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
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
        </div>

        {(searchQuery || selectedCategory !== "All") && (
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">
              {filteredEvents.length} {filteredEvents.length === 1 ? "event" : "events"} found
              {searchQuery && ` for "${searchQuery}"`}
              {selectedCategory !== "All" && ` in ${selectedCategory}`}
            </p>
          </div>
        )}

        {viewMode === "list" ? (
          /* List View */
          <div className="space-y-6">
            {/* Month Navigation */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h2 className="text-2xl font-semibold min-w-48 text-center">
                {months[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <Button variant="outline" size="sm" onClick={() => navigateMonth("next")}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Events Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground">
                    {searchQuery || selectedCategory !== "All"
                      ? "No events match your search criteria. Try adjusting your filters."
                      : "No events available for the selected criteria."}
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
                filteredEvents.map((event) => (
                  <Card key={event.id} className="hover:shadow-lg transition-shadow">
                    {event.image_url && (
                      <div className="aspect-video relative overflow-hidden rounded-t-lg">
                        <img
                          src={event.image_url || "/placeholder.svg"}
                          alt={event.title}
                          className="w-full h-full object-cover"
                        />
                        {event.activities && (
                          <Badge
                            className="absolute top-3 right-3"
                            variant={
                              event.activities.category === "Academic"
                                ? "default"
                                : event.activities.category === "Sports"
                                  ? "secondary"
                                  : event.activities.category === "Arts"
                                    ? "destructive"
                                    : "outline"
                            }
                          >
                            {event.activities.category}
                          </Badge>
                        )}
                      </div>
                    )}

                    <CardHeader>
                      <CardTitle className="text-xl">{event.title}</CardTitle>
                      {event.description && <CardDescription>{event.description}</CardDescription>}
                    </CardHeader>

                    <CardContent className="space-y-3">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>{new Date(event.event_date).toLocaleDateString()}</span>
                      </div>

                      {event.event_time && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="h-4 w-4 mr-2" />
                          <span>{event.event_time}</span>
                        </div>
                      )}

                      {event.location && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span>{event.location}</span>
                        </div>
                      )}

                      <div className="flex gap-2 pt-2">
                        <Button asChild className="flex-1">
                          <Link href={`/events/${event.id}`}>View Details</Link>
                        </Button>
                        <Button variant="outline" className="flex-1 bg-transparent">
                          RSVP
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        ) : (
          /* Calendar View */
          <div className="bg-white dark:bg-gray-900 rounded-lg border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">
                {months[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => navigateMonth("next")}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {/* Day Headers */}
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="p-2 text-center font-medium text-muted-foreground">
                  {day}
                </div>
              ))}

              {/* Calendar Days */}
              {Array.from({ length: 35 }, (_, i) => {
                const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i - 6)
                const isCurrentMonth = date.getMonth() === currentDate.getMonth()
                const dayEvents = filteredEvents.filter(
                  (event) => new Date(event.event_date).toDateString() === date.toDateString(),
                )

                return (
                  <div
                    key={i}
                    className={`min-h-24 p-1 border border-gray-100 dark:border-gray-800 ${
                      isCurrentMonth ? "bg-white dark:bg-gray-900" : "bg-gray-50 dark:bg-gray-800"
                    }`}
                  >
                    <div className={`text-sm ${isCurrentMonth ? "text-gray-900 dark:text-gray-100" : "text-gray-400"}`}>
                      {date.getDate()}
                    </div>
                    <div className="space-y-1">
                      {dayEvents.slice(0, 2).map((event) => (
                        <div
                          key={event.id}
                          className="text-xs p-1 rounded bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 truncate"
                        >
                          {event.title}
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <div className="text-xs text-muted-foreground">+{dayEvents.length - 2} more</div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-12 text-center p-8 bg-orange-50 dark:bg-orange-950 rounded-lg">
          <h2 className="text-2xl font-bold mb-4 text-orange-900 dark:text-orange-100">Want to organize an event?</h2>
          <p className="text-orange-700 dark:text-orange-200 mb-6">
            Submit your event proposal and get it approved by the administration.
          </p>
          <Button size="lg" className="bg-orange-600 hover:bg-orange-700">
            Propose Event
          </Button>
        </div>
      </div>
    </div>
  )
}
