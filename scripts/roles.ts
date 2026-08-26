/**
 * Role provisioning for CodeMastery administrators.
 *
 *   bun scripts/roles.ts promote <email>     # → SUPER_ADMIN, ACTIVE, verified
 *   bun scripts/roles.ts demote <email>      # SUPER_ADMIN/ADMIN → USER
 *   bun scripts/roles.ts status <email>      # show role/status (no secrets)
 *
 * Safety:
 * - Passwords are NEVER handled here — owners set them through the normal
 *   signup / account flows. This script never reads or writes password data.
 * - Demoting the last active SUPER_ADMIN is refused (no zero-admin state).
 * - Every change is written to the AuditLog.
 */
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import "dotenv/config"

const db = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
})
const [cmd, emailArg] = process.argv.slice(2)

function fail(msg: string): never {
  console.error(`✗ ${msg}`)
  process.exit(1)
}

if (!cmd || !emailArg) {
  console.log("Usage: bun scripts/roles.ts <promote|demote|status> <email>")
  process.exit(1)
}

const email = emailArg.trim().toLowerCase()

async function main() {
  const user = await db.user.findUnique({
    where: { email },
    select: { id: true, email: true, role: true, status: true, emailVerified: true },
  })
  if (!user) fail(`No account exists for ${email}. Owner should sign up first via the app.`)

  if (cmd === "status") {
    console.log(`${user.email}  role=${user.role}  status=${user.status}  verified=${user.emailVerified ? "yes" : "no"}`)
    return
  }

  if (cmd === "promote") {
    if (user.role === "SUPER_ADMIN" && user.status === "ACTIVE" && user.emailVerified) {
      console.log(`${user.email} is already an active, verified SUPER_ADMIN.`)
      return
    }
    await db.$transaction([
      db.user.update({
        where: { id: user.id },
        data: { role: "SUPER_ADMIN", status: "ACTIVE", emailVerified: user.emailVerified ?? new Date() },
      }),
      db.auditLog.create({
        data: {
          action: "ROLE_CHANGED",
          targetType: "user",
          targetId: user.id,
          detail: `Promoted to SUPER_ADMIN via provisioning script (was ${user.role}/${user.status}).`,
          result: "SUCCESS",
        },
      }),
    ])
    console.log(`✓ ${email} is now SUPER_ADMIN (active, verified).`)
    return
  }

  if (cmd === "demote") {
    if (user.role === "USER") {
      console.log(`${email} is already a USER.`)
      return
    }
    if (user.role === "SUPER_ADMIN") {
      const activeSuper = await db.user.count({
        where: { role: "SUPER_ADMIN", status: "ACTIVE" },
      })
      if (activeSuper <= 1) fail("Refusing to demote the last active SUPER_ADMIN — the platform would have no Super Admin.")
    }
    await db.$transaction([
      db.user.update({ where: { id: user.id }, data: { role: "USER" } }),
      db.auditLog.create({
        data: {
          action: "ROLE_CHANGED",
          targetType: "user",
          targetId: user.id,
          detail: `Demoted ${user.role} → USER via provisioning script.`,
          result: "SUCCESS",
        },
      }),
    ])
    console.log(`✓ ${email} demoted to USER.`)
    return
  }

  fail(`Unknown command "${cmd}". Use promote, demote or status.`)
}

main()
  .catch((e) => {
    console.error("✗ Script error:", e.message)
    process.exit(1)
  })
  .finally(() => db.$disconnect())