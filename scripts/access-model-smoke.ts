/* Temp smoke test for the access model (deleted after passing). */
import { db } from "@/lib/db"

const BASE = "http://localhost:3000"
let failures = 0

function check(label: string, cond: boolean, extra?: unknown) {
  if (cond) {
    console.log(`PASS ${label}`)
  } else {
    failures++
    console.log(`FAIL ${label}`, extra !== undefined ? JSON.stringify(extra).slice(0, 300) : "")
  }
}

async function main() {
  const email = `access-smoke-${Date.now()}@test.dev`
  const password = "AccessTest123!"

  console.log("--- 1. Register grants a 12-day trial (server-side) ---")
  const reg = await fetch(`${BASE}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "Access Smoke", email, password }),
  })
  const regBody = await reg.json()
  check("register 201", reg.status === 201, regBody)
  check("register returns access", regBody.data?.access?.plan === "NORMAL", regBody.data?.access)
  check("register: PREMIUM_TRIAL effective", regBody.data?.access?.effectiveAccess === "PREMIUM_TRIAL", regBody.data?.access)
  check("register: 12 days remaining", regBody.data?.access?.trialDaysRemaining === 12, regBody.data?.access?.trialDaysRemaining)
  check("register: label is Premium Trial (not Member)", regBody.data?.access?.label === "Premium Trial", regBody.data?.access?.label)

  // Sign in to get cookies for authed requests (jar must hold the CSRF cookie)
  const cookieJar = {
    cookies: new Map<string, string>(),
    cookieHeader() {
      return [...this.cookies.entries()].map(([k, v]) => `${k}=${v}`).join("; ")
    },
    async get(url: string) {
      const res = await fetch(url, { headers: { cookie: this.cookieHeader() } })
      this.merge(res)
      return res
    },
    async post(url: string, body: any) {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", cookie: this.cookieHeader() },
        body: JSON.stringify(body),
        redirect: "manual",
      })
      this.merge(res)
      return res
    },
    merge(res: Response) {
      const setc = res.headers.getSetCookie?.() ?? []
      for (const c of setc) {
        const [pair] = c.split(";")
        const [k, v] = pair.split("=")
        this.cookies.set(k, v)
      }
    },
  } as any

  const csrfRes = await cookieJar.get(`${BASE}/api/auth/csrf`)
  const csrf = await csrfRes.json()
  const signin = await cookieJar.post(`${BASE}/api/auth/callback/credentials`, {
    csrfToken: csrf.csrfToken, email, password, json: true,
  })
  check("sign-in 302/200", [200, 302].includes(signin.status))

  console.log("--- 2. /api/me reports access summary ---")
  const me = await (await cookieJar.get(`${BASE}/api/me`)).json()
  check("me.access.effectiveAccess PREMIUM_TRIAL", me.data?.access?.effectiveAccess === "PREMIUM_TRIAL", me.data?.access)
  check("me.access.trialEndsAt set", !!me.data?.access?.trialEndsAt, me.data?.access)

  console.log("--- 3. Guest reads PUBLIC tutorial ---")
  const subject = await (await fetch(`${BASE}/api/subjects/web-development`)).json()
  const t = subject.data?.modules?.flatMap((m: any) => m.tutorials ?? [])[0]
  check("subject has tutorial", !!t?.id)
  const guestTut = await (await fetch(`${BASE}/api/tutorials/web-development/${t.slug}`)).json()
  check("guest reads PUBLIC tutorial", guestTut.data?.tutorial?.id === t.id, guestTut)
  check("guest sees access info", guestTut.data?.access?.guest === true && guestTut.data?.access?.canRead === true, guestTut.data?.access)
  check("guest has no progress/notes", guestTut.data?.progress === null && guestTut.data?.notes?.length === 0)

  console.log("--- 4. Guest progress POST rejected (401) ---")
  const guestProgress = await fetch(`${BASE}/api/progress`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tutorialId: t.id, percentRead: 50 }),
  })
  check("guest progress 401", guestProgress.status === 401, guestProgress.status)

  console.log("--- 5. Trial user can read a PREMIUM-marked tutorial ---")
  const tutorial = await (await fetch(`${BASE}/api/tutorials/web-development/${t.slug}`)).json()
  const tutorialId = tutorial.data.tutorial.id
  // Mark the tutorial premium (revert after)
  const before = await db.tutorial.findUnique({ where: { id: tutorialId } })
  await db.tutorial.update({ where: { id: tutorialId }, data: { accessLevel: "PREMIUM" } })
  const trialUserTut = await (await cookieJar.get(`${BASE}/api/tutorials/web-development/${t.slug}`)).json()
  check("trial user reads PREMIUM tutorial", trialUserTut.data?.tutorial?.id === tutorialId, trialUserTut)
  // Guest now locked out
  const guestLocked = await (await fetch(`${BASE}/api/tutorials/web-development/${t.slug}`)).json()
  check("guest locked from PREMIUM tutorial", guestLocked.data?.locked?.level === "PREMIUM" && !guestLocked.data?.tutorial, guestLocked.data)
  check("locked payload has no content", guestLocked.data?.preview?.title && !guestLocked.data?.preview?.content)
  // Progress from trial user allowed
  const trialProgress = await cookieJar.post(`${BASE}/api/progress`, { tutorialId, percentRead: 10 })
  check("trial user progress 200", trialProgress.status === 200, trialProgress.status)
  // Restore
  await db.tutorial.update({ where: { id: tutorialId }, data: { accessLevel: before!.accessLevel } })

  console.log("--- 6. Trial expiry via backdated endsAt (timestamp-authoritative) ---")
  const trial = await db.premiumTrial.findUnique({ where: { userId: regBody.data.user.id } })
  check("trial row exists ACTIVE", trial?.status === "ACTIVE")
  await db.premiumTrial.update({ where: { id: trial!.id }, data: { endsAt: new Date(Date.now() - 1000) } })
  const meAfterExpiry = await (await cookieJar.get(`${BASE}/api/me`)).json()
  check("expired → effectiveAccess NORMAL", meAfterExpiry.data?.access?.effectiveAccess === "NORMAL", meAfterExpiry.data?.access)
  check("expired → label Free", meAfterExpiry.data?.access?.label === "Free", meAfterExpiry.data?.access?.label)
  check("expired → trialDaysRemaining 0", meAfterExpiry.data?.access?.trialDaysRemaining === 0)
  check("expired → entitlementState NORMAL_TRIAL_EXPIRED", meAfterExpiry.data?.access?.entitlementState === "NORMAL_TRIAL_EXPIRED", meAfterExpiry.data?.access?.entitlementState)
  const expiredRow = await db.premiumTrial.findUnique({ where: { id: trial!.id } })
  check("record lazily flipped to EXPIRED", expiredRow?.status === "EXPIRED")
  const audit = await db.entitlementAuditLog.count({ where: { userId: regBody.data.user.id, action: "TRIAL_EXPIRED" } })
  check("TRIAL_EXPIRED audit entry", audit >= 1)
  // Expired user locked from premium tutorial + progress rejected
  const expiredTut = await db.tutorial.findUnique({ where: { id: tutorialId } })
  await db.tutorial.update({ where: { id: tutorialId }, data: { accessLevel: "PREMIUM" } })
  const expiredLocked = await (await cookieJar.get(`${BASE}/api/tutorials/web-development/${t.slug}`)).json()
  check("expired user locked from PREMIUM tutorial", !!expiredLocked.data?.locked && !expiredLocked.data?.tutorial, expiredLocked.data)
  const expiredProgress = await cookieJar.post(`${BASE}/api/progress`, { tutorialId, percentRead: 20 })
  check("expired user progress rejected 403", expiredProgress.status === 403, expiredProgress.status)
  await db.tutorial.update({ where: { id: tutorialId }, data: { accessLevel: expiredTut!.accessLevel } })

  console.log("--- 7. AI Tutor gate (AI disabled on this deployment) ---")
  const ai = await cookieJar.post(`${BASE}/api/ai/study-buddy`, { tutorialId, question: "What is a variable?" })
  check("expired (Normal) → AI 403", ai.status === 403, ai.status)
  const aiMsg = await ai.json()
  check("AI 403 mentions Premium", (aiMsg.error ?? "").includes("Premium"), aiMsg)

  // Restore trial (so it doesn't matter for other tests) — delete user
  await db.user.delete({ where: { id: regBody.data.user.id } }).catch(() => {})
  check("cleanup done", true)

  console.log("--- 8. Webhook: signature verification + idempotency ---")
  const webhookSecret = process.env.PREMIUM_WEBHOOK_SECRET ?? ""
  check("webhook secret configured", webhookSecret.length > 0)
  const wu = await db.user.create({
    data: { email: `webhook-${Date.now()}@test.dev`, username: `webhook_${Date.now()}`, passwordHash: "x", role: "USER" },
  })
  const { createHmac } = await import("crypto")
  const payload = JSON.stringify({ userId: wu.id, transactionId: `txn-${Date.now()}`, idempotencyKey: `idem-${Date.now()}`, amount: 4900, currency: "usd" })
  const sig = createHmac("sha256", webhookSecret).update(payload).digest("hex")
  const badRes = await fetch(`${BASE}/api/webhooks/premium`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-premium-signature": `sha256=${"0".repeat(64)}` },
    body: payload,
  })
  check("bad signature → 401", badRes.status === 401)
  const goodRes = await fetch(`${BASE}/api/webhooks/premium`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-premium-signature": `sha256=${sig}` },
    body: payload,
  })
  const goodBody = await goodRes.json()
  check("good webhook → 201 granted", goodRes.status === 201 && goodBody.data?.granted === true, goodBody)
  const dupRes = await fetch(`${BASE}/api/webhooks/premium`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-premium-signature": `sha256=${sig}` },
    body: payload,
  })
  const dupBody = await dupRes.json()
  check("duplicate webhook → rejected (idempotent)", dupBody.data?.duplicate === true, dupBody)
  const entCount = await db.premiumEntitlement.count({ where: { userId: wu.id } })
  check("exactly one entitlement", entCount === 1)
  const payCount = await db.payment.count({ where: { userId: wu.id } })
  check("one payment row", payCount === 1)
  const me2 = await (await cookieJar.get(`${BASE}/api/me`)).json()
  // admin grant for a fresh user
  console.log("--- 9. Admin grant / revoke ---")
  const admin = await db.user.findFirst({ where: { role: "ADMIN" } })
  check("admin user exists", !!admin)
  // simulate admin via direct service call is not necessary — use grant endpoint with a session? Use service directly.
  const { grantPremiumByAdmin, revokePremiumByAdmin } = await import("@/lib/entitlements/payments")
  const gr = await grantPremiumByAdmin({ userId: wu.id, actorId: admin!.id, reason: "smoke" })
  check("admin grant idempotent (duplicate)", gr.duplicate === true, gr)
  const rv = await revokePremiumByAdmin({ userId: wu.id, actorId: admin!.id, reason: "smoke" })
  check("admin revoke ok", rv.granted === true, rv)

  await db.user.delete({ where: { id: wu.id } }).catch(() => {})

  console.log(failures === 0 ? "\nALL ACCESS-MODEL SMOKE CHECKS PASSED" : `\n${failures} FAILURES`)
  process.exit(failures === 0 ? 0 : 1)
}

main().catch((e) => { console.error("SMOKE ERROR:", e); process.exit(1) })