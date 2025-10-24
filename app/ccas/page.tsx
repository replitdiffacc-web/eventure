import { Button } from "@/components/ui/button"
import Navigation from "@/components/navigation"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"
import { CCAsClient } from "@/components/ccas-client"
import { sampleActivities } from "@/lib/sample-data"

interface CCA {
  id: string
  name: string
  description: string | null
  category: string
  staff_members: string | null
  year_groups: string | null
  selection_method: string | null
  meeting_location: string | null // Added meeting_location field
  image_url: string | null
  is_active: boolean
  slug?: string
}

async function getCCAsData() {
  if (!isSupabaseConfigured) {
    const active = sampleActivities.filter((cca) => cca.is_active)
    const uniqueCategories = Array.from(new Set(active.map((c) => c.category)))
    return {
      ccas: active,
      categories: ["All", ...uniqueCategories.sort()],
    }
  }

  try {
    // Fetch CCAs with meeting_location
    const { data: ccasData, error: ccasError } = await supabase
      .from("activities")
      .select(
        "id, name, description, category, staff_members, year_groups, selection_method, meeting_location, image_url, is_active",
      )
      .eq("is_active", true)
      .order("name", { ascending: true })

    if (ccasError) {
      console.error("Error fetching CCAs:", ccasError)
      return { ccas: [], categories: ["All"] }
    }

    // Get unique categories
    const uniqueCategories = Array.from(new Set(ccasData?.map((c) => c.category) || []))
    const categories = ["All", ...uniqueCategories.sort()]

    return {
      ccas: ccasData && ccasData.length > 0 ? ccasData : sampleActivities.filter((cca) => cca.is_active),
      categories,
    }
  } catch (error) {
    console.error("Error fetching data:", error)
    const active = sampleActivities.filter((cca) => cca.is_active)
    const uniqueCategories = Array.from(new Set(active.map((c) => c.category)))
    return { ccas: active, categories: ["All", ...uniqueCategories.sort()] }
  }
}

function formatYearGroups(yearGroups: string | null): string {
  if (!yearGroups) return ""
  return yearGroups.replace(/,/g, ", ")
}

export default async function CCAsPage() {
  const { ccas, categories } = await getCCAsData()

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Header */}
      <section className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-balance mb-4 text-gray-900 dark:text-gray-100">
              Co-Curricular Activities
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 text-pretty">
              Discover and join activities that match your interests and passions
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <CCAsClient initialCcas={ccas} categories={categories} />

        {/* Call to Action */}
        <div className="text-center mt-12 p-8 bg-blue-50 dark:bg-blue-950 rounded-lg">
          <h2 className="text-2xl font-bold mb-4 text-blue-900 dark:text-blue-100">
            Don't see what you're looking for?
          </h2>
          <p className="text-blue-700 dark:text-blue-200 mb-6">
            We're always open to starting new CCAs based on student interest.
          </p>
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
            Propose New CCA
          </Button>
        </div>
      </div>
    </div>
  )
}

export type { CCA }
export { formatYearGroups }
