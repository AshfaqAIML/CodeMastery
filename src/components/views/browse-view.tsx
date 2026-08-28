"use client"

import * as React from "react"
import { Search, Compass, Loader2, BookX, CheckCircle, Clock, Sparkles, ArrowRight } from "lucide-react"
import { useAppStore } from "@/lib/store"
import { useSubjects, useSearch } from "@/hooks/use-api"
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

  const { domains, grouped } = React.useMemo(() => {
    const list = subjects ?? []
    const map = new Map<string, { slug: string; name: string; color: string; order: number }>()
    const groups = new Map<string, any[]>()
    const completedCourses: any[] = []

    for (const s of list) {
      const d = s.domain ?? FALLBACK_DOMAIN
      if (!map.has(d.slug)) map.set(d.slug, { slug: d.slug, name: d.name, color: d.color, order: 0 })
      const arr = groups.get(d.slug) ?? []
      arr.push(s)
      groups.set(d.slug, arr)
      if (s.status === "COMPLETE") completedCourses.push(s)
    }

    if (completedCourses.length > 0) {
      map.set("completed", { slug: "completed", name: "Completed", color: "oklch(0.65 0.18 145)", order: 999 })
      groups.set("completed", completedCourses)
    }

    const doms = Array.from(map.values()).sort((a, b) => a.order - b.order)
    return { domains: doms, grouped: groups }
  }, [subjects])

  const filteredSubjects = React.useMemo(() => {
    if (domainFilter === "all") return subjects ?? []
    if (domainFilter === "completed") return (subjects ?? []).filter((s: any) => s.status === "COMPLETE")
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
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {searchHits.map((hit) => (
                <button
                  key={hit.id}
                  onClick={() => navigate("tutorial", { subjectSlug: hit.subjectSlug, tutorialSlug: hit.slug })}
                  className="text-left group w-full"
                >
                  <div className="cc p-5">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                      <SubjectIcon name={hit.icon} color={hit.subjectColor} className="size-6 rounded-lg" />
                      <span className="font-medium">{hit.subjectName}</span>
                    </div>
                    <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                      {hit.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{hit.summary}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <>
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
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="rounded-2xl border border-border/60 bg-card overflow-hidden">
                  <div className="h-[180px] skeleton-shimmer" />
                  <div className="p-5 space-y-3">
                    <div className="h-2.5 w-16 rounded skeleton-shimmer" />
                    <div className="h-5 w-3/4 rounded skeleton-shimmer" />
                    <div className="space-y-1.5">
                      <div className="h-3 w-full rounded skeleton-shimmer" />
                      <div className="h-3 w-2/3 rounded skeleton-shimmer" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : domainFilter === "all" ? (
            <div className="space-y-12">
              {domains.map((d) => {
                const items = grouped.get(d.slug) ?? []
                if (items.length === 0) return null
                return (
                  <section key={d.slug} aria-label={d.name}>
                    <div className="flex items-center gap-2.5 mb-5">
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

function StatusPill({ status }: { status: string }) {
  if (status === "COMPLETE") {
    return (
      <span className="cc-badge bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
        <CheckCircle className="inline size-2.5 mr-1 -mt-px" />
        Complete
      </span>
    )
  }
  if (status === "IN_PROGRESS") {
    return (
      <span className="cc-badge bg-amber-500/20 text-amber-700 dark:text-amber-300">
        <Clock className="inline size-2.5 mr-1 -mt-px" />
        In Progress
      </span>
    )
  }
  return (
    <span className="cc-badge bg-white/25 text-white dark:bg-black/25 dark:text-white/90">
      <Sparkles className="inline size-2.5 mr-1 -mt-px" />
      Coming Soon
    </span>
  )
}

function CourseCard({ subject, navigate }: { subject: any; navigate: any }) {
  const s = subject
  const hasProgress = s.progressPct !== undefined && s.progressPct > 0
  const tutorialCount = s.tutorialCount ?? 0
  const category = s.domain?.name ?? s.category ?? ""

  const hash = s.id.split("").reduce((a: number, c: string) => a + c.charCodeAt(0), 0)
  const arcSize1 = 120 + (hash % 60)
  const arcSize2 = 80 + ((hash * 3) % 50)
  const arcTop = -20 + (hash % 30)
  const arcRight = -10 + ((hash * 7) % 40)

  return (
    <button
      onClick={() => navigate("subject", { subjectSlug: s.slug })}
      className="text-left group w-full"
    >
      <div className="cc h-full">
        {/* Cover */}
        <div
          className="cc-cover"
          style={{
            background: `
              radial-gradient(ellipse 80% 60% at 30% 20%, color-mix(in oklch, ${s.color} 22%, transparent), transparent),
              radial-gradient(ellipse 60% 50% at 80% 70%, color-mix(in oklch, ${s.color} 10%, transparent), transparent),
              linear-gradient(145deg, color-mix(in oklch, ${s.color} 8%, var(--card)) 0%, var(--card) 100%)
            `,
          }}
        >
          <div
            className="cc-arc"
            style={{
              width: arcSize1,
              height: arcSize1,
              top: arcTop,
              right: arcRight,
              borderColor: s.color,
            }}
          />
          <div
            className="cc-arc"
            style={{
              width: arcSize2,
              height: arcSize2,
              bottom: -arcSize2 / 3,
              left: -arcSize2 / 4,
              borderColor: s.color,
            }}
          />

          <div className="cc-icon size-16 rounded-2xl opacity-35">
            <SubjectIcon
              name={s.icon}
              color={s.color}
              className="size-16 rounded-2xl"
            />
          </div>
          <SubjectIcon
            name={s.icon}
            color={s.color}
            className="cc-icon size-14 rounded-2xl"
          />

          <StatusPill status={s.status ?? "COMING_SOON"} />
        </div>

        {/* Body */}
        <div className="cc-body">
          <span className="cc-cat">{category}</span>
          <h3 className="cc-title">{s.name}</h3>
          <p className="cc-desc">{s.description}</p>

          <div className="cc-spacer" />

          <div className="cc-meta">
            <span>{tutorialCount} lessons</span>
            <span className="cc-meta-dot" />
            <span>{category}</span>
          </div>

          <div className="cc-cta">
            {hasProgress ? (
              <span className="text-xs text-muted-foreground">
                {s.completedCount}/{tutorialCount} completed · <span className="font-semibold text-foreground">{s.progressPct}%</span>
              </span>
            ) : (
              <span />
            )}
            <span className="cc-cta-text">
              {hasProgress ? "Continue" : "Start learning"}
              <ArrowRight className="cc-cta-arrow size-3.5" />
            </span>
          </div>
        </div>

        {/* Progress bar */}
        {hasProgress && (
          <div className="cc-progress">
            <div
              className="cc-progress-bar"
              style={{
                width: `${s.progressPct}%`,
                background: `linear-gradient(90deg, ${s.color}, color-mix(in oklch, ${s.color} 60%, white))`,
              }}
            />
          </div>
        )}
      </div>
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
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {items.map((s: any) => (
        <CourseCard key={s.id} subject={s} navigate={navigate} />
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
