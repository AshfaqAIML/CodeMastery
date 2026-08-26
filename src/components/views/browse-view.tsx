"use client"

import * as React from "react"
import { Search, Compass, Loader2, BookX } from "lucide-react"
import { motion } from "framer-motion"
import { useAppStore } from "@/lib/store"
import { useSubjects, useSearch } from "@/hooks/use-api"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { SubjectIcon } from "@/components/shared/subject-icon"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/shared/empty-state"

const FALLBACK_DOMAIN = { slug: "_uncategorised", name: "Other", color: "oklch(0.65 0.1 200)" }

export function BrowseView() {
  const { navigate } = useAppStore()
  const { data: subjects, isLoading, isError, error } = useSubjects({ withCounts: true, withProgress: true }) as any
  const [domainFilter, setDomainFilter] = React.useState<string>("all")
  const [q, setQ] = React.useState("")
  const debounced = useDebounced(q, 250)
  const { data: searchRes, isLoading: searching } = useSearch(debounced)

  // Derive domain list + grouping from subjects (each subject now carries its domain)
  const { domains, grouped } = React.useMemo(() => {
    const list = subjects ?? []
    const map = new Map<string, { slug: string; name: string; color: string; order: number }>()
    const groups = new Map<string, any[]>()
    for (const s of list) {
      const d = s.domain ?? FALLBACK_DOMAIN
      if (!map.has(d.slug)) map.set(d.slug, { slug: d.slug, name: d.name, color: d.color, order: 0 })
      const arr = groups.get(d.slug) ?? []
      arr.push(s)
      groups.set(d.slug, arr)
    }
    const doms = Array.from(map.values())
    return { domains: doms, grouped: groups }
  }, [subjects])

  const filteredSubjects = React.useMemo(() => {
    if (domainFilter === "all") return subjects ?? []
    return (subjects ?? []).filter((s: any) => (s.domain?.slug ?? FALLBACK_DOMAIN.slug) === domainFilter)
  }, [subjects, domainFilter])

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
          Explore {(subjects ?? []).length} subjects across {domains.length} domains — from computer science foundations to AI engineering.
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search tutorials..."
          aria-label="Search tutorials by title, subject, or topic"
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
            <EmptyState
              icon={BookX}
              title="No tutorials found"
              description={`We couldn't find anything for "${q}". Try a different search term or browse all subjects.`}
              action={<Button variant="outline" size="sm" onClick={() => setQ("")}>Clear search</Button>}
            />
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchHits.map((hit) => (
                <Card
                  key={hit.id}
                  className="cursor-pointer hover:border-primary/40 hover:shadow-md transition-all card-lift"
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
          {/* Domain filter */}
          <div className="flex flex-wrap gap-2 mb-10">
            <DomainChip
              label="All domains"
              active={domainFilter === "all"}
              onClick={() => setDomainFilter("all")}
              count={(subjects ?? []).length}
            />
            {domains.map((d) => (
              <DomainChip
                key={d.slug}
                label={d.name}
                color={d.color}
                active={domainFilter === d.slug}
                onClick={() => setDomainFilter(d.slug)}
                count={grouped.get(d.slug)?.length ?? 0}
              />
            ))}
          </div>

          {isError ? (
            <div className="rounded-xl border border-destructive/40 bg-destructive/5 p-6 text-center">
              <p className="text-sm font-medium text-destructive">Failed to load subjects</p>
              <p className="text-xs text-muted-foreground mt-1">{String((error as any)?.message ?? error ?? "Unknown error")}</p>
              <Button variant="outline" size="sm" className="mt-3" onClick={() => window.location.reload()}>
                Retry
              </Button>
            </div>
          ) : isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="h-44 rounded-xl skeleton-shimmer" />
              ))}
            </div>
          ) : domainFilter === "all" ? (
            /* Grouped by domain — each domain gets a section header */
            <div className="space-y-12">
              {domains.map((d) => {
                const items = grouped.get(d.slug) ?? []
                if (items.length === 0) return null
                return (
                  <section key={d.slug} aria-label={d.name}>
                    <div className="flex items-center gap-2.5 mb-4">
                      <span
                        className="inline-block size-2.5 rounded-full"
                        style={{ background: d.color }}
                        aria-hidden
                      />
                      <h2 className="text-xl font-semibold tracking-tight m-0">{d.name}</h2>
                      <span className="text-xs text-muted-foreground bg-muted/60 rounded-full px-2 py-0.5">
                        {items.length} subject{items.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <SubjectGrid items={items} navigate={navigate} />
                  </section>
                )
              })}
            </div>
          ) : (
            <SubjectGrid items={filteredSubjects} navigate={navigate} />
          )}
        </>
      )}
    </div>
  )
}

function DomainChip({
  label, active, onClick, count, color,
}: { label: string; active: boolean; onClick: () => void; count: number; color?: string }) {
  return (
    <button
      onClick={onClick}
      className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all border flex items-center gap-2 ${
        active
          ? "bg-primary text-primary-foreground border-primary shadow-glow-primary"
          : "bg-background hover:bg-muted border-border text-muted-foreground hover:text-foreground"
      }`}
    >
      {color && !active && (
        <span className="inline-block size-2 rounded-full" style={{ background: color }} aria-hidden />
      )}
      {label}
      <span className={`text-[10px] rounded-full px-1.5 py-0.5 ${active ? "bg-primary-foreground/20" : "bg-muted"}`}>
        {count}
      </span>
    </button>
  )
}

function SubjectGrid({ items, navigate }: { items: any[]; navigate: any }) {
  if (items.length === 0) {
    return (
      <div className="col-span-full py-8 text-center text-sm text-muted-foreground">
        No subjects in this domain.
      </div>
    )
  }
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((s: any) => (
        <button
          key={s.id}
          onClick={() => navigate("subject", { subjectSlug: s.slug })}
          className="text-left group"
        >
          <Card className="h-full hover:border-primary/40 hover:shadow-md transition-all overflow-hidden card-lift">
            <div className="h-1.5 w-full" style={{ background: s.color }} />
            <CardHeader>
              <div className="flex items-start justify-between">
                <SubjectIcon name={s.icon} color={s.color} className="size-11 rounded-xl" />
                <span className="text-xs text-muted-foreground bg-muted/60 rounded-full px-2 py-0.5">
                  {s.domain?.name ?? s.category}
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
        </button>
      ))}
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
