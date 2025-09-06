"use client"

import { useState } from "react"
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

// Mock event data
const eventData = {
  1: {
    id: 1,
    title: "Science Fair 2024",
    date: "2024-03-15",
    time: "9:00 AM - 4:00 PM",
    location: "Main Hall",
    category: "Academic",
    description:
      "Join us for our annual Science Fair where students from all grade levels showcase their innovative projects and scientific discoveries. This year's theme focuses on sustainability and environmental solutions.",
    organizer: "Science Department",
    organizerContact: "science@school.edu",
    capacity: 200,
    rsvpCount: 145,
    image: "/science-fair-display.jpg",
    status: "upcoming",
    agenda: [
      { time: "9:00 AM", activity: "Registration and Setup" },
      { time: "10:00 AM", activity: "Project Presentations Begin" },
      { time: "12:00 PM", activity: "Lunch Break" },
      { time: "1:00 PM", activity: "Judging Period" },
      { time: "3:00 PM", activity: "Awards Ceremony" },
      { time: "4:00 PM", activity: "Closing Remarks" },
    ],
    requirements: [
      "Students must register their projects by March 10th",
      "All attendees must sign in at registration",
      "Photography is allowed with permission",
      "Food and drinks will be provided",
    ],
    attendees: [
      { name: "Sarah Chen", avatar: "/student-avatar-1.png", role: "Participant" },
      { name: "Marcus Johnson", avatar: "/student-avatar-2.png", role: "Judge" },
      { name: "Emma Rodriguez", avatar: "/student-avatar-3.png", role: "Volunteer" },
      { name: "David Kim", avatar: "/student-avatar-4.png", role: "Participant" },
    ],
    gallery: ["/science-project-1.jpg", "/science-project-2.jpg", "/science-project-3.jpg"],
  },
}

interface PageProps {
  params: {
    id: string
  }
}

export default function EventDetailPage({ params }: PageProps) {
  const [isRSVPed, setIsRSVPed] = useState(false)
  const [rsvpForm, setRsvpForm] = useState({
    name: "",
    email: "",
    role: "attendee",
    dietaryRestrictions: "",
    emergencyContact: "",
    agreeToTerms: false,
  })

  const event = eventData[Number.parseInt(params.id) as keyof typeof eventData]

  if (!event) {
    notFound()
  }

  const handleRSVP = () => {
    // In a real app, this would submit to an API
    setIsRSVPed(true)
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
            {event.image && (
              <div className="aspect-video relative overflow-hidden rounded-lg">
                <img src={event.image || "/placeholder.svg"} alt={event.title} className="w-full h-full object-cover" />
                <Badge
                  className="absolute top-4 right-4 text-lg px-3 py-1"
                  variant={
                    event.category === "Academic"
                      ? "default"
                      : event.category === "Sports"
                        ? "secondary"
                        : event.category === "Arts"
                          ? "destructive"
                          : "outline"
                  }
                >
                  {event.category}
                </Badge>
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
                      <div className="text-sm text-muted-foreground">{new Date(event.date).toLocaleDateString()}</div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-green-600 mr-3" />
                    <div>
                      <div className="font-medium">Time</div>
                      <div className="text-sm text-muted-foreground">{event.time}</div>
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
                        {event.rsvpCount}/{event.capacity} registered
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Agenda */}
            <Card>
              <CardHeader>
                <CardTitle>Event Agenda</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {event.agenda.map((item, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-20 text-sm font-medium text-blue-600">{item.time}</div>
                      <div className="flex-1">{item.activity}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Requirements */}
            <Card>
              <CardHeader>
                <CardTitle>Important Information</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {event.requirements.map((requirement, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span>{requirement}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Attendees */}
            <Card>
              <CardHeader>
                <CardTitle>Who's Attending</CardTitle>
                <CardDescription>See who else will be at this event</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {event.attendees.map((attendee, index) => (
                    <div key={index} className="flex items-center space-x-3">
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
                    View All Attendees ({event.rsvpCount})
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* RSVP Card */}
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>{isRSVPed ? "You're Registered!" : "RSVP for Event"}</CardTitle>
                <CardDescription>
                  {isRSVPed
                    ? "We'll send you updates about this event"
                    : event.rsvpCount >= event.capacity
                      ? "This event is currently full"
                      : "Secure your spot at this event"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isRSVPed ? (
                  <div className="space-y-4">
                    <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                      <div className="text-green-600 font-medium">Registration Confirmed</div>
                      <div className="text-sm text-green-600 mt-1">Check your email for details</div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1 bg-transparent">
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                      <Button variant="outline" className="flex-1 bg-transparent">
                        <Heart className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={rsvpForm.name}
                          onChange={(e) => setRsvpForm({ ...rsvpForm, name: e.target.value })}
                          placeholder="Enter your full name"
                        />
                      </div>

                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={rsvpForm.email}
                          onChange={(e) => setRsvpForm({ ...rsvpForm, email: e.target.value })}
                          placeholder="Enter your email"
                        />
                      </div>

                      <div>
                        <Label htmlFor="dietary">Dietary Restrictions (Optional)</Label>
                        <Textarea
                          id="dietary"
                          value={rsvpForm.dietaryRestrictions}
                          onChange={(e) => setRsvpForm({ ...rsvpForm, dietaryRestrictions: e.target.value })}
                          placeholder="Any dietary restrictions or allergies?"
                          rows={2}
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="terms"
                          checked={rsvpForm.agreeToTerms}
                          onCheckedChange={(checked) => setRsvpForm({ ...rsvpForm, agreeToTerms: checked as boolean })}
                        />
                        <Label htmlFor="terms" className="text-sm">
                          I agree to the event terms and conditions
                        </Label>
                      </div>
                    </div>

                    <Button
                      className="w-full"
                      size="lg"
                      onClick={handleRSVP}
                      disabled={
                        event.rsvpCount >= event.capacity || !rsvpForm.name || !rsvpForm.email || !rsvpForm.agreeToTerms
                      }
                    >
                      {event.rsvpCount >= event.capacity ? "Join Waitlist" : "Register Now"}
                    </Button>

                    <p className="text-xs text-muted-foreground text-center">
                      You'll receive a confirmation email after registration
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Organizer Info */}
            <Card>
              <CardHeader>
                <CardTitle>Event Organizer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="font-medium">{event.organizer}</div>
                    <div className="text-sm text-muted-foreground">{event.organizerContact}</div>
                  </div>
                  <Button variant="outline" className="w-full bg-transparent">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Contact Organizer
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Share Event */}
            <Card>
              <CardHeader>
                <CardTitle>Share Event</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    Share
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    Copy Link
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
