import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

export const dynamic = "force-dynamic"

export async function GET() {
  const cwd = process.cwd()
  const results: Record<string, unknown> = { cwd }

  for (const name of ["seal.png", "signature.png", "digital-seal.png"]) {
    // Test 1: cwd/public/certificates/
    const p1 = path.join(cwd, "public", "certificates", name)
    try {
      const data = await fs.readFile(p1)
      results[name] = { path: p1, size: data.length, ok: true, method: "cwd" }
    } catch (e: any) {
      // Test 2: relative path
      const p2 = path.join("public", "certificates", name)
      try {
        const data = await fs.readFile(p2)
        results[name] = { path: p2, size: data.length, ok: true, method: "relative" }
      } catch (e2: any) {
        // Test 3: absolute known path
        const p3 = "/var/task/public/certificates/" + name
        try {
          const data = await fs.readFile(p3)
          results[name] = { path: p3, size: data.length, ok: true, method: "abs" }
        } catch {
          results[name] = { cwd: p1, error1: e.message, error2: e2.message }
        }
      }
    }
  }

  return NextResponse.json(results)
}
