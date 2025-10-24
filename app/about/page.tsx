import Navigation from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { sampleActivities, sampleEvents, sampleCommittees, sampleTestimonials } from "@/lib/sample-data"
import { Users, Calendar, Star, Rocket, Target, HeartHandshake } from "lucide-react"

const impactHighlights = [
  {
    title: "CCAs supported",
    value: sampleActivities.length.toString(),
    description: "Active activities with up-to-date information and leadership tools.",
    icon: Users,
  },
  {
    title: "Events promoted",
    value: sampleEvents.length.toString(),
    description: "Major events showcased this term with RSVP tracking and reminders.",
    icon: Calendar,
  },
  {
    title: "Leadership teams",
    value: sampleCommittees.length.toString(),
    description: "Student-led committees using Eventure to coordinate initiatives.",
    icon: Star,
  },
]

const pillars = [
  {
    title: "One home for involvement",
    description:
      "Eventure centralises CCAs, committees, and event updates so students and families never miss an opportunity.",
    icon: Rocket,
  },
  {
    title: "Designed for leaders",
    description:
      "Committee dashboards, proposal templates, and messaging tools empower student leaders to focus on impact.",
    icon: Target,
  },
  {
    title: "Built for community",
    description:
      "Shared calendars, RSVP workflows, and feedback channels keep the entire school engaged and informed.",
    icon: HeartHandshake,
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <section className="bg-gradient-to-br from-indigo-50 to-sky-100 dark:from-indigo-950 dark:to-sky-950 py-16 border-b">
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <Badge className="w-fit">About Eventure</Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-balance text-slate-900 dark:text-slate-100">
              A vibrant campus deserves an equally vibrant platform
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              Eventure was built by students and advisors who wanted a clearer way to discover, organise, and celebrate
              everything happening on campus. We focus on thoughtful workflows that make it easier to participate and
              lead.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg">
                <Link href="/ccas">Explore CCAs</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="bg-transparent">
                <Link href="/resources">Browse resources</Link>
              </Button>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {impactHighlights.map((item) => (
              <Card key={item.title} className="bg-white/70 dark:bg-slate-900/60 backdrop-blur border-indigo-100">
                <CardHeader className="flex flex-row items-center gap-3 pb-2">
                  <item.icon className="h-6 w-6 text-indigo-500" />
                  <CardTitle className="text-sm uppercase tracking-wide text-indigo-600">{item.title}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">{item.value}</p>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4 grid md:grid-cols-3 gap-8">
          {pillars.map((pillar) => (
            <Card key={pillar.title} className="h-full">
              <CardHeader className="space-y-3">
                <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center">
                  <pillar.icon className="h-6 w-6 text-indigo-500" />
                </div>
                <CardTitle>{pillar.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{pillar.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="py-16 bg-slate-50 dark:bg-slate-950 border-t">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Voices guiding Eventure</h2>
            <p className="text-slate-600 dark:text-slate-300 mt-3">
              Feedback from student leaders, staff advisors, and committee members keeps our roadmap grounded in real
              campus needs.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {sampleTestimonials.map((testimonial) => (
              <Card key={testimonial.id} className="h-full border-slate-200 dark:border-slate-800">
                <CardHeader>
                  <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                  <CardDescription>{testimonial.role}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">“{testimonial.quote}”</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Roadmap for the year</h2>
            <p className="text-muted-foreground leading-relaxed">
              We are expanding Eventure with richer analytics for advisors, automated attendance tracking, and a new
              volunteer hours log. Early adopters will shape each release through feedback sessions and beta access.
            </p>
            <Button asChild>
              <Link href="/contact">Share feedback</Link>
            </Button>
          </div>
          <Card className="bg-slate-900 text-white">
            <CardHeader>
              <CardTitle>Upcoming milestones</CardTitle>
              <CardDescription className="text-slate-200">
                Planned updates for the 2024 school year
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-medium">April</p>
                <p className="text-sm text-slate-300">Launch attendance check-ins with QR codes for CCAs.</p>
              </div>
              <div>
                <p className="font-medium">May</p>
                <p className="text-sm text-slate-300">Introduce advisor dashboards with participation insights.</p>
              </div>
              <div>
                <p className="font-medium">June</p>
                <p className="text-sm text-slate-300">Release volunteer hours tracking and exportable reports.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
