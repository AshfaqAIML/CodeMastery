"use client"

import * as React from "react"
import { Search, Loader2, ArrowRight, Clock, TrendingUp, X, Trash2 } from "lucide-react"
import { useAppStore } from "@/lib/store"
import { useSearch, useSubjects } from "@/hooks/use-api"
import { SubjectIcon } from "@/components/shared/subject-icon"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"

const RECENT_KEY = "codemastery-recent-searches"
const MAX_RECENT = 5

export function SearchPalette() {
  const { searchOpen, setSearchOpen, navigate } = useAppStore()
  const [query, setQuery] = React.useState("")
  const debounced = useDebounced(query, 250)
  const { data, isLoading } = useSearch(debounced)
  const { data: subjects } = useSubjects({ withCounts: true })
  const [recentSearches, setRecentSearches] = React.useState<string[]>([])

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setSearchOpen(true)
      }
      if (e.key === "Escape") setSearchOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [setSearchOpen])

  React.useEffect(() => {
    if (!searchOpen) setQuery("")
  }, [searchOpen])

  // Load recent searches on mount
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_KEY)
      if (stored) setRecentSearches(JSON.parse(stored))
    } catch {}
  }, [searchOpen])

  const saveRecentSearch = (q: string) => {
    if (!q.trim()) return
    const updated = [q, ...recentSearches.filter((s) => s !== q)].slice(0, MAX_RECENT)
    setRecentSearches(updated)
    try {
      localStorage.setItem(RECENT_KEY, JSON.stringify(updated))
    } catch {}
  }

  const clearRecentSearches = () => {
    setRecentSearches([])
    try { localStorage.removeItem(RECENT_KEY) } catch {}
  }

  const hits = data?.hits ?? []
  const isSearching = query.trim().length > 0

  // Trending: subjects with most tutorials (as a proxy for popular content)
  const trending = React.useMemo(() => {
    if (!subjects) return []
    return [...subjects].sort((a: any, b: any) => (b.tutorialCount ?? 0) - (a.tutorialCount ?? 0)).slice(0, 4)
  }, [subjects])

  const onNavigateToTutorial = (hit: any) => {
    saveRecentSearch(query)
    navigate("tutorial", {
      subjectSlug: hit.subjectSlug,
      tutorialSlug: hit.slug,
    })
    setSearchOpen(false)
  }

  return (
    <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
      <DialogContent className="p-0 gap-0 overflow-hidden sm:max-w-2xl top-[20%] translate-y-0">
        <DialogHeader className="sr-only">
          <DialogTitle>Search tutorials</DialogTitle>
        </DialogHeader>
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <Search className="size-5 text-muted-foreground shrink-0" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && hits.length > 0) {
                onNavigateToTutorial(hits[0])
              }
            }}
            placeholder="Search tutorials, subjects, topics..."
            className="flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
            aria-label="Search tutorials"
          />
          {isLoading && <Loader2 className="size-4 animate-spin text-muted-foreground" />}
          <kbd className="hidden sm:inline-flex items-center rounded border bg-muted px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
            ESC
          </kbd>
        </div>
        <div className="max-h-[60vh] overflow-y-auto scrollbar-thin">
          {isSearching ? (
            hits.length === 0 && !isLoading ? (
              <div className="p-8 text-center text-sm text-muted-foreground">
                <Search className="size-8 mx-auto mb-3 opacity-40" />
                No results for &ldquo;{query}&rdquo;.
              </div>
            ) : (
              <ul className="py-2">
                {hits.map((hit) => (
                  <li key={hit.id}>
                    <button
                      onClick={() => onNavigateToTutorial(hit)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-muted/60 transition-colors text-left group"
                    >
                      <SubjectIcon
                        name={hit.icon}
                        color={hit.subjectColor}
                        className="size-8 rounded-md shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">{hit.title}</div>
                        <div className="text-xs text-muted-foreground truncate">
                          {hit.subjectName} · {hit.difficulty}
                        </div>
                      </div>
                      <ArrowRight className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  </li>
                ))}
              </ul>
            )
          ) : recentSearches.length > 0 ? (
            <div className="py-2">
              <div className="flex items-center justify-between px-4 py-1.5">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                  <Clock className="size-3" /> Recent searches
                </span>
                <button
                  onClick={clearRecentSearches}
                  className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                  aria-label="Clear recent searches"
                >
                  <Trash2 className="size-3" /> Clear
                </button>
              </div>
              <ul>
                {recentSearches.map((s, i) => (
                  <li key={i}>
                    <button
                      onClick={() => setQuery(s)}
                      className="w-full flex items-center gap-3 px-4 py-2 hover:bg-muted/60 transition-colors text-left text-sm text-muted-foreground hover:text-foreground"
                    >
                      <Clock className="size-3.5 opacity-50" />
                      <span className="truncate">{s}</span>
                    </button>
                  </li>
                ))}
              </ul>
              <div className="border-t border-border/60 mt-2 pt-2">
                <div className="px-4 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                  <TrendingUp className="size-3" /> Popular subjects
                </div>
                <ul>
                  {trending.map((s: any) => (
                    <li key={s.id}>
                      <button
                        onClick={() => { navigate("subject", { subjectSlug: s.slug }); setSearchOpen(false) }}
                        className="w-full flex items-center gap-3 px-4 py-2 hover:bg-muted/60 transition-colors text-left"
                      >
                        <SubjectIcon name={s.icon} color={s.color} className="size-7 rounded-md shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">{s.name}</div>
                          <div className="text-xs text-muted-foreground">{s.tutorialCount} tutorials</div>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="py-2">
              <div className="px-4 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                <TrendingUp className="size-3" /> Popular subjects
              </div>
              <ul>
                {trending.map((s: any) => (
                  <li key={s.id}>
                    <button
                      onClick={() => { navigate("subject", { subjectSlug: s.slug }); setSearchOpen(false) }}
                      className="w-full flex items-center gap-3 px-4 py-2 hover:bg-muted/60 transition-colors text-left"
                    >
                      <SubjectIcon name={s.icon} color={s.color} className="size-7 rounded-md shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{s.name}</div>
                        <div className="text-xs text-muted-foreground">{s.tutorialCount} tutorials</div>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
              <div className="p-4 text-center text-xs text-muted-foreground border-t border-border/60 mt-2">
                <Search className="size-4 mx-auto mb-1 opacity-40" />
                Start typing to search across all tutorials and subjects.
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
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
