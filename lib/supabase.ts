import { createClient, type SupabaseClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.REACT_APP_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.REACT_APP_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

const notConfiguredError = new Error(
  "Supabase client is not configured. Provide NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to enable live data.",
)

class MockQueryBuilder<T = unknown> {
  private count: number | null = null

  constructor(private readonly data: T) {}

  private buildResponse() {
    const payload = Array.isArray(this.data) ? (this.data as T) : this.data
    const derivedCount = Array.isArray(payload) ? payload.length : null

    return {
      data: payload,
      error: notConfiguredError,
      count: this.count ?? derivedCount,
      status: 503,
      statusText: "Supabase client not configured",
    }
  }

  select(_columns?: string, options?: { count?: "exact" | "planned" | "estimated"; head?: boolean }) {
    if (options?.count) {
      this.count = 0
    }
    return this
  }

  eq() {
    return this
  }

  order() {
    return this
  }

  limit() {
    return this
  }

  gte() {
    return this
  }

  lte() {
    return this
  }

  ilike() {
    return this
  }

  range() {
    return this
  }

  single() {
    return Promise.resolve(this.buildResponse())
  }

  maybeSingle() {
    return Promise.resolve(this.buildResponse())
  }

  insert() {
    return Promise.resolve(this.buildResponse())
  }

  update() {
    return Promise.resolve(this.buildResponse())
  }

  upsert() {
    return Promise.resolve(this.buildResponse())
  }

  delete() {
    return Promise.resolve(this.buildResponse())
  }

  then<TResult1 = unknown, TResult2 = never>(
    onfulfilled?: ((value: ReturnType<MockQueryBuilder<T>["buildResponse"]>) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null,
  ) {
    return Promise.resolve(this.buildResponse()).then(onfulfilled, onrejected)
  }
}

class MockSupabaseClient {
  auth = {
    onAuthStateChange: () => ({
      data: {
        subscription: {
          unsubscribe: () => {},
        },
      },
    }),
    signInWithPassword: async () => ({
      data: { user: null, session: null },
      error: notConfiguredError,
    }),
    signOut: async () => ({ error: notConfiguredError }),
    signUp: async () => ({ data: { user: null, session: null }, error: notConfiguredError }),
    getUser: async () => ({ data: { user: null }, error: notConfiguredError }),
  }

  from() {
    return new MockQueryBuilder<[]>([])
  }

  rpc = async () => ({ data: null, error: notConfiguredError })

  storage = {
    from: () => ({
      download: async () => ({ data: null, error: notConfiguredError }),
      upload: async () => ({ data: null, error: notConfiguredError }),
      list: async () => ({ data: null, error: notConfiguredError }),
      remove: async () => ({ data: null, error: notConfiguredError }),
    }),
  }

  functions = {
    invoke: async () => ({ data: null, error: notConfiguredError }),
  }
}

if (!isSupabaseConfigured) {
  console.warn(
    "Supabase environment variables are missing. Eventure will fall back to sample content until Supabase is configured.",
  )
}

export const supabase: SupabaseClient = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : (new MockSupabaseClient() as unknown as SupabaseClient)

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
