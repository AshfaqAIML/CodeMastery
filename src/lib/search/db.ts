import { db } from "@/lib/db"
import type { SearchService, SearchResult } from "./types"

/**
 * Database-backed search. Works on SQLite and PostgreSQL.
 * Uses LIKE (case-insensitive on most collations) for broad portability.
 * For large datasets, migrate to Meilisearch/Elasticsearch via the same interface.
 */
export class DBSearchService implements SearchService {
  #mode = (process.env.DATABASE_URL ?? "").startsWith("file:")
    ? undefined
    : { mode: "insensitive" as const } // Postgres LIKE is case-sensitive; SQLite is already CI

  async searchTutorials(
    query: string,
    opts: { page?: number; pageSize?: number; subjectId?: string } = {}
  ): Promise<SearchResult> {
    const page = Math.max(1, opts.page ?? 1)
    const pageSize = Math.min(48, Math.max(1, opts.pageSize ?? 12))
    const q = (query ?? "").trim()
    const ci = (s: string) => (this.#mode ? { contains: s, ...this.#mode } : { contains: s })
    const where = {
      published: true,
      ...(opts.subjectId ? { subjectId: opts.subjectId } : {}),
      ...(q
        ? {
            OR: [
              { title: ci(q) },
              { summary: ci(q) },
              { tags: ci(q) },
            ],
          }
        : {}),
    }
    const [total, rows] = await Promise.all([
      db.tutorial.count({ where }),
      db.tutorial.findMany({
        where,
        include: { subject: { select: { slug: true, name: true, color: true, icon: true } } },
        orderBy: [{ order: "asc" }, { title: "asc" }],
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ])
    return {
      total,
      page,
      pageSize,
      hits: rows.map((r) => ({
        id: r.id,
        type: "tutorial" as const,
        title: r.title,
        summary: r.summary,
        slug: r.slug,
        subjectSlug: r.subject.slug,
        subjectName: r.subject.name,
        subjectColor: r.subject.color,
        icon: r.subject.icon,
        difficulty: r.difficulty,
      })),
    }
  }

  async suggest(query: string, limit = 8): Promise<string[]> {
    const q = (query ?? "").trim()
    if (!q) return []
    const rows = await db.tutorial.findMany({
      where: { published: true, title: { contains: q } },
      select: { title: true },
      take: limit,
    })
    return rows.map((r) => r.title)
  }
}
