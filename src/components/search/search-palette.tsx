"use client"

import * as React from "react"
import { Search, Loader2, ArrowRight } from "lucide-react"
import { useAppStore } from "@/lib/store"
import { useSearch } from "@/hooks/use-api"
import { SubjectIcon } from "@/components/shared/subject-icon"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"

export function SearchPalette() {
  const { searchOpen, setSearchOpen, navigate } = useAppStore()
  const [query, setQuery] = React.useState("")
  const debounced = useDebounced(query, 250)
  const { data, isLoading } = useSearch(debounced)

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

  const hits = data?.hits ?? []

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
            placeholder="Search tutorials, subjects, topics..."
            className="flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
          />
          {isLoading && <Loader2 className="size-4 animate-spin text-muted-foreground" />}
          <kbd className="hidden sm:inline-flex items-center rounded border bg-muted px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
            ESC
          </kbd>
        </div>
        <div className="max-h-[60vh] overflow-y-auto scrollbar-thin">
          {query.trim().length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              <Search className="size-8 mx-auto mb-3 opacity-40" />
              Start typing to search across all tutorials and subjects.
            </div>
          ) : hits.length === 0 && !isLoading ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              No results for &ldquo;{query}&rdquo;.
            </div>
          ) : (
            <ul className="py-2">
              {hits.map((hit) => (
                <li key={hit.id}>
                  <button
                    onClick={() => {
                      navigate("tutorial", {
                        subjectSlug: hit.subjectSlug,
                        tutorialSlug: hit.slug,
                      })
                      setSearchOpen(false)
                    }}
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
