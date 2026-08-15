import { db } from "@/lib/db"

/**
 * Website-aware AI context system.
 *
 * Retrieves relevant application data to include in AI prompts:
 * - Current tutorial content
 * - Subject info
 * - User progress and learning state
 * - Related tutorials
 * - User notes and bookmarks
 *
 * All retrieval is scoped to the authenticated user — no cross-user leakage.
 */

export interface AIContext {
  tutorial?: {
    title: string
    subject: string
    content: string
    summary: string
    difficulty: string
    tags: string
  }
  subject?: {
    name: string
    description: string
    moduleTitle?: string
  }
  userProgress?: {
    percentRead: number
    completed: boolean
    level: number
    totalXP: number
    experience: string | null
    goal: string | null
  }
  relatedTutorials?: { title: string; slug: string; difficulty: string }[]
  userNotes?: { content: string; tutorialTitle: string }[]
  userStats?: {
    tutorialsCompleted: number
    quizzesPassed: number
    currentStreak: number
    bookmarksCount: number
  }
  nextTutorials?: { title: string; subject: string; slug: string }[]
}

/**
 * Build context for a tutorial-specific AI request.
 * Sends only the minimum necessary data.
 */
export async function buildTutorialContext(
  userId: string,
  tutorialId: string
): Promise<AIContext> {
  const context: AIContext = {}

  // Fetch tutorial with subject and module
  const tutorial = await db.tutorial.findUnique({
    where: { id: tutorialId },
    select: {
      title: true,
      content: true,
      summary: true,
      difficulty: true,
      tags: true,
      subject: { select: { name: true, description: true } },
      module: { select: { title: true } },
    },
  })

  if (tutorial) {
    // Truncate content to keep token budget reasonable
    const truncatedContent = tutorial.content.slice(0, 6000)

    context.tutorial = {
      title: tutorial.title,
      subject: tutorial.subject.name,
      content: truncatedContent,
      summary: tutorial.summary,
      difficulty: tutorial.difficulty,
      tags: tutorial.tags,
    }

    context.subject = {
      name: tutorial.subject.name,
      description: tutorial.subject.description,
      moduleTitle: tutorial.module?.title,
    }
  }

  // Fetch user progress on this tutorial
  const progress = await db.tutorialProgress.findUnique({
    where: { userId_tutorialId: { userId, tutorialId } },
    select: { percentRead: true, completed: true },
  })

  // Fetch user learning state
  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      level: true,
      totalXP: true,
      experience: true,
      goal: true,
    },
  })

  if (user) {
    context.userProgress = {
      percentRead: progress?.percentRead ?? 0,
      completed: progress?.completed ?? false,
      level: user.level,
      totalXP: user.totalXP,
      experience: user.experience,
      goal: user.goal,
    }
  }

  // Fetch user's notes on this tutorial
  const notes = await db.note.findMany({
    where: { userId, tutorialId },
    select: { content: true },
    take: 5,
  })

  if (notes.length > 0) {
    context.userNotes = notes.map((n) => ({
      content: n.content.slice(0, 500),
      tutorialTitle: tutorial?.title ?? "",
    }))
  }

  // Fetch related tutorials (same subject, excluding current)
  if (tutorial) {
    const subjectId = await db.tutorial.findUnique({
      where: { id: tutorialId },
      select: { subjectId: true },
    })

    if (subjectId) {
      const related = await db.tutorial.findMany({
        where: {
          published: true,
          subjectId: subjectId.subjectId,
          id: { not: tutorialId },
        },
        orderBy: [{ difficulty: "asc" }, { order: "asc" }],
        take: 5,
        select: { title: true, slug: true, difficulty: true },
      })

      if (related.length > 0) {
        context.relatedTutorials = related
      }
    }
  }

  // Fetch user stats
  const [tutorialsCompleted, quizzesPassed, bookmarksCount] = await Promise.all([
    db.tutorialProgress.count({ where: { userId, completed: true } }),
    db.quizAttempt.count({ where: { userId, passed: true } }),
    db.bookmark.count({ where: { userId } }),
  ])

  const userWithStreak = await db.user.findUnique({
    where: { id: userId },
    select: { currentStreak: true },
  })

  context.userStats = {
    tutorialsCompleted,
    quizzesPassed,
    currentStreak: userWithStreak?.currentStreak ?? 0,
    bookmarksCount,
  }

  // Fetch next tutorials (recommendations based on subject)
  if (tutorial) {
    const completedIds = (
      await db.tutorialProgress.findMany({
        where: { userId, completed: true },
        select: { tutorialId: true },
      })
    ).map((p) => p.tutorialId)

    const nextTuts = await db.tutorial.findMany({
      where: {
        published: true,
        id: { notIn: completedIds },
      },
      orderBy: [{ difficulty: "asc" }, { order: "asc" }],
      take: 3,
      include: {
        subject: { select: { name: true, slug: true } },
      },
      select: {
        title: true,
        slug: true,
        subject: { select: { name: true, slug: true } },
      },
    })

    if (nextTuts.length > 0) {
      context.nextTutorials = nextTuts.map((t) => ({
        title: t.title,
        subject: t.subject.name,
        slug: t.slug,
      }))
    }
  }

  return context
}

