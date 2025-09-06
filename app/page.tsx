import { Calendar, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Navigation from "@/components/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabase"

// Mock data for upcoming events and announcements
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

interface Announcement {
  id: string
  title: string
  content: string
  priority: string
  created_at: string
  activities?: {
    name: string
  }
}

interface Activity {
  id: string
  name: string
  category: string
  is_active: boolean
}

async function getHomePageData() {
  try {
    // Fetch upcoming events (next 3 events)
    const { data: events } = await supabase
      .from("events")
      .select(`
        *,
        activities (name, category)
      `)
      .gte("event_date", new Date().toISOString().split("T")[0])
      .order("event_date", { ascending: true })
      .limit(3)

    // Fetch recent announcements (last 3 active announcements)
    const { data: announcements } = await supabase
      .from("announcements")
      .select(`
        *,
        activities (name)
      `)
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(3)

    // Fetch activity count
    const { count: activityCount } = await supabase
      .from("activities")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true)

    // Fetch upcoming events count
    const { count: upcomingEventsCount } = await supabase
      .from("events")
      .select("*", { count: "exact", head: true })
      .gte("event_date", new Date().toISOString().split("T")[0])

    return {
      events: events || [],
      announcements: announcements || [],
      stats: {
        activities: activityCount || 0,
        upcomingEvents: upcomingEventsCount || 0,
      },
    }
  } catch (error) {
    console.error("Error fetching home page data:", error)
    return {
      events: [],
      announcements: [],
      stats: { activities: 0, upcomingEvents: 0 },
    }
  }
}

export default async function HomePage() {
  const { events, announcements, stats } = await getHomePageData()

  const quickStats = [
    { label: "Active CCAs", value: stats.activities.toString(), icon: Users },
    { label: "Upcoming Events", value: stats.upcomingEvents.toString(), icon: Calendar },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-balance mb-6 text-blue-900 dark:text-blue-100">
              Welcome to Eventure
            </h1>
            <p className="text-xl md:text-2xl text-blue-700 dark:text-blue-200 mb-8 text-pretty">
              Discover CCAs, join committees, and stay updated with all school activities in one place
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Link href="/ccas">Explore CCAs</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-blue-600 text-blue-600 hover:bg-blue-50 bg-transparent"
              >
                <Link href="/events">View Events</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-12 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {quickStats.map((stat, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <stat.icon className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Upcoming Events */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Upcoming Events</h2>
              <Button asChild variant="outline">
                <Link href="/events">View All</Link>
              </Button>
            </div>

            <div className="space-y-4">
              {events.length === 0 ? (
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-muted-foreground text-center">No upcoming events at this time.</p>
                  </CardContent>
                </Card>
              ) : (
                events.map((event) => (
                  <Card key={event.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-xl">{event.title}</CardTitle>
                          <CardDescription className="mt-1">
                            {new Date(event.event_date).toLocaleDateString()}
                            {event.event_time && ` at ${event.event_time}`}
                            {event.location && ` • ${event.location}`}
                          </CardDescription>
                        </div>
                        {event.activities && (
                          <Badge
                            variant={
                              event.activities.category === "Academic"
                                ? "default"
                                : event.activities.category === "Sports"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {event.activities.category}
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      {event.description && <p className="text-muted-foreground">{event.description}</p>}
                      <Button className="mt-4" size="sm">
                        RSVP
                      </Button>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* Announcements Sidebar */}
          <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Announcements</h2>
            <div className="space-y-4">
              {announcements.length === 0 ? (
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-muted-foreground text-center">No announcements at this time.</p>
                  </CardContent>
                </Card>
              ) : (
                announcements.map((announcement) => (
                  <Card
                    key={announcement.id}
                    className={`${
                      announcement.priority === "urgent" || announcement.priority === "high"
                        ? "border-red-200 bg-red-50 dark:bg-red-950"
                        : announcement.priority === "normal"
                          ? "border-yellow-200 bg-yellow-50 dark:bg-yellow-950"
                          : "border-gray-200"
                    }`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">{announcement.title}</CardTitle>
                        {(announcement.priority === "urgent" || announcement.priority === "high") && (
                          <Badge variant="destructive" className="ml-2">
                            {announcement.priority === "urgent" ? "Urgent" : "High"}
                          </Badge>
                        )}
                      </div>
                      <CardDescription>
                        {new Date(announcement.created_at).toLocaleDateString()}
                        {announcement.activities && ` • ${announcement.activities.name}`}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{announcement.content}</p>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
