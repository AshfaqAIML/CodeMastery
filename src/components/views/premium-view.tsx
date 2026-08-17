"use client"

import * as React from "react"
import {
  Crown, Sparkles, Check, X as XIcon, BookOpen, Zap, Award,
  Brain, TrendingUp, ArrowRight, ShieldCheck, Infinity as InfinityIcon,
} from "lucide-react"
import { useAppStore } from "@/lib/store"
import { useMe } from "@/hooks/use-api"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

const PREMIUM_FEATURES = [
  { icon: Brain, title: "AI Tutor", desc: "Ask anything about any tutorial. Explain, simplify, quiz, and more — with full conversation memory." },
  { icon: BookOpen, title: "Premium content", desc: "Read every Premium-marked course and tutorial in the library." },
  { icon: Zap, title: "Everything free includes", desc: "Progress, streaks, XP, achievements, bookmarks, notes, recommendations — plus certificates for eligible courses." },
  { icon: Award, title: "Certificates", desc: "Generate certificates for every course you genuinely complete, with public QR verification." },
  { icon: TrendingUp, title: "Full learning analytics", desc: "XP history charts, streak heatmaps, and progress insights." },
  { icon: ShieldCheck, title: "Lifetime, one-time payment", desc: "No subscriptions, no recurring billing. Pay once, keep it forever." },
]

