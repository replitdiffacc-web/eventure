import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.REACT_APP_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.REACT_APP_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types for better TypeScript support
export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "cca_head"
  cca_id?: string
  cca_name?: string
  created_at?: string
  updated_at?: string
}

export interface UserProfile {
  id: string
  user_id: string
  name: string
  role: "admin" | "cca_head"
  cca_id?: string
  cca_name?: string
  created_at?: string
  updated_at?: string
}
