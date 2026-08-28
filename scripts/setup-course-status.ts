const { PrismaClient } = require("@prisma/client")
const { PrismaPg } = require("@prisma/adapter-pg")

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const db = new PrismaClient({ adapter })

async function main() {
  // 1. Add status column if not exists
  await db.$executeRawUnsafe(`
    ALTER TABLE "Subject" ADD COLUMN IF NOT EXISTS "status" TEXT NOT NULL DEFAULT 'COMING_SOON'
  `)
  console.log("✓ Added status column to Subject")

  // 2. Create "Completed" domain if not exists
  let completedDomain = await db.domain.findUnique({ where: { slug: "completed" } })
  if (!completedDomain) {
    completedDomain = await db.domain.create({
      data: {
        slug: "completed",
        name: "Completed",
        tagline: "Courses that are fully built and ready to learn.",
        description: "All completed courses with 10+ tutorials, ready for students.",
        icon: "CheckCircle",
        color: "oklch(0.65 0.18 145)",
        order: 99,
        published: true,
      },
    })
    console.log("✓ Created 'Completed' domain:", completedDomain.id)
  } else {
    console.log("✓ 'Completed' domain already exists:", completedDomain.id)
  }

  // 3. Get all subjects with their tutorial counts
  const subjects = await db.subject.findMany({
    include: { _count: { select: { tutorials: true } } },
  })

  let completedCount = 0
  let comingSoonCount = 0

  for (const s of subjects) {
    const tutorialCount = s._count.tutorials
    const newStatus = tutorialCount > 10 ? "COMPLETED" : "COMING_SOON"
    const newDomainId = tutorialCount > 10 ? completedDomain.id : s.domainId

    // Only update if something changed
    if (s.status !== newStatus || (tutorialCount > 10 && s.domainId !== completedDomain.id)) {
      await db.subject.update({
        where: { id: s.id },
        data: {
          status: newStatus,
          ...(tutorialCount > 10 ? { domainId: completedDomain.id } : {}),
        },
      })
      if (tutorialCount > 10) {
        completedCount++
        console.log(`  ✓ ${s.slug} → COMPLETED (${tutorialCount} tutorials) → Completed domain`)
      } else {
        comingSoonCount++
        console.log(`  ✓ ${s.slug} → COMING_SOON (${tutorialCount} tutorials)`)
      }
    } else {
      if (tutorialCount > 10) completedCount++
      else comingSoonCount++
    }
  }

  console.log(`\n=== SUMMARY ===`)
  console.log(`Completed: ${completedCount} courses`)
  console.log(`Coming Soon: ${comingSoonCount} courses`)

  await db.$disconnect()
}

main()
