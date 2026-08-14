"use client"

import * as React from "react"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import {
  GraduationCap, Search, Sun, Moon, Menu, X, LayoutDashboard, Trophy,
  User as UserIcon, LogOut, Bookmark, Flame, Compass, Route, Award, ChevronDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { NotificationBell } from "@/components/layout/notification-bell"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useTheme } from "next-themes"
import { useAppStore, type ViewName } from "@/lib/store"
import { LevelBadge } from "@/components/shared/level-badge"
import { useMe } from "@/hooks/use-api"
import { toast } from "sonner"

const NAV_ITEMS: { view: ViewName; label: string; icon: any }[] = [
  { view: "browse", label: "Browse", icon: Compass },
  { view: "paths", label: "Paths", icon: Route },
  { view: "leaderboard", label: "Leaderboard", icon: Trophy },
  { view: "achievements", label: "Achievements", icon: Award },
]

export function Header() {
  const { data: session, status } = useSession()
  const { theme, setTheme } = useTheme()
  const { navigate, openAuth, view: curView, setSearchOpen } = useAppStore()
  const [mounted, setMounted] = React.useState(false)
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const { data: meData } = useMe()

  React.useEffect(() => setMounted(true), [])

  const userName = session?.user?.name ?? ""
  const initials = userName
    ? userName.split(" ").map((s) => s[0]).slice(0, 2).join("").toUpperCase()
    : "?"

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
        {/* Logo */}
        <button
          onClick={() => navigate("home")}
          className="flex items-center gap-2 shrink-0 group"
        >
          <span className="size-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-sm transition-transform group-hover:scale-105">
            <GraduationCap className="size-5" />
          </span>
          <span className="hidden sm:block font-bold text-lg tracking-tight">
            Code<span className="text-primary">Mastery</span>
          </span>
        </button>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1 ml-2">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.view}
              onClick={() => navigate(item.view)}
              data-active={curView === item.view}
              className={`nav-link-underline px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                curView === item.view
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Search */}
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => setSearchOpen(true)}
            className="search-focus-ring hidden sm:flex items-center gap-2 h-9 w-44 lg:w-64 rounded-md border border-input bg-muted/40 px-3 text-sm text-muted-foreground hover:bg-muted transition-colors"
          >
            <Search className="size-4" />
            <span className="truncate">Search tutorials...</span>
            <kbd className="ml-auto rounded border bg-background px-1.5 text-[10px] font-mono">⌘K</kbd>
          </button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSearchOpen(true)}
            className="sm:hidden"
            aria-label="Search"
          >
            <Search className="size-5" />
          </Button>

          {/* Notification bell */}
          <NotificationBell />

          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            {mounted && theme === "dark" ? (
              <Sun className="size-5" />
            ) : (
              <Moon className="size-5" />
            )}
          </Button>

          {status === "authenticated" && session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-full border border-border/60 pl-1 pr-2 py-1 hover:bg-muted/60 transition-colors">
                  <Avatar className="size-7">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  {meData && (
                    <LevelBadge level={meData.stats.level} className="hidden sm:flex size-6 text-[10px]" />
                  )}
                  <ChevronDown className="size-3.5 text-muted-foreground hidden sm:block" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium truncate">{userName}</span>
                    <span className="text-xs text-muted-foreground truncate">{session.user.email}</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("dashboard")}>
                  <LayoutDashboard className="mr-2 size-4" /> Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("profile")}>
                  <UserIcon className="mr-2 size-4" /> Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("profile", { tab: "bookmarks" })}>
                  <Bookmark className="mr-2 size-4" /> Bookmarks
                </DropdownMenuItem>
                {session.user.role === "ADMIN" && (
                  <DropdownMenuItem onClick={() => navigate("admin")}>
                    <Trophy className="mr-2 size-4" /> Admin
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-destructive focus:text-destructive"
                >
                  <LogOut className="mr-2 size-4" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => openAuth("login")}>
                Sign in
              </Button>
              <Button size="sm" onClick={() => openAuth("register")}>
                Get started
              </Button>
            </div>
          )}

          {/* Mobile menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Menu">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <GraduationCap className="size-5 text-primary" /> CodeMastery
                </SheetTitle>
              </SheetHeader>
              <div className="mt-4 flex flex-col gap-1">
                {NAV_ITEMS.map((item) => (
                  <button
                    key={item.view}
                    onClick={() => {
                      navigate(item.view)
                      setMobileOpen(false)
                    }}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                      curView === item.view
                        ? "bg-secondary text-secondary-foreground"
                        : "hover:bg-muted"
                    }`}
                  >
                    <item.icon className="size-4" />
                    {item.label}
                  </button>
                ))}
                {status === "authenticated" && (
                  <button
                    onClick={() => {
                      navigate("dashboard")
                      setMobileOpen(false)
                    }}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium hover:bg-muted"
                  >
                    <LayoutDashboard className="size-4" /> Dashboard
                  </button>
                )}
                <div className="h-px bg-border my-2" />
                {status !== "authenticated" && (
                  <div className="flex flex-col gap-2 px-3">
                    <Button onClick={() => { openAuth("login"); setMobileOpen(false) }}>Sign in</Button>
                    <Button variant="outline" onClick={() => { openAuth("register"); setMobileOpen(false) }}>
                      Create account
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
