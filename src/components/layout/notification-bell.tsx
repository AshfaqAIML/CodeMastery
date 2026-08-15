"use client"

import * as React from "react"
import { Bell, Trophy, ClipboardCheck, BookOpen, Flame, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useNotifications } from "@/hooks/use-api"
import { useSession } from "next-auth/react"
import { cn } from "@/lib/utils"
import { SubjectIcon } from "@/components/shared/subject-icon"

const ICON_MAP: Record<string, any> = {
  Trophy, ClipboardCheck, BookOpen, Flame, Bell,
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

export function NotificationBell() {
  const { data: session } = useSession()
  const { data } = useNotifications()
  const [seen, setSeen] = React.useState(false)
  const [opened, setOpened] = React.useState(false)

  const notifications = data?.notifications ?? []
  const unreadCount = data?.unreadCount ?? 0
  const showBadge = unreadCount > 0 && !seen

  React.useEffect(() => {
    if (opened && !seen) setSeen(true)
  }, [opened, seen])

  if (!session) return null

  return (
    <DropdownMenu open={opened} onOpenChange={setOpened}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-11 w-11 sm:h-9 sm:w-9"
          aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
        >
          <Bell className="size-5" />
          {showBadge && (
            <span className="absolute -top-0.5 -right-0.5 size-4 rounded-full bg-primary text-primary-foreground text-[9px] font-bold flex items-center justify-center animate-fade-in-up">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        <DropdownMenuLabel className="flex items-center justify-between px-4 py-3 border-b border-border/60">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <span className="text-xs text-muted-foreground">{unreadCount} new</span>
          )}
        </DropdownMenuLabel>
        <div className="max-h-96 overflow-y-auto scrollbar-thin">
          {notifications.length === 0 ? (
            <div className="py-8 text-center">
              <Bell className="size-8 mx-auto text-muted-foreground/40 mb-2" />
              <p className="text-sm text-muted-foreground">No notifications yet</p>
              <p className="text-xs text-muted-foreground mt-1">
                Complete tutorials to earn XP and unlock achievements!
              </p>
            </div>
          ) : (
            notifications.map((n: any) => {
              const Icon = ICON_MAP[n.icon] ?? Bell
              return (
                <DropdownMenuItem
                  key={n.id}
                  className="flex items-start gap-3 px-4 py-3 cursor-default focus:bg-muted/40"
                >
                  <span
                    className="size-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{
                      background: `color-mix(in oklch, ${n.color} 14%, transparent)`,
                      color: n.color,
                    }}
                  >
                    <Icon className="size-4" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{n.title}</div>
                    <div className="text-xs text-muted-foreground truncate">{n.description}</div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-muted-foreground">{timeAgo(n.createdAt)}</span>
                      {n.xpDelta > 0 && (
                        <span className="text-[10px] text-primary font-medium">+{n.xpDelta} XP</span>
                      )}
                    </div>
                  </div>
                </DropdownMenuItem>
              )
            })
          )}
        </div>
        <DropdownMenuSeparator className="m-0" />
        <DropdownMenuItem
          className="justify-center text-sm text-primary focus:text-primary cursor-pointer"
          onClick={() => {
            // Navigate to achievements via the store
            window.dispatchEvent(new CustomEvent("navigate", { detail: { view: "achievements" } }))
          }}
        >
          View all achievements
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
