"use client"

import * as React from "react"
import Link from "next/link"
import {
  ArrowRight, Sparkles, Zap, Trophy, Flame, BookOpen, Compass, GraduationCap,
  Code2, Brain, Network, Layers, TrendingUp, Target, Users, Rocket, CheckCircle2,
  X,
} from "lucide-react"
import { motion } from "framer-motion"
import { useAppStore } from "@/lib/store"
import { useSubjects, usePaths, useLeaderboard, useMe } from "@/hooks/use-api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { SubjectIcon } from "@/components/shared/subject-icon"
import { DifficultyBadge } from "@/components/shared/difficulty-badge"
import { LevelBadge } from "@/components/shared/level-badge"
import type { ViewName } from "@/lib/store"

const CATEGORIES = [
  { name: "Programming", icon: Code2, color: "oklch(0.62 0.15 162)" },
  { name: "Data", icon: Layers, color: "oklch(0.7 0.13 200)" },
  { name: "Systems", icon: Network, color: "oklch(0.72 0.16 162)" },
  { name: "AI/ML", icon: Brain, color: "oklch(0.65 0.2 305)" },
  { name: "Web", icon: Compass, color: "oklch(0.8 0.16 75)" },
  { name: "Career", icon: Trophy, color: "oklch(0.68 0.2 30)" },
]

