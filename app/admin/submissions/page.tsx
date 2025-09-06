"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Mail, Calendar, User, MessageSquare, ExternalLink } from "lucide-react"
import Navigation from "@/components/navigation"

interface Submission {
  id: string
  name: string
  email: string
  subject: string
  category: string
  message: string
  timestamp: string
  status: string
  replied: boolean
}

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchSubmissions()
  }, [])

  const fetchSubmissions = async () => {
    try {
      const response = await fetch("/api/contact")
      if (!response.ok) throw new Error("Failed to fetch submissions")

      const data = await response.json()
      setSubmissions(data.submissions || [])
    } catch (err) {
      setError("Failed to load submissions")
      console.error("Error fetching submissions:", err)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString()
  }

  const createEmailLink = (submission: Submission) => {
    const subject = encodeURIComponent(`Re: ${submission.subject}`)
    const body = encodeURIComponent(
      `Hi ${submission.name},\n\nThank you for contacting Eventure. \n\n[Your response here]\n\nBest regards,\nEventure Team`,
    )
    return `mailto:${submission.email}?subject=${subject}&body=${body}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">Loading submissions...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center text-red-500">{error}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Contact Submissions</h1>
          <p className="text-muted-foreground">Total submissions: {submissions.length}</p>
        </div>

        {submissions.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No contact submissions yet.</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {submissions.map((submission) => (
              <Card key={submission.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        {submission.name}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-4 mt-2">
                        <span className="flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          {submission.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(submission.timestamp)}
                        </span>
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{submission.category}</Badge>
                      <Badge variant={submission.status === "new" ? "destructive" : "default"}>
                        {submission.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Subject:</h4>
                      <p className="text-sm">{submission.subject}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Message:</h4>
                      <p className="text-sm whitespace-pre-wrap bg-muted p-3 rounded-md">{submission.message}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button asChild size="sm">
                        <a href={createEmailLink(submission)} className="flex items-center gap-2">
                          <ExternalLink className="h-4 w-4" />
                          Reply via Email
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