export function PremiumView() {
  const { status } = useSession()
  const { data: meData } = useMe()
  const { navigate, openAuth } = useAppStore()

  const access = meData?.access
  const isPremiumish =
    access?.effectiveAccess === "PREMIUM" ||
    access?.effectiveAccess === "PREMIUM_TRIAL"

  const priceUsd = "$49"

  return (
    <div className="flex-1">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-40 pointer-events-none" />
        <div className="absolute inset-0 bg-radial-glow pointer-events-none" />
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 size-[600px] rounded-full bg-yellow-500/10 blur-3xl pointer-events-none" />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 pt-20 pb-14 sm:pt-24 text-center">
          <div className="inline-flex items-center gap-2 rounded-full glass-pill px-3.5 py-1.5 text-xs font-medium text-muted-foreground mb-6">
            <Crown className="size-3.5 text-yellow-500" />
            One-time payment · Lifetime access · No subscription
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-[-0.02em] leading-[1.05] mb-4">
            Unlock <span className="text-gradient">everything</span> with
            <br />
            Lifetime Premium
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8">
            Your 12-day Premium trial gives you the full experience free.
            Love it? Unlock it forever — a single payment, no recurring billing.
          </p>

          {status === "loading" ? null : isPremiumish ? (
            <div className="flex flex-col items-center gap-3">
              <Badge className="px-4 py-2 text-sm gap-1.5">
                <Crown className="size-4" />
                {access?.label === "Premium Trial" ? "Premium Trial active" : "Premium Member"}
              </Badge>
              {access?.label === "Premium Trial" && access.trialDaysRemaining != null && (
                <p className="text-sm text-muted-foreground">
                  You're enjoying Premium free right now — {access.trialDaysRemaining} day{access.trialDaysRemaining === 1 ? "" : "s"} remaining in your trial.
                </p>
              )}
              <Button size="lg" className="h-12 px-7 text-base" onClick={() => navigate("dashboard")}>
                Go to dashboard <ArrowRight className="ml-2 size-4" />
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              {status === "unauthenticated" && (
                <p className="text-sm text-muted-foreground">
                  Create a free account and get a 12-day Premium trial — no credit card.
                </p>
              )}
              <Button
                size="lg"
                className="h-12 px-8 text-base shadow-glow-primary"
                onClick={() => {
                  if (status === "unauthenticated") {
                    openAuth("register")
                    toast.info("Create a free account to start your 12-day Premium trial.")
                  } else {
                    toast.info("Premium is granted on this deployment via the admin panel or a configured payment gateway.")
                    navigate("dashboard")
                  }
                }}
              >
                <Crown className="mr-2 size-4" /> Unlock lifetime Premium
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* PRICING */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
        <div className="grid lg:grid-cols-5 gap-6 items-start">
          <div className="lg:col-span-2">
            <Card className="relative overflow-hidden border-primary/30 shadow-glow-primary">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-500" />
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Crown className="size-5 text-yellow-500" /> Lifetime Premium
                </CardTitle>
                <CardDescription>One payment. Forever.</CardDescription>
                <div className="flex items-end gap-2 pt-2">
                  <span className="text-5xl font-bold tracking-tight">{priceUsd}</span>
                  <span className="text-muted-foreground text-sm pb-2">one-time</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <ul className="space-y-2.5 text-sm">
                  <PremiumCheck>12-day free trial first — cancel anytime</PremiumCheck>
                  <PremiumCheck>AI Tutor with daily fair-use limits</PremiumCheck>
                  <PremiumCheck>All Premium courses and tutorials</PremiumCheck>
                  <PremiumCheck>Certificates for completed courses</PremiumCheck>
                  <PremiumCheck>No subscription, no auto-renewal</PremiumCheck>
                  <PremiumCheck>Lifetime access on this account</PremiumCheck>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
            <div className="grid sm:grid-cols-2 gap-4">
              {PREMIUM_FEATURES.map((f) => (
                <Card key={f.title} className="card-lift">
                  <CardHeader className="pb-2">
                    <div className="size-9 rounded-lg bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 flex items-center justify-center mb-2">
                      <f.icon className="size-5" />
                    </div>
                    <CardTitle className="text-base flex items-center gap-2">
                      {f.title}
                      {f.title === "AI Tutor" && <Badge variant="secondary" className="text-[10px]">Premium</Badge>}
                      {f.title === "Premium content" && <Badge variant="secondary" className="text-[10px]">Premium</Badge>}
                    </CardTitle>
                    <CardDescription className="text-xs">{f.desc}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TRIAL / FREE COMPARISON */}
      <section className="border-t border-border/60 bg-muted/20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-14 text-center">
          <h2 className="text-2xl font-bold mb-8">What you get at each level</h2>
          <div className="grid sm:grid-cols-3 gap-4 text-left">
            <TierCard
              name="Guest"
              price="Free · no account"
              features={[
                ["Read public tutorials", true],
                ["Progress tracking", false],
                ["Streaks, XP, achievements", false],
                ["Notes, bookmarks, certificates", false],
                ["AI Tutor", false],
              ]}
            />
            <TierCard
              name="Free (Normal)"
              price="$0 forever"
              features={[
                ["Read public tutorials", true],
                ["Progress tracking", true],
                ["Streaks, XP, achievements", true],
                ["Notes, bookmarks, certificates", true],
                ["AI Tutor", false],
              ]}
              highlight
            />
            <TierCard
              name="Premium"
              price={`${priceUsd} once`}
              features={[
                ["Everything in Free", true],
                ["All Premium content", true],
                ["AI Tutor with limits", true],
                ["Premium certificates", true],
                ["12-day free trial first", true],
              ]}
            />
          </div>
          <div className="mt-10 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="size-4 text-primary" />
            Every new account starts with a free 12-day Premium trial — no credit card required.
          </div>
        </div>
      </section>
    </div>
  )
}

function PremiumCheck({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2">
      <Check className="size-4 mt-0.5 text-primary shrink-0" />
      <span>{children}</span>
    </li>
  )
}

function TierCard({ name, price, features, highlight }: {
  name: string
  price: string
  features: [string, boolean][]
  highlight?: boolean
}) {
  return (
    <Card className={highlight ? "border-primary/40 shadow-glow-primary" : ""}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{name}</CardTitle>
        <CardDescription>{price}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 text-sm">
          {features.map(([label, included]) => (
            <li key={label} className="flex items-center gap-2">
              {included ? (
                <Check className="size-4 text-primary shrink-0" />
              ) : (
                <XIcon className="size-4 text-muted-foreground/50 shrink-0" />
              )}
              <span className={included ? "" : "text-muted-foreground"}>{label}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
