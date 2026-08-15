import { db } from "@/lib/db"
import { ok } from "@/lib/api"
import { getCurrentUser } from "@/lib/session"

/**
 * Daily Challenge endpoint.
 *
 * Returns a deterministic "tutorial of the day" based on the current date.
 * The selection is seeded by the date so all users see the same challenge
 * on a given day, and rotates daily. XP bonus for completing the daily
 * challenge is tracked separately (first completion per day).
 *
 * This is portable — no external scheduler required. The "daily" logic is
 * derived from the current date at request time.
 */

// Deterministic pseudo-random based on a string seed
function seededRandom(seed: string): number {
  let h = 2166136261
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return ((h >>> 0) % 10000) / 10000
}

function todaySeed(): string {
  return new Date().toISOString().slice(0, 10) // YYYY-MM-DD
}

export async function GET() {
  const user = await getCurrentUser()
  const seed = todaySeed()
  const today = new Date(seed + "T00:00:00:00Z")

  // Get all published tutorials
  const allTutorials = await db.tutorial.findMany({
    where: { published: true },
    select: {
      id: true, slug: true, title: true, summary: true,
      difficulty: true, estimatedMinutes: true, tags: true,
      subject: { select: { slug: true, name: true, color: true, icon: true } },
    },
  })

  if (allTutorials.length === 0) {
    return ok({ tutorial: null, completed: false, xpBonus: 0 })
  }

  // Deterministic pick based on date seed
  const rand = seededRandom(seed)
  const index = Math.floor(rand * allTutorials.length)
  const challenge = allTutorials[index]

  // Check if the current user has already completed this tutorial today
  let completedToday = false
  let alreadyCompleted = false
  if (user) {
    const progress = await db.tutorialProgress.findUnique({
      where: { userId_tutorialId: { userId: user.id, tutorialId: challenge.id } },
      select: { completed: true, completedAt: true },
    })
    alreadyCompleted = progress?.completed ?? false
    if (progress?.completedAt) {
      const completedDate = progress.completedAt.toISOString().slice(0, 10)
      completedToday = completedDate === seed
    }
  }

  // XP bonus for completing the daily challenge (first time today)
  const xpBonus = 25

  return ok({
    tutorial: challenge,
    completedToday,
    alreadyCompleted,
    xpBonus,
    date: seed,
  })
}
