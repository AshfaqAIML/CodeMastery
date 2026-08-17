import { test, expect, type APIRequestContext, type Page } from "@playwright/test"
import { db } from "../../src/lib/db"

const PASSWORD = "AccessTest123!"
const WELCOME_TIMEOUT = 30_000

test.describe.configure({ timeout: 240_000 })

/** Register a fresh user + sign in against a context so the browser shares the session cookie. */
async function registerAndSignIn(ctx: APIRequestContext, name: string) {
  const email = `access-e2e-${Date.now()}-${Math.floor(Math.random() * 1e6)}@test.dev`
  const reg = await ctx.post("/api/auth/register", { data: { name, email, password: PASSWORD } })
  expect(reg.status(), "register should succeed").toBe(201)
  const csrf = await (await ctx.get("/api/auth/csrf")).json()
  const signin = await ctx.post("/api/auth/callback/credentials", {
    data: { csrfToken: csrf.csrfToken, email, password: PASSWORD, json: true },
  })
  expect([200, 302], "sign-in should succeed").toContain(signin.status())
  return { email, name }
}

async function firstWebDevTutorial(ctx: APIRequestContext) {
  const subject = await (await ctx.get("/api/subjects/web-development")).json()
  const tutorial = subject.data?.modules?.flatMap((m: any) => m.tutorials ?? [])[0]
  expect(tutorial, "web-development should have a tutorial").toBeTruthy()
  return { ...(tutorial as { id: string; slug: string; title: string }), subjectName: subject.data.name as string }
}

/** First-time users get an onboarding dialog — dismiss it when present. */
async function dismissOnboarding(page: Page, waitMs = 2500) {
  const onboarding = page.getByRole("dialog", { name: /Welcome to CodeMastery/ })
  try {
    await onboarding.waitFor({ state: "visible", timeout: waitMs })
    await onboarding.getByRole("button", { name: "Skip" }).click()
  } catch {
    // no onboarding dialog present
  }
}

/** The app is a client-side SPA: navigate home → Browse → subject card → tutorial row. */
async function openTutorial(page: Page, subjectName: string, tutorialTitle: string, opts: { signedIn?: boolean } = {}) {
  await page.goto("/")
  await dismissOnboarding(page, opts.signedIn ? 15_000 : 2_500)
  await page.getByRole("button", { name: /^Browse$/ }).or(page.getByRole("button", { name: /^Browse tutorials$/ })).first().click({ timeout: 60_000 })
  await page
    .getByRole("button")
    .filter({ has: page.getByText(subjectName, { exact: true }) })
    .first()
    .click({ timeout: 60_000 })
  await page
    .getByRole("button")
    .filter({ has: page.getByText(tutorialTitle, { exact: true }) })
    .first()
    .click({ timeout: 60_000 })
  await expect(page.getByRole("heading", { name: new RegExp(tutorialTitle) })).toBeVisible()
}

/** Signed-in users reach the dashboard via the home CTA. */
async function openDashboard(page: Page) {
  await page.goto("/")
  await dismissOnboarding(page, 15_000)
  await expect(page.getByRole("heading", { name: /Welcome back/ })).toBeVisible({ timeout: WELCOME_TIMEOUT })
  await page.getByRole("button", { name: /Continue learning/ }).click({ timeout: 60_000 })
  await dismissOnboarding(page, 15_000)
  await expect(page.getByText(/Premium trial — \d+ days? remaining/)).toBeVisible()
}

test.describe("Access model: homepage states", () => {
  test("guest sees the start-journey CTA and no welcome-back", async ({ page }) => {
    await page.goto("/")
    await expect(page.getByRole("heading", { name: /Ready to start your journey/ })).toBeVisible()
    await expect(page.getByText(/free 12-day Premium trial/)).toBeVisible()
    await expect(page.getByRole("heading", { name: /Welcome back/ })).toHaveCount(0)
  })

  test("CTA flips to Welcome back after registering in-place (no page reload)", async ({ page }) => {
    const email = `home-ui-${Date.now()}@test.dev`
    await page.goto("/")
    await expect(page.getByRole("heading", { name: /Ready to start your journey/ })).toBeVisible()
    await page.getByRole("button", { name: /Create free account/ }).click()
    const dialog = page.getByRole("dialog")
    await expect(dialog).toBeVisible()
    await dialog.locator("#name").fill("Home UI Tester")
    await dialog.locator("#email").fill(email)
    await dialog.locator("#password").fill(PASSWORD)
    await dialog.getByRole("button", { name: /Create account/ }).click()
    // The session flips client-side and /api/me refetches — no reload required.
    await expect(page.getByRole("heading", { name: /Welcome back, Home/ })).toBeVisible({ timeout: WELCOME_TIMEOUT })
    await expect(page.getByText(/Premium trial — \d+d left/)).toBeVisible()
    await expect(page.getByRole("heading", { name: /Ready to start your journey/ })).toHaveCount(0)
  })

  test("signed-in user sees welcome-back CTA with trial badge", async ({ page }) => {
    const request = page.context().request
    const { name } = await registerAndSignIn(request, "Welcome Tester")
    await page.goto("/")
    await expect(page.getByRole("heading", { name: new RegExp(`Welcome back, ${name.split(" ")[0]}`) })).toBeVisible({ timeout: WELCOME_TIMEOUT })
    await expect(page.getByText(/Premium trial — \d+d left/)).toBeVisible()
    await expect(page.getByRole("heading", { name: /Ready to start your journey/ })).toHaveCount(0)
  })
})

