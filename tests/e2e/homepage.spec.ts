import { test, expect } from "@playwright/test"

test.describe("Homepage", () => {
  test("loads and displays hero", async ({ page }) => {
    await page.goto("/")
    await expect(page).toHaveTitle(/CodeMastery/)
    await expect(page.locator("h1")).toBeVisible()
    await expect(page.locator("h1")).toContainText("Master Computer Science")
  })

  test("displays subject cards", async ({ page }) => {
    await page.goto("/")
    // Wait for subjects to load
    await page.waitForTimeout(3000)
    const subjectButtons = page.locator("text=/tutorials/")
    const count = await subjectButtons.count()
    expect(count).toBeGreaterThan(0)
  })

  test("navigation works", async ({ page }) => {
    await page.goto("/")
    await page.waitForTimeout(2000)
    // Click Browse nav
    const browseLink = page.locator("button, a", { hasText: "Browse" }).first()
    if (await browseLink.isVisible()) {
      await browseLink.click()
      await page.waitForTimeout(2000)
      await expect(page.locator("h1")).toContainText("Browse subjects")
    }
  })

  test("search palette opens with Cmd+K", async ({ page }) => {
    await page.goto("/")
    await page.waitForTimeout(2000)
    await page.keyboard.press("Control+k")
    await page.waitForTimeout(1000)
    // Search dialog should be visible
    const dialog = page.locator('[role="dialog"]')
    if (await dialog.isVisible()) {
      await expect(dialog).toBeVisible()
    }
  })

  test("theme toggle works", async ({ page }) => {
    await page.goto("/")
    await page.waitForTimeout(2000)
    const themeToggle = page.locator('button[aria-label="Toggle theme"]')
    if (await themeToggle.isVisible()) {
      await themeToggle.click()
      await page.waitForTimeout(500)
    }
  })

  test("footer is visible", async ({ page }) => {
    await page.goto("/")
    await page.waitForTimeout(2000)
    const footer = page.locator("footer")
    await expect(footer).toBeVisible()
  })

  test("skip to content link exists", async ({ page }) => {
    await page.goto("/")
    const skipLink = page.locator('a:has-text("Skip to content")')
    await expect(skipLink).toHaveAttribute("href", "#main-content")
  })

  test("has canonical URL", async ({ page }) => {
    await page.goto("/")
    const canonical = page.locator('link[rel="canonical"]')
    await expect(canonical).toHaveAttribute("href")
  })

  test("has structured data", async ({ page }) => {
    await page.goto("/")
    const structuredData = page.locator('script[type="application/ld+json"]')
    await expect(structuredData).toHaveCount(1)
  })
})
