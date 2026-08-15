"use client"

import { CalendarHeart, Zap, CheckCircle2, ArrowRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SubjectIcon } from "@/components/shared/subject-icon"
import { useAppStore } from "@/lib/store"
import { useDailyChallenge } from "@/hooks/use-api"

export function DailyChallengeWidget() {
  const { navigate } = useAppStore()
  const { data, isLoading } = useDailyChallenge()

  if (isLoading) {
    return (
      <Card className="overflow-hidden">
        <div className="h-28 skeleton-shimmer" />
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
