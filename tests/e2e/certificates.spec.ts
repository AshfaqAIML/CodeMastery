import { test, expect, type APIRequestContext } from "@playwright/test"
import { PNG } from "pngjs"
import jsQR from "jsqr"
import { db } from "../../src/lib/db"

const BASE = "http://localhost:3000"
const CERT_NUMBER_RE = /^CM-\d{4}-\d{6}$/

/** Register a fresh user and sign in with credentials. */
async function registerAndSignIn(request: APIRequestContext, name: string) {
  const email = `cert-e2e-${Date.now()}-${Math.floor(Math.random() * 1e6)}@test.dev`
  const password = "CertTest123!"
  const reg = await request.post("/api/auth/register", { data: { name, email, password } })
  expect(reg.status(), "register should succeed").toBe(201)
  await signInWithContext(request, email, password)
  return { email, password }
}

/** Credentials sign-in against any APIRequestContext (cookie jar shared). */
async function signInWithContext(ctx: APIRequestContext, email: string, password: string) {
  const csrf = await (await ctx.get("/api/auth/csrf")).json()
  const signin = await ctx.post("/api/auth/callback/credentials", {
    data: { csrfToken: csrf.csrfToken, email, password, json: true },
  })
  expect([200, 302], "sign-in should redirect on success").toContain(signin.status())
}

/** Complete the single tutorial of web-development (auto-issues the certificate). */
async function completeWebDevelopment(request: APIRequestContext) {
  const subject = await (await request.get("/api/subjects/web-development")).json()
  const tutorialId = subject.data?.modules?.flatMap((m: any) => m.tutorials ?? [])[0]?.id
  expect(tutorialId, "web-development should have a tutorial").toBeTruthy()
  const res = await request.post("/api/progress", {
    data: { tutorialId, percentRead: 100, completed: true, timeSpentSec: 90 },
  })
  expect(res.status(), "progress post should succeed").toBe(200)
  return await res.json()
}

async function myCertificateNumber(request: APIRequestContext): Promise<string> {
  const mine = await (await request.get("/api/me/certificates")).json()
  expect(mine.data?.certificates?.length, "expected exactly one certificate").toBe(1)
  const number = mine.data.certificates[0].number as string
  expect(number, "certificate number format").toMatch(CERT_NUMBER_RE)
  return number
}

