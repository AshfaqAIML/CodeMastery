/**
 * Search service abstraction.
 *
 * Default implementation uses the relational database (Prisma) with
 * LIKE/contains queries. This is portable and requires no extra service.
 *
 * The interface allows future migration to Meilisearch, Elasticsearch,
 * OpenSearch, or Typesense without changing application code.
 */

export interface SearchHit {
  id: string
  type: "tutorial" | "subject"
  title: string
  summary: string
  slug: string
  subjectSlug?: string
  subjectName?: string
  subjectColor?: string
  difficulty?: string
  icon?: string
  score?: number
}

export interface SearchResult {
  hits: SearchHit[]
  total: number
  page: number
  pageSize: number
}

export interface SearchService {
  searchTutorials(
    query: string,
    opts?: { page?: number; pageSize?: number; subjectId?: string }
  ): Promise<SearchResult>
  suggest(query: string, limit?: number): Promise<string[]>
}
