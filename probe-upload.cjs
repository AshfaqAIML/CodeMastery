const fs = require("fs")
const { PrismaClient } = require("@prisma/client")

const env = fs.readFileSync(".env", "utf8")
process.env.DATABASE_URL = env.match(/^DATABASE_URL=(.+)$/m)[1]

const BASE = process.argv[2] || "http://localhost:3000"
const jar = new Map()
function cookies() {
  return [...jar.entries()].map(([k, v]) => `${k}=${v}`).join("; ")
}
async function req(path, opts = {}) {
  const headers = { ...(opts.headers || {}) }
  if (jar.size) headers.Cookie = cookies()
  const res = await fetch(BASE + path, { ...opts, headers, redirect: "manual" })
  for (const c of res.headers.getSetCookie()) {
    const [pair] = c.split(";")
    const [k, v] = pair.split("=")
    jar.set(k, v)
  }
  return res
}

;(async () => {
  const db = new PrismaClient()
  const email = `upload-probe-${Date.now()}@test.dev`
  const reg = await (await req("/api/auth/register", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ name: "Upload Probe", email, password: "ProbeSpec123!" }),
  })).json()
  const uid = reg.data?.user?.id
  if (!uid) throw new Error("register failed: " + JSON.stringify(reg))
  await db.user.update({ where: { id: uid }, data: { role: "SUPER_ADMIN" } })
  await db.$disconnect()

  const csrf = await (await req("/api/auth/csrf")).json()
  await req("/api/auth/callback/credentials", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ csrfToken: csrf.csrfToken, email, password: "ProbeSpec123!", json: true }),
  })

  const png = Buffer.alloc(256 * 1024, 1).toString("base64")
  const up = await req("/api/admin/certificates/settings", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ signature: { name: "probe.png", mime: "image/png", base64: png } }),
  })
  const body = await up.text()
  console.log(BASE, "-> upload status:", up.status)
  console.log("body:", body.slice(0, 250))

  await req("/api/admin/certificates/settings", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ clearSignature: true }),
  })
  await db.$disconnect?.()
})().catch((e) => {
  console.error("PROBE-FAIL:", e.message)
  process.exit(1)
})
