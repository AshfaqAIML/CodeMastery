"use client"

import * as React from "react"
import {
  ArrowLeft, ArrowRight, Bookmark, Clock, ChevronRight, Loader2,
  StickyNote, CheckCircle2, Sparkles, ListTree, Search, Lock,
} from "lucide-react"
import { useAppStore, setCurrentPageLabel } from "@/lib/store"
import {
  useTutorial, useUpdateProgress, useToggleBookmark,
  useNotes, useCreateNote, useDeleteNote, useMe,
} from "@/hooks/use-api"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DifficultyBadge } from "@/components/shared/difficulty-badge"
import { SubjectIcon } from "@/components/shared/subject-icon"
import { MarkdownRenderer } from "@/components/markdown/markdown-renderer"
import { StructuredData } from "@/components/shared/structured-data"
import { StudyBuddy } from "@/components/tutorial/study-buddy"
import { CompletionCelebration } from "@/components/tutorial/completion-celebration"
import { KeyboardShortcuts } from "@/components/tutorial/keyboard-shortcuts"
import { TutorialRating } from "@/components/tutorial/tutorial-rating"
import { ShareButton } from "@/components/tutorial/share-button"
import { RelatedTutorials } from "@/components/tutorial/related-tutorials"
import { FontSizeControl } from "@/components/tutorial/font-size-control"
import { PrintButton } from "@/components/tutorial/print-button"
import { QuizInline } from "@/components/tutorial/quiz-inline"
import { NotesPanel } from "@/components/tutorial/notes-panel"
import { MobileToc } from "@/components/tutorial/mobile-toc"
import { ReturnBar } from "@/components/tutorial/return-bar"
import { TutorialMetaPanel, TutorialRecapPanel } from "@/components/tutorial/tutorial-meta-panel"
import { toast } from "sonner"

