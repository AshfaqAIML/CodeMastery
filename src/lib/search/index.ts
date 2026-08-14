import { config } from "@/lib/config"
import type { SearchService } from "./types"
import { DBSearchService } from "./db"

let _instance: SearchService | null = null

export function getSearch(): SearchService {
  if (_instance) return _instance
  // Currently only DB-backed search is implemented.
  // To add Meilisearch/Elasticsearch, branch on config.search.provider here.
  _instance = new DBSearchService()
  return _instance
}

export type { SearchService, SearchResult, SearchHit }
