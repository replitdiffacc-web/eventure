"use client"

import { useEffect, useState } from "react"
import { ArrowLeft, Calendar, Clock, MapPin, Users, Share2, Heart, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import Navigation from "@/components/navigation"
import Link from "next/link"
import { notFound } from "next/navigation"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"
import { sampleEvents } from "@/lib/sample-data"

interface EventDetail {
  id: string
  title: string
  description: string
  event_date: string
  event_time: string
  location: string
  image_url?: string
  activities?: {
    name: string
    category: string
  }
  organizer?: string
  organizer_contact?: string
  capacity?: number
  rsvp_count?: number
  status?: string
  agenda?: {
    time: string
    activity: string
  }[]
  requirements?: string[]
  attendees?: {
    name: string
    role: string
    avatar?: string
  }[]
  gallery?: string[]
}

interface PageProps {
  params: {
    id: string
  }
}

function mergeEventData(primary: Partial<EventDetail> | null, fallback: EventDetail | undefined): EventDetail | null {
  if (!primary && !fallback) {
    return null
  }

  if (!primary && fallback) {
    return fallback
  }

  if (!primary) {
    return null
  }

  return {
    id: primary.id ?? fallback?.id ?? "",
    title: primary.title ?? fallback?.title ?? "",
    description: primary.description ?? fallback?.description ?? "",
    event_date: primary.event_date ?? fallback?.event_date ?? new Date().toISOString(),
    event_time: primary.event_time ?? fallback?.event_time ?? "",
    location: primary.location ?? fallback?.location ?? "",
    image_url: primary.image_url ?? fallback?.image_url,
    activities: primary.activities ?? fallback?.activities,
    organizer: primary.organizer ?? fallback?.organizer,
    organizer_contact: primary.organizer_contact ?? fallback?.organizer_contact,
    capacity: primary.capacity ?? fallback?.capacity,
    rsvp_count: primary.rsvp_count ?? fallback?.rsvp_count,
    status: primary.status ?? fallback?.status,
    agenda: primary.agenda ?? fallback?.agenda ?? [],
    requirements: primary.requirements ?? fallback?.requirements ?? [],
    attendees: primary.attendees ?? fallback?.attendees ?? [],
    gallery: primary.gallery ?? fallback?.gallery ?? [],
  }
}

export default function EventDetailPage({ params }: PageProps) {
  const [event, setEvent] = useState<EventDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [isRSVPed, setIsRSVPed] = useState(false)
  const [rsvpForm, setRsvpForm] = useState({
    name: "",
    email: "",
    role: "attendee",
    dietaryRestrictions: "",
    emergencyContact: "",
    agreeToTerms: false,
  })

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    async function fetchEvent() {
      const fallbackEvent = sampleEvents.find((item) => item.id === params.id)

      if (!isSupabaseConfigured) {
        setEvent(fallbackEvent ?? null)
        setLoading(false)
        return
      }

      try {
        const { data, error } = await supabase
          .from("events")
          .select("*, activities (name, category)")
          .eq("id", params.id)
          .maybeSingle()

        if (error) {
          console.error("Error fetching event:", error)
          setEvent(fallbackEvent ?? null)
          return
        }

        const merged = mergeEventData(data as Partial<EventDetail>, fallbackEvent)
        setEvent(merged)
      } catch (err) {
        console.error("Unexpected error loading event:", err)
        setEvent(fallbackEvent ?? null)
      } finally {
        setLoading(false)
      }
    }

    fetchEvent()
  }, [params.id])

  const handleRSVP = () => {
    // In a real app, this would submit to an API
    setIsRSVPed(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading event details...</div>
        </div>
      </div>
    )
  }

  if (!event) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button asChild variant="ghost" className="mb-6">
          <Link href="/events">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Events
          </Link>
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Image */}
            {event.image_url && (
              <div className="aspect-video relative overflow-hidden rounded-lg">
                <img src={event.image_url || "/placeholder.svg"} alt={event.title} className="w-full h-full object-cover" />
                {(event.activities?.category || event.status) && (
                  <Badge
                    className="absolute top-4 right-4 text-lg px-3 py-1"
                    variant={
                      event.activities?.category === "Academic"
                        ? "default"
                        : event.activities?.category === "Sports"
                          ? "secondary"
                          : event.activities?.category === "Arts"
                            ? "destructive"
                            : "outline"
                    }
                  >
                    {event.activities?.category || event.status}
                  </Badge>
                )}
              </div>
            )}

            {/* Title and Description */}
            <div>
              <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">{event.title}</h1>
              <p className="text-lg text-muted-foreground leading-relaxed">{event.description}</p>
            </div>

            {/* Event Details */}
            <Card>
              <CardHeader>
                <CardTitle>Event Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-blue-600 mr-3" />
                    <div>
                      <div className="font-medium">Date</div>
                      <div className="text-sm text-muted-foreground">
                        {event.event_date ? new Date(event.event_date).toLocaleDateString() : "TBA"}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-green-600 mr-3" />
                    <div>
                      <div className="font-medium">Time</div>
                      <div className="text-sm text-muted-foreground">{event.event_time || "To be announced"}</div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-red-600 mr-3" />
                    <div>
                      <div className="font-medium">Location</div>
                      <div className="text-sm text-muted-foreground">{event.location}</div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-purple-600 mr-3" />
                    <div>
                      <div className="font-medium">Capacity</div>
                      <div className="text-sm text-muted-foreground">
                        {event.rsvp_count ?? 0}/{event.capacity ?? 0} registered
                      </div>
                    </div>
                  </div>
                </div>

                {(event.organizer || event.organizer_contact) && (
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium text-gray-700 dark:text-gray-200">Organised by:</span>{" "}
                    {event.organizer}
                    {event.organizer_contact && ` • ${event.organizer_contact}`}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Agenda */}
            {event.agenda && event.agenda.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Event Agenda</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {event.agenda.map((item, index) => (
                      <div key={`${item.time}-${index}`} className="flex items-center">
                        <div className="w-20 text-sm font-medium text-blue-600">{item.time}</div>
                        <div className="flex-1">{item.activity}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Requirements */}
            {event.requirements && event.requirements.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Important Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {event.requirements.map((requirement, index) => (
                      <li key={`${requirement}-${index}`} className="flex items-start">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span>{requirement}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Attendees */}
            {event.attendees && event.attendees.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Who's Attending</CardTitle>
                  <CardDescription>See who else will be at this event</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {event.attendees.map((attendee) => (
                      <div key={attendee.name} className="flex items-center space-x-3">
                        <Avatar>
                          {attendee.avatar && (
                            <AvatarImage src={attendee.avatar || "/placeholder.svg"} alt={attendee.name} />
                          )}
                          <AvatarFallback>
                            {attendee.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{attendee.name}</div>
                          <div className="text-sm text-muted-foreground">{attendee.role}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 text-center">
                    <Button variant="outline" size="sm">
                      View All Attendees ({event.rsvp_count ?? 0})
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Discussion */}
            <Card>
              <CardHeader>
                <CardTitle>Discussion</CardTitle>
                <CardDescription>Share questions and coordinate with your peers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Button variant="outline" size="sm" className="bg-transparent">
                    <Share2 className="h-4 w-4 mr-2" /> Share
                  </Button>
                  <Button variant="outline" size="sm" className="bg-transparent">
                    <Heart className="h-4 w-4 mr-2" /> Interested
                  </Button>
                  <Button variant="outline" size="sm" className="bg-transparent">
                    <MessageCircle className="h-4 w-4 mr-2" /> Start Chat
                  </Button>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="comment">Add a comment</Label>
                  <Textarea
                    id="comment"
                    placeholder="Ask a question or share your excitement..."
                    className="min-h-[120px]"
                  />
                  <div className="flex justify-end">
                    <Button size="sm">Post Comment</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* RSVP Card */}
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>RSVP for {event.title}</CardTitle>
                <CardDescription>
                  {isRSVPed
                    ? "You're on the list! We'll email you event updates."
                    : "Reserve your spot and receive reminders before the event."}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form
                  className="space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleRSVP()
                  }}
                >
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={rsvpForm.name}
                      onChange={(e) => setRsvpForm({ ...rsvpForm, name: e.target.value })}
                      placeholder="Jordan Smith"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={rsvpForm.email}
                      onChange={(e) => setRsvpForm({ ...rsvpForm, email: e.target.value })}
                      placeholder="you@school.edu"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Input
                      id="role"
                      value={rsvpForm.role}
                      onChange={(e) => setRsvpForm({ ...rsvpForm, role: e.target.value })}
                      placeholder="Participant, Volunteer, Judge..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dietary">Dietary Preferences</Label>
                    <Input
                      id="dietary"
                      value={rsvpForm.dietaryRestrictions}
                      onChange={(e) => setRsvpForm({ ...rsvpForm, dietaryRestrictions: e.target.value })}
                      placeholder="Vegetarian, allergies, etc."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emergency">Emergency Contact</Label>
                    <Input
                      id="emergency"
                      value={rsvpForm.emergencyContact}
                      onChange={(e) => setRsvpForm({ ...rsvpForm, emergencyContact: e.target.value })}
                      placeholder="Parent/guardian name & phone"
                    />
                  </div>
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="terms"
                      checked={rsvpForm.agreeToTerms}
                      onCheckedChange={(checked) =>
                        setRsvpForm({ ...rsvpForm, agreeToTerms: Boolean(checked) })
                      }
                      required
                    />
                    <Label htmlFor="terms" className="text-sm text-muted-foreground">
                      I agree to the event guidelines and will notify the organiser if my plans change.
                    </Label>
                  </div>

                  <Button type="submit" className="w-full" disabled={isRSVPed}>
                    {isRSVPed ? "RSVP Confirmed" : "Submit RSVP"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Helpful Links */}
            <Card>
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>
                  Contact the organiser at {event.organizer_contact || "studentlife@school.edu"} for questions about
                  this event.
                </p>
                <p>For accessibility support, please reach out at least 72 hours before the event.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
