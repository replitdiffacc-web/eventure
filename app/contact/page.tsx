"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Mail, Send, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Navigation from "@/components/navigation"
import { submitContactForm } from "./actions"

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [result, setResult] = useState("")
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setResult("Sending...")

    try {
      const formData = new FormData(e.currentTarget)
      const response = await submitContactForm(formData)

      if (response.success) {
        setResult("Form Submitted Successfully")
        setIsSubmitted(true)
        if (formRef.current) {
          formRef.current.reset()
        }
      } else {
        setResult(response.message)
      }
    } catch (error) {
      console.error("Error sending message:", error)
      setResult("Failed to send message. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      content: "dia230403@diaestudents.com",
      description: "Send us an email anytime",
    },
  ]

  const categories = ["General Inquiry", "CCA Information", "Event Questions", "Technical Support", "Feedback", "Other"]

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Header */}
      <section className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-balance mb-4 text-gray-900 dark:text-gray-100">
              Contact Us
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 text-pretty">
              Have questions or need assistance? We're here to help you with anything related to school activities.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Get in Touch</h2>
            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="flex items-start space-x-4">
                      <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-lg">
                        <info.icon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">{info.title}</h3>
                        <p className="text-gray-900 dark:text-gray-100 font-medium">{info.content}</p>
                        <p className="text-sm text-muted-foreground">{info.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Send us a Message
                </CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isSubmitted ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-green-700 dark:text-green-400 mb-2">
                      Message Sent Successfully!
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Thank you for contacting us. We'll get back to you within 24 hours.
                    </p>
                    <Button onClick={() => setIsSubmitted(false)} variant="outline">
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input id="name" name="name" placeholder="Enter your full name" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input id="email" name="email" type="email" placeholder="Enter your email address" required />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select name="category">
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject *</Label>
                        <Input id="subject" name="subject" placeholder="Brief subject of your message" required />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="Please provide details about your inquiry..."
                        rows={6}
                        required
                      />
                    </div>

                    {result && !isSubmitted && (
                      <div className="text-center text-sm text-muted-foreground">{result}</div>
                    )}

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
