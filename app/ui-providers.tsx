"use client"

import { Toaster } from "@/components/ui/sonner"

export default function UIProviders() {
  return (
    <Toaster
      richColors
      toastOptions={{
        classNames: {
          success: "bg-[#5cb85c]",
          error: "bg-[#ff0000] text-white",
        },
      }}
    />
  )
}
