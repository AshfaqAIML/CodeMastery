"use client"

import * as React from "react"
import {
  ArrowLeft, ArrowRight, Bookmark, Clock, ChevronRight, Loader2,
  StickyNote, CheckCircle2, X, Plus, Pencil, Trash2, Sparkles, ListTree,
} from "lucide-react"
import { useAppStore } from "@/lib/store"
import {
  useTutorial, useUpdateProgress, useToggleBookmark,
  useNotes, useCreateNote, useDeleteNote,
} from "@/hooks/use-api"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { DifficultyBadge } from "@/components/shared/difficulty-badge"
import { SubjectIcon } from "@/components/shared/subject-icon"
import { MarkdownRenderer } from "@/components/markdown/markdown-renderer"
import { StudyBuddy } from "@/components/tutorial/study-buddy"
import { CompletionCelebration } from "@/components/tutorial/completion-celebration"
import { KeyboardShortcuts } from "@/components/tutorial/keyboard-shortcuts"
import { TutorialRating } from "@/components/tutorial/tutorial-rating"
import { ShareButton } from "@/components/tutorial/share-button"
import { RelatedTutorials } from "@/components/tutorial/related-tutorials"
import { FontSizeControl } from "@/components/tutorial/font-size-control"
import { toast } from "sonner"

export function TutorialView() {
  const { params, navigate } = useAppStore()
  const { data, isLoading } = useTutorial(params.subjectSlug, params.tutorialSlug)
  const { data: session } = useSession()
  const updateProgress = useUpdateProgress()
  const toggleBookmark = useToggleBookmark()
  const { data: notesData } = useNotes(data?.tutorial?.id)
  const createNote = useCreateNote()
  const deleteNote = useDeleteNote()
  const [showNotes, setShowNotes] = React.useState(false)
  const [celebration, setCelebration] = React.useState<{ show: boolean; xp: number; achievement: string | null }>({
    show: false, xp: 0, achievement: null,
  })

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
    updateProgress.mutate(
      { tutorialId: data.tutorial.id, percentRead: 100, completed: true },
      {
        onSuccess: (res) => {
          // Only show celebration on first completion (when XP was awarded)
          if (!wasCompleted && res.xpAwarded > 0) {
            // Check if an achievement was unlocked by looking at the stats
            setCelebration({
              show: true,
              xp: res.xpAwarded,
              achievement: null,
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

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-8">
        <div className="h-8 w-40 bg-muted/40 animate-pulse rounded mb-6" />
        <div className="h-12 bg-muted/40 animate-pulse rounded mb-3" />
        <div className="space-y-3 mt-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-5 bg-muted/40 animate-pulse rounded" />
          ))}
        </div>
      </div>
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

  const { tutorial, prev, next, progress, bookmarked } = data
  const completed = progress?.completed ?? false

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6">
      {/* Reading progress bar */}
      <div className="fixed top-16 left-0 right-0 z-30 h-1 bg-transparent pointer-events-none">
        <div
          className="h-full bg-primary transition-[width] duration-150"
          style={{ width: `${Math.max(readingPct, progress?.percentRead ?? 0)}%` }}
        />
      </div>

      <div className="grid lg:grid-cols-[1fr_240px] gap-8">
        <div className="min-w-0">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4 flex-wrap">
            <button onClick={() => navigate("home")} className="hover:text-foreground">Home</button>
            <ChevronRight className="size-3.5" />
            <button onClick={() => navigate("browse")} className="hover:text-foreground">Browse</button>
            <ChevronRight className="size-3.5" />
            <button
              onClick={() => navigate("subject", { subjectSlug: tutorial.subject.slug })}
              className="hover:text-foreground flex items-center gap-1.5"
            >
              <SubjectIcon name={tutorial.subject.icon} color={tutorial.subject.color} className="size-4 rounded" />
              {tutorial.subject.name}
            </button>
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
                    Notes {(notesData?.length ?? 0) > 0 && `(${notesData.length})`}
                  </Button>
                  <ShareButton title={tutorial.title} slug={tutorial.slug} />
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <ShareButton title={tutorial.title} slug={tutorial.slug} />
                </div>
              )}
            </div>
          </div>

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
          tutorialId={tutorial.id}
          notes={notesData ?? []}
          onCreate={(content) =>
            createNote.mutateAsync({ tutorialId: tutorial.id, content }).then(() => toast.success("Note added"))
          }
          onDelete={(id) => deleteNote.mutateAsync(id).then(() => toast.success("Note deleted"))}
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

      {/* AI Study Buddy (only renders if AI_ENABLED) */}
      <StudyBuddy tutorialId={tutorial.id} tutorialTitle={tutorial.title} />

      {/* Keyboard shortcuts */}
      <KeyboardShortcuts
        onPrev={() => prev && navigate("tutorial", { subjectSlug: tutorial.subject.slug, tutorialSlug: prev.slug })}
        onNext={() => next && navigate("tutorial", { subjectSlug: tutorial.subject.slug, tutorialSlug: next.slug })}
        onBookmark={onBookmark}
        onComplete={markComplete}
        hasPrev={!!prev}
        hasNext={!!next}
      />
    </div>
  )
}

