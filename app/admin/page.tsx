"use client"

export const dynamic = "force-dynamic"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Users, Calendar, Settings, Bell, FileText, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Navigation from "@/components/navigation"
import Link from "next/link"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"
import { sampleActivities, sampleAnnouncements, sampleEvents, sampleNews } from "@/lib/sample-data"

interface DashboardStats {
  totalCCAs: number
  totalEvents: number
  totalAnnouncements: number
  totalNews: number
}

const sampleStats: DashboardStats = {
  totalCCAs: sampleActivities.length,
  totalEvents: sampleEvents.length,
  totalAnnouncements: sampleAnnouncements.length,
  totalNews: sampleNews.length,
}

export default function AdminDashboard() {
  const { user, isChecking } = useAuth()
  const backendReady = isSupabaseConfigured

  const [stats, setStats] = useState<DashboardStats>(backendReady ? {
    totalCCAs: 0,
    totalEvents: 0,
    totalAnnouncements: 0,
    totalNews: 0,
  } : sampleStats)
  const [loading, setLoading] = useState(backendReady)

  useEffect(() => {
    if (!backendReady) {
      return
    }

    if (isChecking) {
      return
    }

    if (!user || (user.role !== "admin" && user.role !== "cca_head")) {
      setLoading(false)
      return
    }

    async function fetchStats() {
      try {
        const [ccasResult, eventsResult, announcementsResult, newsResult] = await Promise.all([
          supabase.from("activities").select("id", { count: "exact" }),
          supabase.from("events").select("id", { count: "exact" }),
          supabase.from("announcements").select("id", { count: "exact" }),
          supabase.from("news").select("id", { count: "exact" }),
        ])

        setStats({
          totalCCAs: ccasResult.count || 0,
          totalEvents: eventsResult.count || 0,
          totalAnnouncements: announcementsResult.count || 0,
          totalNews: newsResult.count || 0,
        })
      } catch (error) {
        console.error("Error fetching stats:", error)
        setStats(sampleStats)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [backendReady, isChecking, user])

  if (!backendReady) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <Card className="border-dashed">
            <CardHeader className="flex flex-row items-start gap-3">
              <Info className="h-6 w-6 text-blue-500" />
              <div>
                <CardTitle>Supabase not configured</CardTitle>
                <CardDescription>
                  You're viewing a demo of the admin dashboard using sample data. Add Supabase credentials to enable
                  live management features.
                </CardDescription>
              </div>
            </CardHeader>
          </Card>
        </div>
        <DashboardContent stats={sampleStats} roleHint="admin" readOnly />
      </div>
    )
  }

  if (isChecking) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            Checking authentication...
          </div>
        </div>
      </div>
    )
  }

  if (!user || (user.role !== "admin" && user.role !== "cca_head")) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Access denied. Admin or CCA Head privileges required.</div>
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

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <DashboardContent stats={stats} roleHint={user.role} />
    </div>
  )
}

function DashboardContent({
  stats,
  roleHint,
  readOnly = false,
}: {
  stats: DashboardStats
  roleHint: "admin" | "cca_head"
  readOnly?: boolean
}) {
  return (
    <>
      <section className="bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-950 dark:to-gray-950 py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {roleHint === "admin" ? "Admin Dashboard" : "CCA Management"}
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                {roleHint === "admin"
                  ? "Manage school activities and monitor engagement"
                  : "Manage your CCA details and content"}
              </p>
            </div>
            {readOnly && (
              <Badge className="bg-blue-600/10 text-blue-600 border-blue-200" variant="outline">
                Demo Mode
              </Badge>
            )}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard title="Total CCAs" icon={Users} value={stats.totalCCAs} />
          <StatCard title="Total Events" icon={Calendar} value={stats.totalEvents} />
          <StatCard title="Announcements" icon={Bell} value={stats.totalAnnouncements} />
          <StatCard title="News Articles" icon={FileText} value={stats.totalNews} />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ActionCard
            title="CCA Management"
            description={roleHint === "admin" ? "Manage all CCAs and their details" : "Manage your CCA details"}
            icon={Users}
            href="/admin/ccas"
            disabled={readOnly}
          />

          {roleHint === "admin" && (
            <>
              <ActionCard
                title="Event Management"
                description="Create and manage school events"
                icon={Calendar}
                href="/admin/events"
                disabled={readOnly}
              />
              <ActionCard
                title="Announcements"
                description="Create and manage announcements"
                icon={Bell}
                href="/admin/announcements"
                disabled={readOnly}
              />
              <ActionCard
                title="News Management"
                description="Create and manage news articles"
                icon={FileText}
                href="/admin/news"
                disabled={readOnly}
              />
              <ActionCard
                title="System Settings"
                description="Configure system preferences"
                icon={Settings}
                href="/admin/settings"
                disabled={readOnly}
              />
            </>
          )}
        </div>
      </div>
    </>
  )
}

function StatCard({
  title,
  icon: Icon,
  value,
}: {
  title: string
  icon: typeof Users
  value: number
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  )
}

function ActionCard({
  title,
  description,
  icon: Icon,
  href,
  disabled,
}: {
  title: string
  description: string
  icon: typeof Users
  href: string
  disabled?: boolean
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Icon className="h-5 w-5 mr-2" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button asChild className="w-full" variant={disabled ? "outline" : "default"} disabled={disabled}>
          <Link href={href}>{disabled ? "Unavailable in demo" : `Open ${title}`}</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