test.describe("Access model: content gating", () => {
  test("guest can read a PUBLIC tutorial but gets no progress", async ({ page }) => {
    const request = page.context().request
    const tutorial = await firstWebDevTutorial(request)
    await openTutorial(page, tutorial.subjectName, tutorial.title)
    await expect(page.getByText(/PREMIUM content/)).toHaveCount(0)
    const prog = await request.post("/api/progress", { data: { tutorialId: tutorial.id, percentRead: 50 } })
    expect(prog.status(), "guest progress must be rejected").toBe(401)
  })

  test("guest sees a lock screen for PREMIUM tutorials (content never served)", async ({ page }) => {
    const request = page.context().request
    const tutorial = await firstWebDevTutorial(request)
    await db.tutorial.update({ where: { id: tutorial.id }, data: { accessLevel: "PREMIUM" } })
    try {
      await openTutorial(page, tutorial.subjectName, tutorial.title)
      await expect(page.getByText(/PREMIUM content/)).toBeVisible()
      await expect(page.getByRole("button", { name: /Create free account/ })).toBeVisible()
      await expect(page.locator("h2")).toHaveCount(0)
    } finally {
      await db.tutorial.update({ where: { id: tutorial.id }, data: { accessLevel: "PUBLIC" } })
    }
  })

  test("trial user can read a PREMIUM tutorial", async ({ page }) => {
    const request = page.context().request
    await registerAndSignIn(request, "Trial Reader")
    const tutorial = await firstWebDevTutorial(request)
    await db.tutorial.update({ where: { id: tutorial.id }, data: { accessLevel: "PREMIUM" } })
    try {
      await openTutorial(page, tutorial.subjectName, tutorial.title, { signedIn: true })
      await expect(page.getByText(/PREMIUM content/)).toHaveCount(0)
      await expect(page.locator("h2").first()).toBeVisible()
      const prog = await request.post("/api/progress", { data: { tutorialId: tutorial.id, percentRead: 10 } })
      expect(prog.status(), "trial user progress should be accepted").toBe(200)
    } finally {
      await db.tutorial.update({ where: { id: tutorial.id }, data: { accessLevel: "PUBLIC" } })
    }
  })
})

test.describe("Access model: trial lifecycle", () => {
  test("registration grants a real 12-day trial", async ({ page }) => {
    const request = page.context().request
    await registerAndSignIn(request, "Trial Lifey")
    const me = await (await request.get("/api/me")).json()
    expect(me.data.access.plan).toBe("NORMAL")
    expect(me.data.access.effectiveAccess).toBe("PREMIUM_TRIAL")
    expect(me.data.access.label).toBe("Premium Trial")
    expect(me.data.access.trialDaysRemaining).toBe(12)
    expect(me.data.access.trialEndsAt).toBeTruthy()
  })

  test("dashboard shows the trial banner with days remaining", async ({ page }) => {
    const request = page.context().request
    await registerAndSignIn(request, "Banner Tester")
    await openDashboard(page)
    await expect(page.getByText(/Premium trial — 12 days remaining/)).toBeVisible()
    await expect(page.getByRole("button", { name: /Unlock lifetime/ })).toBeVisible()
    await expect(page.getByText(/Your 12-day Premium trial has ended/)).toHaveCount(0)
  })

  test("expired trial locks premium content and flips the dashboard banner", async ({ page }) => {
    const request = page.context().request
    const { email } = await registerAndSignIn(request, "Expiry Tester")
    // Backdate the trial end (timestamp-authoritative expiry)
    const user = await db.user.findUnique({ where: { email } })
    expect(user, "user must exist").toBeTruthy()
    await db.premiumTrial.update({
      where: { userId: user!.id },
      data: { endsAt: new Date(Date.now() - 60_000) },
    })
    // Next access lazily flips the trial to EXPIRED
    const me = await (await request.get("/api/me")).json()
    expect(me.data.access.effectiveAccess).toBe("NORMAL")
    expect(me.data.access.label).toBe("Free")
    expect(me.data.access.trialDaysRemaining).toBe(0)
    const trial = await db.premiumTrial.findUnique({ where: { userId: user!.id } })
    expect(trial?.status, "trial row should be lazily expired").toBe("EXPIRED")
    const audit = await db.entitlementAuditLog.count({ where: { userId: user!.id, action: "TRIAL_EXPIRED" } })
    expect(audit, "expiry must be audited").toBe(1)

    // Dashboard shows the respectful expiry banner
    await page.goto("/")
    await dismissOnboarding(page, 15_000)
    await expect(page.getByRole("heading", { name: /Welcome back/ })).toBeVisible({ timeout: WELCOME_TIMEOUT })
    await page.getByRole("button", { name: /Continue learning/ }).click({ timeout: 60_000 })
    await dismissOnboarding(page, 15_000)
    await expect(page.getByText(/Your 12-day Premium trial has ended/)).toBeVisible()
    await expect(page.getByRole("button", { name: /Continue with free/ })).toBeVisible()
    await expect(page.getByRole("button", { name: /Unlock lifetime Premium/ })).toBeVisible()

    // Premium content now locked, and progress rejected server-side
    const tutorial = await firstWebDevTutorial(request)
    await db.tutorial.update({ where: { id: tutorial.id }, data: { accessLevel: "PREMIUM" } })
    try {
      await openTutorial(page, tutorial.subjectName, tutorial.title, { signedIn: true })
      await expect(page.getByText(/PREMIUM content/)).toBeVisible()
      await expect(page.getByRole("button", { name: /Unlock lifetime Premium/ })).toBeVisible()
      await expect(page.getByRole("button", { name: /Continue learning free/ })).toBeVisible()
      const prog = await request.post("/api/progress", { data: { tutorialId: tutorial.id, percentRead: 10 } })
      expect(prog.status(), "expired user progress must be rejected").toBe(403)
    } finally {
      await db.tutorial.update({ where: { id: tutorial.id }, data: { accessLevel: "PUBLIC" } })
    }
  })
})
