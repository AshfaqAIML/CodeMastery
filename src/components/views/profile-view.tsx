"use client"

import * as React from "react"
import { useSession, signOut } from "next-auth/react"
import {
  User as UserIcon, Bookmark, StickyNote, LogOut, Pencil, Save, X, Flame, Zap,
  Trophy, BookOpen, Target, Loader2,
} from "lucide-react"
import { useAppStore } from "@/lib/store"
import { useMe, useBookmarks, useNotes, useDeleteNote, useOnboard } from "@/hooks/use-api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { LevelBadge, XPBar } from "@/components/shared/level-badge"
import { SubjectIcon } from "@/components/shared/subject-icon"
import { DifficultyBadge } from "@/components/shared/difficulty-badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { toast } from "sonner"

export function ProfileView() {
  const { params } = useAppStore()
  const { data: session } = useSession()
  const { data: meData, isLoading } = useMe()
  const { data: bookmarks } = useBookmarks()
  const { data: notes } = useNotes()
  const deleteNote = useDeleteNote()
  const onboard = useOnboard()
  const [editing, setEditing] = React.useState(false)
  const [name, setName] = React.useState("")
  const [bio, setBio] = React.useState("")
  const [experience, setExperience] = React.useState("beginner")
  const [goal, setGoal] = React.useState("career")

  const initialTab = params.tab ?? "overview"

  React.useEffect(() => {
    if (meData?.user) {
      setName(meData.user.name ?? "")
      setBio(meData.user.bio ?? "")
      setExperience(meData.user.experience ?? "beginner")
      setGoal(meData.user.goal ?? "career")
    }
  }, [meData])

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8">
        <div className="h-32 bg-muted/40 animate-pulse rounded-xl mb-6" />
        <div className="h-64 bg-muted/40 animate-pulse rounded-xl" />
      </div>
    )
  }

  if (!session || !meData) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <p className="text-muted-foreground">Sign in to view your profile.</p>
      </div>
    )
  }

  const { user, stats } = meData

  const onSaveProfile = async () => {
    try {
      await onboard.mutateAsync({ name, bio, experience, goal })
      setEditing(false)
      toast.success("Profile updated")
    } catch (e: any) {
      toast.error(e.message ?? "Failed to update profile")
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8">
      {/* Profile header */}
      <Card className="mb-6 overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent" />
        <CardContent className="pt-0 -mt-10">
          <div className="flex items-end gap-4">
            <div className="size-20 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold border-4 border-background">
              {(user.name ?? "?").split(" ").map((s: string) => s[0]).slice(0, 2).join("").toUpperCase()}
            </div>
            <div className="flex-1 pb-2">
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => setEditing((e) => !e)}>
              {editing ? <X className="mr-1.5 size-4" /> : <Pencil className="mr-1.5 size-4" />}
              {editing ? "Cancel" : "Edit"}
            </Button>
          </div>

          {editing ? (
            <div className="mt-6 space-y-4">
              <div>
                <Label className="text-xs">Name</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label className="text-xs">Bio</Label>
                <Textarea value={bio} onChange={(e) => setBio(e.target.value)} className="mt-1 min-h-20" placeholder="Tell us about your learning goals..." />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Experience level</Label>
                  <select
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="mt-1 w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
                <div>
                  <Label className="text-xs">Learning goal</Label>
                  <select
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    className="mt-1 w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                  >
                    <option value="career">Career growth</option>
                    <option value="interview">Interview prep</option>
                    <option value="academics">Academics</option>
                    <option value="curiosity">Curiosity</option>
                  </select>
                </div>
              </div>
              <Button onClick={onSaveProfile} disabled={onboard.isPending}>
                {onboard.isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
                <Save className="mr-2 size-4" /> Save changes
              </Button>
            </div>
          ) : (
            <div className="mt-4">
              {user.bio && <p className="text-sm text-muted-foreground mb-3">{user.bio}</p>}
              <div className="flex flex-wrap gap-2">
                {user.experience && (
                  <span className="inline-flex items-center gap-1 text-xs rounded-full bg-muted px-2.5 py-1">
                    <Target className="size-3" /> {user.experience}
                  </span>
                )}
                {user.goal && (
                  <span className="inline-flex items-center gap-1 text-xs rounded-full bg-muted px-2.5 py-1">
                    <Zap className="size-3" /> {user.goal}
                  </span>
                )}
                {user.onboarded && (
                  <span className="inline-flex items-center gap-1 text-xs rounded-full bg-primary/10 text-primary px-2.5 py-1">
                    Onboarded
                  </span>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <MiniStat icon={Zap} label="Total XP" value={stats.totalXP.toLocaleString()} color="oklch(0.75 0.16 85)" />
        <MiniStat icon={Flame} label="Streak" value={`${stats.currentStreak}d`} color="oklch(0.68 0.2 30)" />
        <MiniStat icon={BookOpen} label="Tutorials" value={stats.tutorialsCompleted} color="oklch(0.62 0.15 162)" />
        <MiniStat icon={Trophy} label="Quizzes" value={stats.quizzesPassed} color="oklch(0.7 0.13 200)" />
      </div>

      {/* Tabs */}
      <Tabs defaultValue={initialTab}>
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="bookmarks">
            Bookmarks {bookmarks && bookmarks.length > 0 && `(${bookmarks.length})`}
          </TabsTrigger>
          <TabsTrigger value="notes">
            Notes {notes && notes.length > 0 && `(${notes.length})`}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Level progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 mb-4">
                <LevelBadge level={stats.level} className="size-12 text-base" />
                <div>
                  <div className="text-xl font-bold">Level {stats.level}</div>
                  <div className="text-xs text-muted-foreground">{stats.totalXP.toLocaleString()} total XP</div>
                </div>
              </div>
              <XPBar totalXP={stats.totalXP} />
              <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center justify-between rounded-lg border border-border/60 p-3">
                  <span className="text-muted-foreground">Points</span>
                  <span className="font-semibold">{stats.points.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border/60 p-3">
                  <span className="text-muted-foreground">Longest streak</span>
                  <span className="font-semibold">{stats.longestStreak}d</span>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <Button variant="ghost" size="sm" onClick={() => signOut({ callbackUrl: "/" })} className="text-destructive hover:text-destructive">
                  <LogOut className="mr-2 size-4" /> Sign out
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bookmarks">
          <Card>
            <CardContent className="pt-6">
              {!bookmarks || bookmarks.length === 0 ? (
                <EmptyText icon={Bookmark} text="No bookmarks yet. Save tutorials to revisit them later." />
              ) : (
                <ul className="space-y-2">
                  {bookmarks.map((b: any) => (
                    <li key={b.id}>
                      <button
                        onClick={() => {
                          useAppStore.getState().navigate("tutorial", {
                            subjectSlug: b.tutorial.subject.slug,
                            tutorialSlug: b.tutorial.slug,
                          })
                        }}
                        className="w-full flex items-center gap-3 rounded-lg border border-border/60 hover:border-primary/40 hover:bg-muted/40 transition-all p-3 text-left group"
                      >
                        <SubjectIcon
                          name={b.tutorial.subject.icon}
                          color={b.tutorial.subject.color}
                          className="size-10 rounded-lg shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate group-hover:text-primary transition-colors">
                            {b.tutorial.title}
                          </div>
                          <div className="text-xs text-muted-foreground mt-0.5">{b.tutorial.subject.name}</div>
                        </div>
                        <DifficultyBadge difficulty={b.tutorial.difficulty} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes">
          <Card>
            <CardContent className="pt-6">
              {!notes || notes.length === 0 ? (
                <EmptyText icon={StickyNote} text="No notes yet. Add notes while reading tutorials to capture insights." />
              ) : (
                <ul className="space-y-3">
                  {notes.map((n: any) => (
                    <li key={n.id} className="group rounded-lg border border-border/60 p-3">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <button
                          onClick={() => {
                            useAppStore.getState().navigate("tutorial", {
                              subjectSlug: n.tutorial.subject.slug,
                              tutorialSlug: n.tutorial.slug,
                            })
                          }}
                          className="text-xs text-primary hover:underline"
                        >
                          {n.tutorial.title}
                        </button>
                        <button
                          onClick={() => deleteNote.mutateAsync(n.id).then(() => toast.success("Note deleted"))}
                          className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity"
                        >
                          <X className="size-3.5" />
                        </button>
                      </div>
                      <p className="text-sm whitespace-pre-wrap">{n.content}</p>
                      <p className="text-[10px] text-muted-foreground mt-2">
                        {new Date(n.updatedAt).toLocaleString()}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function MiniStat({ icon: Icon, label, value, color }: { icon: any; label: string; value: any; color: string }) {
  return (
    <Card>
      <CardContent className="pt-4 pb-4">
        <div className="flex items-center gap-2 mb-1">
          <span
            className="size-7 rounded-md flex items-center justify-center"
            style={{ background: `color-mix(in oklch, ${color} 16%, transparent)`, color }}
          >
            <Icon className="size-4" />
          </span>
        </div>
        <div className="text-xl font-bold">{value}</div>
        <div className="text-[11px] text-muted-foreground">{label}</div>
      </CardContent>
    </Card>
  )
}

function EmptyText({ icon: Icon, text }: { icon: any; text: string }) {
  return (
    <div className="text-center py-10">
      <Icon className="size-10 mx-auto text-muted-foreground/40 mb-3" />
      <p className="text-sm text-muted-foreground max-w-sm mx-auto">{text}</p>
    </div>
  )
}
