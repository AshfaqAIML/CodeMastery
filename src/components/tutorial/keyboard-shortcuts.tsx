"use client"

import * as React from "react"
import { Keyboard, ArrowLeft, ArrowRight } from "lucide-react"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog"

/**
 * Keyboard shortcuts for the tutorial reader.
 * - ← / → : Navigate to previous/next tutorial
 * - ?     : Show this help dialog
 * - b     : Toggle bookmark
 * - c     : Mark complete
 */
export function KeyboardShortcuts({
  onPrev,
  onNext,
  onBookmark,
  onComplete,
  hasPrev,
  hasNext,
}: {
  onPrev: () => void
  onNext: () => void
  onBookmark: () => void
  onComplete: () => void
  hasPrev: boolean
  hasNext: boolean
}) {
  const [helpOpen, setHelpOpen] = React.useState(false)

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      // Ignore when typing in inputs/textareas
      const target = e.target as HTMLElement
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) {
        return
      }
      // Ignore when modifier keys are pressed (cmd/ctrl shortcuts)
      if (e.metaKey || e.ctrlKey || e.altKey) return

      if (e.key === "ArrowLeft" && hasPrev) {
        e.preventDefault()
        onPrev()
      } else if (e.key === "ArrowRight" && hasNext) {
        e.preventDefault()
        onNext()
      } else if (e.key === "?") {
        e.preventDefault()
        setHelpOpen((o) => !o)
      } else if (e.key === "b" || e.key === "B") {
        e.preventDefault()
        onBookmark()
      } else if (e.key === "c" || e.key === "C") {
        e.preventDefault()
        onComplete()
      } else if (e.key === "Escape") {
        setHelpOpen(false)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onPrev, onNext, onBookmark, onComplete, hasPrev, hasNext])

  return (
    <>
      <button
        onClick={() => setHelpOpen(true)}
        className="hidden lg:flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Keyboard shortcuts"
      >
        <Keyboard className="size-3.5" />
        <span>Shortcuts</span>
      </button>

      <Dialog open={helpOpen} onOpenChange={setHelpOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Keyboard className="size-5 text-primary" /> Keyboard shortcuts
            </DialogTitle>
            <DialogDescription>
              Navigate tutorials faster with your keyboard.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <ShortcutRow keys={["←"]} desc="Previous tutorial" disabled={!hasPrev} />
            <ShortcutRow keys={["→"]} desc="Next tutorial" disabled={!hasNext} />
            <ShortcutRow keys={["B"]} desc="Toggle bookmark" />
            <ShortcutRow keys={["C"]} desc="Mark tutorial complete" />
            <ShortcutRow keys={["?"]} desc="Show/hide this help" />
            <ShortcutRow keys={["Esc"]} desc="Close dialogs" />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

function ShortcutRow({ keys, desc, disabled }: { keys: string[]; desc: string; disabled?: boolean }) {
  return (
    <div className={`flex items-center justify-between rounded-lg px-3 py-2 ${disabled ? "opacity-50" : ""}`}>
      <span className="text-sm text-muted-foreground">{desc}</span>
      <div className="flex items-center gap-1">
        {keys.map((k) => (
          <kbd
            key={k}
            className="inline-flex items-center justify-center min-w-7 h-7 rounded border border-border bg-muted px-2 text-xs font-mono font-medium"
          >
            {k}
          </kbd>
        ))}
      </div>
    </div>
  )
}
