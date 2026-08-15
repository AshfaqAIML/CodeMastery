import { NextRequest } from "next/server"
import { getSearch } from "@/lib/search"
import { ok } from "@/lib/api"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get("q") ?? ""
  const page = Number(searchParams.get("page") ?? "1")
  const pageSize = Number(searchParams.get("pageSize") ?? "12")
  const subjectId = searchParams.get("subjectId") ?? undefined
  const result = await getSearch().searchTutorials(q, { page, pageSize, subjectId })
  return ok(result)
}
