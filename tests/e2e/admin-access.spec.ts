import { test, expect, type APIRequestContext } from "@playwright/test"
import { db } from "../../src/lib/db"
import { grantPremiumByAdmin } from "../../src/lib/entitlements/payments"

const PASSWORD = "AdminSecTest123!"

test.describe.configure({ timeout: 240_000 })

/** Register + (optionally promote) + sign in on a fresh API context (shared cookies). */
async function registerAndSignIn(ctx: APIRequestContext, name: string, role?: string) {
  const email = `admin-e2e-${Date.now()}-${Math.floor(Math.random() * 1e6)}@test.dev`
  const reg = await ctx.post("/api/auth/register", { data: { name, email, password: PASSWORD } })
  expect(reg.status(), "register should succeed").toBe(201)
  const regJson = (await reg.json()) as any
  const id = regJson.data?.user?.id
  expect(id, "register should return the user id").toBeTruthy()
  if (role) await setRole(id, role)
  const csrf = await (await ctx.get("/api/auth/csrf")).json()
  const signin = await ctx.post("/api/auth/callback/credentials", {
    data: { csrfToken: csrf.csrfToken, email, password: PASSWORD, json: true },
  })
  expect([200, 302], "sign-in should succeed").toContain(signin.status())
  return { email, name, id }
}

async function setRole(userId: string, role: string, status = "ACTIVE") {
  await db.user.update({ where: { id: userId }, data: { role, status } })
}

const ADMIN_ENDPOINTS = [
  "/api/admin/stats",
  "/api/admin/users",
  "/api/admin/entitlements",
  "/api/admin/certificates",
  "/api/admin/tutorials",
  "/api/admin/export",
  "/api/admin/audit-logs",
  "/api/admin/settings",
  "/api/admin/ai",
] as const

test.describe("Admin access: escalation control", () => {
  test("guests are rejected from every admin endpoint", async ({ request }) => {
    for (const path of ADMIN_ENDPOINTS) {
      const res = await request.get(path)
      expect([401, 403], `${path} should reject guests`).toContain(res.status())
    }
    const mut = await request.patch("/api/admin/users/whatever", { data: { role: "SUPER_ADMIN" } })
    expect([401, 403]).toContain(mut.status())
  })

  test("normal users cannot access admin endpoints or spoof roles", async () => {
    const ctx = await test.request.newContext()
    await registerAndSignIn(ctx, "Normal User")
    for (const path of ADMIN_ENDPOINTS) {
      const res = await ctx.get(path)
      expect(res.status(), `${path} should be 403 for a normal user`).toBe(403)
    }
    // Client-side "spoofing" headers/footers have no effect — the server
    // derives identity from the signed session, never from request data.
    const spoofed = await ctx.get("/api/admin/stats", { headers: { "x-role": "SUPER_ADMIN" } })
    expect(spoofed.status()).toBe(403)
    await ctx.dispose()
  })

  test("premium users cannot access admin endpoints merely because they paid", async () => {
    const ctx = await test.request.newContext()
    const { id } = await registerAndSignIn(ctx, "Premium User")
    await grantPremiumByAdmin({ userId: id, actorId: null as any, reason: "e2e premium fixture" })
    const res = await ctx.get("/api/admin/stats")
    expect(res.status()).toBe(403)
    await ctx.dispose()
  })
})

