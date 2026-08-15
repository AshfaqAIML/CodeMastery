import type { MetadataRoute } from "next"
import { db } from "@/lib/db"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://codemastery.dev"

  const staticUrls = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily" as const, priority: 1 },
  ]

  // Add subject URLs
  let subjectUrls: MetadataRoute.Sitemap = []
  let tutorialUrls: MetadataRoute.Sitemap = []

  try {
    const subjects = await db.subject.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
    })
    subjectUrls = subjects.map((s) => ({
      url: `${baseUrl}/?s=${s.slug}`,
      lastModified: s.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }))

    const tutorials = await db.tutorial.findMany({
      where: { published: true },
      select: { slug: true, subject: { select: { slug: true } }, updatedAt: true },
    })
    tutorialUrls = tutorials.map((t) => ({
      url: `${baseUrl}/?s=${t.subject.slug}&t=${t.slug}`,
      lastModified: t.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }))
  } catch {
    // DB not available during build — return static URLs only
  }

  return [...staticUrls, ...subjectUrls, ...tutorialUrls]
}
