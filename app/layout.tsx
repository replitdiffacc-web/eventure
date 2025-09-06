import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Suspense } from "react"
import { AuthProvider } from "@/contexts/auth-context"
import UIProviders from "./ui-providers"
import "./globals.css"

export const metadata: Metadata = {
  title: "Eventure - Activity Management System",
  description: "Centralized hub for school CCAs, committees, and events",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <AuthProvider>
          <Suspense fallback={null}>{children}</Suspense>
        </AuthProvider>

        {/* Global UI (Sonner toaster) */}
        <UIProviders />

        <footer className="bg-gray-50 dark:bg-gray-900 border-t py-4">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm text-muted-foreground">
              Made by{" "}
              <a
                href="https://anshgupta.site"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-500 dark:text-blue-400 font-medium"
              >
                Ansh Gupta
              </a>
            </p>
          </div>
        </footer>
      </body>
    </html>
  )
}
