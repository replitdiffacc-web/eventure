"use server"

export async function submitContactForm(formData: FormData) {
  try {
    // Add the access key to the form data
    formData.append("access_key", process.env.WEB3FORMS_ACCESS_KEY || "")

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData,
    })

    const data = await response.json()

    if (data.success) {
      return { success: true, message: "Form submitted successfully!" }
    } else {
      console.log("Web3Forms Error:", data)
      return { success: false, message: data.message || "Failed to send message" }
    }
  } catch (error) {
    console.error("Contact form error:", error)
    return { success: false, message: "Failed to send message. Please try again." }
  }
}
