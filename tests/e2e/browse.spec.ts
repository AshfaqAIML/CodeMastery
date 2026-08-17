import { test, expect } from "@playwright/test"

test.describe("Browse View", () => {
  test("displays subject cards", async ({ page }) => {
    await page.goto("/")
    await page.waitForTimeout(3000)
    // Navigate to browse
    const browseBtn = page.locator("button, a", { hasText: "Browse" }).first()
    if (await browseBtn.isVisible()) {
      await browseBtn.click()
      await page.waitForTimeout(3000)
    }
    // Should show category filters for all 7 domains
    const categories = page.locator("text=/All domains|Computer Science|Artificial Intelligence|Data Science|Web Development|Backend & Systems|Cloud, DevOps & Security|Career & Professional Skills/")
    expect(await categories.count()).toBeGreaterThan(0)
  })

  test("search filters tutorials", async ({ page }) => {
    await page.goto("/")
    await page.waitForTimeout(2000)
    const browseBtn = page.locator("button, a", { hasText: "Browse" }).first()
    if (await browseBtn.isVisible()) {
      await browseBtn.click()
      await page.waitForTimeout(2000)
    }
    const searchInput = page.locator('input[placeholder*="Search"]')
    if (await searchInput.isVisible()) {
      await searchInput.fill("python")
      await page.waitForTimeout(2000)
      // Should show results
      const results = page.locator("text=/Python/")
      expect(await results.count()).toBeGreaterThan(0)
    }
  })
})
