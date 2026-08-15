"use client"

import * as React from "react"

interface BreadcrumbItem {
  name: string
  url?: string
}

export function StructuredData({
  type,
  data,
}: {
  type: "Article" | "Breadcrumb" | "FAQPage"
  data: any
}) {
  let schema: any

  if (type === "Article") {
    schema = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: data.title,
      description: data.summary,
      author: { "@type": "Organization", name: "CodeMastery" },
      publisher: { "@type": "Organization", name: "CodeMastery" },
      ...(data.subjectName ? { about: data.subjectName } : {}),
      ...(data.difficulty ? { educationalLevel: data.difficulty } : {}),
      ...(data.estimatedMinutes ? { timeRequired: `PT${data.estimatedMinutes}M` } : {}),
    }
  } else if (type === "Breadcrumb") {
    schema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: data.items.map((item: BreadcrumbItem, i: number) => ({
        "@type": "ListItem",
        position: i + 1,
        name: item.name,
        ...(item.url ? { item: item.url } : {}),
      })),
    }
  } else if (type === "FAQPage") {
    schema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: data.questions.map((q: any) => ({
        "@type": "Question",
        name: q.prompt,
        acceptedAnswer: { "@type": "Answer", text: q.options[q.answerIndex] },
      })),
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
