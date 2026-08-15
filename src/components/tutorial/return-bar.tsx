"use client"

import * as React from "react"
import { ArrowLeft, CornerUpLeft } from "lucide-react"
import { useAppStore, viewLabel, type HistoryEntry } from "@/lib/store"

/**
 * Derives a friendly, specific label for the page the user would return to.
 *
 * Prefers the explicit `label` captured at navigation time (e.g. a tutorial
 * title set by `setCurrentPageLabel`). Falls back to a generic view-based
 * label so the button is never blank.
 */
function describeEntry(entry: HistoryEntry): string {
  if (entry.label && entry.label.trim()) return entry.label.trim()
  return viewLabel(entry.view)
}

/**
 * A compact "Return to previous page" bar.
 *
 * Renders only when there is somewhere to return to (i.e. the navigation
 * history stack is non-empty). Clicking it calls the store's `back()` action,
 * which pops the last history entry and restores that view + params.
 *
 * Two variants are supported via the `variant` prop:
 *  - "bar"   : a full-width pill/bar meant to sit at the top of a view.
 *  - "inline": a self-contained button meant for inline CTAs (e.g. at the
 *              bottom of a tutorial, after the prev/next nav).
 */
export function ReturnBar({
  variant = "bar",
  className = "",
}: {
  variant?: "bar" | "inline"
  className?: string
}) {
  // Subscribe to history so we re-render when it changes. Using a selector
  // keeps the subscription narrow.
  const history = useAppStore((s) => s.history)
  const back = useAppStore((s) => s.back)

  // Stable reference to the previous entry; recompute only when history changes.
  const prevEntry = React.useMemo(
    () => (history.length > 0 ? history[history.length - 1] : null),
    [history]
  )

  // Keyboard shortcut: Alt+← returns to the previous page, matching the
  // common "browser back" muscle memory without hijacking it (browser back
  // still works independently).
  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.altKey && e.key === "ArrowLeft" && history.length > 0) {
        e.preventDefault()
        back()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [history.length, back])

  if (!prevEntry) return null

  const label = describeEntry(prevEntry)

  if (variant === "inline") {
    return (
      <button
        type="button"
        onClick={back}
        className={`group inline-flex items-center gap-2 rounded-lg border border-border/60 bg-background/60 px-4 py-2.5 text-sm font-medium text-foreground/90 transition-all hover:border-primary/40 hover:bg-primary/5 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${className}`}
        aria-label={`Return to ${label}`}
      >
        <CornerUpLeft className="size-4 text-muted-foreground transition-transform group-hover:-translate-x-0.5 group-hover:text-primary" />
        <span>
          Return to <span className="font-semibold">{label}</span>
        </span>
      </button>
    )
  }

  // "bar" variant — subtle sticky-ish banner.
  return (
    <div className={`mb-4 ${className}`}>
      <button
        type="button"
        onClick={back}
        className="group flex w-full items-center gap-2.5 rounded-lg border border-border/50 bg-muted/30 px-3.5 py-2 text-sm text-muted-foreground transition-all hover:border-primary/40 hover:bg-primary/5 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        aria-label={`Return to ${label}`}
      >
        <ArrowLeft className="size-4 shrink-0 transition-transform group-hover:-translate-x-0.5" />
        <span className="truncate">
          Return to <span className="font-medium text-foreground group-hover:text-primary">{label}</span>
        </span>
        <kbd className="ml-auto hidden shrink-0 items-center rounded border border-border/60 bg-background px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground sm:inline-flex">
          Alt ←
        </kbd>
      </button>
    </div>
  )
}