export function TutorialView() {
  const { params, navigate, setSearchOpen } = useAppStore()
  const { data, isLoading } = useTutorial(params.subjectSlug, params.tutorialSlug)
  const { data: session } = useSession()
  const { data: meData } = useMe()
  const updateProgress = useUpdateProgress()
  const toggleBookmark = useToggleBookmark()
  const { data: notesData } = useNotes(data?.tutorial?.id)
  const createNote = useCreateNote()
  const deleteNote = useDeleteNote()
  const [showNotes, setShowNotes] = React.useState(false)
  const [celebration, setCelebration] = React.useState<{ show: boolean; xp: number; achievement: string | null }>({
    show: false, xp: 0, achievement: null,
  })

  // Publish the current tutorial title as the "current page label" so that
  // when the user navigates away (via search, related tutorials, prev/next),
  // a "Return to <title>" button can be shown on the destination page.
  // The holder is non-reactive, so this does not cause extra renders.
  React.useEffect(() => {
    if (data?.tutorial) {
      setCurrentPageLabel(data.tutorial.title)
    }
    return () => setCurrentPageLabel(undefined)
  }, [data?.tutorial?.id, data?.tutorial?.title])

  const contentRef = React.useRef<HTMLDivElement>(null)
  const lastPercentSent = React.useRef(0)
  const lastSentAt = React.useRef(0)
  const [readingPct, setReadingPct] = React.useState(0)
  const [activeTocIndex, setActiveTocIndex] = React.useState<number>(-1)

  // Compute TOC from content
  const content = data?.tutorial?.content
  const toc = React.useMemo(() => {
    if (!content) return []
    const matches = [...content.matchAll(/^##\s+(.+)$/gm)]
    return matches.map((m, i) => ({
      id: `toc-${i}`,
      text: m[1].trim(),
    }))
  }, [content])

  // Reading progress tracking + TOC scroll spy
  React.useEffect(() => {
    function onScroll() {
      const el = contentRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const total = el.offsetHeight - window.innerHeight
      const scrolled = Math.min(Math.max(0, -rect.top), total)
      const pct = total > 0 ? Math.round((scrolled / total) * 100) : 0
      setReadingPct(pct)

      // Scroll spy: find the heading closest to the top of the viewport
      const headings = el.querySelectorAll("h2")
      let activeIdx = -1
      const triggerLine = 140 // px from top where a heading becomes "active"
      headings.forEach((h, i) => {
        const r = h.getBoundingClientRect()
        if (r.top <= triggerLine) activeIdx = i
      })
      setActiveTocIndex(activeIdx)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener("scroll", onScroll)
  }, [data?.tutorial?.id])

  // Send progress periodically (throttled, server-side anti-farm)
  React.useEffect(() => {
    if (!data?.tutorial || !session) return
    const id = setInterval(() => {
      const now = Date.now()
      if (now - lastSentAt.current < 8000) return // throttle to 8s
      const pct = readingPct
      if (Math.abs(pct - lastPercentSent.current) < 5) return // only meaningful changes
      lastPercentSent.current = pct
      lastSentAt.current = now
      updateProgress.mutate({
        tutorialId: data.tutorial.id,
        percentRead: pct,
        timeSpentSec: 8,
      })
    }, 4000)
    return () => clearInterval(id)
  }, [data?.tutorial?.id, session, readingPct, updateProgress])

  // Mark complete on click
  const markComplete = () => {
    if (!data?.tutorial) return
    const wasCompleted = data?.progress?.completed ?? false
    const prevLevel = meData?.stats?.level ?? 1
    updateProgress.mutate(
      { tutorialId: data.tutorial.id, percentRead: 100, completed: true },
      {
        onSuccess: (res) => {
          const newLevel = res.stats?.level ?? prevLevel
          const leveledUp = newLevel > prevLevel
          // Only show celebration on first completion (when XP was awarded)
          if (!wasCompleted && res.xpAwarded > 0) {
            setCelebration({
              show: true,
              xp: res.xpAwarded,
              achievement: leveledUp ? `Level ${newLevel} reached!` : null,
            })
          } else if (res.xpAwarded > 0) {
            toast.success(`+${res.xpAwarded} XP earned`)
          } else if (wasCompleted) {
            toast.info("Already completed")
          } else {
            toast.success("Marked as complete.")
          }
        },
      }
    )
  }

  const onBookmark = () => {
    if (!data?.tutorial) return
    toggleBookmark.mutate(data.tutorial.id, {
      onSuccess: (res) => {
        toast.success(res.bookmarked ? "Bookmarked" : "Removed bookmark")
      },
    })
  }

  const pendingTutorial = data as { tutorial?: { id: string; title: string } } | undefined

  if (isLoading) {
    return (
      <>
        {/* AI Study Buddy (renders immediately, even while the tutorial loads) */}
        <StudyBuddy tutorialId={pendingTutorial?.tutorial?.id} tutorialTitle={pendingTutorial?.tutorial?.title} />
        <div className="mx-auto max-w-3xl px-4 sm:px-6 py-8">
          <div className="h-8 w-40 bg-muted/40 animate-pulse rounded mb-6" />
          <div className="h-12 bg-muted/40 animate-pulse rounded mb-3" />
          <div className="space-y-3 mt-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-5 bg-muted/40 animate-pulse rounded" />
            ))}
          </div>
        </div>
      </>
    )
  }

  if (!data) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <p className="text-muted-foreground">Tutorial not found.</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate("browse")}>
          Back to browse
        </Button>
      </div>
    )
  }

  // Premium/FREE content without access — the API sends metadata only,
  // never the body. Render the lock screen with the right upsell.
  if (data.locked) {
    return (
      <LockedTutorial
        preview={data.preview}
        locked={data.locked}
        onUpgrade={() => navigate("premium")}
        onBrowse={() => navigate("browse")}
      />
    )
  }

  const { tutorial, prev, next, progress, bookmarked } = data
  const completed = progress?.completed ?? false

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6">
      {/* Structured data for SEO */}
      <StructuredData type="Article" data={{
        title: tutorial.title,
        summary: tutorial.summary,
        subjectName: tutorial.subject.name,
        difficulty: tutorial.difficulty,
        estimatedMinutes: tutorial.estimatedMinutes,
      }} />
      {/* Breadcrumb structured data */}
      <StructuredData type="Breadcrumb" data={{
        items: [
          { name: "Home" },
          { name: "Browse" },
          { name: tutorial.subject.name },
          { name: tutorial.title },
        ],
      }} />

      {/* Reading progress bar */}
      <div className="fixed top-16 left-0 right-0 z-30 h-1 bg-transparent pointer-events-none">
        <div
          className="h-full bg-primary transition-[width] duration-150"
          style={{ width: `${Math.max(readingPct, progress?.percentRead ?? 0)}%` }}
        />
      </div>

      {/* Mobile TOC (collapsible) */}
      {toc.length > 0 && (
        <MobileToc
          toc={toc}
          activeIndex={activeTocIndex}
        />
      )}

      <div className="grid lg:grid-cols-[1fr_240px] gap-8">
        <div className="min-w-0">
          {/* Return to previous page (e.g. the tutorial the reader came from) */}
          <ReturnBar variant="bar" />

          {/* Breadcrumb — full hierarchy: Domain › Subject › Module › Tutorial */}
          <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4 flex-wrap" aria-label="Breadcrumb">
            <button onClick={() => navigate("home")} className="hover:text-foreground">Home</button>
            <ChevronRight className="size-3.5" />
            <button onClick={() => navigate("browse")} className="hover:text-foreground">Browse</button>
            <ChevronRight className="size-3.5" />
            {tutorial.subject.domain && (
              <>
                <span
                  className="flex items-center gap-1.5 rounded px-1.5 py-0.5 text-xs font-medium"
                  style={{
                    color: tutorial.subject.domain.color,
                    background: `color-mix(in oklch, ${tutorial.subject.domain.color} 12%, transparent)`,
                  }}
                >
                  {tutorial.subject.domain.name}
                </span>
                <ChevronRight className="size-3.5" />
              </>
            )}
            <button
              onClick={() => navigate("subject", { subjectSlug: tutorial.subject.slug })}
              className="hover:text-foreground flex items-center gap-1.5"
            >
              <SubjectIcon name={tutorial.subject.icon} color={tutorial.subject.color} className="size-4 rounded" />
              {tutorial.subject.name}
            </button>
            {tutorial.module && (
              <>
                <ChevronRight className="size-3.5" />
                <span className="text-foreground/80 truncate max-w-[12rem]">{tutorial.module.title}</span>
              </>
            )}
          </nav>

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              <DifficultyBadge difficulty={tutorial.difficulty} />
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="size-3.5" /> {tutorial.estimatedMinutes} min read
              </span>
              {completed && (
                <span className="flex items-center gap-1 text-xs text-primary font-medium">
                  <CheckCircle2 className="size-3.5" /> Completed
                </span>
              )}
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight">
              {tutorial.title}
            </h1>
            <p className="text-lg text-muted-foreground mt-3">{tutorial.summary}</p>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-2 mt-6">
              {session ? (
                <>
                  <Button
                    variant={completed ? "outline" : "default"}
                    onClick={markComplete}
                    disabled={updateProgress.isPending}
                    size="sm"
                  >
                    {updateProgress.isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
                    <CheckCircle2 className="mr-2 size-4" />
                    {completed ? "Completed" : "Mark complete"}
                  </Button>
                  <Button
                    variant={bookmarked ? "secondary" : "outline"}
                    onClick={onBookmark}
                    size="sm"
                  >
                    <Bookmark className={`mr-2 size-4 ${bookmarked ? "fill-current" : ""}`} />
                    {bookmarked ? "Saved" : "Bookmark"}
                  </Button>
                  <Button variant="outline" onClick={() => setShowNotes((s) => !s)} size="sm">
                    <StickyNote className="mr-2 size-4" />
                    Notes {(notesData?.length ?? 0) > 0 && `(${notesData?.length})`}
                  </Button>
                  <ShareButton title={tutorial.title} slug={tutorial.slug} />
                  <PrintButton title={tutorial.title} subject={tutorial.subject.name} />
                </>
              ) : (
                <div className="flex flex-wrap items-center gap-2">
                  <Button size="sm" onClick={() => useAppStore.getState().openAuth("register")} className="shadow-glow-primary">
                    Sign in to track progress
                  </Button>
                  <ShareButton title={tutorial.title} slug={tutorial.slug} />
                  <PrintButton title={tutorial.title} subject={tutorial.subject.name} />
                </div>
              )}
              {/* Search while reading — jump to a related topic without losing your place. */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSearchOpen(true)}
                className="border-dashed"
                aria-label="Search tutorials while reading"
              >
                <Search className="mr-2 size-4" />
                Search topics
                <kbd className="ml-1.5 hidden sm:inline-flex items-center rounded border border-border/60 bg-background px-1 text-[10px] font-mono text-muted-foreground">
                  ⌘K
                </kbd>
              </Button>
            </div>
          </div>

          {/* Pedagogical header — learning objectives, prerequisites, where-it-fits */}
          <TutorialMetaPanel
            learningObjectives={(tutorial as any).learningObjectives}
            prerequisites={(tutorial as any).prerequisites}
            whereItFits={(tutorial as any).whereItFits}
          />

          {/* Content */}
          <div ref={contentRef} data-tutorial-content className="border-t border-border/60 pt-8 text-base transition-[font-size]">
            <MarkdownRenderer content={tutorial.content} />
          </div>

          {/* Rating */}
          {session && (
            <div className="mt-10 flex items-center justify-center py-6 border-y border-border/60">
              <TutorialRating tutorialId={tutorial.id} />
            </div>
          )}

          {/* Quizzes */}
          {tutorial.quizzes && tutorial.quizzes.length > 0 && (
            <div className="mt-12">
              <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <Sparkles className="size-5 text-primary" /> Test your knowledge
              </h2>
              <div className="space-y-3">
                {tutorial.quizzes.map((q: any) => (
                  <QuizInline key={q.id} quiz={q} tutorialId={tutorial.id} />
                ))}
              </div>
            </div>
          )}

          {/* Recap — key takeaways + self-assessment checklist */}
          <TutorialRecapPanel
            keyTakeaways={(tutorial as any).keyTakeaways}
            selfAssessment={(tutorial as any).selfAssessment}
          />

          {/* Prev / Next */}
          <div className="grid sm:grid-cols-2 gap-3 mt-12 pt-8 border-t border-border/60">
            {prev ? (
              <button
                onClick={() => navigate("tutorial", { subjectSlug: tutorial.subject.slug, tutorialSlug: prev.slug })}
                className="group flex items-center gap-3 rounded-xl border border-border/60 hover:border-primary/40 hover:shadow-sm transition-all p-4 text-left"
              >
                <ArrowLeft className="size-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs text-muted-foreground">Previous</div>
                  <div className="font-medium truncate group-hover:text-primary transition-colors">{prev.title}</div>
                </div>
              </button>
            ) : <div />}
            {next ? (
              <button
                onClick={() => navigate("tutorial", { subjectSlug: tutorial.subject.slug, tutorialSlug: next.slug })}
                className="group flex items-center gap-3 rounded-xl border border-border/60 hover:border-primary/40 hover:shadow-sm transition-all p-4 text-right sm:justify-end"
              >
                <div className="min-w-0 sm:order-1">
                  <div className="text-xs text-muted-foreground">Next</div>
                  <div className="font-medium truncate group-hover:text-primary transition-colors">{next.title}</div>
                </div>
                <ArrowRight className="size-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0 sm:order-2" />
              </button>
            ) : <div />}
          </div>

          {/* Return to where the reader came from — handy after finishing a
              side-quest tutorial reached via search. */}
          <div className="mt-6 flex justify-center">
            <ReturnBar variant="inline" />
          </div>

          {/* Related tutorials */}
          <RelatedTutorials
            subjectSlug={tutorial.subject.slug}
            tutorialSlug={tutorial.slug}
          />
        </div>

        {/* TOC sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            {toc.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                  <ListTree className="size-3.5" /> Contents
                </div>
                <ul className="space-y-1.5 text-sm">
                  {toc.map((t, idx) => {
                    const isActive = idx === activeTocIndex
                    return (
                      <li key={t.id} className="relative">
                        <button
                          className={`text-left line-clamp-1 transition-colors w-full pl-3 border-l-2 ${
                            isActive
                              ? "border-primary text-primary font-medium"
                              : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                          }`}
                          onClick={() => {
                            const headings = document.querySelectorAll("h2")
                            headings.forEach((h) => {
                              if (h.textContent?.trim() === t.text) h.scrollIntoView({ behavior: "smooth", block: "start" })
                            })
                          }}
                        >
                          {t.text}
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}
            {/* Font size control */}
            <div>
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                Font size
              </div>
              <FontSizeControl />
            </div>
            {session && (
              <div>
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  Progress
                </div>
                <div className="text-2xl font-bold">{progress?.percentRead ?? readingPct}%</div>
                <div className="h-2 rounded-full bg-muted overflow-hidden mt-2">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${Math.max(progress?.percentRead ?? readingPct, 2)}%` }}
                  />
                </div>
                {(() => {
                  const pct = progress?.percentRead ?? readingPct
                  const remaining = Math.max(0, Math.ceil(tutorial.estimatedMinutes * (1 - pct / 100)))
                  if (pct >= 100) {
                    return <div className="text-xs text-primary mt-2 flex items-center gap-1"><CheckCircle2 className="size-3" /> Completed</div>
                  }
                  if (pct > 0) {
                    return <div className="text-xs text-muted-foreground mt-2 flex items-center gap-1"><Clock className="size-3" /> ~{remaining} min left</div>
                  }
                  return <div className="text-xs text-muted-foreground mt-2 flex items-center gap-1"><Clock className="size-3" /> {tutorial.estimatedMinutes} min read</div>
                })()}
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* Notes panel */}
      {showNotes && session && (
        <NotesPanel
          notes={notesData ?? []}
          onCreate={(content) =>
            createNote.mutateAsync({ tutorialId: tutorial.id, content }).then(() => { toast.success("Note added") })
          }
          onDelete={async (id) => { await deleteNote.mutateAsync(id); toast.success("Note deleted") }}
          onClose={() => setShowNotes(false)}
        />
      )}

      {/* Completion celebration */}
      <CompletionCelebration
        show={celebration.show}
        xpAwarded={celebration.xp}
        achievementUnlocked={celebration.achievement}
        onClose={() => setCelebration({ show: false, xp: 0, achievement: null })}
      />

      {/* Keyboard shortcuts */}
      <KeyboardShortcuts
        onPrev={() => prev && navigate("tutorial", { subjectSlug: tutorial.subject.slug, tutorialSlug: prev.slug })}
        onNext={() => next && navigate("tutorial", { subjectSlug: tutorial.subject.slug, tutorialSlug: next.slug })}
        onBookmark={onBookmark}
        onComplete={markComplete}
        hasPrev={!!prev}
        hasNext={!!next}
      />

      {/* AI Study Buddy — always available on a loaded tutorial */}
      <StudyBuddy tutorialId={tutorial.id} tutorialTitle={tutorial.title} />
    </div>
  )
}

// ----------------------------------------------------------------
// LOCKED TUTORIAL — content behind FREE/PREMIUM without access.
// The API never sends the body here, only preview metadata.
// ----------------------------------------------------------------
function LockedTutorial({
  preview,
  locked,
  onUpgrade,
  onBrowse,
}: {
  preview: { title: string; summary: string; difficulty: string; estimatedMinutes: number; tags: string; subject: { slug: string; name: string; icon: string; color: string } }
  locked: { level: string; canRead: boolean; previewOnly: boolean; reason: string | null; guest: boolean; effectiveAccess: string }
  onUpgrade: () => void
  onBrowse: () => void
}) {
  const isGuest = locked.effectiveAccess === "GUEST"
  const isPremiumLevel = locked.level === "PREMIUM"

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-12">
      <div className="flex flex-col items-center text-center">
        <div className="size-16 rounded-2xl bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 flex items-center justify-center mb-6">
          <Sparkles className="size-8" />
        </div>
        <div className="inline-flex items-center gap-1.5 rounded-full glass-pill px-3 py-1 text-xs font-medium text-muted-foreground mb-4">
          <Lock className="size-3.5" /> {locked.level} content
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">{preview.title}</h1>
        <p className="text-muted-foreground mb-2">{preview.summary}</p>
        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-8">
          <DifficultyBadge difficulty={preview.difficulty} />
          <span className="flex items-center gap-1"><Clock className="size-3.5" /> {preview.estimatedMinutes} min</span>
        </div>
        <p className="text-sm text-muted-foreground/90 max-w-md mb-8 leading-relaxed">
          {locked.reason}
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {isGuest ? (
            <>
              <Button className="shadow-glow-primary" onClick={() => useAppStore.getState().openAuth("register")}>
                Create free account <ArrowRight className="ml-2 size-4" />
              </Button>
              <Button variant="outline" onClick={onBrowse}>
                Browse free tutorials
              </Button>
            </>
          ) : (
            <>
              <Button className="shadow-glow-primary" onClick={onUpgrade}>
                {isPremiumLevel ? "Unlock lifetime Premium" : "Unlock full tutorial"} <ArrowRight className="ml-2 size-4" />
              </Button>
              <Button variant="outline" onClick={onBrowse}>
                Continue learning free
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
