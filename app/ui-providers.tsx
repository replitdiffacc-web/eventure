"use client"

import { Toaster } from "@/components/ui/sonner"

export default function UIProviders() {
  return (
    <Toaster
      toastOptions={{
        classNames: {
          // Root class for all toasts
          toast: "rounded-xl",
          // Variant-specific background + text
          success: "bg-[#5cb85c]",
          error: "bg-[#ff0000] text-white",
          title: "text-white",
          description: "text-white",
          actionButton: "text-white",
          cancelButton: "text-white",
        },
      }}
    />
  )
}
