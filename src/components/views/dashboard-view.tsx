"use client"

import * as React from "react"
import { useSession } from "next-auth/react"
import {
  LayoutDashboard, Flame, Zap, Trophy, BookOpen, Bookmark, StickyNote,
  Clock, ArrowRight, Sparkles, Target, TrendingUp, Loader2, GraduationCap,
  CheckCircle2, CalendarHeart,
} from "lucide-react"
import { useAppStore } from "@/lib/store"
import { useMe, useSubjects, useDailyChallenge } from "@/hooks/use-api"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LevelBadge, XPBar } from "@/components/shared/level-badge"
import { SubjectIcon } from "@/components/shared/subject-icon"
import { DifficultyBadge } from "@/components/shared/difficulty-badge"
import { StreakHeatmap } from "@/components/dashboard/streak-heatmap"
import { StreakStatus } from "@/components/dashboard/streak-status"
import { XpHistoryChart } from "@/components/dashboard/xp-history-chart"

const ACTIVITY_LABELS: Record<string, string> = {
  tutorial_completed: "Completed a tutorial",
  tutorial_read: "Read a tutorial",
  quiz_passed: "Passed a quiz",
  bookmark_added: "Bookmarked a tutorial",
  note_created: "Created a note",
  achievement_earned: "Unlocked an achievement",
  account_created: "Joined CodeMastery",
}

