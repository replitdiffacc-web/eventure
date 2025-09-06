"use client"

import { createContext, useContext, useState, useEffect, useRef, type ReactNode } from "react"
import { supabase } from "@/lib/supabase"
import type { User as SupabaseUser } from "@supabase/supabase-js"

interface User {
  id: string
  email: string
  name: string
  role: "admin" | "cca_head"
  ccaId?: string
  ccaName?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  isChecking: boolean // bootstrap-only loading
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// ---- helpers --------------------------------------------------------------
function withTimeout<T>(p: Promise<T>, ms = 12000) {
  return Promise.race<T>([
    p,
    new Promise<T>((_, rej) => setTimeout(() => rej(new Error("timeout")), ms)),
  ])
}
// --------------------------------------------------------------------------

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isChecking, setIsChecking] = useState(true)
  const initialHandled = useRef(false)

  useEffect(() => {
    // Fires once immediately with INITIAL_SESSION, then on changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      try {
        if (session?.user) {
          // Only do the first-time fetch from this hook once
          if (!initialHandled.current) {
            initialHandled.current = true
            // fire-and-forget so we don't block UI
            fetchUserProfile(session.user).catch((e) =>
              console.error("Auth change fetch profile error:", e)
            )
          }
        } else {
          setUser(null)
        }
      } finally {
        setIsChecking(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchUserProfile = async (supabaseUser: SupabaseUser) => {
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", supabaseUser.id)

    if (error) {
      console.error("Error fetching user profile:", error)
      return
    }
    if (!profile || profile.length !== 1) {
      console.error("Profile missing or not unique for user:", supabaseUser.id)
      return
    }

    const p = profile[0]
    setUser({
      id: supabaseUser.id,
      email: supabaseUser.email || "",
      name: p.name,
      role: p.role,
      ccaId: p.cca_id,
      ccaName: p.cca_name,
    })
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Put a hard timeout around the auth call so UI never hangs forever
      const { data, error } = await withTimeout(
        supabase.auth.signInWithPassword({ email, password }),
        12000
      )

      if (error) {
        console.error("Login error:", error)
        return false
      }
      if (data?.user) {
        // do NOT block the login on profile fetch; kick it off in the background
        fetchUserProfile(data.user).catch((e) => console.error("Profile fetch after login:", e))
        return true
      }
      return false
    } catch (err) {
      console.error("Login error:", err)
      return false
    }
  }

  const logout = async (): Promise<void> => {
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isChecking }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
