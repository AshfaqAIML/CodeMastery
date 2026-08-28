const { PrismaClient } = require("@prisma/client")
const { PrismaPg } = require("@prisma/adapter-pg")
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const db = new PrismaClient({ adapter })

async function main() {
  const completedDomain = await db.domain.findUnique({ where: { slug: "completed" } })
  if (!completedDomain) { console.log("No Completed domain"); await db.$disconnect(); return }

  const r = await db.subject.updateMany({
    where: { domainId: completedDomain.id },
    data: { status: "COMING_SOON" },
  })
  console.log("Reset", r.count, "courses in Completed domain to COMING_SOON status")
  await db.$disconnect()
}
main()
