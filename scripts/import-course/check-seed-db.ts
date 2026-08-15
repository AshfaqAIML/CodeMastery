// Compares a seed file's declared content against the live database.
// Usage: bun scripts/import-course/check-seed-db.ts [seedFile]
// Exit code 0 when seed and DB agree; prints a diff otherwise.
import { PrismaClient } from "@prisma/client"
import { readFileSync } from "node:fs"
import { resolve } from "node:path"

const db = new PrismaClient()
const seedPath = resolve(process.argv[2] ?? "prisma/computer-science-foundations-seed.ts")
const src = readFileSync(seedPath, "utf8")

const subject = {
  slug: String(src.match(/const subject = \{[\s\S]*?slug: "([^"]+)"/)?.[1] ?? ""),
  name: String(src.match(/name: "([^"]+)"/)?.[1] ?? ""),
}
const FIELD = String.raw`\s*,\s*`
const QUOTED = String.raw`"((?:[^"\\]|\\.)*)"`
const modules = [...src.matchAll(new RegExp(String.raw`slug: "([^"]+)"${FIELD}title: "([^"]+)"${FIELD}summary: ${QUOTED}${FIELD}order: (\d+)${FIELD}difficulty: "([^"]+)"${FIELD}estimatedMinutes: (\d+)${FIELD}tutorials: \[`, "g"))].map(m => ({ slug: m[1], title: m[2], order: +m[4], difficulty: m[5], estimatedMinutes: +m[6] }))
const tutorials = [...src.matchAll(new RegExp(String.raw`slug: "([^"]+)"${FIELD}title: "([^"]+)"${FIELD}summary: ${QUOTED}${FIELD}difficulty: "([^"]+)"${FIELD}estimatedMinutes: (\d+)${FIELD}order: (\d+)${FIELD}tags: "([^"]*)"${FIELD}learningObjectives: \[`, "g"))].map(m => ({ slug: m[1], title: m[2], order: +m[6], difficulty: m[4], estimatedMinutes: +m[5] }))
const pathSlug = String(src.match(/const path = await db\.learningPath\.upsert\(\{[\s\S]*?where: \{ slug: "([^"]+)" \}/)?.[1] ?? "")
const pathStepsBody = (src.match(/const pathSteps[\s\S]*?= \[([\s\S]*?)\r?\n\s*\]\r?\n/) ?? [])[1] ?? ""
const pathSteps = [...pathStepsBody.matchAll(/tutorialSlug: "([^"]+)"/g)].map(m => m[1])

console.log(`seed declares: ${modules.length} modules, ${tutorials.length} tutorials, ${pathSteps.length} path steps`)

let failures = 0
const fail = (msg: string) => { failures++; console.log("  DIFF: " + msg) }

const srec = await db.subject.findUnique({ where: { slug: subject.slug } })
if (!srec) { console.log(`subject ${subject.slug} does not exist in DB`); process.exit(1) }
console.log(`subject: ${srec.name} (${subject.name})`)

const mrecs = await db.module.findMany({ where: { subjectId: srec.id } })
if (mrecs.length !== modules.length) fail(`module count ${mrecs.length} != seed ${modules.length}`)
for (const m of modules) {
  const found = mrecs.find(r => r.slug === m.slug)
  if (!found) { fail(`module ${m.slug} missing`); continue }
  if (found.order !== m.order || found.estimatedMinutes !== m.estimatedMinutes || found.difficulty !== m.difficulty) fail(`module ${m.slug} order/min/diff mismatch (db=${found.order}/${found.estimatedMinutes}/${found.difficulty} seed=${m.order}/${m.estimatedMinutes}/${m.difficulty})`)
}

const trecs = await db.tutorial.findMany({ where: { subjectId: srec.id }, include: { module: true } })
if (trecs.length !== tutorials.length) fail(`tutorial count ${trecs.length} != seed ${tutorials.length}`)
for (const t of tutorials) {
  const found = trecs.find(r => r.slug === t.slug)
  if (!found) { fail(`tutorial ${t.slug} missing`); continue }
  if (found.order !== t.order || found.estimatedMinutes !== t.estimatedMinutes || found.difficulty !== t.difficulty) fail(`tutorial ${t.slug} order/min/diff mismatch`)
}

if (pathSlug) {
  const prec = await db.learningPath.findUnique({ where: { slug: pathSlug }, include: { steps: { include: { tutorial: true }, orderBy: { order: "asc" } } } })
  const dbSteps = prec?.steps.map(s => s.tutorial?.slug ?? "(unlinked)") ?? []
  if (dbSteps.length !== pathSteps.length) fail(`path ${pathSlug} steps ${dbSteps.length} != seed ${pathSteps.length}`)
  pathSteps.forEach((slug, i) => { if (dbSteps[i] !== slug) fail(`path step ${i} ${slug} != db ${dbSteps[i]}`) })
  console.log(`path: ${prec?.title ?? "MISSING"} (${dbSteps.length} steps)`)
} else {
  console.log("path: (none declared in seed)")
}

await db.$disconnect()
console.log(failures ? `\n${failures} difference(s) found` : "\nseed and DB agree")
process.exit(failures ? 1 : 0)