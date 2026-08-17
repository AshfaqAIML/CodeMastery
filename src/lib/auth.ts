import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { db } from "@/lib/db"
import { verifyPassword } from "@/lib/password"
import { rateLimit } from "@/lib/api"
import { recordAuditSafe } from "@/lib/audit"
import { isAdminRole } from "@/lib/authorization/service"

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  pages: { signIn: "/" },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      // NextAuth v4: second arg is the incoming Request (app router).
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) return null
        const email = credentials.email.trim().toLowerCase()
        const ip = req?.headers?.get?.("x-forwarded-for")?.split(",")[0]?.trim() ?? "anon"

        // Rate limit per email+IP to slow credential stuffing on admin
        // accounts without locking out the whole platform.
        const rl = rateLimit(`login:${email}:${ip}`, 10, 60_000)
        if (!rl.ok) {
          await recordAuditSafe({
            action: "LOGIN_FAILED_LOCKOUT",
            targetType: "user",
            detail: `Login rate limit hit for ${email} (ip ${ip}).`,
            ip,
          })
          return null
        }

        const user = await db.user.findUnique({
          where: { email },
          select: {
            id: true,
            email: true,
            name: true,
            username: true,
            passwordHash: true,
            role: true,
            status: true,
            image: true,
          },
        })
        if (!user || !user.passwordHash) return null
        if (user.status !== "ACTIVE") return null
        if (!verifyPassword(credentials.password, user.passwordHash)) return null

        // Audit every successful admin / super-admin sign-in.
        if (isAdminRole(user.role)) {
          await recordAuditSafe({
            actorId: user.id,
            action: "ADMIN_LOGIN",
            targetType: "user",
            targetId: user.id,
            detail: `${user.role} signed in.`,
            ip,
            userAgent: req?.headers?.get?.("user-agent")?.slice(0, 300) ?? null,
          })
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name ?? user.username ?? user.email.split("@")[0],
          role: user.role,
          image: user.image ?? null,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as { role?: string }).role ?? "USER"
        token.image = (user as { image?: string | null }).image ?? null
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        if (token.image) session.user.image = token.image as string
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET ?? "codemastery-dev-secret-change-in-production-0x9f3a",
}

// Type augmentation for session user
declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      image?: string | null
      role: string
    }
  }
  interface User {
    role?: string
    image?: string | null
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string
    role?: string
    image?: string | null
  }
}