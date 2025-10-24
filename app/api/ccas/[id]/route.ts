import { type NextRequest, NextResponse } from "next/server"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  if (!isSupabaseConfigured) {
    return NextResponse.json(
      { error: "Supabase is not configured. Connect the database to enable updates." },
      { status: 503 },
    )
  }

  try {
    const { id } = params
    const body = await request.json()

    console.log("Updating CCA:", id)

    // Check if CCA exists first
    const { data: existingCCA, error: selectError } = await supabase.from("activities").select("*").eq("id", id)

    if (selectError) {
      console.error("Error checking existing CCA:", selectError)
      return NextResponse.json({ error: "Database error checking CCA", details: selectError.message }, { status: 500 })
    }

    if (!existingCCA || existingCCA.length === 0) {
      console.error("CCA not found with ID:", id)
      return NextResponse.json({ error: "CCA not found" }, { status: 404 })
    }

    const updateData: any = {
      updated_at: new Date().toISOString(),
    }

    // Map frontend fields to database fields
    if (body.description !== undefined) updateData.description = body.description
    if (body.learning_objectives !== undefined) updateData.learning_objectives = body.learning_objectives
    if (body.meeting_location !== undefined) updateData.meeting_location = body.meeting_location
    if (body.contact_email !== undefined) updateData.contact_email = body.contact_email
    if (body.year_groups !== undefined) updateData.year_groups = body.year_groups
    if (body.category !== undefined) updateData.category = body.category
    if (body.selection_method !== undefined) updateData.selection_method = body.selection_method
    if (body.staff_members !== undefined) updateData.staff_members = body.staff_members
    if (body.image_url !== undefined) updateData.image_url = body.image_url
    if (body.logo_url !== undefined) updateData.logo_url = body.logo_url
    if (body.core_committee_signup_url !== undefined)
      updateData.core_committee_signup_url = body.core_committee_signup_url

    const hasChanges = Object.keys(updateData).length > 1 // More than just updated_at

    if (!hasChanges) {
      return NextResponse.json({
        success: true,
        message: "No changes made",
        data: existingCCA[0],
      })
    }

    const { data, error } = await supabase.from("activities").update(updateData).eq("id", id).select()

    if (error) {
      console.error("Database update error:", error)

      if (error.code === "PGRST116" || error.message?.includes("policy")) {
        return NextResponse.json(
          {
            error: "Permission denied - you may not have access to update this CCA. Please contact an administrator.",
            code: "RLS_POLICY_VIOLATION",
          },
          { status: 403 },
        )
      }

      return NextResponse.json({ error: "Failed to update CCA", details: error.message }, { status: 500 })
    }

    if (!data || data.length === 0) {
      console.error("Update returned no data - likely RLS policy issue")
      return NextResponse.json(
        {
          error:
            "Update failed - you may not have permission to modify this CCA. Please ensure your account is properly linked to this CCA.",
          code: "RLS_NO_ROWS_AFFECTED",
        },
        { status: 403 },
      )
    }

    console.log("CCA updated successfully")

    return NextResponse.json({
      success: true,
      message: "CCA updated successfully",
      data: data[0],
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
