import { test, expect } from "@playwright/test"

test.describe("API Health", () => {
  test("health endpoint returns ok", async ({ request }) => {
    const response = await request.get("/api/health")
    expect(response.ok()).toBeTruthy()
    const data = await response.json()
    expect(data.ok).toBe(true)
    expect(data.data.status).toBe("ok")
  })

  test("subjects endpoint returns data", async ({ request }) => {
    const response = await request.get("/api/subjects?withCounts=true")
    expect(response.ok()).toBeTruthy()
    const data = await response.json()
    expect(data.ok).toBe(true)
    expect(data.data.length).toBeGreaterThan(0)
    expect(data.data[0]).toHaveProperty("slug")
    expect(data.data[0]).toHaveProperty("name")
    expect(data.data[0]).toHaveProperty("tutorialCount")
  })

  test("leaderboard endpoint returns data", async ({ request }) => {
    const response = await request.get("/api/leaderboard")
    expect(response.ok()).toBeTruthy()
    const data = await response.json()
    expect(data.ok).toBe(true)
    expect(data.data.entries).toBeDefined()
  })

  test("daily challenge endpoint returns data", async ({ request }) => {
    const response = await request.get("/api/daily-challenge")
    expect(response.ok()).toBeTruthy()
    const data = await response.json()
    expect(data.ok).toBe(true)
    expect(data.data).toHaveProperty("xpBonus")
  })

  test("AI status endpoint returns config", async ({ request }) => {
    const response = await request.get("/api/ai/status")
    expect(response.ok()).toBeTruthy()
    const data = await response.json()
    expect(data.ok).toBe(true)
    expect(data.data).toHaveProperty("enabled")
  })

  test("protected endpoints return 401 when unauthenticated", async ({ request }) => {
    const endpoints = [
      "/api/notifications",
      "/api/xp-history",
      "/api/streak-heatmap",
    ]
    for (const ep of endpoints) {
      const response = await request.get(ep)
      expect(response.status()).toBe(401)
    }
  })

  test("search returns results", async ({ request }) => {
    const response = await request.get("/api/search?q=python")
    expect(response.ok()).toBeTruthy()
    const data = await response.json()
    expect(data.ok).toBe(true)
    expect(data.data.total).toBeGreaterThanOrEqual(0)
  })

  test("sitemap.xml is accessible", async ({ request }) => {
    const response = await request.get("/sitemap.xml")
    expect(response.ok()).toBeTruthy()
    const text = await response.text()
    expect(text).toContain("<urlset")
  })

  test("robots.txt is accessible", async ({ request }) => {
    const response = await request.get("/robots.txt")
    expect(response.ok()).toBeTruthy()
    const text = await response.text()
    expect(text).toContain("User-Agent")
    expect(text).toContain("Sitemap")
  })

  test("manifest.json is accessible", async ({ request }) => {
    const response = await request.get("/manifest.json")
    expect(response.ok()).toBeTruthy()
    const data = await response.json()
    expect(data.name).toContain("CodeMastery")
  })

  test("imported JavaScript course is searchable", async ({ request }) => {
    const response = await request.get("/api/search?q=closure")
    expect(response.ok()).toBeTruthy()
    const data = await response.json()
    expect(data.ok).toBe(true)
    const hit = data.data.hits.find((h: any) => h.slug === "chapter-34-closures")
    expect(hit).toBeTruthy()
    expect(hit.subjectSlug).toBe("complete-javascript-for-absolute-beginners")
  })

  test("imported JavaScript tutorial fetches fully", async ({ request }) => {
    const response = await request.get(
      "/api/tutorials/complete-javascript-for-absolute-beginners/chapter-34-closures"
    )
    expect(response.ok()).toBeTruthy()
    const data = await response.json()
    expect(data.ok).toBe(true)
    const t = data.data.tutorial
    expect(t.slug).toBe("chapter-34-closures")
    expect(t.content.length).toBeGreaterThan(5000)
    expect(t.learningObjectives.length).toBeGreaterThan(0)
    expect(t.keyTakeaways.length).toBeGreaterThan(0)
  })

  test("imported JavaScript subject exposes 9 modules and 62 tutorials", async ({ request }) => {
    const response = await request.get("/api/subjects/complete-javascript-for-absolute-beginners")
    expect(response.ok()).toBeTruthy()
    const data = await response.json()
    expect(data.ok).toBe(true)
    const s = data.data
    expect(s.modules.length).toBe(9)
    const tutorials = s.modules.reduce((n: number, m: any) => n + m.tutorials.length, 0)
    expect(tutorials).toBe(62)
    const slugs = s.modules.flatMap((m: any) => m.tutorials.map((t: any) => t.slug))
    expect(slugs).toContain("project-3-to-do-list-application")
    expect(slugs).toContain("chapter-34-closures")
  })
})
