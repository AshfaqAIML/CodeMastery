import { NextRequest } from "next/server"
import { db } from "@/lib/db"
import { ok, err, forbidden } from "@/lib/api"
import { getCurrentUser } from "@/lib/session"
import { assertPermission } from "@/lib/authorization/service"
import { recordAuditSafe } from "@/lib/audit"

export async function POST(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return forbidden()
  const denied = await assertPermission(user, "content.import")
  if (denied) return denied

  let body: any
  try {
    body = await req.json()
  } catch {
    return err("Invalid JSON body.", 400)
  }
  const { subjects: subjectsIn = [], achievements: achievementsIn = [], paths: pathsIn = [] } = body || {}

  let created = { subjects: 0, modules: 0, tutorials: 0, quizzes: 0, questions: 0, achievements: 0, paths: 0, steps: 0 }

  // Subjects, modules, tutorials, quizzes
  for (const s of subjectsIn) {
    const subject = await db.subject.upsert({
      where: { slug: s.slug },
      create: {
        slug: s.slug,
        name: s.name,
        tagline: s.tagline ?? "",
        description: s.description ?? "",
        icon: s.icon ?? "Code2",
        color: s.color ?? "oklch(0.62 0.15 162)",
        category: s.category ?? "Programming",
        order: s.order ?? 0,
        published: s.published ?? true,
      },
      update: {
        name: s.name,
        tagline: s.tagline ?? "",
        description: s.description ?? "",
        icon: s.icon ?? "Code2",
        color: s.color ?? "oklch(0.62 0.15 162)",
        category: s.category ?? "Programming",
        order: s.order ?? 0,
      },
    })
    created.subjects++

    for (const m of s.modules ?? []) {
      const moduleRec = await db.module.upsert({
        where: { subjectId_slug: { subjectId: subject.id, slug: m.slug } },
        create: {
          subjectId: subject.id,
          slug: m.slug,
          title: m.title,
          summary: m.summary ?? null,
          order: m.order ?? 0,
          difficulty: m.difficulty ?? "beginner",
          estimatedMinutes: m.estimatedMinutes ?? 30,
        },
        update: {
          title: m.title,
          summary: m.summary ?? null,
          order: m.order ?? 0,
          difficulty: m.difficulty ?? "beginner",
          estimatedMinutes: m.estimatedMinutes ?? 30,
        },
      })
      created.modules++

      for (const t of m.tutorials ?? []) {
        const tut = await db.tutorial.upsert({
          where: { subjectId_slug: { subjectId: subject.id, slug: t.slug } },
          create: {
            subjectId: subject.id,
            moduleId: moduleRec.id,
            slug: t.slug,
            title: t.title,
            summary: t.summary ?? "",
            content: t.content ?? "",
            difficulty: t.difficulty ?? "beginner",
            estimatedMinutes: t.estimatedMinutes ?? 15,
            tags: t.tags ?? "",
            order: t.order ?? 0,
            published: t.published ?? true,
          },
          update: {
            title: t.title,
            summary: t.summary ?? "",
            content: t.content ?? "",
            difficulty: t.difficulty ?? "beginner",
            estimatedMinutes: t.estimatedMinutes ?? 15,
            tags: t.tags ?? "",
            order: t.order ?? 0,
          },
        })
        created.tutorials++
        for (const q of t.quizzes ?? []) {
          const quiz = await db.quiz.upsert({
            where: { id: q.id ?? "nonexistent" },
            create: {
              tutorialId: tut.id,
              title: q.title,
              description: q.description ?? null,
              passingScore: q.passingScore ?? 70,
              xpReward: q.xpReward ?? 50,
            },
            update: {},
          })
          if (q.id) created.quizzes++
          else created.quizzes++
          for (const qq of q.questions ?? []) {
            await db.quizQuestion.upsert({
              where: { id: qq.id ?? "nonexistent" },
              create: {
                quizId: quiz.id,
                prompt: qq.prompt,
                options: typeof qq.options === "string" ? qq.options : JSON.stringify(qq.options),
                answerIndex: qq.answerIndex ?? 0,
                explanation: qq.explanation ?? null,
                order: qq.order ?? 0,
              },
              update: {
                prompt: qq.prompt,
                options: typeof qq.options === "string" ? qq.options : JSON.stringify(qq.options),
                answerIndex: qq.answerIndex ?? 0,
                explanation: qq.explanation ?? null,
                order: qq.order ?? 0,
              },
            })
            created.questions++
          }
        }
      }
    }
    // Top-level tutorials (no module)
    for (const t of s.tutorials ?? []) {
      await db.tutorial.upsert({
        where: { subjectId_slug: { subjectId: subject.id, slug: t.slug } },
        create: {
          subjectId: subject.id,
          slug: t.slug,
          title: t.title,
          summary: t.summary ?? "",
          content: t.content ?? "",
          difficulty: t.difficulty ?? "beginner",
          estimatedMinutes: t.estimatedMinutes ?? 15,
          tags: t.tags ?? "",
          order: t.order ?? 0,
          published: t.published ?? true,
        },
        update: { title: t.title, summary: t.summary ?? "", content: t.content ?? "" },
      })
      created.tutorials++
    }
  }

  // Achievements
  for (const a of achievementsIn) {
    await db.achievement.upsert({
      where: { slug: a.slug },
      create: {
        slug: a.slug,
        title: a.title,
        description: a.description,
        icon: a.icon ?? "Trophy",
        color: a.color ?? "oklch(0.7 0.16 85)",
        category: a.category ?? "learning",
        xpReward: a.xpReward ?? 0,
        threshold: a.threshold ?? 1,
        metric: a.metric ?? "tutorials_completed",
      },
      update: {
        title: a.title,
        description: a.description,
        icon: a.icon ?? "Trophy",
        color: a.color ?? "oklch(0.7 0.16 85)",
        category: a.category ?? "learning",
        xpReward: a.xpReward ?? 0,
        threshold: a.threshold ?? 1,
        metric: a.metric ?? "tutorials_completed",
      },
    })
    created.achievements++
  }

  // Learning paths
  for (const p of pathsIn) {
    const path = await db.learningPath.upsert({
      where: { slug: p.slug },
      create: {
        slug: p.slug,
        title: p.title,
        tagline: p.tagline ?? "",
        description: p.description ?? "",
        icon: p.icon ?? "Route",
        color: p.color ?? "oklch(0.7 0.13 200)",
        difficulty: p.difficulty ?? "beginner",
        estimatedHours: p.estimatedHours ?? 40,
        published: p.published ?? true,
      },
      update: {
        title: p.title,
        tagline: p.tagline ?? "",
        description: p.description ?? "",
        icon: p.icon ?? "Route",
        color: p.color ?? "oklch(0.7 0.13 200)",
        difficulty: p.difficulty ?? "beginner",
        estimatedHours: p.estimatedHours ?? 40,
      },
    })
    created.paths++
    for (const st of p.steps ?? []) {
      const tutorial = st.tutorialSlug
        ? await db.tutorial.findFirst({
            where: { slug: st.tutorialSlug, subject: { slug: st.subjectSlug } },
          })
        : null
      const subject = st.subjectSlug ? await db.subject.findUnique({ where: { slug: st.subjectSlug } }) : null
      await db.learningPathStep.create({
        data: {
          pathId: path.id,
          tutorialId: tutorial?.id ?? null,
          subjectId: subject?.id ?? null,
          title: st.title,
          subtitle: st.subtitle ?? null,
          order: st.order ?? 0,
        },
      })
      created.steps++
    }
  }

  await recordAuditSafe({
    actorId: user.id,
    action: "CONTENT_IMPORTED",
    targetType: "system",
    detail: `Imported ${created.subjects} subjects, ${created.tutorials} tutorials, ${created.achievements} achievements, ${created.paths} paths.`,
  })

  return ok({ imported: created })
}
