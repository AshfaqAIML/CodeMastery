"use client"

import * as React from "react"
import { Award, Lock, CheckCircle2 } from "lucide-react"
import { useAppStore } from "@/lib/store"
import { useAchievements, useMe } from "@/hooks/use-api"
import { Card, CardContent } from "@/components/ui/card"
import { useSession } from "next-auth/react"
import { SubjectIcon } from "@/components/shared/subject-icon"

const CATEGORY_LABELS: Record<string, string> = {
  learning: "Learning",
  streak: "Streaks",
  skill: "Skills",
  milestone: "Milestones",
  social: "Social",
}

export function AchievementsView() {
  const { navigate } = useAppStore()
  const { data: session } = useSession()
  const { data, isLoading } = useAchievements()
  const { data: meData } = useMe()
  const achievements = data?.achievements ?? []

  const unlocked = achievements.filter((a: any) => a.unlocked)
  const total = achievements.length
  const pct = total > 0 ? Math.round((unlocked.length / total) * 100) : 0

  const byCategory = React.useMemo(() => {
    const map: Record<string, any[]> = {}
    for (const a of achievements) {
      if (!map[a.category]) map[a.category] = []
      map[a.category].push(a)
    }
    return map
  }, [achievements])

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
        <div className="h-10 w-48 bg-muted/40 animate-pulse rounded mb-6" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="h-40 bg-muted/40 animate-pulse rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="size-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
          <Award className="size-6" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Achievements</h1>
          <p className="text-muted-foreground text-sm">
            {unlocked.length} of {total} unlocked · {pct}% complete
          </p>
        </div>
      </div>

      {!session && (
        <Card className="mb-6">
          <CardContent className="py-6 text-center">
            <p className="text-sm text-muted-foreground">
              Sign in to track your achievement progress.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Progress bar */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="font-medium">Overall progress</span>
            <span className="text-muted-foreground">{unlocked.length}/{total}</span>
          </div>
          <div className="h-3 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-700"
              style={{ width: `${Math.max(2, pct)}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* By category */}
      <div className="space-y-8">
        {Object.entries(byCategory).map(([cat, items]) => (
          <div key={cat}>
            <h2 className="text-lg font-semibold mb-3">{CATEGORY_LABELS[cat] ?? cat}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((a) => (
                <Card
                  key={a.id}
                  className={`overflow-hidden transition-all ${
                    a.unlocked ? "border-primary/30" : "opacity-70"
                  }`}
                >
                  <CardContent className="pt-5">
                    <div className="flex items-start gap-3">
                      <div
                        className={`size-12 rounded-xl flex items-center justify-center shrink-0 ${
                          a.unlocked ? "" : "grayscale"
                        }`}
                        style={{
                          background: a.unlocked
                            ? `color-mix(in oklch, ${a.color} 18%, transparent)`
                            : "var(--muted)",
                          color: a.unlocked ? a.color : "var(--muted-foreground)",
                        }}
                      >
                        {a.unlocked ? (
                          <SubjectIcon name={a.icon} color={a.color} className="size-12 rounded-xl bg-transparent p-0" />
                        ) : (
                          <Lock className="size-5" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold flex items-center gap-1.5">
                          {a.title}
                          {a.unlocked && <CheckCircle2 className="size-4 text-primary shrink-0" />}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{a.description}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      {a.unlocked ? (
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-primary font-medium">Unlocked</span>
                          {a.earnedAt && (
                            <span className="text-muted-foreground">
                              {new Date(a.earnedAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                            <span>{a.progress}/{a.threshold}</span>
                            <span>+{a.xpReward} XP</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                            <div
                              className="h-full bg-primary"
                              style={{
                                width: `${Math.min(100, (a.progress / a.threshold) * 100)}%`,
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      {meData && (
        <p className="text-center text-sm text-muted-foreground mt-10">
          You've earned {meData.stats.totalXP.toLocaleString()} XP so far. {unlocked.length < total
            ? `${total - unlocked.length} achievements left to unlock!`
            : "You've unlocked everything! 🏆"}
        </p>
      )}
    </div>
  )
}
