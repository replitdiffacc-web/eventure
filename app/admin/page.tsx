"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Users, Calendar, Settings, Bell, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Navigation from "@/components/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabase"

interface DashboardStats {
  totalCCAs: number
  totalEvents: number
  totalAnnouncements: number
  totalNews: number
}

export default function AdminDashboard() {
  const { user, isLoading: authLoading } = useAuth()
  console.log("Admin page - user object:", user)
  console.log("Admin page - user role:", user?.role)
  console.log("Admin page - auth loading:", authLoading)
  console.log("Admin page - user full object:", JSON.stringify(user, null, 2))

  const [stats, setStats] = useState<DashboardStats>({
    totalCCAs: 0,
    totalEvents: 0,
    totalAnnouncements: 0,
    totalNews: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log("Admin page useEffect - user:", user)
    console.log("Admin page useEffect - authLoading:", authLoading)

    if (authLoading) {
      console.log("Still loading auth, waiting...")
      return
    }

    if (!user) {
      console.log("No user found after auth loading complete")
      return
    }

    if (user?.role !== "admin" && user?.role !== "cca_head") {
      console.log("User role check failed:", user.role)
      return
    }

    console.log("User authenticated, fetching stats")
    fetchStats()
  }, [user, authLoading])

  async function fetchStats() {
    try {
      console.log("Fetching dashboard stats...")
      const [ccasResult, eventsResult, announcementsResult, newsResult] = await Promise.all([
        supabase.from("activities").select("id", { count: "exact" }),
        supabase.from("events").select("id", { count: "exact" }),
        supabase.from("announcements").select("id", { count: "exact" }),
        supabase.from("news").select("id", { count: "exact" }),
      ])

      console.log("Stats fetched:", {
        ccas: ccasResult.count,
        events: eventsResult.count,
        announcements: announcementsResult.count,
        news: newsResult.count,
      })

      setStats({
        totalCCAs: ccasResult.count || 0,
        totalEvents: eventsResult.count || 0,
        totalAnnouncements: announcementsResult.count || 0,
        totalNews: newsResult.count || 0,
      })
    } catch (error) {
      console.error("Error fetching stats:", error)
    } finally {
      setLoading(false)
    }
  }

  if (authLoading) {
    console.log("Showing auth loading screen")
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            Loading authentication...
          </div>
        </div>
      </div>
    )
  }

  if (!user || (user.role !== "admin" && user.role !== "cca_head")) {
    console.log("Access denied - user:", user)
    console.log("Access denied - role check failed:", user?.role)
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            Access denied. Admin or CCA Head privileges required.
            <br />
            <small className="text-gray-500">Debug: Role = {user?.role || "undefined"}</small>
            <br />
            <small className="text-gray-500">User ID = {user?.id || "undefined"}</small>
            <br />
            <small className="text-gray-500">Auth Loading = {authLoading ? "true" : "false"}</small>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            Loading dashboard...
          </div>
        </div>
      </div>
    )
  }

  console.log("Rendering admin dashboard for user:", user.role)

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Header */}
      <section className="bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-950 dark:to-gray-950 py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {user.role === "admin" ? "Admin Dashboard" : "CCA Management"}
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                {user.role === "admin"
                  ? "Manage school activities and monitor engagement"
                  : "Manage your CCA details and content"}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total CCAs</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCCAs}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Events</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalEvents}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Announcements</CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalAnnouncements}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">News Articles</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalNews}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                CCA Management
              </CardTitle>
              <CardDescription>
                {user.role === "admin" ? "Manage all CCAs and their details" : "Manage your CCA details"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/admin/ccas">Manage CCAs</Link>
              </Button>
            </CardContent>
          </Card>

          {user.role === "admin" && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Event Management
                  </CardTitle>
                  <CardDescription>Create and manage school events</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild className="w-full bg-transparent" variant="outline">
                    <Link href="/admin/events">Manage Events</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bell className="h-5 w-5 mr-2" />
                    Announcements
                  </CardTitle>
                  <CardDescription>Create and manage announcements</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild className="w-full bg-transparent" variant="outline">
                    <Link href="/admin/announcements">Manage Announcements</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    News Management
                  </CardTitle>
                  <CardDescription>Create and manage news articles</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild className="w-full bg-transparent" variant="outline">
                    <Link href="/admin/news">Manage News</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="h-5 w-5 mr-2" />
                    System Settings
                  </CardTitle>
                  <CardDescription>Configure system settings and preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild className="w-full bg-transparent" variant="outline">
                    <Link href="/admin/settings">System Settings</Link>
                  </Button>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