test.describe("Certificates", () => {
  test("issues a certificate when all tutorials are completed", async ({ request }) => {
    await registerAndSignIn(request, "Cert Issuer")
    const body = await completeWebDevelopment(request)

    const issued = body.data?.certificateIssued
    expect(issued, "auto-issue should return the certificate").toBeTruthy()
    expect(issued.number).toMatch(CERT_NUMBER_RE)
    expect(issued.verifyUrl).toContain(`/verify/${issued.number}`)

    await myCertificateNumber(request)
  })

  test("does not issue duplicates on re-completion", async ({ request }) => {
    await registerAndSignIn(request, "Cert Dupes")
    await completeWebDevelopment(request)

    const second = await completeWebDevelopment(request)
    expect(second.data?.certificateIssued, "re-completion must not re-issue").toBeNull()

    const mine = await (await request.get("/api/me/certificates")).json()
    expect(mine.data.certificates.length).toBe(1)
  })

  test("verifies a certificate publicly (VALID state)", async ({ request }) => {
    await registerAndSignIn(request, "Cert Verify")
    const body = await completeWebDevelopment(request)
    const number = body.data.certificateIssued.number as string

    const api = await (await request.get(`/api/verify/${number}`)).json()
    expect(api.data.certificate.status).toBe("VALID")
    expect(api.data.certificate.number).toBe(number)

    const page = await request.get(`/verify/${number}`)
    expect(page.status()).toBe(200)
    const html = await page.text()
    expect(html).toContain("Certificate Verified")
    expect(html).toContain("Cert Verify")
  })

  test("renders the verify page on mobile viewports", async ({ request, browser }) => {
    await registerAndSignIn(request, "Cert Mobile")
    const body = await completeWebDevelopment(request)
    const number = body.data.certificateIssued.number as string

    const mobile = await browser.newContext({ viewport: { width: 390, height: 844 } })
    const page = await mobile.newPage()
    await page.goto(`/verify/${number}`)
    await expect(page.locator("h1")).toBeVisible()
    await expect(page.getByText("Certificate Verified")).toBeVisible()
    await expect(page.getByText(/^CM-\d{4}-\d{6}$/)).toBeVisible()
    await mobile.close()
  })

  test("reports INVALID for unknown numbers", async ({ request }) => {
    const api = await (await request.get("/api/verify/CM-1999-000001")).json()
    expect(api.data.status).toBe("INVALID")

    const page = await request.get("/verify/CM-1999-000001")
    expect(page.status()).toBe(200)
    expect(await page.text()).toContain("Certificate not found")
  })

  test("shows REVOKED and SUPERSEDED states", async ({ request }) => {
    await registerAndSignIn(request, "Cert States")
    const body = await completeWebDevelopment(request)
    const number = body.data.certificateIssued.number as string

    await db.certificate.update({
      where: { number },
      data: { status: "REVOKED", revokedAt: new Date(), revokeReason: "e2e test" },
    })
    const revokedApi = await (await request.get(`/api/verify/${number}`)).json()
    expect(revokedApi.data.certificate.status).toBe("REVOKED")
    const revokedPage = await request.get(`/verify/${number}`)
    expect(await revokedPage.text()).toContain("Certificate Revoked")

    await db.certificate.update({ where: { number }, data: { status: "SUPERSEDED" } })
    const supersededPage = await request.get(`/verify/${number}`)
    expect(await supersededPage.text()).toContain("Superseded by a newer version")
  })

  test("QR code encodes the verification URL and decodes", async ({ request }) => {
    await registerAndSignIn(request, "Cert QR")
    const body = await completeWebDevelopment(request)
    const number = body.data.certificateIssued.number as string

    const qrRes = await request.get(`/api/certificates/${number}/qr`)
    expect(qrRes.status()).toBe(200)
    expect(qrRes.headers()["content-type"]).toContain("image/png")
    const png = PNG.sync.read(Buffer.from(await qrRes.body()))
    const decoded = jsQR(new Uint8ClampedArray(png.data.buffer), png.width, png.height)
    expect(decoded?.data).toBe(`${BASE}/verify/${number}`)

    const resolved = await request.get(decoded!.data)
    expect(resolved.status()).toBe(200)
  })

  test("downloads PDF via the download and generate endpoints", async ({ request }) => {
    await registerAndSignIn(request, "Cert PDF")
    const body = await completeWebDevelopment(request)
    const number = body.data.certificateIssued.number as string

    const download = await request.get(`/api/certificates/${number}/download`)
    expect(download.status()).toBe(200)
    expect(download.headers()["content-type"]).toContain("application/pdf")
    const pdf = Buffer.from(await download.body())
    expect(pdf.subarray(0, 5).toString("latin1")).toBe("%PDF-")
    expect(pdf.length).toBeGreaterThan(1000)

    const generate = await request.post("/api/certificates/generate", {
      data: {
        data: { courseName: "Web Development", subjectName: "web-development" },
        options: { template: "classic" },
      },
    })
    expect(generate.status()).toBe(200)
    expect(generate.headers()["content-type"]).toContain("application/pdf")
    const genPdf = Buffer.from(await generate.body())
    expect(genPdf.subarray(0, 5).toString("latin1")).toBe("%PDF-")

    // Ineligible subject → the access gate must deny (403)
    const subjects = await (await request.get("/api/subjects?withCounts=true")).json()
    const other = subjects.data.find((s: any) => s.tutorialCount > 1)
    expect(other, "a multi-tutorial subject should exist").toBeTruthy()
    const denied = await request.post("/api/certificates/generate", {
      data: { data: { courseName: other.name, subjectName: other.slug } },
    })
    expect(denied.status()).toBe(403)
  })

  test("enforces ownership and admin-only access", async ({ request, playwright }) => {
    await registerAndSignIn(request, "Cert Owner")
    const body = await completeWebDevelopment(request)
    const number = body.data.certificateIssued.number as string

    // Owner can read the detail endpoint
    const owner = await (await request.get(`/api/certificates/${number}`)).json()
    expect(owner.data.certificate.number).toBe(number)

    // Anonymous (fresh context, no cookies) → 401
    const anonCtx = await playwright.request.newContext({ baseURL: BASE })
    const anonymous = await anonCtx.get(`/api/certificates/${number}`)
    expect(anonymous.status()).toBe(401)
    await anonCtx.dispose()

    // Another user → 403
    const otherCtx = await playwright.request.newContext({ baseURL: BASE })
    const otherEmail = `other-${Date.now()}@test.dev`
    await otherCtx.post("/api/auth/register", {
      data: { name: "Other User", email: otherEmail, password: "Other123!" },
    })
    await signInWithContext(otherCtx, otherEmail, "Other123!")
    const otherRes = await otherCtx.get(`/api/certificates/${number}`)
    expect(otherRes.status()).toBe(403)
    await otherCtx.dispose()

    // Non-admin cannot reach admin endpoints
    const admin = await request.get("/api/admin/certificates")
    expect([401, 403]).toContain(admin.status())
  })
})
