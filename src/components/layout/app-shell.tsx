"use client"

import * as React from "react"
import { AnimatePresence, motion } from "framer-motion"
import { useAppStore } from "@/lib/store"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { AuthModal } from "@/components/auth/auth-modal"
import { OnboardingModal } from "@/components/auth/onboarding-modal"
import { SearchPalette } from "@/components/search/search-palette"
import { ScrollToTop } from "@/components/shared/scroll-to-top"
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
import { useMe } from "@/hooks/use-api"

export function AppShell() {
  const { view, navigate } = useAppStore()
  const { status } = useSession()
  const { data: meData } = useMe()
  const [onboardingOpen, setOnboardingOpen] = React.useState(false)
  const [onboardingDismissed, setOnboardingDismissed] = React.useState(false)

  // Redirect protected views to home if not authed
  React.useEffect(() => {
    if (status === "unauthenticated" && (view === "dashboard" || view === "profile" || view === "admin")) {
      navigate("home")
    }
  }, [status, view, navigate])

  // Trigger onboarding for authenticated users who haven't completed it
  React.useEffect(() => {
    if (status === "authenticated" && meData?.user && !meData.user.onboarded && !onboardingDismissed) {
      const t = setTimeout(() => setOnboardingOpen(true), 800)
      return () => clearTimeout(t)
    }
  }, [status, meData, onboardingDismissed])

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={view + (JSON.stringify(useAppStore.getState().params) || "")}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="flex-1 flex flex-col"
          >
            {renderView(view)}
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
      <AuthModal />
      <SearchPalette />
      <ScrollToTop />
      <OnboardingModal
        open={onboardingOpen}
        onComplete={() => {
          setOnboardingOpen(false)
          setOnboardingDismissed(true)
        }}
      />
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
