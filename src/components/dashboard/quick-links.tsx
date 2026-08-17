"use client"

import { Bookmark, StickyNote, Trophy, Sparkles, Award } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { QuickLink } from "@/components/dashboard/quick-link"
import { useAppStore } from "@/lib/store"

export function QuickLinks({ bookmarksCount, notesCount }: { bookmarksCount: number; notesCount: number }) {
  const { navigate } = useAppStore()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Quick links</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        <QuickLink icon={Bookmark} label="My bookmarks" value={bookmarksCount} onClick={() => navigate("profile", { tab: "bookmarks" })} />
        <QuickLink icon={StickyNote} label="My notes" value={notesCount} onClick={() => navigate("profile", { tab: "notes" })} />
        <QuickLink icon={Trophy} label="Achievements" onClick={() => navigate("achievements")} />
        <QuickLink icon={Award} label="My certificates" onClick={() => navigate("certificates")} />
        <QuickLink icon={Sparkles} label="Leaderboard" onClick={() => navigate("leaderboard")} />
      </CardContent>
    </Card>
  )
}
