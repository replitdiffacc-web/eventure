import type { ComponentType } from "react"
import Navigation from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { sampleResources } from "@/lib/sample-data"
import * as Icons from "lucide-react"
import Link from "next/link"

function DynamicIcon({ name }: { name: string }) {
  const IconComponent = (Icons as Record<string, ComponentType<{ className?: string }>>)[name] || Icons.FileText
  return <IconComponent className="h-6 w-6 text-blue-500" />
}

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <section className="bg-gradient-to-br from-blue-50 to-purple-100 dark:from-blue-950 dark:to-purple-950 py-16 border-b">
        <div className="container mx-auto px-4 text-center space-y-6">
          <Badge className="mx-auto w-fit">Resource hub</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100">
            Guides, templates, and support for every leader
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Find playbooks for running CCAs, hosting events, communicating with families, and supporting your teams.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4 grid lg:grid-cols-3 gap-8">
          {sampleResources.map((category) => (
            <Card key={category.id} className="h-full">
              <CardHeader className="space-y-3">
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                  <DynamicIcon name={category.icon} />
                </div>
                <CardTitle>{category.title}</CardTitle>
                <CardDescription>{category.summary}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {category.items.map((item) => (
                  <div key={item.name} className="border border-dashed border-slate-200 dark:border-slate-800 rounded-lg p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-medium text-slate-900 dark:text-slate-100">{item.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                      </div>
                      <Button asChild variant="outline" className="bg-transparent" size="sm">
                        <Link href={item.link} target={item.link.startsWith("http") ? "_blank" : undefined}>
                          Open
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
