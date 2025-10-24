import Navigation from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { sampleFaqs } from "@/lib/sample-data"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const groupedFaqs = sampleFaqs.reduce<Record<string, typeof sampleFaqs>>((acc, faq) => {
  acc[faq.category] = acc[faq.category] ? [...acc[faq.category], faq] : [faq]
  return acc
}, {})

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <section className="bg-gradient-to-r from-slate-50 to-blue-100 dark:from-slate-950 dark:to-blue-950 py-16 border-b">
        <div className="container mx-auto px-4 text-center space-y-6">
          <Badge className="mx-auto w-fit">FAQ</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100">
            Answers to common Eventure questions
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Everything you need to know about joining CCAs, managing committees, and getting the most from Eventure.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-8">
          {Object.entries(groupedFaqs).map(([category, faqs]) => (
            <Card key={category} className="h-full">
              <CardHeader>
                <CardTitle>{category}</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="space-y-2">
                  {faqs.map((faq) => (
                    <AccordionItem key={faq.id} value={faq.id} className="border border-slate-200 dark:border-slate-800 rounded-lg px-4">
                      <AccordionTrigger className="text-left text-base font-medium">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