export function DashboardView() {
  const { data: session, status } = useSession()
  const { navigate, openAuth } = useAppStore()
  const { data: meData, isLoading } = useMe()
  const { data: subjects } = useSubjects()

  if (status === "loading" || isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
        <div className="h-10 w-48 bg-muted/40 animate-pulse rounded mb-6" />
        <div className="grid lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-32 bg-muted/40 animate-pulse rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <div className="size-14 rounded-2xl bg-primary/10 text-primary mx-auto flex items-center justify-center mb-4">
          <GraduationCap className="size-7" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Sign in to see your dashboard</h1>
        <p className="text-muted-foreground mb-6">
          Track your progress, streaks, XP, and achievements in one place.
        </p>
        <div className="flex items-center justify-center gap-2">
          <Button onClick={() => openAuth("register")}>Create account</Button>
          <Button variant="outline" onClick={() => openAuth("login")}>Sign in</Button>
        </div>
      </div>
    )
  }

  if (!meData) return null

  const { user, stats, continueLearning, recentActivity, recommendations = [], recentlyViewed = [] } = meData
  const dailyPct = Math.min(100, Math.round((stats.todayXP / stats.dailyXPCap) * 100))

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="size-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
          <LayoutDashboard className="size-6" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Welcome back, {user.name?.split(" ")[0]} 👋
          </h1>
          <p className="text-muted-foreground text-sm">Here's your learning at a glance.</p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard
          icon={Zap}
          label="Total XP"
          value={stats.totalXP.toLocaleString()}
          color="oklch(0.75 0.16 85)"
          extra={<LevelBadge level={stats.level} />}
        />
        <StatCard
          icon={Flame}
          label="Current streak"
          value={`${stats.currentStreak}d`}
          color="oklch(0.68 0.2 30)"
          extra={<span className="text-xs text-muted-foreground">Best: {stats.longestStreak}d</span>}
        />
        <StatCard
          icon={BookOpen}
          label="Tutorials done"
          value={stats.tutorialsCompleted}
          color="oklch(0.62 0.15 162)"
        />
        <StatCard
          icon={Trophy}
          label="Quizzes passed"
          value={stats.quizzesPassed}
          color="oklch(0.7 0.13 200)"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: Continue learning + activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Continue learning */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Clock className="size-5 text-primary" /> Continue learning
                </span>
                <Button variant="ghost" size="sm" onClick={() => navigate("browse")}>
                  Browse all <ArrowRight className="ml-1 size-3.5" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {continueLearning.length === 0 ? (
                <EmptyState
                  icon={BookOpen}
                  title="No tutorials in progress"
                  desc="Start reading a tutorial and pick up right where you left off."
                  action={
                    <Button size="sm" onClick={() => navigate("browse")}>
                      Browse tutorials
                    </Button>
                  }
                />
              ) : (
                <div className="space-y-2">
                  {continueLearning.map((p: any) => (
                    <button
                      key={p.id}
                      onClick={() =>
                        navigate("tutorial", {
                          subjectSlug: p.tutorial.subject.slug,
                          tutorialSlug: p.tutorial.slug,
                        })
                      }
                      className="w-full flex items-center gap-3 rounded-lg border border-border/60 hover:border-primary/40 hover:bg-muted/40 transition-all p-3 text-left group"
                    >
                      <SubjectIcon
                        name={p.tutorial.subject.icon}
                        color={p.tutorial.subject.color}
                        className="size-10 rounded-lg shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate group-hover:text-primary transition-colors">
                          {p.tutorial.title}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden max-w-32">
                            <div
                              className="h-full bg-primary"
                              style={{ width: `${p.percentRead}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">{p.percentRead}%</span>
                        </div>
                      </div>
                      <ArrowRight className="size-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Streak status */}
          <StreakStatus
            currentStreak={stats.currentStreak}
            longestStreak={stats.longestStreak}
            lastActivityDate={user.lastActivityDate}
          />

          {/* Streak heatmap */}
          <StreakHeatmap currentStreak={stats.currentStreak} />

          {/* Recent activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="size-5 text-primary" /> Recent activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentActivity.length === 0 ? (
                <p className="text-sm text-muted-foreground py-6 text-center">
                  No activity yet. Start reading to build your history.
                </p>
              ) : (
                <ul className="space-y-3">
                  {recentActivity.map((a: any) => (
                    <li key={a.id} className="flex items-center gap-3 text-sm">
                      <span className="size-7 rounded-full bg-muted flex items-center justify-center shrink-0">
                        {a.xpDelta > 0 ? (
                          <Zap className="size-3.5 text-primary" />
                        ) : (
                          <Clock className="size-3.5 text-muted-foreground" />
                        )}
                      </span>
                      <div className="flex-1 min-w-0">
                        <span className="text-foreground">{ACTIVITY_LABELS[a.type] ?? a.type}</span>
                        <span className="text-xs text-muted-foreground ml-2">
                          · {timeAgo(a.createdAt)}
                        </span>
                      </div>
                      {a.xpDelta > 0 && (
                        <span className="text-xs font-semibold text-primary">+{a.xpDelta} XP</span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          {/* Recommended next */}
          {recommendations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sparkles className="size-5 text-primary" /> Recommended for you
                </CardTitle>
                <CardDescription className="text-xs">
                  Based on what you've been learning.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-3">
                  {recommendations.slice(0, 4).map((r: any) => (
                    <button
                      key={r.id}
                      onClick={() =>
                        navigate("tutorial", {
                          subjectSlug: r.subject.slug,
                          tutorialSlug: r.slug,
                        })
                      }
                      className="group flex flex-col gap-2 rounded-lg border border-border/60 hover:border-primary/40 hover:bg-muted/40 transition-all p-3 text-left"
                    >
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <SubjectIcon
                          name={r.subject.icon}
                          color={r.subject.color}
                          className="size-6 rounded"
                        />
                        <span className="truncate">{r.subject.name}</span>
                      </div>
                      <div className="font-medium text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                        {r.title}
                      </div>
                      <div className="flex items-center gap-2 mt-auto">
                        <DifficultyBadge difficulty={r.difficulty} />
                        <span className="text-[11px] text-muted-foreground flex items-center gap-0.5">
                          <Clock className="size-3" />{r.estimatedMinutes}m
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recently viewed */}
          {recentlyViewed.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="size-5 text-primary" /> Recently viewed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {recentlyViewed.slice(0, 4).map((p: any) => (
                    <li key={p.id}>
                      <button
                        onClick={() =>
                          navigate("tutorial", {
                            subjectSlug: p.tutorial.subject.slug,
                            tutorialSlug: p.tutorial.slug,
                          })
                        }
                        className="w-full flex items-center gap-3 rounded-lg hover:bg-muted/40 transition-colors p-2 text-left group"
                      >
                        <SubjectIcon
                          name={p.tutorial.subject.icon}
                          color={p.tutorial.subject.color}
                          className="size-8 rounded shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                            {p.tutorial.title}
                          </div>
                          <div className="text-[11px] text-muted-foreground">
                            {p.percentRead}% · {timeAgo(p.lastReadAt)}
                          </div>
                        </div>
                        {p.completed && (
                          <CheckCircle2 className="size-4 text-primary shrink-0" />
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right: Level + daily cap + quick links */}
        <div className="space-y-6">
          {/* Daily Challenge */}
          <DailyChallengeWidget />

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Your level</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 mb-4">
                <LevelBadge level={stats.level} className="size-12 text-base" />
                <div>
                  <div className="text-2xl font-bold">Level {stats.level}</div>
                  <div className="text-xs text-muted-foreground">{stats.totalXP.toLocaleString()} total XP</div>
                </div>
              </div>
              <XPBar totalXP={stats.totalXP} showMilestones />
            </CardContent>
          </Card>

          {/* XP history chart */}
          <XpHistoryChart />

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Target className="size-4 text-primary" /> Daily goal
                </span>
                <span className="text-xs text-muted-foreground">{stats.todayXP}/{stats.dailyXPCap}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-2 rounded-full bg-muted overflow-hidden mb-2">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${dailyPct}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {dailyPct >= 100
                  ? "Daily goal reached! Great work. 🎉"
                  : `Earn ${stats.dailyXPCap - stats.todayXP} more XP to hit today's cap.`}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <QuickLink icon={Bookmark} label="My bookmarks" value={stats.bookmarksCount} onClick={() => navigate("profile", { tab: "bookmarks" })} />
              <QuickLink icon={StickyNote} label="My notes" value={stats.notesCount} onClick={() => navigate("profile", { tab: "notes" })} />
              <QuickLink icon={Trophy} label="Achievements" onClick={() => navigate("achievements")} />
              <QuickLink icon={Sparkles} label="Leaderboard" onClick={() => navigate("leaderboard")} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon: Icon, label, value, color, extra }: { icon: any; label: string; value: any; color: string; extra?: React.ReactNode }) {
  return (
    <Card>
      <CardContent className="pt-5">
        <div className="flex items-center justify-between mb-2">
          <span
            className="size-9 rounded-lg flex items-center justify-center"
            style={{ background: `color-mix(in oklch, ${color} 16%, transparent)`, color }}
          >
            <Icon className="size-5" />
          </span>
          {extra}
        </div>
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
      </CardContent>
    </Card>
  )
}

function QuickLink({ icon: Icon, label, value, onClick }: { icon: any; label: string; value?: number; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-2 px-2 py-2 rounded-md hover:bg-muted/60 transition-colors text-sm group"
    >
      <Icon className="size-4 text-muted-foreground" />
      <span className="flex-1 text-left">{label}</span>
      {value !== undefined && <span className="text-xs text-muted-foreground">{value}</span>}
      <ArrowRight className="size-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  )
}

function EmptyState({ icon: Icon, title, desc, action }: { icon: any; title: string; desc: string; action?: React.ReactNode }) {
  return (
    <div className="text-center py-8">
      <Icon className="size-10 mx-auto text-muted-foreground/40 mb-3" />
      <h3 className="font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1 mb-4">{desc}</p>
      {action}
    </div>
  )
}

function timeAgo(date: string | Date) {
  const diff = Date.now() - new Date(date).getTime()
  const sec = Math.floor(diff / 1000)
  if (sec < 60) return "just now"
  const min = Math.floor(sec / 60)
  if (min < 60) return `${min}m ago`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `${hr}h ago`
  const day = Math.floor(hr / 24)
  if (day < 7) return `${day}d ago`
  return new Date(date).toLocaleDateString()
}

function DailyChallengeWidget() {
  const { navigate } = useAppStore()
  const { data, isLoading } = useDailyChallenge()

  if (isLoading) {
    return (
      <Card className="overflow-hidden">
        <div className="h-28 bg-muted/40 animate-pulse" />
      </Card>
    )
  }

  if (!data?.tutorial) return null

  const { tutorial, completedToday, xpBonus, date } = data

  return (
    <Card className="overflow-hidden relative border-primary/30">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent pointer-events-none" />
      <CardHeader className="pb-2 relative">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <CalendarHeart className="size-5 text-primary" />
            Daily Challenge
          </CardTitle>
          <span className="text-[10px] text-muted-foreground font-mono">
            {new Date(date).toLocaleDateString("en", { month: "short", day: "numeric" })}
          </span>
        </div>
      </CardHeader>
      <CardContent className="relative">
        <button
          onClick={() =>
            navigate("tutorial", {
              subjectSlug: tutorial.subject.slug,
              tutorialSlug: tutorial.slug,
            })
          }
          className="w-full text-left group"
        >
          <div className="flex items-start gap-3 mb-3">
            <SubjectIcon
              name={tutorial.subject.icon}
              color={tutorial.subject.color}
              className="size-10 rounded-lg shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm leading-snug group-hover:text-primary transition-colors line-clamp-2">
                {tutorial.title}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {tutorial.subject.name}
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1 text-xs font-medium text-primary bg-primary/10 rounded-full px-2.5 py-1">
              <Zap className="size-3 fill-current" />
              +{xpBonus} XP bonus
            </span>
            {completedToday ? (
              <span className="inline-flex items-center gap-1 text-xs text-primary font-medium">
                <CheckCircle2 className="size-3.5" />
                Done today!
              </span>
            ) : (
              <span className="text-xs text-muted-foreground group-hover:text-primary transition-colors flex items-center gap-1">
                Start <ArrowRight className="size-3" />
              </span>
            )}
          </div>
        </button>
      </CardContent>
    </Card>
  )
}
