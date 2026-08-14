"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useSession } from "next-auth/react"

// ---------- Auth-aware fetch ----------
export async function apiFetch<T = unknown>(
  input: string,
  init?: RequestInit
): Promise<T> {
  const res = await fetch(input, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  })
  const data = await res.json().catch(() => ({ ok: false, error: "Invalid response" }))
  if (!res.ok || data?.ok === false) {
    throw new Error(data?.error ?? `Request failed (${res.status})`)
  }
  return data.data as T
}

// ---------- Subjects ----------
export function useSubjects(opts?: { withCounts?: boolean; withProgress?: boolean }) {
  const withCounts = opts?.withCounts
  const withProgress = opts?.withProgress
  const params = new URLSearchParams()
  if (withCounts) params.set("withCounts", "true")
  if (withProgress) params.set("withProgress", "true")
  const qs = params.toString()
  return useQuery({
    queryKey: ["subjects", withCounts, withProgress],
    queryFn: () => apiFetch<any[]>(`/api/subjects${qs ? `?${qs}` : ""}`),
  })
}

export function useSubject(slug: string | undefined) {
  return useQuery({
    queryKey: ["subject", slug],
    queryFn: () => apiFetch<any>(`/api/subjects/${slug}`),
    enabled: !!slug,
  })
}

// ---------- Tutorials ----------
export function useTutorial(subjectSlug: string | undefined, tutorialSlug: string | undefined) {
  return useQuery({
    queryKey: ["tutorial", subjectSlug, tutorialSlug],
    queryFn: () =>
      apiFetch<any>(`/api/tutorials/${subjectSlug}/${tutorialSlug}`),
    enabled: !!subjectSlug && !!tutorialSlug,
  })
}

export function useRelatedTutorials(subjectSlug: string | undefined, tutorialSlug: string | undefined) {
  return useQuery({
    queryKey: ["related", subjectSlug, tutorialSlug],
    queryFn: () => apiFetch<any[]>(`/api/tutorials/${subjectSlug}/${tutorialSlug}/related`),
    enabled: !!subjectSlug && !!tutorialSlug,
  })
}

// ---------- Progress ----------
export function useUpdateProgress() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: any) =>
      apiFetch(`/api/progress`, { method: "POST", body: JSON.stringify(body) }),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["tutorial"] })
      qc.invalidateQueries({ queryKey: ["me"] })
      qc.invalidateQueries({ queryKey: ["leaderboard"] })
      qc.invalidateQueries({ queryKey: ["achievements"] })
    },
  })
}

// ---------- Bookmarks ----------
export function useBookmarks() {
  return useQuery({
    queryKey: ["bookmarks"],
    queryFn: () => apiFetch<any[]>(`/api/bookmarks`),
  })
}
export function useToggleBookmark() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (tutorialId: string) =>
      apiFetch(`/api/bookmarks`, {
        method: "POST",
        body: JSON.stringify({ tutorialId }),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["bookmarks"] })
      qc.invalidateQueries({ queryKey: ["tutorial"] })
    },
  })
}

