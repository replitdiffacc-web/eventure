import Navigation from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { sampleCommittees } from "@/lib/sample-data"
import { Calendar, Users, Sparkles } from "lucide-react"

export default function CommitteesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <section className="bg-gradient-to-r from-emerald-50 via-blue-50 to-sky-100 dark:from-emerald-950 dark:to-sky-950 py-16 border-b">
        <div className="container mx-auto px-4 text-center space-y-6">
          <Badge className="mx-auto w-fit">Student leadership</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100">
            Committees that shape campus life
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Join a leadership team, drive initiatives, and gain experience coordinating events, communications, and
            student voice efforts across the school.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4 grid lg:grid-cols-3 gap-8">
          {sampleCommittees.map((committee) => (
            <Card key={committee.id} className="h-full border-emerald-100 dark:border-emerald-900/40">
              <CardHeader className="space-y-2">
                <Badge variant="outline" className="w-fit uppercase tracking-wide text-xs">
                  {committee.focus}
                </Badge>
                <CardTitle>{committee.name}</CardTitle>
                <CardDescription>{committee.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground">
                  <div>
                    <p className="font-medium text-slate-700 dark:text-slate-200">Open positions</p>
                    <p>{committee.openPositions}</p>
                  </div>
                  <div>
                    <p className="font-medium text-slate-700 dark:text-slate-200">Meeting cadence</p>
                    <p>{committee.meetingCadence}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="font-medium text-slate-700 dark:text-slate-200">Application window</p>
                    <p>{committee.applicationWindow}</p>
                  </div>
                </div>
                <div>
                  <p className="font-medium text-slate-700 dark:text-slate-200 mb-2">What you'll do</p>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    {committee.highlights.map((highlight) => (
                      <li key={highlight}>{highlight}</li>
                    ))}
                  </ul>
                </div>
                <Button className="w-full" variant="outline">
                  Submit interest
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="py-16 bg-slate-50 dark:bg-slate-950 border-t">
        <div className="container mx-auto px-4 grid md:grid-cols-3 gap-6">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-emerald-500" />
                Lead collaboratively
              </CardTitle>
              <CardDescription>Mentor peers, facilitate meetings, and develop leadership skills.</CardDescription>
            </CardHeader>
          </Card>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-500" />
                Plan memorable events
              </CardTitle>
              <CardDescription>Coordinate logistics, manage budgets, and host engaging experiences.</CardDescription>
            </CardHeader>
          </Card>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-indigo-500" />
                Grow your portfolio
              </CardTitle>
              <CardDescription>Document achievements, initiatives, and service hours for future applications.</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>
    </div>
  )
}