test.describe("Admin access: role capabilities", () => {
  test("ADMIN gets admin capabilities but not super-admin-only ones", async () => {
    const ctx = await test.request.newContext()
    const admin = await registerAndSignIn(ctx, "Fixture Admin", "ADMIN")

    const stats = await ctx.get("/api/admin/stats")
    expect(stats.status()).toBe(200)
    const users = await ctx.get("/api/admin/users")
    expect(users.status()).toBe(200)
    const certs = await ctx.get("/api/admin/certificates")
    expect(certs.status()).toBe(200)

    // ADMIN may suspend a plain user…
    const normal = await registerAndSignIn(await test.request.newContext(), "Suspend Target")
    const patch = await ctx.patch(`/api/admin/users/${normal.id}`, { data: { status: "SUSPENDED" } })
    expect(patch.status()).toBe(200)

    // …but cannot grant roles, manage settings, AI or read the audit log.
    const promote = await ctx.patch(`/api/admin/users/${normal.id}`, { data: { role: "ADMIN" } })
    expect(promote.status()).toBe(403)
    expect((await ctx.get("/api/admin/settings")).status()).toBe(403)
    expect((await ctx.get("/api/admin/ai")).status()).toBe(403)
    expect((await ctx.get("/api/admin/audit-logs")).status()).toBe(403)
    await ctx.dispose()
  })

  test("SUPER_ADMIN has every capability; cannot self-demote or self-suspend", async () => {
    const ctx = await test.request.newContext()
    const superAdmin = await registerAndSignIn(ctx, "Fixture Super Admin", "SUPER_ADMIN")

    for (const path of ADMIN_ENDPOINTS) {
      const res = await ctx.get(path)
      expect(res.status(), `${path} should be 200 for a Super Admin`).toBe(200)
    }

    const other = await registerAndSignIn(await test.request.newContext(), "Role Target")
    const promote = await ctx.patch(`/api/admin/users/${other.id}`, { data: { role: "ADMIN" } })
    expect(promote.status()).toBe(200)

    // Self-demotion / self-suspension are forbidden (lockout protection).
    const demoteSelf = await ctx.patch(`/api/admin/users/${superAdmin.id}`, { data: { role: "USER" } })
    expect(demoteSelf.status()).toBe(403)
    const suspendSelf = await ctx.patch(`/api/admin/users/${superAdmin.id}`, { data: { status: "SUSPENDED" } })
    expect(suspendSelf.status()).toBe(403)
    await ctx.dispose()
  })

  test("a suspended admin session is cut off immediately", async () => {
    const ctx = await test.request.newContext()
    const admin = await registerAndSignIn(ctx, "Suspend Me Admin", "ADMIN")
    expect((await ctx.get("/api/admin/stats")).status()).toBe(200)
    // Suspend from a separate privileged context (self-suspension is blocked).
    const boss = await test.request.newContext()
    const superAdmin = await registerAndSignIn(boss, "Boss Super Admin", "SUPER_ADMIN")
    expect((await boss.patch(`/api/admin/users/${admin.id}`, { data: { status: "SUSPENDED" } })).status()).toBe(200)
    // The admin's live session now gets 403 — status is enforced per request.
    expect((await ctx.get("/api/admin/stats")).status()).toBe(403)
    await ctx.dispose()
    await boss.dispose()
  })
})

test.describe("Admin access: audit trail", () => {
  test("admin login, role changes and status changes are recorded", async () => {
    const ctx = await test.request.newContext()
    const superAdmin = await registerAndSignIn(ctx, "Audit Super Admin", "SUPER_ADMIN")

    // Admin login audit is written by the auth flow.
    const admin = await registerAndSignIn(await test.request.newContext(), "Audit Admin", "ADMIN")

    const target = await registerAndSignIn(await test.request.newContext(), "Audit Target")
    await ctx.patch(`/api/admin/users/${target.id}`, { data: { role: "ADMIN" } })
    await ctx.patch(`/api/admin/users/${target.id}`, { data: { status: "SUSPENDED" } })
    await ctx.post("/api/admin/entitlements/grant", { data: { userId: target.id, reason: "e2e audit" } })

    const logs = await (await ctx.get("/api/admin/audit-logs?limit=100")).json()
    const actions = logs.data.entries.map((e: any) => e.action)
    expect(actions).toContain("ADMIN_LOGIN")
    expect(actions).toContain("ROLE_CHANGED")
    expect(actions).toContain("USER_STATUS_CHANGED")
    expect(actions).toContain("PREMIUM_GRANTED")
    await ctx.dispose()
  })
})

test.describe("Admin access: content lifecycle", () => {
  test("unpublishing hides a tutorial from the public API; republishing restores it", async () => {
    const ctx = await test.request.newContext()
    const superAdmin = await registerAndSignIn(ctx, "Content Super Admin", "SUPER_ADMIN")

    const slug = `adm-lifecycle-${Date.now()}`
    const subject = await db.subject.create({
      data: {
        name: `Admin E2E ${Date.now()}`,
        slug: `${slug}-subject`,
        tagline: "e2e",
        description: "e2e",
        color: "#000",
        icon: "book",
        category: "Web",
        order: 99999,
      },
    })
    const tutorial = await db.tutorial.create({
      data: {
        subjectId: subject.id,
        slug,
        title: `Admin E2E Tutorial ${Date.now()}`,
        summary: "e2e",
        content: "# Hi",
        order: 99999,
      },
    })

    // Visible while published.
    const before = await ctx.get(`/api/tutorials/${subject.slug}/${tutorial.slug}`)
    expect([200, 303]).toContain(before.status())

    // Unpublish via the admin API → hidden from guests.
    const unpub = await ctx.patch(`/api/admin/tutorials/${tutorial.id}`, { data: { published: false } })
    expect(unpub.status()).toBe(200)
    const during = await ctx.get(`/api/tutorials/${subject.slug}/${tutorial.slug}`)
    expect(during.status()).toBe(404)

    // Republish → visible again.
    const repub = await ctx.patch(`/api/admin/tutorials/${tutorial.id}`, { data: { published: true } })
    expect(repub.status()).toBe(200)
    const after = await ctx.get(`/api/tutorials/${subject.slug}/${tutorial.slug}`)
    expect(after.status()).toBe(200)

    await db.tutorial.delete({ where: { id: tutorial.id } })
    await db.subject.delete({ where: { id: subject.id } })
    await ctx.dispose()
  })
})