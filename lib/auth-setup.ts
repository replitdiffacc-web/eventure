import { supabase } from "./supabase"

// Demo user credentials that match the login page
export const demoUsers = [
  {
    email: "admin@school.edu",
    password: "admin123",
    profile: {
      name: "School Administrator",
      role: "admin",
      cca_id: null,
      cca_name: null,
    },
  },
  {
    email: "abstract@school.edu",
    password: "abstract123",
    profile: {
      name: "Abstract Club Head",
      role: "cca_head",
      cca_id: "abstract",
      cca_name: "Abstract Club",
    },
  },
  {
    email: "alpha@school.edu",
    password: "alpha123",
    profile: {
      name: "ALPHA Head",
      role: "cca_head",
      cca_id: "alpha",
      cca_name: "ALPHA Leadership",
    },
  },
  {
    email: "brushup@school.edu",
    password: "brushup123",
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

  for (const user of demoUsers) {
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
