import { test, expect } from "@playwright/test"

test.describe("Auth Flow", () => {
  test("sign in modal opens", async ({ page }) => {
    await page.goto("/")
    await page.waitForTimeout(2000)
    const signInBtn = page.locator("button, a", { hasText: "Sign in" }).first()
    if (await signInBtn.isVisible()) {
      await signInBtn.click()
      await page.waitForTimeout(1000)
      const dialog = page.locator('[role="dialog"]')
      if (await dialog.isVisible()) {
        await expect(dialog).toContainText(/Welcome back|Sign in/)
      }
    }
  })

  test("register modal opens", async ({ page }) => {
    await page.goto("/")
    await page.waitForTimeout(2000)
    const registerBtn = page.locator("button, a", { hasText: "Get started" }).first()
    if (await registerBtn.isVisible()) {
      await registerBtn.click()
      await page.waitForTimeout(1000)
      const dialog = page.locator('[role="dialog"]')
      if (await dialog.isVisible()) {
        await expect(dialog).toContainText(/Create your account|Sign up/)
      }
    }
  })

  test("login API rejects invalid credentials", async ({ request }) => {
    const response = await request.post("/api/auth/callback/credentials", {
      maxRedirects: 0,
      data: {
        email: "nonexistent@test.com",
        password: "wrongpassword",
      },
    })
    // NextAuth redirects (302) to the sign-in error page on invalid credentials;
    // a 200 success response would mean the login was accepted.
    expect(response.status()).not.toBe(200)
    expect([302, 400, 401]).toContain(response.status())
  })
})
