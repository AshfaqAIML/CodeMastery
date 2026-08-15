import { test, expect } from "@playwright/test"

test.setTimeout(180_000)

async function openTutorial(page, subjectName, tutorialTitle) {
  await page.goto("/", { waitUntil: "domcontentloaded" })
  await page.waitForTimeout(8000)
  const browseBtn = page.locator("button, a", { hasText: "Browse" }).first()
  if (await browseBtn.isVisible()) {
    await browseBtn.click()
    await page.waitForTimeout(3000)
  }
  await page.getByText(subjectName, { exact: true }).first().click()
  await page.waitForTimeout(3000)
  await page.getByText(tutorialTitle, { exact: true }).first().click()
  await page.waitForTimeout(4000)
}

test("chapter with MCQs renders questions and options", async ({ page }) => {
  await openTutorial(page, "Complete JavaScript for Absolute Beginners", "Chapter 5 — Variables")
  await expect(page.getByRole("heading", { name: "1. Which keyword creates a constant?" })).toBeVisible({ timeout: 15000 })
  await expect(page.getByText("A. var").first()).toBeVisible()
  await expect(page.getByText("Answer: C").first()).toBeVisible()
})

test("code fences render as pre blocks", async ({ page }) => {
  await openTutorial(page, "Complete JavaScript for Absolute Beginners", "Chapter 6 — Data Types")
  await expect(page.locator("pre").first()).toBeVisible({ timeout: 15000 })
  const pres = await page.locator("pre").count()
  expect(pres).toBeGreaterThan(2)
})

test("markdown tables render", async ({ page }) => {
  await openTutorial(page, "Complete JavaScript for Absolute Beginners", "Chapter 2 — Introduction to JavaScript")
  await expect(page.locator("table").first()).toBeVisible({ timeout: 15000 })
  const tables = await page.locator("table").count()
  expect(tables).toBeGreaterThan(0)
})

test("output labels render as headings", async ({ page }) => {
  await openTutorial(page, "Complete JavaScript for Absolute Beginners", "Chapter 5 — Variables")
  await expect(page.getByText("Output:", { exact: true }).first()).toBeVisible({ timeout: 15000 })
})

test("project page renders overview and code", async ({ page }) => {
  await openTutorial(page, "Complete JavaScript for Absolute Beginners", "Project 3 — To-Do List Application")
  await expect(page.getByText("Project Overview", { exact: true })).toBeVisible({ timeout: 15000 })
  await expect(page.locator("pre").first()).toBeVisible()
})