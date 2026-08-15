// Gamification helpers — level curve, XP thresholds, streak logic.
// Designed so progression feels meaningful but not grindy.

export const DAILY_XP_CAP = 500 // max XP earnable per day from reading/quizzes (achievements excluded)

// Level -> cumulative XP required. Quadratic-ish curve.
export function xpForLevel(level: number): number {
  if (level <= 1) return 0
  return Math.round(100 * (level - 1) + 50 * (level - 1) * (level - 2))
}

export function levelFromXP(totalXP: number): { level: number; into: number; needed: number; progress: number } {
  let level = 1
  while (xpForLevel(level + 1) <= totalXP) level++
  const base = xpForLevel(level)
  const next = xpForLevel(level + 1)
  const into = totalXP - base
  const needed = next - base
  return { level, into, needed, progress: needed > 0 ? into / needed : 0 }
}

export function todayStr(): string {
  return new Date().toISOString().slice(0, 10)
}

export function daysBetween(a: string, b: string): number {
  const da = new Date(a + "T00:00:00Z").getTime()
  const db = new Date(b + "T00:00:00Z").getTime()
  return Math.round((db - da) / 86400000)
}

// Update streak given today's activity. Returns new streak + whether it incremented.
export function computeStreak(current: number, lastActivityDate: string | null, today: string): { streak: number; incremented: boolean; isDailyCapReset: boolean } {
  if (!lastActivityDate) {
    return { streak: 1, incremented: true, isDailyCapReset: true }
  }
  const diff = daysBetween(lastActivityDate, today)
  if (diff === 0) return { streak: Math.max(current, 1), incremented: false, isDailyCapReset: false }
  if (diff === 1) return { streak: current + 1, incremented: true, isDailyCapReset: true }
  return { streak: 1, incremented: true, isDailyCapReset: true }
}

export const DIFFICULTY_META: Record<string, { label: string; color: string }> = {
  beginner: { label: "Beginner", color: "oklch(0.7 0.16 162)" },
  intermediate: { label: "Intermediate", color: "oklch(0.75 0.16 85)" },
  advanced: { label: "Advanced", color: "oklch(0.68 0.2 30)" },
}
