import { db } from "@/lib/db"
import { ok, unauthorized } from "@/lib/api"
import { getCurrentUserWithStats } from "@/lib/session"
import { levelFromXP, todayStr } from "@/lib/gamification"

export async function GET() {
  const user = await getCurrentUserWithStats()
  if (!user) return unauthorized()

  const [
    tutorialsCompleted,
    quizzesPassed,
    notesCount,
    bookmarksCount,
    recentActivity,
    continueLearning,
    recentlyViewed,
    todayXP,
  ] = await Promise.all([
    db.tutorialProgress.count({ where: { userId: user.id, completed: true } }),
    db.quizAttempt.count({ where: { userId: user.id, passed: true } }),
    db.note.count({ where: { userId: user.id } }),
    db.bookmark.count({ where: { userId: user.id } }),
    db.activityLog.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
    db.tutorialProgress.findMany({
      where: { userId: user.id, completed: false, percentRead: { gt: 0 } },
      orderBy: { lastReadAt: "desc" },
      take: 5,
      include: {
        tutorial: {
          select: {
            id: true, slug: true, title: true, estimatedMinutes: true,
            subject: { select: { slug: true, name: true, color: true, icon: true } },
          },
        },
      },
    }),
    // Recently viewed (any progress, including completed, sorted by lastReadAt)
    db.tutorialProgress.findMany({
      where: { userId: user.id },
      orderBy: { lastReadAt: "desc" },
      take: 4,
      include: {
        tutorial: {
          select: {
            id: true, slug: true, title: true, summary: true, difficulty: true, estimatedMinutes: true,
            subject: { select: { slug: true, name: true, color: true, icon: true } },
          },
        },
      },
    }),
    user.dailyXPDate === todayStr() ? user.dailyXPEarned : 0,
  ])

  // ---- Recommendations ----
  // Strategy:
  //  1. If user has history → recommend tutorials from subjects they've engaged with,
  //     that they haven't completed yet.
  //  2. If no history but has interests → recommend tutorials from interested subjects.
  //  3. Otherwise → recommend beginner tutorials tailored by their stated experience.
  const completedTutorialIds = (
    await db.tutorialProgress.findMany({
      where: { userId: user.id },
      select: { tutorialId: true },
    })
  ).map((p) => p.tutorialId)

  // Parse the user's interests (comma-separated slugs)
  const interestSlugs = user.interests
    ? user.interests.split(",").filter(Boolean)
    : []

  let recommendations: any[] = []

  if (completedTutorialIds.length > 0) {
    // Find subjects the user has engaged with
    const engagedSubjects = await db.tutorialProgress.findMany({
      where: { userId: user.id },
      select: { tutorial: { select: { subjectId: true } } },
      distinct: ["tutorialId"],
    })
    const subjectIds = [...new Set(engagedSubjects.map((p) => p.tutorial.subjectId))]

    recommendations = await db.tutorial.findMany({
      where: {
        published: true,
        subjectId: { in: subjectIds },
        id: { notIn: completedTutorialIds },
      },
      orderBy: [{ difficulty: "asc" }, { order: "asc" }],
      take: 6,
      include: {
        subject: { select: { slug: true, name: true, color: true, icon: true } },
      },
    })
  }

  // If still not enough (new user), try interests first, then experience level
  if (recommendations.length < 4) {
    const existing = new Set([
      ...completedTutorialIds,
      ...recommendations.map((r) => r.id),
    ])

    // Try tutorials from the user's selected interests
    if (interestSlugs.length > 0) {
      const interestSubjects = await db.subject.findMany({
        where: { slug: { in: interestSlugs } },
        select: { id: true },
      })
      const interestSubjectIds = interestSubjects.map((s) => s.id)
      if (interestSubjectIds.length > 0) {
        const interestFillers = await db.tutorial.findMany({
          where: {
            published: true,
            subjectId: { in: interestSubjectIds },
            id: { notIn: [...existing] },
          },
          orderBy: [{ difficulty: "asc" }, { order: "asc" }],
          take: 6 - recommendations.length,
          include: {
            subject: { select: { slug: true, name: true, color: true, icon: true } },
          },
        })
        recommendations = [...recommendations, ...interestFillers]
      }
    }

    // Final fallback: recommend based on experience level
    if (recommendations.length < 4) {
      const difficultyMap: Record<string, string> = {
        beginner: "beginner",
        intermediate: "intermediate",
        advanced: "advanced",
      }
      const targetDifficulty = difficultyMap[user.experience ?? "beginner"]
      const updatedExisting = new Set([
        ...completedTutorialIds,
        ...recommendations.map((r) => r.id),
      ])
      const fillers = await db.tutorial.findMany({
        where: {
          published: true,
          difficulty: targetDifficulty,
          id: { notIn: [...updatedExisting] },
        },
        orderBy: [{ order: "asc" }],
        take: 6 - recommendations.length,
        include: {
          subject: { select: { slug: true, name: true, color: true, icon: true } },
        },
      })
      recommendations = [...recommendations, ...fillers]
    }
  }

  // Deduplicate subject-level progress for subject cards
  const subjectProgress = await db.subject.findMany({
    where: { published: true },
    orderBy: [{ order: "asc" }, { name: "asc" }],
    include: {
      tutorials: {
        where: { published: true },
        select: {
          id: true,
          progress: {
            where: { userId: user.id, completed: true },
            select: { tutorialId: true },
          },
        },
      },
      _count: { select: { tutorials: { where: { published: true } } } },
    },
  })
  const subjectsWithProgress = subjectProgress.map((s) => {
    const total = s._count.tutorials
    const completed = s.tutorials.filter((t) => t.progress.length > 0).length
    return {
      id: s.id,
      slug: s.slug,
      name: s.name,
      icon: s.icon,
      color: s.color,
      category: s.category,
      totalTutorials: total,
      completedTutorials: completed,
      progressPct: total > 0 ? Math.round((completed / total) * 100) : 0,
    }
  })

  const levelInfo = levelFromXP(user.totalXP)

  return ok({
    user,
    stats: {
      totalXP: user.totalXP,
      points: user.points,
      level: levelInfo.level,
      levelInfo,
      currentStreak: user.currentStreak,
      longestStreak: user.longestStreak,
      tutorialsCompleted,
      quizzesPassed,
      notesCount,
      bookmarksCount,
      todayXP,
      dailyXPCap: 500,
    },
    continueLearning,
    recentlyViewed,
    recommendations: recommendations.map((r) => ({
      id: r.id,
      slug: r.slug,
      title: r.title,
      summary: r.summary,
      difficulty: r.difficulty,
      estimatedMinutes: r.estimatedMinutes,
      subject: r.subject,
    })),
    subjectProgress: subjectsWithProgress,
    recentActivity,
  })
}
