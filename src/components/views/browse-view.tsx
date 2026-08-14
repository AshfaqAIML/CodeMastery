"use client"

import * as React from "react"
import { Search, Compass, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import { useAppStore } from "@/lib/store"
import { useSubjects, useSearch } from "@/hooks/use-api"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { SubjectIcon } from "@/components/shared/subject-icon"
import { Input } from "@/components/ui/input"

const CATEGORIES = ["All", "Programming", "Data", "Systems", "AI/ML", "Web", "Career"]

export function BrowseView() {
  const { navigate } = useAppStore()
  const { data: subjects, isLoading } = useSubjects({ withCounts: true, withProgress: true })
  const [cat, setCat] = React.useState("All")
  const [q, setQ] = React.useState("")
  const debounced = useDebounced(q, 250)
  const { data: searchRes, isLoading: searching } = useSearch(debounced)

  const filtered = React.useMemo(() => {
    let list = subjects ?? []
    if (cat !== "All") list = list.filter((s: any) => s.category === cat)
    return list
  }, [subjects, cat])

  const searchHits = searchRes?.hits ?? []
  const searchingActive = q.trim().length > 0

  return (
    <div className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 py-8 sm:py-12">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight flex items-center gap-3">
          <Compass className="size-8 text-primary" />
          Browse subjects
        </h1>
        <p className="text-muted-foreground mt-2">
          Explore {(subjects ?? []).length} subjects across computer science and AI engineering.
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search tutorials..."
          className="pl-10 h-11"
        />
      </div>

      {searchingActive ? (
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            {searching && <Loader2 className="size-4 animate-spin" />}
            {searchHits.length} result{searchHits.length !== 1 ? "s" : ""} for &ldquo;{q}&rdquo;
          </div>
          {searchHits.length === 0 && !searching ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                No tutorials found. Try a different search.
              </CardContent>
            </Card>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchHits.map((hit) => (
                <Card
                  key={hit.id}
                  className="cursor-pointer hover:border-primary/40 hover:shadow-md transition-all"
                  onClick={() => navigate("tutorial", { subjectSlug: hit.subjectSlug, tutorialSlug: hit.slug })}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <SubjectIcon name={hit.icon} color={hit.subjectColor} className="size-6 rounded" />
                      {hit.subjectName}
                    </div>
                    <CardTitle className="text-base mt-2">{hit.title}</CardTitle>
                    <CardDescription className="line-clamp-2 text-xs">{hit.summary}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Category filter with counts */}
          <div className="flex flex-wrap gap-2 mb-8">
            {CATEGORIES.map((c) => {
              const count = c === "All"
                ? (subjects ?? []).length
                : (subjects ?? []).filter((s: any) => s.category === c).length
              return (
                <button
                  key={c}
                  onClick={() => setCat(c)}
                  className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all border flex items-center gap-1.5 ${
                    cat === c
                      ? "bg-primary text-primary-foreground border-primary shadow-glow-primary"
                      : "bg-background hover:bg-muted border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {c}
                  <span className={`text-[10px] rounded-full px-1.5 py-0.5 ${
                    cat === c ? "bg-primary-foreground/20" : "bg-muted"
                  }`}>
                    {count}
                  </span>
                </button>
              )
            })}
          </div>

          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="h-44 rounded-xl bg-muted/40 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((s: any, i) => (
                <motion.button
                  key={s.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: i * 0.03 }}
                  onClick={() => navigate("subject", { subjectSlug: s.slug })}
                  className="text-left group"
                >
                  <Card className="h-full hover:border-primary/40 hover:shadow-md transition-all overflow-hidden card-lift">
                    <div
                      className="h-1.5 w-full"
                      style={{ background: s.color }}
                    />
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <SubjectIcon name={s.icon} color={s.color} className="size-11 rounded-xl" />
                        <span className="text-xs text-muted-foreground bg-muted/60 rounded-full px-2 py-0.5">
                          {s.category}
                        </span>
                      </div>
                      <CardTitle className="text-lg mt-3 group-hover:text-primary transition-colors">
                        {s.name}
                      </CardTitle>
                      <CardDescription className="line-clamp-2 text-sm">{s.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      {s.progressPct !== undefined && s.progressPct > 0 ? (
                        <div className="mb-2">
                          <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1">
                            <span>{s.completedCount}/{s.tutorialCount} completed</span>
                            <span className="text-primary font-medium">{s.progressPct}%</span>
                          </div>
                          <div className="h-1 rounded-full bg-muted overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{ width: `${s.progressPct}%`, background: s.color }}
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{s.tutorialCount ?? 0} tutorials</span>
                          <span className="text-primary opacity-0 group-hover:opacity-100 transition-opacity font-medium">
                            Explore →
                          </span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

function useDebounced<T>(value: T, delay: number) {
  const [v, setV] = React.useState(value)
  React.useEffect(() => {
    const t = setTimeout(() => setV(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return v
}