export function HomeView() {
  const { navigate, openAuth } = useAppStore()
  const { data: subjects } = useSubjects({ withCounts: true })
  const { data: paths } = usePaths()
  const { data: lb } = useLeaderboard("weekly")
  const { data: meData } = useMe()

  const featured = (subjects ?? []).slice(0, 8)
  const totalTutorials = (subjects ?? []).reduce((s, x) => s + (x.tutorialCount ?? 0), 0)
  const continueLearning = meData?.continueLearning ?? []

  return (
    <div className="flex-1">
      {/* Resume banner for returning users */}
      {continueLearning.length > 0 && (
        <ResumeBanner items={continueLearning} onNavigate={navigate} />
      )}
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-40 pointer-events-none" />
        <div className="absolute inset-0 bg-radial-glow pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background pointer-events-none" />
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 size-[600px] rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 pt-20 pb-16 sm:pt-28 sm:pb-24">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 rounded-full glass-pill px-3.5 py-1.5 text-xs font-medium text-muted-foreground mb-6">
              <Sparkles className="size-3.5 text-primary" />
              {totalTutorials}+ tutorials · {subjects?.length ?? 20} subjects · 100% free
            </div>
            <h1 className="text-4xl sm:text-6xl font-bold tracking-[-0.02em] leading-[1.05] mb-6 text-foreground/95">
              Master Computer Science,
              <br />
              <span className="text-gradient">the structured way.</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground/90 leading-relaxed mb-10 max-w-2xl mx-auto">
              From C and Python to Machine Learning, LLMs, and System Design. Learn with
              real tutorials, track your progress, earn XP, and build the skills that matter.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button size="lg" className="h-12 px-7 text-base shadow-glow-primary" onClick={() => navigate("browse")}>
                Start learning
                <ArrowRight className="ml-2 size-4" />
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-7 text-base" onClick={() => navigate("paths")}>
                <Compass className="mr-2 size-4" />
                Explore paths
              </Button>
            </div>
            <div className="mt-10 flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-primary" /> No credit card
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-primary" /> Self-hostable
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <CheckCircle2 className="size-4 text-primary" /> Open architecture
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="border-y border-border/60 bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <StatCard icon={BookOpen} label="Tutorials" value={`${totalTutorials}+`} color="oklch(0.62 0.15 162)" />
            <StatCard icon={Layers} label="Subjects" value={`${subjects?.length ?? 20}`} color="oklch(0.7 0.13 200)" />
            <StatCard icon={Compass} label="Learning paths" value={`${paths?.length ?? 5}`} color="oklch(0.68 0.2 305)" />
            <StatCard icon={Trophy} label="Achievements" value="16" color="oklch(0.75 0.16 85)" />
          </div>
        </div>
      </section>

      {/* FEATURED SUBJECTS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Explore subjects</h2>
            <p className="text-muted-foreground mt-1">Pick a topic and start learning today.</p>
          </div>
          <Button variant="ghost" onClick={() => navigate("browse")} className="hidden sm:flex">
            View all <ArrowRight className="ml-1.5 size-4" />
          </Button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {featured.map((s, i) => (
            <motion.button
              key={s.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
              onClick={() => navigate("subject", { subjectSlug: s.slug })}
              className="group text-left"
            >
              <Card className="h-full hover:border-primary/40 hover:shadow-md transition-all overflow-hidden card-lift">
                <CardHeader className="pb-3">
                  <SubjectIcon name={s.icon} color={s.color} className="size-11 rounded-xl" />
                  <CardTitle className="text-base mt-3 group-hover:text-primary transition-colors">
                    {s.name}
                  </CardTitle>
                  <CardDescription className="line-clamp-2 text-xs">
                    {s.tagline}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{s.tutorialCount ?? 0} tutorials</span>
                    <ArrowRight className="size-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </CardContent>
              </Card>
            </motion.button>
          ))}
        </div>
      </section>

      {/* LEARNING PATHS */}
      <section className="border-t border-border/60 bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-20">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Curated learning paths</h2>
            <p className="text-muted-foreground mt-2">
              Structured journeys that take you from where you are to where you want to be.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {(paths ?? []).slice(0, 3).map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <Card className="h-full hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate("paths")}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <SubjectIcon name={p.icon} color={p.color} className="size-11 rounded-xl" />
                      <DifficultyBadge difficulty={p.difficulty} />
                    </div>
                    <CardTitle className="text-lg mt-3">{p.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{p.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Compass className="size-3.5" /> {p.steps?.length ?? 0} steps
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Target className="size-3.5" /> {p.estimatedHours}h
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* GAMIFICATION + LEADERBOARD */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-20">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Why it works */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
              Learning that sticks.
            </h2>
            <p className="text-muted-foreground mb-6">
              Built-in gamification rewards real progress, not mindless scrolling.
            </p>
            <div className="space-y-4">
              <Feature
                icon={Flame}
                title="Daily streaks"
                desc="Build a habit. Come back every day to keep your streak alive."
                color="oklch(0.68 0.2 30)"
              />
              <Feature
                icon={Zap}
                title="XP & levels"
                desc="Earn XP for reading and completing tutorials. Level up as you learn."
                color="oklch(0.75 0.16 85)"
              />
              <Feature
                icon={Trophy}
                title="Achievements"
                desc="Unlock badges for milestones — first tutorial, streaks, quizzes, and more."
                color="oklch(0.7 0.13 200)"
              />
              <Feature
                icon={TrendingUp}
                title="Real progress tracking"
                desc="Pick up exactly where you left off. See how far you've come."
                color="oklch(0.62 0.15 162)"
              />
            </div>
          </div>

          {/* Weekly leaderboard preview */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="size-5 text-primary" /> Weekly leaderboard
                  </CardTitle>
                  <CardDescription>Top learners this week</CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => navigate("leaderboard")}>
                  All <ArrowRight className="ml-1 size-3.5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {(lb?.entries ?? []).length === 0 ? (
                <div className="text-center py-10 text-sm text-muted-foreground">
                  <Trophy className="size-8 mx-auto mb-2 opacity-40" />
                  Be the first on the leaderboard!
                </div>
              ) : (
                <ul className="space-y-2">
                  {(lb?.entries ?? []).slice(0, 5).map((e: any) => (
                    <li
                      key={e.id}
                      className="flex items-center gap-3 rounded-lg border border-border/60 px-3 py-2.5"
                    >
                      <span
                        className={`size-7 rounded-full flex items-center justify-center text-xs font-bold ${
                          e.rank === 1
                            ? "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400"
                            : e.rank === 2
                            ? "bg-slate-400/20 text-slate-500 dark:text-slate-300"
                            : e.rank === 3
                            ? "bg-orange-500/20 text-orange-600 dark:text-orange-400"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {e.rank}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{e.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {e.totalXP.toLocaleString()} XP · {e.currentStreak}d streak
                        </div>
                      </div>
                      <LevelBadge level={e.level} />
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border/60 bg-muted/20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-16 sm:py-24 text-center">
          <div className="inline-flex size-14 rounded-2xl bg-primary text-primary-foreground items-center justify-center mb-6">
            <Rocket className="size-7" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Ready to start your journey?
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
            Join CodeMastery today. Track your progress, earn achievements, and become a better engineer — one tutorial at a time.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button size="lg" className="h-12 px-7 text-base shadow-glow-primary" onClick={() => openAuth("register")}>
              Create free account <ArrowRight className="ml-2 size-4" />
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-6 text-base" onClick={() => navigate("browse")}>
              Browse tutorials
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

function StatCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: string; color: string }) {
  return (
    <div className="flex items-center gap-3">
      <span
        className="size-10 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: `color-mix(in oklch, ${color} 16%, transparent)`, color }}
      >
        <Icon className="size-5" />
      </span>
      <div>
        <div className="text-2xl font-bold leading-none">{value}</div>
        <div className="text-xs text-muted-foreground mt-1">{label}</div>
      </div>
    </div>
  )
}

function Feature({ icon: Icon, title, desc, color }: { icon: any; title: string; desc: string; color: string }) {
  return (
    <div className="flex items-start gap-4">
      <span
        className="size-10 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: `color-mix(in oklch, ${color} 16%, transparent)`, color }}
      >
        <Icon className="size-5" />
      </span>
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground mt-0.5">{desc}</p>
      </div>
    </div>
  )
}

function ResumeBanner({ items, onNavigate }: { items: any[]; onNavigate: (view: ViewName, params?: any) => void }) {
  const [dismissed, setDismissed] = React.useState(false)
  if (dismissed || items.length === 0) return null

  const top = items[0]
  return (
    <div className="border-b border-border/60 bg-gradient-to-r from-primary/5 via-primary/3 to-transparent">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3">
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex size-9 rounded-lg bg-primary/10 text-primary items-center justify-center shrink-0">
            <BookOpen className="size-5" />
          </div>
          <div className="flex-1 min-w-0 flex items-center gap-3">
            <div className="min-w-0">
              <div className="text-xs text-muted-foreground">Continue where you left off</div>
              <div className="font-medium text-sm truncate">{top.tutorial.title}</div>
            </div>
            <div className="hidden sm:flex items-center gap-2 shrink-0">
              <div className="w-24 h-1.5 rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-primary" style={{ width: `${top.percentRead}%` }} />
              </div>
              <span className="text-xs text-muted-foreground">{top.percentRead}%</span>
            </div>
          </div>
          <Button
            size="sm"
            className="shadow-glow-primary"
            onClick={() =>
              onNavigate("tutorial", {
                subjectSlug: top.tutorial.subject.slug,
                tutorialSlug: top.tutorial.slug,
              })
            }
          >
            Resume <ArrowRight className="ml-1.5 size-3.5" />
          </Button>
          <button
            onClick={() => setDismissed(true)}
            className="text-muted-foreground hover:text-foreground transition-colors p-1"
            aria-label="Dismiss"
          >
            <X className="size-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
