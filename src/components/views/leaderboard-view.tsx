"use client"

import * as React from "react"
import { Trophy, Flame, Crown, Medal, TrendingUp } from "lucide-react"
import { useAppStore } from "@/lib/store"
import { useLeaderboard, useMe } from "@/hooks/use-api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LevelBadge } from "@/components/shared/level-badge"
import { useSession } from "next-auth/react"

export function LeaderboardView() {
  const { navigate } = useAppStore()
  const { data: session } = useSession()
  const [period, setPeriod] = React.useState<"all" | "weekly">("all")
  const { data, isLoading } = useLeaderboard(period)
  const { data: meData } = useMe()
  const entries = data?.entries ?? []

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8">
      <div className="flex items-center gap-3 mb-2">
        <div className="size-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
          <Trophy className="size-6" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Leaderboard</h1>
          <p className="text-muted-foreground text-sm">See how you stack up against other learners.</p>
        </div>
      </div>

      {/* Period toggle */}
      <div className="inline-flex rounded-lg border border-border p-1 mt-4 mb-6 bg-muted/30">
        <button
          onClick={() => setPeriod("all")}
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
            period === "all" ? "bg-background shadow-sm" : "text-muted-foreground"
          }`}
        >
          All time
        </button>
        <button
          onClick={() => setPeriod("weekly")}
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
            period === "weekly" ? "bg-background shadow-sm" : "text-muted-foreground"
          }`}
        >
          This week
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-16 bg-muted/40 animate-pulse rounded-lg" />
          ))}
        </div>
      ) : entries.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Trophy className="size-12 mx-auto text-muted-foreground/40 mb-3" />
            <h3 className="font-semibold mb-1">No entries yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Be the first to make the leaderboard. Read tutorials and pass quizzes to earn XP!
            </p>
            <Button onClick={() => navigate("browse")}>Start learning</Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Podium for top 3 */}
          {entries.length >= 3 && (
            <div className="grid grid-cols-3 gap-3 mb-8 items-end">
              {[entries[1], entries[0], entries[2]].map((e, i) => {
                const rank = e.rank
                const isFirst = rank === 1
                return (
                  <Card
                    key={e.id}
                    className={`text-center relative overflow-hidden ${
                      isFirst ? "pt-8 pb-6" : "pt-6 pb-5"
                    }`}
                    style={{
                      borderColor: isFirst ? "oklch(0.75 0.16 85)" : undefined,
                      background: isFirst
                        ? "linear-gradient(180deg, color-mix(in oklch, oklch(0.75 0.16 85) 14%, var(--card)), var(--card))"
                        : undefined,
                    }}
                  >
                    <div className="absolute top-2 left-1/2 -translate-x-1/2">
                      {rank === 1 && <Crown className="size-6 text-yellow-500 fill-yellow-500/30" aria-hidden />}
                    </div>
                    <div
                      className={`mx-auto rounded-full flex items-center justify-center font-bold mb-2 ${
                        isFirst ? "size-16 text-xl" : "size-12 text-base"
                      } ${
                        rank === 1
                          ? "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400"
                          : rank === 2
                          ? "bg-slate-400/20 text-slate-500 dark:text-slate-300"
                          : "bg-orange-500/20 text-orange-600 dark:text-orange-400"
                      }`}
                      role="img"
                      aria-label={`Rank ${rank}${rank === 1 ? " — Gold" : rank === 2 ? " — Silver" : rank === 3 ? " — Bronze" : ""}`}
                    >
                      {rank}
                    </div>
                    <div className="font-semibold text-sm truncate px-2">{e.name}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{e.totalXP.toLocaleString()} XP</div>
                    <div className="mt-2 flex items-center justify-center gap-1 text-xs text-muted-foreground">
                      <Flame className="size-3 text-orange-500" /> {e.currentStreak}d
                    </div>
                  </Card>
                )
              })}
            </div>
          )}

          {/* Full list */}
          <Card>
            <CardContent className="p-0">
              <ul className="divide-y divide-border/60">
                {entries.map((e: any) => {
                  const isMe = session?.user?.id === e.id
                  return (
                    <li
                      key={e.id}
                      className={`flex items-center gap-3 px-4 py-3 ${
                        isMe ? "bg-primary/5 border-l-2 border-primary" : ""
                      }`}
                    >
                      <span
                        className={`size-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                          e.rank === 1
                            ? "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400"
                            : e.rank === 2
                            ? "bg-slate-400/20 text-slate-500 dark:text-slate-300"
                            : e.rank === 3
                            ? "bg-orange-500/20 text-orange-600 dark:text-orange-400"
                            : "bg-muted text-muted-foreground"
                        }`}
                        role="img"
                        aria-label={`Rank ${e.rank}`}
                      >
                        {e.rank <= 3 ? <Medal className="size-4" aria-hidden /> : e.rank}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate flex items-center gap-2">
                          {e.name}
                          {isMe && <span className="text-xs text-primary">(you)</span>}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {e.totalXP.toLocaleString()} XP · {e.currentStreak}d streak
                        </div>
                      </div>
                      {isMe ? (
                        <Button variant="ghost" size="sm" onClick={() => navigate("dashboard")}>
                          Dashboard
                        </Button>
                      ) : (
                        <LevelBadge level={e.level} />
                      )}
                    </li>
                  )
                })}
              </ul>
            </CardContent>
          </Card>

          {meData && (
            <p className="text-center text-sm text-muted-foreground mt-6">
              You're at level {meData.stats.level} with {meData.stats.totalXP.toLocaleString()} XP. Keep learning to climb the ranks!
            </p>
          )}
        </>
      )}
    </div>
  )
}
