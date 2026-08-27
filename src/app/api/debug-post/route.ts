import { NextRequest } from "next/server"
import { ok } from "@/lib/api"
import { getToken } from "next-auth/jwt"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function POST(req: NextRequest) {
  const cookieHeader = req.headers.get("cookie") ?? "none"
  const allCookies = Array.from(req.cookies.entries()).map(([k]) => k)

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  const session = await getServerSession(authOptions)

  return ok({
    cookieHeaderLength: cookieHeader.length,
    cookieNames: allCookies,
    tokenUserId: token?.id ?? null,
    tokenRole: token?.role ?? null,
    sessionUser: (session?.user as Record<string, unknown>)?.id ?? null,
  })
}

export async function GET(req: NextRequest) {
  const cookieHeader = req.headers.get("cookie") ?? "none"
  const allCookies = Array.from(req.cookies.entries()).map(([k]) => k)

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  const session = await getServerSession(authOptions)

  return ok({
    cookieHeaderLength: cookieHeader.length,
    cookieNames: allCookies,
    tokenUserId: token?.id ?? null,
    tokenRole: token?.role ?? null,
    sessionUser: (session?.user as Record<string, unknown>)?.id ?? null,
  })
}
