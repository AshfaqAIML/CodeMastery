import { test, expect } from "@playwright/test"

test.describe.configure({ timeout: 120_000 })

// The Google button only renders when NEXT_PUBLIC_GOOGLE_CLIENT_ID is set
// (see .env.example) — skip the UI assertions when it isn't configured.
const googleConfigured = !!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID

test("sign-in modal shows Continue with Google when configured", async ({ page }) => {
  test.skip(!googleConfigured, "NEXT_PUBLIC_GOOGLE_CLIENT_ID not set")

  await page.goto("/")
  await page.getByRole("button", { name: /Sign in/i }).first().click({ timeout: 60_000 })
  await expect(page.getByRole("heading", { name: /Welcome back/ })).toBeVisible({ timeout: 60_000 })

  const googleBtn = page.getByRole("button", { name: /Continue with Google/ })
  await expect(googleBtn).toBeVisible()

  // The modal also exposes Forgot password from the login form.
  await expect(page.getByRole("button", { name: /Forgot password/i })).toBeVisible()
})

test("login form links to Forgot password and back", async ({ page }) => {
  await page.goto("/")
  await page.getByRole("button", { name: /Sign in/i }).first().click({ timeout: 60_000 })
  await expect(page.getByRole("heading", { name: /Welcome back/ })).toBeVisible({ timeout: 60_000 })

  const forgot = page.getByRole("button", { name: /Forgot password/i })
  await expect(forgot).toBeVisible()
  await forgot.click()
  await expect(page.getByRole("heading", { name: /Reset your password/ })).toBeVisible()
  await expect(page.getByRole("button", { name: /Send reset link/ })).toBeVisible()

  // Back arrow returns to the login form.
  await page.getByRole("button", { name: /Back to sign in/ }).click()
  await expect(page.getByRole("heading", { name: /Welcome back/ })).toBeVisible()
})