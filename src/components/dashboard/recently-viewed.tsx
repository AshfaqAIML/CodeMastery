"use client"

import { Clock, CheckCircle2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SubjectIcon } from "@/components/shared/subject-icon"
import { useAppStore } from "@/lib/store"

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

export function RecentlyViewed({ items }: { items: any[] }) {
  const { navigate } = useAppStore()

  if (items.length === 0) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Clock className="size-5 text-primary" /> Recently viewed
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {items.slice(0, 4).map((p: any) => (
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
  )
}
