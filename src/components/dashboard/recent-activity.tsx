"use client"

import { TrendingUp, Zap, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const ACTIVITY_LABELS: Record<string, string> = {
  tutorial_completed: "Completed a tutorial",
  tutorial_read: "Read a tutorial",
  quiz_passed: "Passed a quiz",
  bookmark_added: "Bookmarked a tutorial",
  note_created: "Created a note",
  achievement_earned: "Unlocked an achievement",
  account_created: "Joined CodeMastery",
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

export function RecentActivity({ items }: { items: any[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <TrendingUp className="size-5 text-primary" /> Recent activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground py-6 text-center">
            No activity yet. Start reading to build your history.
          </p>
        ) : (
          <ul className="space-y-3">
            {items.map((a: any) => (
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
  )
}
