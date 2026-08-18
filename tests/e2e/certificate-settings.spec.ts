import { test, expect, type APIRequestContext } from "@playwright/test"
import { db } from "../../src/lib/db"

const PASSWORD = "CertSetSpec123!"

test.describe.configure({ timeout: 240_000 })

// 1x1 transparent PNG (67 bytes) — small enough to round-trip as base64.
const TINY_PNG =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="

async function signInAsSuperAdmin(ctx: APIRequestContext) {
  const email = `certset-e2e-${Date.now()}-${Math.floor(Math.random() * 1e6)}@test.dev`
  const reg = await ctx.post("/api/auth/register", { data: { name: "Cert Settings Admin", email, password: PASSWORD } })
  expect(reg.status()).toBe(201)
  const id = (await reg.json()).data.user.id
  await db.user.update({ where: { id }, data: { role: "SUPER_ADMIN" } })
  const csrf = await (await ctx.get("/api/auth/csrf")).json()
  const signin = await ctx.post("/api/auth/callback/credentials", {
    data: { csrfToken: csrf.csrfToken, email, password: PASSWORD, json: true },
  })
  expect([200, 302]).toContain(signin.status())
  return id
}

test.describe("Certificate settings: assets", () => {
  test("digital seal upload round-trips; clear resets it; other assets untouched", async ({ request }) => {
    const ctx = await test.request.newContext()
    await signInAsSuperAdmin(ctx)

    const before = (await (await ctx.get("/api/admin/certificates/settings")).json()).data.settings

    // Upload ONLY a digital seal — partial payload must not clobber the
    // text fields or the other asset keys (regression for the upload bug).
    const upload = await ctx.post("/api/admin/certificates/settings", {
      data: {
        digitalSeal: { name: "digital.png", mime: "image/png", base64: TINY_PNG },
      },
    })
    expect(upload.status()).toBe(200)

    const after = (await (await ctx.get("/api/admin/certificates/settings")).json()).data.settings
    expect(after.digitalSealKey).toBeTruthy()
    expect(after.sealKey).toBe(before.sealKey)
    expect(after.signatureKey).toBe(before.signatureKey)
    expect(after.signatoryName).toBe(before.signatoryName)
    expect(after.issuerWebsite).toBe(before.issuerWebsite)

    // Clearing the digital seal restores the "not shown" state.
    const clear = await ctx.post("/api/admin/certificates/settings", { data: { clearDigitalSeal: true } })
    expect(clear.status()).toBe(200)
    const cleared = (await (await ctx.get("/api/admin/certificates/settings")).json()).data.settings
    expect(cleared.digitalSealKey).toBeNull()

    await ctx.dispose()
  })

  test("partial text updates work and oversized assets are rejected", async ({ request }) => {
    const ctx = await test.request.newContext()
    await signInAsSuperAdmin(ctx)

    const before = (await (await ctx.get("/api/admin/certificates/settings")).json()).data.settings

    // Partial text-only update (no assets, no issuer block) must succeed.
    const partial = await ctx.post("/api/admin/certificates/settings", {
      data: { signatoryName: "E2E Temp Signatory" },
    })
    expect(partial.status()).toBe(200)
    const mid = (await (await ctx.get("/api/admin/certificates/settings")).json()).data.settings
    expect(mid.signatoryName).toBe("E2E Temp Signatory")
    expect(mid.signatoryTitle).toBe(before.signatoryTitle)

    // Restore what we changed.
    const restore = await ctx.post("/api/admin/certificates/settings", {
      data: { signatoryName: before.signatoryName },
    })
    expect(restore.status()).toBe(200)

    // Oversized asset (>8MB) is rejected with a 400, nothing persisted.
    const huge = "A".repeat(Math.ceil((8 * 1024 * 1024 * 4) / 3) + 1024) // base64 of >8MB
    const oversize = await ctx.post("/api/admin/certificates/settings", {
      data: {
        seal: { name: "huge.png", mime: "image/png", base64: huge },
      },
    })
    expect(oversize.status()).toBe(400)

    await ctx.dispose()
  })
})