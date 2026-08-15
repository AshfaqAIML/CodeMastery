"use client"

import * as React from "react"
import { ListTree, ChevronRight } from "lucide-react"

export function MobileToc({ toc, activeIndex }: { toc: { id: string; text: string }[]; activeIndex: number }) {
  const [open, setOpen] = React.useState(false)
  const activeText = activeIndex >= 0 ? toc[activeIndex]?.text : null

  const scrollTo = (text: string) => {
    const headings = document.querySelectorAll("h2")
    headings.forEach((h) => {
      if (h.textContent?.trim() === text) h.scrollIntoView({ behavior: "smooth", block: "start" })
    })
    setOpen(false)
  }

  return (
    <div className="lg:hidden mb-6">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between rounded-lg border border-border/60 bg-card px-4 py-2.5 text-sm font-medium"
        aria-expanded={open}
      >
        <span className="flex items-center gap-2">
          <ListTree className="size-4 text-primary" />
          <span className="truncate">{activeText || "Table of contents"}</span>
        </span>
        <ChevronRight className={`size-4 text-muted-foreground transition-transform ${open ? "rotate-90" : ""}`} />
      </button>
      {open && (
        <div className="mt-2 rounded-lg border border-border/60 bg-card p-3 max-h-64 overflow-y-auto scrollbar-thin">
          <ul className="space-y-1 text-sm">
            {toc.map((t, idx) => (
              <li key={t.id}>
                <button
                  className={`w-full text-left pl-3 py-1.5 rounded border-l-2 transition-colors ${
                    idx === activeIndex
                      ? "border-primary text-primary font-medium bg-primary/5"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/40"
                  }`}
                  onClick={() => scrollTo(t.text)}
                >
                  <span className="line-clamp-1">{t.text}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
