"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff, LogIn, School } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/contexts/auth-context"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const { login, isChecking } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!email || !password) {
      setError("Please fill in all fields")
      return
    }

    setSubmitting(true)
    try {
      const success = await login(email, password)
      if (success) {
        router.push("/admin")
      } else {
        setError("Invalid email or password")
      }
    } catch (err) {
      setError("Something went wrong signing in. Please try again.")
      console.error(err)
    } finally {
      // ALWAYS re-enable the button
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <School className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">Eventure</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Welcome Back</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Sign in to manage your CCA</p>
        </div>

        {/* Optional: non-blocking notice during auth bootstrap */}
        {isChecking && (
          <Alert>
            <AlertDescription>Checking your session… You can still sign in below.</AlertDescription>
          </Alert>
        )}

        {/* Login Form */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-center">Sign In</CardTitle>
            <CardDescription className="text-center">Enter your credentials to access the admin panel</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@school.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="username"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <LogIn className="h-4 w-4" />
                    <span>Sign In</span>
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Back to Home */}
        <div className="text-center">
          <Link href="/" className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
