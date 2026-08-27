import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

const settings = await prisma.certificateSettings.findUnique({ where: { id: "default" } })
if (settings) {
  console.log("sealKey:", JSON.stringify(settings.sealKey))
  console.log("signatureKey:", JSON.stringify(settings.signatureKey))
  console.log("digitalSealKey:", JSON.stringify(settings.digitalSealKey))
  console.log("issuerName:", settings.issuerName)
  console.log("issuerWebsite:", settings.issuerWebsite)
} else {
  console.log("No settings found")
}

await prisma.$disconnect()
