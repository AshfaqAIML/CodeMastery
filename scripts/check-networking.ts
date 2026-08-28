import { PrismaClient } from "@prisma/client"
const { PrismaPg } = require("@prisma/adapter-pg")

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const db = new PrismaClient({ adapter })

async function main() {
  const subj = await db.subject.findUnique({
    where: { slug: "computer-networking" },
    include: { modules: { include: { tutorials: true } } },
  })

  if (!subj) {
    console.log("SUBJECT NOT FOUND")
    await db.$disconnect()
    return
  }

  const fixSlug = await db.tutorial.update({
    where: { id: "cmtckeuie00022wznhsmdb52u" },
    data: { slug: "net-what-is-a-computer-network" },
  })
  console.log("Fixed slug:", fixSlug.slug)

  await db.$disconnect()
}

main()
