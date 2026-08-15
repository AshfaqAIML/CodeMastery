import { NextRequest } from "next/server"
import { db } from "@/lib/db"
import { ok, unauthorized } from "@/lib/api"
import { getCurrentUser } from "@/lib/session"

/**
 * Export the user's bookmarks as JSON or Markdown.
 * Query param: format=json (default) or format=markdown
 */
export async function GET(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return unauthorized()

  const { searchParams } = new URL(req.url)
  const format = searchParams.get("format") ?? "json"

  const bookmarks = await db.bookmark.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      tutorial: {
        select: {
          id: true,
          slug: true,
          title: true,
          summary: true,
          difficulty: true,
          estimatedMinutes: true,
          tags: true,
          subject: { select: { slug: true, name: true, color: true } },
        },
      },
    },
  })

  if (format === "markdown") {
    let md = `# My CodeMastery Bookmarks\n\n`
    md += `_Exported on ${new Date().toLocaleDateString()} · ${bookmarks.length} tutorials_\n\n`
    bookmarks.forEach((b, i) => {
      md += `## ${i + 1}. ${b.tutorial.title}\n\n`
      md += `- **Subject**: ${b.tutorial.subject.name}\n`
      md += `- **Difficulty**: ${b.tutorial.difficulty}\n`
      md += `- **Read time**: ${b.tutorial.estimatedMinutes} min\n`
      md += `- **Summary**: ${b.tutorial.summary}\n`
      md += `- **Bookmarked**: ${new Date(b.createdAt).toLocaleDateString()}\n\n`
    })
    return new Response(md, {
      headers: {
        "Content-Type": "text/markdown",
        "Content-Disposition": `attachment; filename="codemastery-bookmarks.md"`,
      },
    })
  }

  // JSON format
  return Response.json({
    ok: true,
    data: {
      exportedAt: new Date().toISOString(),
      count: bookmarks.length,
      bookmarks: bookmarks.map((b) => ({
        title: b.tutorial.title,
        slug: b.tutorial.slug,
        summary: b.tutorial.summary,
        difficulty: b.tutorial.difficulty,
        estimatedMinutes: b.tutorial.estimatedMinutes,
        tags: b.tutorial.tags,
        subject: b.tutorial.subject,
        bookmarkedAt: b.createdAt,
      })),
    },
  })
}
