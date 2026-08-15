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
import { ErrorBoundary } from "@/components/shared/error-boundary"
import dynamic from "next/dynamic"
import { useSession } from "next-auth/react"
import { useMe } from "@/hooks/use-api"

// Lazy-load views to reduce initial JS bundle
const HomeView = dynamic(() => import("@/components/views/home-view").then(m => ({ default: m.HomeView })), { ssr: true })
const BrowseView = dynamic(() => import("@/components/views/browse-view").then(m => ({ default: m.BrowseView })), { ssr: false })
const SubjectView = dynamic(() => import("@/components/views/subject-view").then(m => ({ default: m.SubjectView })), { ssr: false })
const TutorialView = dynamic(() => import("@/components/views/tutorial-view").then(m => ({ default: m.TutorialView })), { ssr: false })
const DashboardView = dynamic(() => import("@/components/views/dashboard-view").then(m => ({ default: m.DashboardView })), { ssr: false })
const LeaderboardView = dynamic(() => import("@/components/views/leaderboard-view").then(m => ({ default: m.LeaderboardView })), { ssr: false })
const AchievementsView = dynamic(() => import("@/components/views/achievements-view").then(m => ({ default: m.AchievementsView })), { ssr: false })
const ProfileView = dynamic(() => import("@/components/views/profile-view").then(m => ({ default: m.ProfileView })), { ssr: false })
const PathsView = dynamic(() => import("@/components/views/paths-view").then(m => ({ default: m.PathsView })), { ssr: false })
const AdminView = dynamic(() => import("@/components/views/admin-view").then(m => ({ default: m.AdminView })), { ssr: false })

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
      {/* Skip to content link for screen readers and keyboard users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:shadow-lg"
      >
        Skip to content
      </a>
      <Header />
      <main id="main-content" className="flex-1 flex flex-col" tabIndex={-1}>
        <ErrorBoundary>
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
        </ErrorBoundary>
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
