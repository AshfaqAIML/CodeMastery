const { PrismaClient } = require("@prisma/client")
const { PrismaPg } = require("@prisma/adapter-pg")

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const db = new PrismaClient({ adapter })

async function main() {
  const domains = await db.domain.findMany({ orderBy: { order: "asc" } })
  console.log("=== DOMAINS ===")
  for (const d of domains) {
    const count = await db.subject.count({ where: { domainId: d.id } })
    console.log(`  ${d.slug} | ${d.name} | subjects: ${count}`)
  }

  const subjects = await db.subject.findMany({
    orderBy: { order: "asc" },
    include: { domain: true, _count: { select: { tutorials: true } } },
  })
  console.log("\n=== SUBJECTS ===")
  for (const s of subjects) {
    const domainName = s.domain ? s.domain.name : "(none)"
    console.log(`  ${s.slug} | ${s.name} | domain: ${domainName} | tutorials: ${s._count.tutorials}`)
  }

  await db.$disconnect()
}

main()