// ---------- Notes ----------
export function useNotes(tutorialId?: string) {
  return useQuery({
    queryKey: ["notes", tutorialId],
    queryFn: () =>
      apiFetch<any[]>(`/api/notes${tutorialId ? `?tutorialId=${tutorialId}` : ""}`),
  })
}
export function useCreateNote() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: any) =>
      apiFetch(`/api/notes`, { method: "POST", body: JSON.stringify(body) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notes"] }),
  })
}
export function useUpdateNote() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: any) =>
      apiFetch(`/api/notes`, { method: "PUT", body: JSON.stringify(body) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notes"] }),
  })
}
export function useDeleteNote() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => apiFetch(`/api/notes?id=${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notes"] }),
  })
}

// ---------- Search ----------
export function useSearch(query: string, page = 1) {
  return useQuery({
    queryKey: ["search", query, page],
    queryFn: () =>
      apiFetch<any>(`/api/search?q=${encodeURIComponent(query)}&page=${page}`),
    enabled: query.trim().length > 0,
  })
}

// ---------- Leaderboard ----------
export function useLeaderboard(period: "all" | "weekly" = "all") {
  return useQuery({
    queryKey: ["leaderboard", period],
    queryFn: () => apiFetch<any>(`/api/leaderboard?period=${period}`),
  })
}

// ---------- Daily Challenge ----------
export function useDailyChallenge() {
  return useQuery({
    queryKey: ["daily-challenge"],
    queryFn: () => apiFetch<any>(`/api/daily-challenge`),
  })
}

// ---------- Streak Heatmap ----------
export function useStreakHeatmap() {
  return useQuery({
    queryKey: ["streak-heatmap"],
    queryFn: () => apiFetch<any>(`/api/streak-heatmap`),
  })
}

// ---------- XP History ----------
export function useXpHistory() {
  return useQuery({
    queryKey: ["xp-history"],
    queryFn: () => apiFetch<any>(`/api/xp-history`),
  })
}

// ---------- Tutorial Ratings ----------
export function useRating(tutorialId: string | undefined) {
  return useQuery({
    queryKey: ["rating", tutorialId],
    queryFn: () => apiFetch<any>(`/api/ratings?tutorialId=${tutorialId}`),
    enabled: !!tutorialId,
  })
}
export function useRateTutorial() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ tutorialId, value }: { tutorialId: string; value: 1 | -1 | 0 }) =>
      apiFetch<any>(`/api/ratings`, {
        method: "POST",
        body: JSON.stringify({ tutorialId, value }),
      }),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["rating", vars.tutorialId] })
    },
  })
}

// ---------- Achievements ----------
export function useAchievements() {
  return useQuery({
    queryKey: ["achievements"],
    queryFn: () => apiFetch<any>(`/api/achievements`),
  })
}

// ---------- Me ----------
export function useMe() {
  const { status } = useSession()
  return useQuery({
    queryKey: ["me"],
    queryFn: () => apiFetch<any>(`/api/me`),
    enabled: status === "authenticated",
  })
}

// ---------- Onboarding ----------
export function useOnboard() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: any) =>
      apiFetch(`/api/onboarding`, { method: "POST", body: JSON.stringify(body) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["me"] }),
  })
}

// ---------- Paths ----------
export function usePaths() {
  return useQuery({
    queryKey: ["paths"],
    queryFn: () => apiFetch<any[]>(`/api/paths`),
  })
}
export function usePath(slug: string | undefined) {
  return useQuery({
    queryKey: ["path", slug],
    queryFn: () => apiFetch<any>(`/api/paths/${slug}`),
    enabled: !!slug,
  })
}

// ---------- Quiz ----------
export function useQuiz(id: string | undefined) {
  return useQuery({
    queryKey: ["quiz", id],
    queryFn: () => apiFetch<any>(`/api/quizzes/${id}`),
    enabled: !!id,
  })
}
export function useSubmitQuiz() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, answers }: { id: string; answers: any[] }) =>
      apiFetch<any>(`/api/quizzes/${id}/attempt`, {
        method: "POST",
        body: JSON.stringify({ answers }),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["me"] })
      qc.invalidateQueries({ queryKey: ["achievements"] })
      qc.invalidateQueries({ queryKey: ["leaderboard"] })
    },
  })
}

// ---------- AI Study Buddy (optional, requires AI_ENABLED) ----------
export function useStudyBuddy() {
  return useMutation({
    mutationFn: ({ tutorialId, question }: { tutorialId: string; question: string }) =>
      apiFetch<any>(`/api/ai/study-buddy`, {
        method: "POST",
        body: JSON.stringify({ tutorialId, question }),
      }),
  })
}

// ---------- AI feature availability ----------
export function useAICheck() {
  return useQuery({
    queryKey: ["ai-status"],
    queryFn: () => apiFetch<{ enabled: boolean; provider: string | null }>(`/api/ai/status`),
    staleTime: 5 * 60 * 1000,
  })
}
