"use client"

export const dynamic = "force-dynamic"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Navigation from "@/components/navigation"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"
import { Pencil, Save, X, Loader2, Lock, Mail } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "sonner"
import { sampleActivities } from "@/lib/sample-data"
import { Badge } from "@/components/ui/badge"

interface CCA {
  id: string
  name: string
  description: string
  category: string
  year_groups: string
  selection_method: string
  staff_members: string
  learning_objectives?: string
  meeting_location?: string
  contact_email?: string
  image_url?: string
  logo_url?: string
  core_committee_signup_url?: string
}

export default function AdminCCAsPage() {
  const { user } = useAuth()
  const backendReady = isSupabaseConfigured
  const [ccas, setCcas] = useState<CCA[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<CCA>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (user?.role !== "admin" && user?.role !== "cca_head") return

    if (!backendReady) {
      setCcas(sampleActivities)
      setLoading(false)
      return
    }

    fetchCCAs()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, backendReady])

  async function fetchCCAs() {
    if (!backendReady) {
      return
    }

    try {
      let query = supabase.from("activities").select("*")
      if (user?.role === "cca_head" && user?.ccaName) {
        query = query.eq("name", user.ccaName)
      }
      const { data, error } = await query
      if (error) {
        console.error("Error fetching CCAs:", error)
        return
      }
      setCcas(data || [])
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  async function updateCCA(id: string, updates: Partial<CCA>) {
    if (!backendReady) {
      toast.info("Connect Supabase to enable editing.")
      return
    }

    setSaving(true)
    try {
      const payload: Partial<CCA> = {
        ...updates,
        ...(updates.year_groups ? { year_groups: formatYearGroups(updates.year_groups) } : {}),
      }

      const response = await fetch(`/api/ccas/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const result = await response.json()

      if (!response.ok) {
        console.error("Error updating CCA:", result.error)
        toast.error("Save failed", {
          description: result.error || "Please try again.",
          style: { backgroundColor: "#FF0000", color: "#FFF" },
        })
        return
      }

      setCcas(ccas.map((cca) => (cca.id === id ? { ...cca, ...result.data } : cca)))
      setEditingId(null)
      setEditForm({})
      toast.success("Changes saved successfully!", {
        description: "Your updates have been applied.",
        style: { backgroundColor: "#5CB85C", color: "#FFF" },
      })
    } catch (error) {
      console.error("Error:", error)
      toast.error("Save failed", {
        description: "Failed to save changes. Please try again.",
        style: { backgroundColor: "#FF0000", color: "#FFF" },
      })
    } finally {
      setSaving(false)
    }
  }

  function startEditing(cca: CCA) {
    if (!backendReady) return
    setEditingId(cca.id)
    setEditForm(cca)
  }

  function cancelEditing() {
    setEditingId(null)
    setEditForm({})
  }

  function formatYearGroups(input: string): string {
    const groups = input.replace(/\s/g, "").split(",")
    const valid = groups
      .filter((g) => g.trim() !== "")
      .map((g) => {
        const n = Number.parseInt(g.trim(), 10)
        return n >= 7 && n <= 13 ? n.toString() : null
      })
      .filter((g): g is string => g !== null)
    const unique = [...new Set(valid)].sort((a, b) => Number.parseInt(a) - Number.parseInt(b))
    return unique.join(", ")
  }

  function invalidYearGroups(value: string): string | null {
    const parts = value.split(",").map((p) => p.trim()).filter(Boolean)
    const bad = parts.filter((p) => !/^\d+$/.test(p) || Number(p) < 7 || Number(p) > 13)
    return bad.length ? `Invalid: ${bad.join(", ")}` : null
  }

  function handleYearGroupsChange(value: string) {
    setEditForm({ ...editForm, year_groups: value })
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
          <div className="text-center">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {!backendReady && (
          <Alert className="mb-6" variant="default">
            <AlertDescription>
              Eventure is running in demo mode. Connect Supabase to unlock live editing for your CCAs.
            </AlertDescription>
          </Alert>
        )}

        <h1 className="text-3xl font-bold mb-8">
          {user.role === "admin" ? "Manage All CCAs" : `Manage ${user.ccaName}`}
        </h1>

        <div className="space-y-6">
          {ccas.map((cca) => (
            <Card key={cca.id}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>{cca.name}</CardTitle>
                  {backendReady ? (
                    editingId === cca.id ? (
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => updateCCA(cca.id, editForm)} disabled={saving}>
                          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        </Button>
                        <Button size="sm" variant="outline" onClick={cancelEditing} disabled={saving}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <Button size="sm" variant="outline" onClick={() => startEditing(cca)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                    )
                  ) : (
                    <Badge variant="outline" className="uppercase tracking-wide text-xs text-muted-foreground">
                      Read only
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {editingId === cca.id ? (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name" className="flex items-center gap-2">
                        Name <Lock className="h-4 w-4 text-muted-foreground" />
                      </Label>
                      <Input id="name" value={editForm.name || ""} disabled className="bg-muted cursor-not-allowed" />
                      <Alert className="mt-2">
                        <Mail className="h-4 w-4" />
                        <AlertDescription>
                          CCA name changes are restricted. Contact administration at dia230403@diaestudents.com to
                          request a name change.
                        </AlertDescription>
                      </Alert>
                    </div>

                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={editForm.description || ""}
                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="learning_objectives">Learning Objectives</Label>
                      <Textarea
                        id="learning_objectives"
                        value={editForm.learning_objectives || ""}
                        onChange={(e) => setEditForm({ ...editForm, learning_objectives: e.target.value })}
                        placeholder="What will students learn and achieve in this CCA?"
                      />
                    </div>
                    <div>
                      <Label htmlFor="meeting_location">Meeting Location</Label>
                      <Input
                        id="meeting_location"
                        value={editForm.meeting_location || ""}
                        onChange={(e) => setEditForm({ ...editForm, meeting_location: e.target.value })}
                        placeholder="e.g., Computer Lab 1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="contact_email">Contact Email</Label>
                      <Input
                        id="contact_email"
                        type="email"
                        value={editForm.contact_email || ""}
                        onChange={(e) => setEditForm({ ...editForm, contact_email: e.target.value })}
                        placeholder="e.g., syntaxengine@school.edu"
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={editForm.category || ""}
                        onValueChange={(value) => setEditForm({ ...editForm, category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Academic">Academic</SelectItem>
                          <SelectItem value="Arts & Creative">Arts & Creative</SelectItem>
                          <SelectItem value="Sports & Recreation">Sports & Recreation</SelectItem>
                          <SelectItem value="STEM & Engineering">STEM & Engineering</SelectItem>
                          <SelectItem value="Leadership & Debate">Leadership & Debate</SelectItem>
                          <SelectItem value="Technology & Computing">Technology & Computing</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="year_groups">Year Groups</Label>
                      <Input
                        id="year_groups"
                        inputMode="numeric"
                        pattern="[0-9, ]*"
                        value={editForm.year_groups || ""}
                        onChange={(e) => handleYearGroupsChange(e.target.value)}
                        onBlur={(e) =>
                          setEditForm({
                            ...editForm,
                            year_groups: formatYearGroups(e.target.value),
                          })
                        }
                        placeholder="e.g., 7, 8, 9, 10, 11, 12, 13"
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        Enter year groups 7-13, separated by commas. Invalid entries will be automatically removed on
                        blur/save.
                      </p>
                      {editForm.year_groups && invalidYearGroups(editForm.year_groups) && (
                        <p className="text-xs text-red-500 mt-1">{invalidYearGroups(editForm.year_groups)}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="selection_method">Selection Method</Label>
                      <Input
                        id="selection_method"
                        value={editForm.selection_method || ""}
                        onChange={(e) => setEditForm({ ...editForm, selection_method: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="staff_members">Staff Members</Label>
                      <Input
                        id="staff_members"
                        value={editForm.staff_members || ""}
                        onChange={(e) => setEditForm({ ...editForm, staff_members: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="image_url">Image URL</Label>
                      <Input
                        id="image_url"
                        value={editForm.image_url || ""}
                        onChange={(e) => setEditForm({ ...editForm, image_url: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="logo_url">Logo URL</Label>
                      <Input
                        id="logo_url"
                        value={editForm.logo_url || ""}
                        onChange={(e) => setEditForm({ ...editForm, logo_url: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="core_committee_signup_url">Core Committee Signup URL</Label>
                      <Input
                        id="core_committee_signup_url"
                        value={editForm.core_committee_signup_url || ""}
                        onChange={(e) => setEditForm({ ...editForm, core_committee_signup_url: e.target.value })}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p><strong>Description:</strong> {cca.description}</p>
                    {cca.learning_objectives && <p><strong>Learning Objectives:</strong> {cca.learning_objectives}</p>}
                    <p><strong>Category:</strong> {cca.category}</p>
                    <p><strong>Year Groups:</strong> {cca.year_groups}</p>
                    <p><strong>Selection:</strong> {cca.selection_method}</p>
                    <p><strong>Staff:</strong> {cca.staff_members}</p>
                    {cca.meeting_location && <p><strong>Meeting Location:</strong> {cca.meeting_location}</p>}
                    {cca.contact_email && <p><strong>Contact Email:</strong> {cca.contact_email}</p>}
                    {cca.image_url && <p><strong>Image URL:</strong> {cca.image_url}</p>}
                    {cca.logo_url && <p><strong>Logo URL:</strong> {cca.logo_url}</p>}
                    {cca.core_committee_signup_url && <p><strong>Core Committee Signup:</strong> {cca.core_committee_signup_url}</p>}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
