"use client"

import * as React from "react"
import { useSession } from "next-auth/react"
import {
  LayoutDashboard, Flame, Zap, Trophy, BookOpen, GraduationCap, Crown, Sparkles,
} from "lucide-react"
import { useAppStore } from "@/lib/store"
import { useMe } from "@/hooks/use-api"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StatCard } from "@/components/dashboard/stat-card"
import { ContinueLearning } from "@/components/dashboard/continue-learning"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { Recommendations } from "@/components/dashboard/recommendations"
import { RecentlyViewed } from "@/components/dashboard/recently-viewed"
import { DailyChallengeWidget } from "@/components/dashboard/daily-challenge-widget"
import { DailyGoal } from "@/components/dashboard/daily-goal"
import { LevelCard } from "@/components/dashboard/level-card"
import { QuickLinks } from "@/components/dashboard/quick-links"
import { StreakHeatmap } from "@/components/dashboard/streak-heatmap"
import { StreakStatus } from "@/components/dashboard/streak-status"
import { XpHistoryChart } from "@/components/dashboard/xp-history-chart"
import { LevelBadge } from "@/components/shared/level-badge"

export function DashboardView() {
  const { data: session, status } = useSession()
  const { openAuth, navigate } = useAppStore()
  const { data: meData, isLoading } = useMe()

  if (status === "loading" || isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
        <div className="h-10 w-48 skeleton-shimmer rounded mb-6" />
        <div className="grid lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-32 skeleton-shimmer rounded-xl" />
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
  const access = meData.access

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      {/* Access-model banner: trial countdown / expiry upsell / premium chip */}
      {access?.effectiveAccess === "PREMIUM_TRIAL" && (
        <div className="mb-6 flex flex-wrap items-center gap-3 rounded-xl border border-primary/30 bg-primary/5 px-4 py-3">
          <div className="size-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Sparkles className="size-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold">
              Premium trial — {access.trialDaysRemaining} day{access.trialDaysRemaining === 1 ? "" : "s"} remaining
            </p>
            <p className="text-xs text-muted-foreground">
              You're enjoying the full Premium experience for free. Lock it in forever with a one-time payment.
            </p>
          </div>
          <Button size="sm" variant="outline" onClick={() => navigate("premium")}>
            <Crown className="mr-1.5 size-4 text-yellow-500" /> Unlock lifetime
          </Button>
        </div>
      )}

      {access?.entitlementState === "NORMAL_TRIAL_EXPIRED" && (
        <div className="mb-6 flex flex-wrap items-center gap-3 rounded-xl border border-border bg-muted/30 px-4 py-3">
          <div className="size-9 rounded-lg bg-muted text-muted-foreground flex items-center justify-center shrink-0">
            <Crown className="size-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold">Your 12-day Premium trial has ended</p>
            <p className="text-xs text-muted-foreground">
              Your progress, streaks, XP, and achievements are all still here — you're just on the free tier now.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost" onClick={() => navigate("browse")}>Continue with free</Button>
            <Button size="sm" onClick={() => navigate("premium")}>
              <Crown className="mr-1.5 size-4" /> Unlock lifetime Premium
            </Button>
          </div>
        </div>
      )}

      {access?.effectiveAccess === "PREMIUM" && (
        <div className="mb-6">
          <Badge className="gap-1.5">
            <Crown className="size-3.5" /> Premium Member
          </Badge>
        </div>
      )}

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
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          <ContinueLearning items={continueLearning} />
          <StreakStatus
            currentStreak={stats.currentStreak}
            longestStreak={stats.longestStreak}
            lastActivityDate={user.lastActivityDate}
          />
          <StreakHeatmap currentStreak={stats.currentStreak} />
          <RecentActivity items={recentActivity} />
          <Recommendations items={recommendations} />
          <RecentlyViewed items={recentlyViewed} />
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <DailyChallengeWidget />
          <LevelCard level={stats.level} totalXP={stats.totalXP} />
          <XpHistoryChart />
          <DailyGoal todayXP={stats.todayXP} dailyXPCap={stats.dailyXPCap} />
          <QuickLinks bookmarksCount={stats.bookmarksCount} notesCount={stats.notesCount} />
        </div>
      </div>
    </div>
  )
}
