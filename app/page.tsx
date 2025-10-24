import { Calendar, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Navigation from "@/components/navigation"
import Link from "next/link"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"
import {
  sampleAnnouncements,
  sampleActivities,
  sampleEvents,
  sampleTestimonials,
  sampleCommittees,
} from "@/lib/sample-data"

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
  const fallbackData = {
    events: sampleEvents.slice(0, 3),
    announcements: sampleAnnouncements.slice(0, 3),
    stats: {
      activities: sampleActivities.length,
      upcomingEvents: sampleEvents.filter((event) => event.status === "upcoming").length,
    },
  }

  if (!isSupabaseConfigured) {
    return fallbackData
  }

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

    const resolvedEvents = events && events.length > 0 ? events : fallbackData.events
    const resolvedAnnouncements =
      announcements && announcements.length > 0 ? announcements : fallbackData.announcements

    return {
      events: resolvedEvents,
      announcements: resolvedAnnouncements,
      stats: {
        activities: activityCount ?? fallbackData.stats.activities,
        upcomingEvents: upcomingEventsCount ?? fallbackData.stats.upcomingEvents,
      },
    }
  } catch (error) {
    console.error("Error fetching home page data:", error)
    return fallbackData
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

      {/* Committees Preview */}
      <section className="py-16 bg-slate-50 dark:bg-slate-950 border-t">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Lead with purpose</h2>
              <p className="text-slate-600 dark:text-slate-300 mt-2 max-w-2xl">
                Explore student leadership committees that make campus life thrive. Each committee offers unique
                opportunities to shape initiatives, run events, and represent your peers.
              </p>
            </div>
            <Button asChild variant="outline" className="bg-white dark:bg-slate-900">
              <Link href="/committees">View all committees</Link>
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {sampleCommittees.slice(0, 3).map((committee) => (
              <Card key={committee.id} className="h-full border-blue-100 dark:border-slate-800">
                <CardHeader>
                  <Badge variant="outline" className="w-fit uppercase tracking-wide text-xs">
                    {committee.focus}
                  </Badge>
                  <CardTitle className="mt-3 text-xl">{committee.name}</CardTitle>
                  <CardDescription>{committee.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-muted-foreground">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="font-medium text-slate-700 dark:text-slate-200">Open roles</span>
                      <p>{committee.openPositions}</p>
                    </div>
                    <div>
                      <span className="font-medium text-slate-700 dark:text-slate-200">Cadence</span>
                      <p>{committee.meetingCadence}</p>
                    </div>
                  </div>
                  <ul className="list-disc list-inside space-y-1">
                    {committee.highlights.map((highlight) => (
                      <li key={highlight}>{highlight}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Voices from our community</h2>
            <p className="text-gray-600 dark:text-gray-300 mt-3">
              Students, educators, and activity leaders share how Eventure streamlines collaboration and keeps
              everyone informed.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {sampleTestimonials.map((testimonial) => (
              <Card key={testimonial.id} className="h-full">
                <CardHeader>
                  <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                  <CardDescription className="capitalize">{testimonial.role}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">“{testimonial.quote}”</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Explore CTA */}
      <section className="py-16 bg-gradient-to-br from-indigo-600 to-blue-500 text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-4">
              <h2 className="text-3xl font-bold">Ready to explore more?</h2>
              <p className="text-lg text-blue-100">
                Learn about the mission behind Eventure, browse help articles, and get answers to common questions so
                you can make the most of the platform.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row md:flex-col gap-3">
              <Button asChild size="lg" className="bg-white text-blue-600 hover:text-blue-700">
                <Link href="/about">About Eventure</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <Link href="/resources">Resource Library</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <Link href="/faq">FAQs</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
