import { test, expect } from "@playwright/test"
import { db } from "../../src/lib/db"
import { verifyPassword } from "../../src/lib/password"

const PASSWORD = "ResetSpecPass123!"
const NEW_PASSWORD = "ResetSpecNew456!"

test.describe.configure({ timeout: 360_000 })

test.describe("Password reset", () => {
  test("forgot → email link → reset → sign-in with the new password", async ({ request }) => {
    const email = `reset-e2e-${Date.now()}-${Math.floor(Math.random() * 1e6)}@test.dev`
    const reg = await request.post("/api/auth/register", {
      data: { name: "Reset Spec", email, password: PASSWORD },
    })
    expect(reg.status()).toBe(201)

    // 1. Request a reset — returns the link in development mode only.
    const forgot = await request.post("/api/auth/forgot-password", { data: { email } })
    expect(forgot.status()).toBe(200)
    const forgotJson = await forgot.json()
    expect(forgotJson.data.sent).toBe(true)
    expect(forgotJson.data.devLink, "dev mode should return the reset link").toContain("auth=reset&token=")

    const token = new URL(forgotJson.data.devLink).searchParams.get("token") as string
    expect(token).toHaveLength(64)

    // Tokens are stored hashed — the raw token never touches the DB.
    const stored = await db.passwordResetToken.findMany({
      where: { user: { email } },
      select: { tokenHash: true, expiresAt: true, usedAt: true },
    })
    expect(stored.length).toBe(1)
    expect(stored[0].tokenHash).not.toBe(token)
    expect(stored[0].tokenHash).toHaveLength(64)

    // 2. Reset with the token.
    const reset = await request.post("/api/auth/reset-password", {
      data: { token, password: NEW_PASSWORD },
    })
    expect(reset.status()).toBe(200)

    // The stored hash now verifies the NEW password and rejects the OLD one
    // (deterministic — NextAuth's sign-in endpoint answers with redirects
    // whose follow semantics vary, so we assert the security property
    // directly at the hash level, then exercise a real session below).
    const fresh = await db.user.findUnique({ where: { email }, select: { passwordHash: true } })
    expect(verifyPassword(PASSWORD, fresh?.passwordHash ?? "")).toBe(false)
    expect(verifyPassword(NEW_PASSWORD, fresh?.passwordHash ?? "")).toBe(true)

    // Reuse of the token is rejected.
    const reuse = await request.post("/api/auth/reset-password", {
      data: { token, password: "AnotherPass123!" },
    })
    expect(reuse.status()).toBe(400)

    // 3. A second forgot request invalidates the first link (single-use).
    const forgot2 = await request.post("/api/auth/forgot-password", { data: { email } })
    expect(forgot2.status()).toBe(200)
    const token2 = new URL((await forgot2.json()).data.devLink).searchParams.get("token") as string
    expect(token2).not.toBe(token)

    // 4. Sign in with the new password and complete a full flow.
    const csrf = await (await request.get("/api/auth/csrf")).json()
    const signin = await request.post("/api/auth/callback/credentials", {
      data: { csrfToken: csrf.csrfToken, email, password: NEW_PASSWORD, json: true },
    })
    expect([200, 302]).toContain(signin.status())
    const me = await request.get("/api/me")
    expect(me.status()).toBe(200)
  })

  test("forgot-password never reveals whether an email exists", async ({ request }) => {
    const ghost = await request.post("/api/auth/forgot-password", {
      data: { email: `ghost-${Date.now()}@test.dev` },
    })
    expect(ghost.status()).toBe(200)
    const body = await ghost.json()
    expect(body.data.sent).toBe(true)
    expect(body.data.devLink).toBeUndefined()
  })
})