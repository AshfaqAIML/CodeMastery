"use client"

import * as React from "react"
import { Route, Target, Clock, ChevronRight, ArrowLeft, Compass, CheckCircle2 } from "lucide-react"
import { motion } from "framer-motion"
import { useAppStore } from "@/lib/store"
import { usePaths, usePath, useEnrollPath } from "@/hooks/use-api"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SubjectIcon } from "@/components/shared/subject-icon"
import { DifficultyBadge } from "@/components/shared/difficulty-badge"
import { toast } from "sonner"

export function PathsView() {
  const { params, navigate } = useAppStore()
  const { data: paths, isLoading } = usePaths()
  const { data: path } = usePath(params.pathSlug)
  const { data: session } = useSession()
  const enroll = useEnrollPath()

  // Detail view
  if (params.pathSlug) {
    if (!path) {
      return (
        <div className="mx-auto max-w-2xl px-4 py-20 text-center">
          <p className="text-muted-foreground">Learning path not found.</p>
          <Button variant="outline" className="mt-4" onClick={() => navigate("paths")}>
            Back to paths
          </Button>
        </div>
      )
    }
    return (
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8">
        <button onClick={() => navigate("paths")} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="size-4" /> All paths
        </button>

        <div
          className="rounded-2xl border border-border/60 p-6 sm:p-8 mb-8 relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, color-mix(in oklch, ${path.color} 12%, var(--background)), var(--background))`,
          }}
        >
          <div className="absolute -top-8 -right-8 opacity-10">
            <SubjectIcon name={path.icon} color={path.color} className="size-40 rounded-3xl" />
          </div>
          <div className="relative flex items-start gap-4">
            <SubjectIcon name={path.icon} color={path.color} className="size-14 rounded-2xl shrink-0" />
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{path.title}</h1>
              <p className="text-lg text-muted-foreground mt-1">{path.tagline}</p>
              <p className="text-sm text-muted-foreground mt-3 max-w-2xl">{path.description}</p>
              <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5"><DifficultyBadge difficulty={path.difficulty} /></span>
                <span className="flex items-center gap-1.5"><Target className="size-3.5" /> {path.steps.length} steps</span>
                <span className="flex items-center gap-1.5"><Clock className="size-3.5" /> {path.estimatedHours}h</span>
              </div>
              {session && (
                <div className="mt-5 flex items-center gap-3">
                  {path.enrollment ? (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          enroll.mutate(
                            { slug: path.slug, action: "unenroll" },
                            { onSuccess: () => toast.success("Unenrolled") }
                          )
                        }
                      >
                        Unenroll
                      </Button>
                      <div className="flex-1 max-w-xs">
                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                          <span>Your progress</span>
                          <span className="font-medium text-foreground">
                            {path.enrollment.completedSteps}/{path.enrollment.totalSteps} · {path.enrollment.percent}%
                          </span>
                        </div>
                        <div className="h-2 rounded-full bg-background/60 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${path.enrollment.percent}%`, background: path.color }}
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <Button
                      size="sm"
                      className="shadow-glow-primary"
                      onClick={() =>
                        enroll.mutate(
                          { slug: path.slug, action: "enroll" },
                          { onSuccess: () => toast.success("Enrolled! Start learning 🎉") }
                        )
                      }
                    >
                      Enroll for free
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-4">The journey</h2>
        <ol className="relative border-l-2 border-border/60 ml-4 space-y-6">
          {path.steps.map((step: any, i: number) => {
            const isCompleted = step.tutorial?.progress?.[0]?.completed
            return (
            <li key={step.id} className="ml-6 relative">
              <span
                className={`absolute -left-[34px] top-0 size-7 rounded-full border-2 border-background flex items-center justify-center text-xs font-bold ${isCompleted ? "" : ""}`}
                style={{ background: isCompleted ? "var(--primary)" : path.color, color: "white" }}
              >
                {isCompleted ? <CheckCircle2 className="size-4" /> : i + 1}
              </span>
              <Card className={`hover:shadow-sm transition-shadow ${isCompleted ? "border-primary/30" : ""}`}>
                <CardContent className="py-4">
                  <div className="flex items-start gap-3">
                    <SubjectIcon
                      name={step.subject?.icon ?? step.tutorial?.subject.icon}
                      color={step.subject?.color ?? step.tutorial?.subject.color}
                      className="size-10 rounded-lg shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold flex items-center gap-2">
                        {step.title}
                        {isCompleted && <CheckCircle2 className="size-4 text-primary shrink-0" />}
                      </h3>
                      {step.subtitle && <p className="text-sm text-muted-foreground mt-0.5">{step.subtitle}</p>}
                      <div className="mt-3">
                        {step.tutorial ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              navigate("tutorial", {
                                subjectSlug: step.tutorial.subject.slug,
                                tutorialSlug: step.tutorial.slug,
                              })
                            }
                          >
                            Start tutorial <ChevronRight className="ml-1 size-3.5" />
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => navigate("subject", { subjectSlug: step.subject.slug })}
                          >
                            Explore subject <ChevronRight className="ml-1 size-3.5" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </li>
            )
          })}
        </ol>
      </div>
    )
  }

  // List view
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
      <div className="flex items-center gap-3 mb-2">
        <div className="size-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
          <Route className="size-6" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Learning paths</h1>
          <p className="text-muted-foreground text-sm">Curated journeys from beginner to expert.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 gap-4 mt-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-56 bg-muted/40 animate-pulse rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4 mt-8">
          {(paths ?? []).map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <Card
                className="h-full cursor-pointer hover:shadow-md transition-shadow overflow-hidden"
                onClick={() => navigate("paths", { pathSlug: p.slug })}
              >
                <div className="h-1.5" style={{ background: p.color }} />
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <SubjectIcon name={p.icon} color={p.color} className="size-12 rounded-xl" />
                    <DifficultyBadge difficulty={p.difficulty} />
                  </div>
                  <CardTitle className="text-lg mt-3">{p.title}</CardTitle>
                  <CardDescription>{p.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5"><Compass className="size-3.5" /> {p.steps?.length ?? 0} steps</span>
                    <span className="flex items-center gap-1.5"><Target className="size-3.5" /> {p.estimatedHours}h</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
