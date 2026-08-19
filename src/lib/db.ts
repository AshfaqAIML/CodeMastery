import { PrismaClient } from '@prisma/client'

type PrismaClientFactory = () => PrismaClient

function createNeonClient(): PrismaClient {
  // Lazy require so the Neon driver only loads when explicitly requested.
  const { PrismaNeon } = require('@prisma/adapter-neon')
  const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL })
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'production' ? ['error'] : ['error', 'warn'],
  })
}

function createPgClient(): PrismaClient {
  const { PrismaPg } = require('@prisma/adapter-pg')
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'production' ? ['error'] : ['error', 'warn'],
  })
}

const factory: PrismaClientFactory =
  process.env.PRISMA_DRIVER === 'pg' ? createPgClient : createNeonClient

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db = globalForPrisma.prisma ?? factory()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db