"use client"

import * as React from "react"
import {
  Target, ListChecks, Compass, ClipboardList, Lightbulb, CheckCircle2,
} from "lucide-react"
import { useAppStore } from "@/lib/store"
import { cn } from "@/lib/utils"

type Prereq = { label: string; subjectSlug?: string; tutorialSlug?: string }

/**
 * Pedagogical header panels for a tutorial — rendered above the main content.
 * Each panel only appears when its data is non-empty, so tutorials without
 * explicit metadata are unaffected.
 */
export function TutorialMetaPanel({
  learningObjectives,
  prerequisites,
  whereItFits,
}: {
  learningObjectives?: string[]
  prerequisites?: Prereq[]
  whereItFits?: string
}) {
  const { navigate } = useAppStore()
  const hasObjectives = (learningObjectives?.length ?? 0) > 0
  const hasPrereqs = (prerequisites?.length ?? 0) > 0
  const hasWhereItFits = !!(whereItFits && whereItFits.trim())

  if (!hasObjectives && !hasPrereqs && !hasWhereItFits) return null

  return (
    <div className="mb-8 grid gap-4 sm:grid-cols-2">
      {/* Learning objectives — full width on its own row when alone */}
      {hasObjectives && (
        <section
          className={cn(
            "rounded-xl border border-primary/25 bg-primary/5 p-5 not-prose",
            !hasPrereqs && !hasWhereItFits && "sm:col-span-2"
          )}
          aria-label="Learning objectives"
        >
          <div className="flex items-center gap-2 mb-3">
            <Target className="size-4 text-primary" aria-hidden />
            <h2 className="text-sm font-semibold uppercase tracking-wide text-primary m-0">
              Learning Objectives
            </h2>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            By the end of this tutorial, you will be able to:
          </p>
          <ul className="space-y-2 m-0 list-none p-0">
            {learningObjectives!.map((obj, i) => (
              <li key={i} className="flex items-start gap-2 text-sm leading-6 text-foreground/90">
                <CheckCircle2 className="size-4 mt-0.5 text-primary/70 shrink-0" aria-hidden />
                <span>{obj}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Prerequisites */}
      {hasPrereqs && (
        <section
          className={cn(
            "rounded-xl border border-border/60 bg-muted/30 p-5 not-prose",
            !hasObjectives && !hasWhereItFits && "sm:col-span-2"
          )}
          aria-label="Prerequisites"
        >
          <div className="flex items-center gap-2 mb-3">
            <ListChecks className="size-4 text-muted-foreground" aria-hidden />
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground m-0">
              Prerequisites
            </h2>
          </div>
          <ul className="space-y-1.5 m-0 list-none p-0">
            {prerequisites!.map((p, i) => {
              const isLink = !!(p.subjectSlug && p.tutorialSlug)
              return (
                <li key={i} className="flex items-start gap-2 text-sm leading-6">
                  <span className="text-muted-foreground mt-0.5" aria-hidden>•</span>
                  {isLink ? (
                    <button
                      onClick={() =>
                        navigate("tutorial", {
                          subjectSlug: p.subjectSlug,
                          tutorialSlug: p.tutorialSlug,
                        })
                      }
                      className="text-left text-foreground/90 underline underline-offset-2 decoration-primary/40 hover:decoration-primary hover:text-primary transition-colors"
                    >
                      {p.label}
                    </button>
                  ) : (
                    <span className="text-foreground/90">{p.label}</span>
                  )}
                </li>
              )
            })}
          </ul>
        </section>
      )}

      {/* Where this fits — full width */}
      {hasWhereItFits && (
        <section
          className="sm:col-span-2 rounded-xl border border-border/60 bg-muted/20 p-4 not-prose"
          aria-label="Where this tutorial fits"
        >
          <div className="flex items-start gap-3">
            <Compass className="size-5 mt-0.5 text-muted-foreground shrink-0" aria-hidden />
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
                Where You Are in the Learning Path
              </div>
              <p className="text-sm leading-7 text-foreground/85 m-0">{whereItFits}</p>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

/**
 * End-of-tutorial panels: Key Takeaways + Self-Assessment checklist.
 * Rendered after the main content / quizzes, before prev-next nav.
 */
export function TutorialRecapPanel({
  keyTakeaways,
  selfAssessment,
}: {
  keyTakeaways?: string[]
  selfAssessment?: string[]
}) {
  const hasTakeaways = (keyTakeaways?.length ?? 0) > 0
  const hasSelf = (selfAssessment?.length ?? 0) > 0
  if (!hasTakeaways && !hasSelf) return null

  return (
    <div className="mt-12 grid gap-4 sm:grid-cols-2">
      {hasTakeaways && (
        <section
          className={cn(
            "rounded-xl border border-primary/25 bg-primary/5 p-5 not-prose",
            !hasSelf && "sm:col-span-2"
          )}
          aria-label="Key takeaways"
        >
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="size-4 text-primary" aria-hidden />
            <h2 className="text-sm font-semibold uppercase tracking-wide text-primary m-0">
              Key Takeaways
            </h2>
          </div>
          <ul className="space-y-2 m-0 list-none p-0">
            {keyTakeaways!.map((k, i) => (
              <li key={i} className="flex items-start gap-2 text-sm leading-6 text-foreground/90">
                <span className="text-primary font-semibold mt-0.5 shrink-0">{i + 1}.</span>
                <span>{k}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
      {hasSelf && (
        <section
          className={cn(
            "rounded-xl border border-border/60 bg-muted/30 p-5 not-prose",
            !hasTakeaways && "sm:col-span-2"
          )}
          aria-label="Self-assessment"
        >
          <div className="flex items-center gap-2 mb-3">
            <ClipboardList className="size-4 text-muted-foreground" aria-hidden />
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground m-0">
              Self-Assessment — Can you now…
            </h2>
          </div>
          <ul className="space-y-2 m-0 list-none p-0">
            {selfAssessment!.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-sm leading-6 text-foreground/90">
                <input
                  type="checkbox"
                  className="mt-1 size-4 rounded border-border accent-primary shrink-0"
                  aria-label={s}
                />
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