/**
 * Build a system prompt that makes the AI website-aware.
 */
export function buildSystemPrompt(context: AIContext): string {
  let prompt = `You are CodeMastery AI Tutor, an intelligent assistant integrated into the CodeMastery learning platform.

You are NOT a generic chatbot. You are a website-aware AI that understands the platform's content, the user's learning journey, and their current context.

## Your Role
- Help users understand tutorial content at their level
- Generate examples, analogies, and explanations
- Create practice questions and quizzes
- Provide learning recommendations based on actual platform content
- Help with code explanation and debugging
- Maintain a supportive, encouraging tone

## CRITICAL RULES
1. ONLY reference tutorials and content that actually exist in the platform (listed below).
2. NEVER invent tutorials, subjects, or learning paths that don't exist.
3. If asked about content not on the platform, say "The platform doesn't currently cover that topic."
4. Use the user's actual progress data to personalize responses.
5. Keep responses concise and focused — under 400 words unless explicitly asked for more.
6. Use markdown formatting: code blocks with language tags, **bold** for emphasis, lists for steps.
7. When referencing tutorials, mention their titles so users can find them.

## Current Context`

  if (context.tutorial) {
    prompt += `

### Current Tutorial
- Title: ${context.tutorial.title}
- Subject: ${context.tutorial.subject}
- Difficulty: ${context.tutorial.difficulty}
- Tags: ${context.tutorial.tags}
- Summary: ${context.tutorial.summary}

### Tutorial Content (excerpt)
${context.tutorial.content.slice(0, 4000)}`
  }

  if (context.subject) {
    prompt += `

### Subject: ${context.subject.name}
${context.subject.description}
${context.subject.moduleTitle ? `Module: ${context.subject.moduleTitle}` : ""}`
  }

  if (context.userProgress) {
    prompt += `

### User Learning State
- Level: ${context.userProgress.level}
- Total XP: ${context.userProgress.totalXP}
- Experience level: ${context.userProgress.experience ?? "not specified"}
- Learning goal: ${context.userProgress.goal ?? "not specified"}
- Progress on current tutorial: ${context.userProgress.percentRead}%
- Current tutorial completed: ${context.userProgress.completed ? "yes" : "no"}

Adapt your explanations based on the user's experience level. If they're a beginner, use simpler language and more analogies. If advanced, include more technical detail.`
  }

  if (context.userStats) {
    prompt += `

### User Statistics
- Tutorials completed: ${context.userStats.tutorialsCompleted}
- Quizzes passed: ${context.userStats.quizzesPassed}
- Current streak: ${context.userStats.currentStreak} days
- Bookmarks: ${context.userStats.bookmarksCount}`
  }

  if (context.relatedTutorials && context.relatedTutorials.length > 0) {
    prompt += `

### Related Tutorials in This Subject
${context.relatedTutorials.map((t) => `- ${t.title} (${t.difficulty})`).join("\n")}`
  }

  if (context.nextTutorials && context.nextTutorials.length > 0) {
    prompt += `

### Recommended Next Tutorials
${context.nextTutorials.map((t) => `- ${t.title} (${t.subject})`).join("\n")}`
  }

  if (context.userNotes && context.userNotes.length > 0) {
    prompt += `

### User's Notes on This Tutorial
${context.userNotes.map((n) => `- ${n.content}`).join("\n")}`
  }

  prompt += `

Remember: You are part of the CodeMastery platform. Be helpful, accurate, and use the actual content above to ground your answers.`

  return prompt
}

/**
 * Quick action prompts — predefined actions the user can trigger.
 */
export const QUICK_ACTIONS = {
  explain: "Explain this tutorial's main concepts in simple terms, as if teaching a beginner.",
  simplify: "Take the most complex part of this tutorial and break it down step by step.",
  example: "Give me a practical real-world example that demonstrates the concepts in this tutorial.",
  analogy: "Explain the key concepts using a real-world analogy.",
  quiz: "Create 3 quiz questions based on this tutorial's content. Include the correct answers and brief explanations.",
  summarize: "Summarize this tutorial in 5 key bullet points.",
  next: "Based on what I just learned, what should I study next? Use the actual tutorials available on the platform.",
  prerequisites: "What foundational concepts should I understand before this tutorial? Reference actual platform content if relevant.",
  code: "Explain the code examples in this tutorial line by line.",
} as const

export type QuickAction = keyof typeof QUICK_ACTIONS
