const { PrismaClient } = require("@prisma/client")
const { PrismaPg } = require("@prisma/adapter-pg")
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const db = new PrismaClient({ adapter })

async function main() {
  const subjects = await db.subject.findMany({
    include: { _count: { select: { tutorials: true } }, domain: true },
    orderBy: { name: "asc" },
  })

  const statusCounts = {}
  for (const s of subjects) {
    const st = s.status || "NULL"
    statusCounts[st] = (statusCounts[st] || 0) + 1
  }
  console.log("Status distribution:", statusCounts)

  console.log("\n=== Subjects with >10 tutorials ===")
  for (const s of subjects) {
    if (s._count.tutorials > 10) {
      console.log(`  ${s.slug} | status=${s.status} | tutorials=${s._count.tutorials} | domain=${s.domain?.name || "none"}`)
    }
  }

  await db.$disconnect()
}
main()
