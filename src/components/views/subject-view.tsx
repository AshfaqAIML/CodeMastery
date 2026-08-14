"use client"

import * as React from "react"
import { ArrowLeft, Clock, ChevronRight, BookOpen, CheckCircle2, Circle } from "lucide-react"
import { useAppStore } from "@/lib/store"
import { useSubject } from "@/hooks/use-api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SubjectIcon } from "@/components/shared/subject-icon"
import { DifficultyBadge } from "@/components/shared/difficulty-badge"

export function SubjectView() {
  const { params, navigate } = useAppStore()
  const { data: subject, isLoading } = useSubject(params.subjectSlug)

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
        <div className="h-10 w-40 bg-muted/40 animate-pulse rounded mb-6" />
        <div className="h-32 bg-muted/40 animate-pulse rounded-xl mb-8" />
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 bg-muted/40 animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  if (!subject) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <p className="text-muted-foreground">Subject not found.</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate("browse")}>
          Back to browse
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
        <button onClick={() => navigate("home")} className="hover:text-foreground">Home</button>
        <ChevronRight className="size-3.5" />
        <button onClick={() => navigate("browse")} className="hover:text-foreground">Browse</button>
        <ChevronRight className="size-3.5" />
        <span className="text-foreground">{subject.name}</span>
      </nav>

      {/* Header */}
      <div
        className="rounded-2xl border border-border/60 p-6 sm:p-8 mb-8 relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, color-mix(in oklch, ${subject.color} 12%, var(--background)), var(--background))`,
        }}
      >
        <div className="absolute -top-8 -right-8 opacity-10">
          <SubjectIcon name={subject.icon} color={subject.color} className="size-40 rounded-3xl" />
        </div>
        <div className="relative flex items-start gap-4">
          <SubjectIcon name={subject.icon} color={subject.color} className="size-14 rounded-2xl shrink-0" />
          <div className="flex-1">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{subject.name}</h1>
            <p className="text-lg text-muted-foreground mt-1">{subject.tagline}</p>
            <p className="text-sm text-muted-foreground mt-3 max-w-2xl">{subject.description}</p>
            {subject.overallProgress && subject.overallProgress.total > 0 && (
              <div className="mt-4 flex items-center gap-3 max-w-md">
                <div className="flex-1">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                    <span>Your progress</span>
                    <span className="font-medium text-foreground">
                      {subject.overallProgress.completed}/{subject.overallProgress.total} · {subject.overallProgress.percent}%
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-background/60 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${subject.overallProgress.percent}%`, background: subject.color }}
                    />
                  </div>
                </div>
                {subject.overallProgress.percent === 100 && (
                  <span className="text-xs font-medium text-primary flex items-center gap-1 shrink-0">
                    <CheckCircle2 className="size-4" /> Done!
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Difficulty filter */}
      <DifficultyFilter subject={subject} />

      {/* Modules */}
      <div className="space-y-8">
        {subject.modules?.map((m: any) => (
          <div key={m.id}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <BookOpen className="size-5 text-primary" />
                  {m.title}
                </h2>
                {m.summary && (
                  <p className="text-sm text-muted-foreground mt-0.5">{m.summary}</p>
                )}
              </div>
              <span className="text-xs text-muted-foreground flex items-center gap-1.5 shrink-0">
                <Clock className="size-3.5" />
                ~{m.estimatedMinutes}m
              </span>
            </div>
            <div className="grid gap-3">
              {m.tutorials.map((t: any) => (
                <TutorialRow
                  key={t.id}
                  tutorial={t}
                  subjectSlug={subject.slug}
                  onClick={() =>
                    navigate("tutorial", { subjectSlug: subject.slug, tutorialSlug: t.slug })
                  }
                />
              ))}
            </div>
          </div>
        ))}

        {/* Tutorials without a module */}
        {subject.tutorials && subject.tutorials.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-3">Tutorials</h2>
            <div className="grid gap-3">
              {subject.tutorials.map((t: any) => (
                <TutorialRow
                  key={t.id}
                  tutorial={t}
                  subjectSlug={subject.slug}
                  onClick={() =>
                    navigate("tutorial", { subjectSlug: subject.slug, tutorialSlug: t.slug })
                  }
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-12">
        <Button variant="ghost" onClick={() => navigate("browse")}>
          <ArrowLeft className="mr-2 size-4" /> Back to all subjects
        </Button>
      </div>
    </div>
  )
}

function TutorialRow({ tutorial, onClick }: { tutorial: any; subjectSlug: string; onClick: () => void }) {
  const completed = tutorial.progress?.[0]?.completed
  const percent = tutorial.progress?.[0]?.percentRead ?? 0
  return (
    <button
      onClick={onClick}
      className="group flex items-center gap-4 rounded-xl border border-border/60 bg-card hover:border-primary/40 hover:shadow-sm transition-all p-4 text-left"
    >
      {completed !== undefined && (
        completed ? (
          <CheckCircle2 className="size-5 text-primary shrink-0" />
        ) : percent > 0 ? (
          <div className="relative size-5 shrink-0">
            <Circle className="size-5 text-muted-foreground/40" />
            <svg className="absolute inset-0 size-5 -rotate-90" viewBox="0 0 20 20">
              <circle cx="10" cy="10" r="8" fill="none" stroke="var(--primary)" strokeWidth="2" strokeDasharray={`${(percent / 100) * 50.3} 50.3`} strokeLinecap="round" />
            </svg>
          </div>
        ) : (
          <Circle className="size-5 text-muted-foreground/30 shrink-0" />
        )
      )}
      <div className="flex-1 min-w-0">
        <h3 className={`font-semibold group-hover:text-primary transition-colors ${completed ? "text-foreground" : ""}`}>
          {tutorial.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5">{tutorial.summary}</p>
        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
          <DifficultyBadge difficulty={tutorial.difficulty} />
          <span className="flex items-center gap-1">
            <Clock className="size-3" /> {tutorial.estimatedMinutes}m
          </span>
          {percent > 0 && !completed && (
            <span className="text-primary font-medium">{percent}% read</span>
          )}
        </div>
      </div>
      <ChevronRight className="size-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
    </button>
  )
}

function DifficultyFilter({ subject }: { subject: any }) {
  const [filter, setFilter] = React.useState<string>("all")

  // Collect all difficulties present in this subject
  const difficulties = React.useMemo(() => {
    const set = new Set<string>()
    const allTutorials = [
      ...(subject.modules ?? []).flatMap((m: any) => m.tutorials ?? []),
      ...(subject.tutorials ?? []),
    ]
    allTutorials.forEach((t: any) => set.add(t.difficulty))
    return ["all", ...Array.from(set)]
  }, [subject])

  if (difficulties.length <= 2) return null // only "all" + 1 difficulty → no filter needed

  const labelMap: Record<string, string> = {
    all: "All levels",
    beginner: "Beginner",
    intermediate: "Intermediate",
    advanced: "Advanced",
  }

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6">
      <span className="text-xs text-muted-foreground mr-1">Filter:</span>
      {difficulties.map((d) => (
        <button
          key={d}
          onClick={() => setFilter(d)}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-all border ${
            filter === d
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-background hover:bg-muted border-border text-muted-foreground hover:text-foreground"
          }`}
        >
          {labelMap[d] ?? d}
        </button>
      ))}
      <span className="text-xs text-muted-foreground ml-auto" data-difficulty-filter={filter} />
    </div>
  )
}
