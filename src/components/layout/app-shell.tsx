"use client"

import * as React from "react"
import { useAppStore } from "@/lib/store"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { AuthModal } from "@/components/auth/auth-modal"
import { SearchPalette } from "@/components/search/search-palette"
import { HomeView } from "@/components/views/home-view"
import { BrowseView } from "@/components/views/browse-view"
import { SubjectView } from "@/components/views/subject-view"
import { TutorialView } from "@/components/views/tutorial-view"
import { DashboardView } from "@/components/views/dashboard-view"
import { LeaderboardView } from "@/components/views/leaderboard-view"
import { AchievementsView } from "@/components/views/achievements-view"
import { ProfileView } from "@/components/views/profile-view"
import { PathsView } from "@/components/views/paths-view"
import { AdminView } from "@/components/views/admin-view"
import { useSession } from "next-auth/react"

export function AppShell() {
  const { view, navigate } = useAppStore()
  const { status } = useSession()

  // Redirect protected views to home if not authed
  React.useEffect(() => {
    if (status === "unauthenticated" && (view === "dashboard" || view === "profile")) {
      navigate("home")
    }
  }, [status, view, navigate])

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 flex flex-col">{renderView(view)}</main>
      <Footer />
      <AuthModal />
      <SearchPalette />
    </div>
  )
}

function renderView(view: string) {
  switch (view) {
    case "home": return <HomeView />
    case "browse": return <BrowseView />
    case "subject": return <SubjectView />
    case "tutorial": return <TutorialView />
    case "dashboard": return <DashboardView />
    case "leaderboard": return <LeaderboardView />
    case "achievements": return <AchievementsView />
    case "profile": return <ProfileView />
    case "paths": return <PathsView />
    case "admin": return <AdminView />
    default: return <HomeView />
  }
}
