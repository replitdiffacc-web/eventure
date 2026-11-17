import { supabase, isSupabaseConfigured } from "./supabase"

// Demo user credentials that match the login page
export const demoUsers = [
  {
    email: 'archive-user-1@example.invalid',
    password: "",
    profile: {
      name: "School Administrator",
      role: "admin",
      cca_id: null,
      cca_name: null,
    },
  },
  {
    email: 'archive-user-2@example.invalid',
    password: "",
    profile: {
      name: "Abstract Club Head",
      role: "cca_head",
      cca_id: "abstract",
      cca_name: "Abstract Club",
    },
  },
  {
    email: 'archive-user-3@example.invalid',
    password: "",
    profile: {
      name: "ALPHA Head",
      role: "cca_head",
      cca_id: "alpha",
      cca_name: "ALPHA Leadership",
    },
  },
  {
    email: 'archive-user-4@example.invalid',
    password: "",
    profile: {
      name: "Brush Up Head",
      role: "cca_head",
      cca_id: "brushup",
      cca_name: "Brush Up Art Society",
    },
  },
]

// Function to create demo users (for development setup)
export async function createDemoUsers() {
  console.log("Creating demo users...")

  if (!isSupabaseConfigured) {
    console.warn("Supabase is not configured. Skipping demo user creation.")
    return
  }

  for (const user of demoUsers) {
    if (!user.password) { console.warn("Historical demo account provisioning disabled in portable archive"); return }
    try {
      // Sign up the user
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: user.email,
        password: user.password,
        options: {
          data: user.profile,
        },
      })

      if (signUpError) {
        console.error(`Error creating user ${user.email}:`, signUpError.message)
        continue
      }

      if (authData.user) {
        // Create or update profile
        const { error: profileError } = await supabase.from("profiles").upsert({
          user_id: authData.user.id,
          ...user.profile,
        })

        if (profileError) {
          console.error(`Error creating profile for ${user.email}:`, profileError.message)
        } else {
          console.log(`Successfully created user: ${user.email}`)
        }
      }
    } catch (error) {
      console.error(`Unexpected error creating user ${user.email}:`, error)
    }
  }
}
