import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  console.log("===== CONTACT API ROUTE CALLED =====")
  console.log("Request method:", request.method)
  console.log("Request URL:", request.url)

  try {
    const accessKey = process.env.WEB3FORMS_ACCESS_KEY
    console.log("WEB3FORMS_ACCESS_KEY exists:", !!accessKey)
    console.log("WEB3FORMS_ACCESS_KEY length:", accessKey?.length || 0)

    if (!accessKey) {
      console.error("ERROR: WEB3FORMS_ACCESS_KEY environment variable is not set")
      return NextResponse.json(
        { success: false, message: "WEB3FORMS_ACCESS_KEY environment variable is not configured" },
        { status: 500 },
      )
    }

    console.log("Parsing request body...")
    const body = await request.json()
    console.log("Request body received:", JSON.stringify(body, null, 2))

    const { name, email, subject, category, message } = body

    if (!name || !email || !subject || !message) {
      console.log("Validation failed - missing fields:", {
        name: !!name,
        email: !!email,
        subject: !!subject,
        message: !!message,
      })
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 })
    }

    const payload = {
      access_key: accessKey,
      name,
      email,
      subject,
      message: category ? `Category: ${category}\n\n${message}` : message,
    }

    console.log("Sending to Web3Forms API...")
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    console.log("Web3Forms response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Web3Forms API error:", response.status, errorText)
      return NextResponse.json({ success: false, message: "Failed to send message to Web3Forms" }, { status: 500 })
    }

    const result = await response.json()
    console.log("Web3Forms response:", result)

    if (result.success) {
      console.log("SUCCESS: Message sent via Web3Forms")
      return NextResponse.json({ success: true, message: "Message sent successfully" })
    } else {
      console.error("Web3Forms returned failure:", result)
      return NextResponse.json(
        { success: false, message: result.message || "Web3Forms rejected the submission" },
        { status: 400 },
      )
    }
  } catch (error) {
    console.error("CRITICAL ERROR in contact API:", error)
    if (error instanceof Error) {
      console.error("Error message:", error.message)
      console.error("Error stack:", error.stack)
    }
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