function QuizInline({ quiz, tutorialId }: { quiz: any; tutorialId: string }) {
  const { data: fullQuiz } = useQuizInline(quiz.id)
  const submit = useSubmitQuizInline()
  const [answers, setAnswers] = React.useState<Record<string, number>>({})
  const [result, setResult] = React.useState<any>(null)

  if (!fullQuiz) return <div className="h-20 bg-muted/30 animate-pulse rounded-lg" />

  const onSubmit = () => {
    const arr = fullQuiz.questions.map((q: any) => ({
      questionId: q.id,
      selectedIndex: answers[q.id] ?? -1,
    }))
    submit.mutate(
      { id: quiz.id, answers: arr },
      {
        onSuccess: (res) => {
          setResult(res)
          if (res.passed) toast.success(`Quiz passed! +${res.xpAwarded} XP`)
          else toast.error(`You scored ${res.score}%. Passing is ${quiz.passingScore}%.`)
        },
      }
    )
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center justify-between">
          <span>{quiz.title}</span>
          <span className="text-xs text-muted-foreground font-normal">
            {quiz.xpReward} XP · pass {quiz.passingScore}%
          </span>
        </CardTitle>
        {quiz.description && <p className="text-sm text-muted-foreground">{quiz.description}</p>}
      </CardHeader>
      <CardContent className="space-y-5">
        {fullQuiz.questions.map((q: any, qi: number) => {
          const chosen = answers[q.id]
          const correct = result?.answers?.find((a: any) => a.questionId === q.id)
          return (
            <div key={q.id}>
              <p className="font-medium text-sm mb-2">{qi + 1}. {q.prompt}</p>
              <div className="space-y-1.5">
                {q.options.map((opt: string, oi: number) => {
                  const isChosen = chosen === oi
                  const isCorrect = result && oi === correct?.correctIndex
                  const isWrongChosen = result && isChosen && !correct?.correct
                  return (
                    <button
                      key={oi}
                      disabled={!!result}
                      onClick={() => setAnswers((a) => ({ ...a, [q.id]: oi }))}
                      className={`w-full flex items-center gap-2 rounded-lg border px-3 py-2 text-sm text-left transition-colors ${
                        result
                          ? isCorrect
                            ? "border-primary/50 bg-primary/10 text-primary"
                            : isWrongChosen
                            ? "border-destructive/50 bg-destructive/10 text-destructive"
                            : "border-border text-muted-foreground"
                          : isChosen
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/40 hover:bg-muted/40"
                      }`}
                    >
                      <span className="size-5 rounded-full border border-current flex items-center justify-center text-[10px] font-bold shrink-0">
                        {String.fromCharCode(65 + oi)}
                      </span>
                      <span className="flex-1">{opt}</span>
                      {result && isCorrect && <CheckCircle2 className="size-4 text-primary" />}
                    </button>
                  )
                })}
              </div>
              {result && correct?.explanation && (
                <p className="text-xs text-muted-foreground mt-2 pl-2 border-l-2 border-border">
                  {correct.explanation}
                </p>
              )}
            </div>
          )
        })}
        {!result ? (
          <Button onClick={onSubmit} disabled={submit.isPending || Object.keys(answers).length === 0}>
            {submit.isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
            Submit answers
          </Button>
        ) : (
          <div className="flex items-center justify-between rounded-lg border border-border p-3">
            <div>
              <div className="font-semibold">
                {result.passed ? "Passed! 🎉" : "Not passed"}
              </div>
              <div className="text-sm text-muted-foreground">
                Score: {result.score}%
                {result.xpAwarded > 0 && ` · +${result.xpAwarded} XP`}
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => { setResult(null); setAnswers({}) }}>
              Retake
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Inline imports to avoid circular ref issues
import { useQuiz, useSubmitQuiz } from "@/hooks/use-api"
function useQuizInline(id: string) {
  return useQuiz(id)
}
function useSubmitQuizInline() {
  return useSubmitQuiz()
}

function NotesPanel({
  tutorialId,
  notes,
  onCreate,
  onDelete,
  onClose,
}: {
  tutorialId: string
  notes: any[]
  onCreate: (content: string) => Promise<void>
  onDelete: (id: string) => Promise<void>
  onClose: () => void
}) {
  const [content, setContent] = React.useState("")
  const [saving, setSaving] = React.useState(false)

  const submit = async () => {
    if (!content.trim()) return
    setSaving(true)
    try {
      await onCreate(content)
      setContent("")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 max-w-[calc(100vw-2rem)]">
      <Card className="shadow-xl">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              <StickyNote className="size-4 text-primary" /> My notes
            </CardTitle>
            <Button variant="ghost" size="icon" className="size-7" onClick={onClose}>
              <X className="size-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write a note about this tutorial..."
              className="min-h-20 text-sm"
            />
            <Button size="sm" onClick={submit} disabled={saving || !content.trim()} className="w-full">
              {saving && <Loader2 className="mr-2 size-4 animate-spin" />}
              <Plus className="mr-1 size-4" /> Add note
            </Button>
          </div>
          <div className="max-h-60 overflow-y-auto scrollbar-thin space-y-2">
            {notes.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-4">
                No notes yet. Start writing!
              </p>
            ) : (
              notes.map((n) => (
                <div key={n.id} className="group rounded-lg border border-border/60 p-2.5">
                  <p className="text-sm whitespace-pre-wrap">{n.content}</p>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(n.updatedAt).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => onDelete(n.id)}
                      className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
