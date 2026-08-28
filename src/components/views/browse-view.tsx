"use client"

import * as React from "react"
import { Search, Compass, Loader2, BookX, CheckCircle, Clock, Sparkles, ArrowRight, BookOpen, Layers } from "lucide-react"
import { motion } from "framer-motion"
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

  // Derive domain list + grouping from subjects (each subject now carries its domain)
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

      // Collect COMPLETE courses for the virtual "Completed" domain
      if (s.status === "COMPLETE") {
        completedCourses.push(s)
      }
    }

    // Add virtual "Completed" domain at the end
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
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {searchHits.map((hit) => (
                <button
                  key={hit.id}
                  onClick={() => navigate("tutorial", { subjectSlug: hit.subjectSlug, tutorialSlug: hit.slug })}
                  className="text-left group w-full"
                >
                  <div className="course-card relative h-full rounded-2xl border border-border/60 bg-card overflow-hidden shadow-sm p-4">
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
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="rounded-2xl border border-border/60 bg-card overflow-hidden shadow-sm">
                  <div className="h-32 skeleton-shimmer" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 w-3/4 rounded-lg skeleton-shimmer" />
                    <div className="space-y-1.5">
                      <div className="h-3 w-full rounded skeleton-shimmer" />
                      <div className="h-3 w-2/3 rounded skeleton-shimmer" />
                    </div>
                    <div className="flex gap-1.5">
                      <div className="h-5 w-16 rounded-full skeleton-shimmer" />
                      <div className="h-5 w-20 rounded-full skeleton-shimmer" />
                    </div>
                  </div>
                </div>
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

function StatusBadge({ status }: { status: string }) {
  if (status === "COMPLETE") {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-semibold rounded-full px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
        <CheckCircle className="size-3" />
        Complete
      </span>
    )
  }
  if (status === "IN_PROGRESS") {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-semibold rounded-full px-2 py-0.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
        <Clock className="size-3" />
        In Progress
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-semibold rounded-full px-2 py-0.5 bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
      <Sparkles className="size-3" />
      Coming Soon
    </span>
  )
}

function DifficultyChip({ difficulty }: { difficulty?: string }) {
  const d = difficulty ?? "beginner"
  const cls = d === "advanced" ? "badge-advanced" : d === "intermediate" ? "badge-intermediate" : "badge-beginner"
  return (
    <span className={`inline-flex items-center text-[10px] font-semibold rounded-full px-2 py-0.5 ${cls}`}>
      {d.charAt(0).toUpperCase() + d.slice(1)}
    </span>
  )
}

function CourseCard({ subject, navigate }: { subject: any; navigate: any }) {
  const s = subject
  const hasProgress = s.progressPct !== undefined && s.progressPct > 0
  const tutorialCount = s.tutorialCount ?? 0

  // Generate a subtle pattern based on the course color
  const patternId = `pattern-${s.id}`

  return (
    <button
      onClick={() => navigate("subject", { subjectSlug: s.slug })}
      className="text-left group w-full"
    >
      <div className="course-card relative h-full rounded-2xl border border-border/60 bg-card overflow-hidden shadow-sm">
        {/* Gradient header area */}
        <div
          className="course-card-header relative h-32 overflow-hidden"
          style={{
            background: `linear-gradient(135deg, color-mix(in oklch, ${s.color} 18%, transparent) 0%, color-mix(in oklch, ${s.color} 8%, transparent) 50%, color-mix(in oklch, ${s.color} 3%, transparent) 100%)`,
          }}
        >
          {/* Subtle dot pattern overlay */}
          <svg className="course-card-pattern absolute inset-0 h-full w-full opacity-[0.06]" aria-hidden>
            <defs>
              <pattern id={patternId} x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="0.8" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#${patternId})`} />
          </svg>

          {/* Decorative gradient orb */}
          <div
            className="absolute -top-8 -right-8 size-24 rounded-full opacity-20 blur-2xl"
            style={{ background: s.color }}
          />

          {/* Icon */}
          <div className="absolute bottom-3 left-4">
            <SubjectIcon
              name={s.icon}
              color={s.color}
              className="course-card-icon size-12 rounded-xl shadow-sm border border-white/20 dark:border-white/5"
            />
          </div>

          {/* Status badge top-right */}
          <div className="absolute top-3 right-3">
            <StatusBadge status={s.status ?? "COMING_SOON"} />
          </div>
        </div>

        {/* Content area */}
        <div className="p-4 pt-3.5 flex flex-col flex-1">
          {/* Title */}
          <h3 className="text-[15px] font-semibold leading-snug tracking-tight text-foreground group-hover:text-primary transition-colors duration-200 line-clamp-2 min-h-[2.5rem]">
            {s.name}
          </h3>

          {/* Description */}
          <p className="text-xs text-muted-foreground leading-relaxed mt-1.5 line-clamp-2 min-h-[2rem]">
            {s.description}
          </p>

          {/* Metadata chips */}
          <div className="flex items-center gap-1.5 mt-3 flex-wrap">
            <DifficultyChip difficulty="beginner" />
            <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground bg-muted/50 rounded-full px-2 py-0.5">
              <BookOpen className="size-2.5" />
              {tutorialCount} lessons
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground bg-muted/50 rounded-full px-2 py-0.5">
              <Layers className="size-2.5" />
              {s.domain?.name ?? s.category}
            </span>
          </div>

          {/* Spacer to push footer down */}
          <div className="flex-1 min-h-2" />

          {/* Progress or CTA footer */}
          <div className="mt-3 pt-3 border-t border-border/40">
            {hasProgress ? (
              <div>
                <div className="flex items-center justify-between text-[11px] mb-1.5">
                  <span className="text-muted-foreground">
                    {s.completedCount}/{tutorialCount} completed
                  </span>
                  <span className="font-semibold text-foreground">{s.progressPct}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted/60 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500 ease-out"
                    style={{
                      width: `${s.progressPct}%`,
                      background: `linear-gradient(90deg, ${s.color}, color-mix(in oklch, ${s.color} 70%, white))`,
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  Start learning
                </span>
                <span className="course-card-cta inline-flex items-center gap-1 text-xs font-medium text-primary">
                  Explore <ArrowRight className="size-3" />
                </span>
              </div>
            )}
          </div>
        </div>
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
