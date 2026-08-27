import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { db } from "@/lib/db"
import { verifyPassword } from "@/lib/password"
import { rateLimit } from "@/lib/api"
import { recordAuditSafe } from "@/lib/audit"
import { isAdminRole } from "@/lib/authorization/service"
import { provisionOAuthUser } from "./oauth-provision"

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
    // Google OAuth — optional at runtime: providers are only enabled when
    // GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET are set (see .env.example).
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
  ],
  callbacks: {
    async signIn({ account, profile, user }) {
      // Only Google account linking needs guards; credentials flow is
      // fully handled inside authorize().
      if (account?.provider !== "google") return true
      const email = (profile?.email ?? user.email ?? "").trim().toLowerCase()
      if (!email) return false

      const existing = await db.user.findUnique({
        where: { email },
        select: { id: true, emailVerified: true },
      })
      if (!existing) {
        // First Google sign-in: no account yet — the jwt callback will
        // provision one (username, 12-day trial, audit).
        return true
      }

      // Account-takeover guard: Google emails are pre-verified by Google,
      // but the local register form does NOT verify emails. If an attacker
      // pre-registered someone else's address, auto-linking would hand the
      // victim's Google identity to a stranger. Link only into accounts
      // that already hold proof of ownership (emailVerified or an existing
      // Google link). Everyone else goes through forgot-password instead,
      // which proves ownership via their real inbox.
      if (existing.emailVerified) return true
      const linked = await db.account.findFirst({
        where: { provider: "google", userId: existing.id },
      })
      return !!linked
    },
    async jwt({ token, user, account, profile }) {
      if (user) {
        // Credentials path: authorize() already resolved the DB user and
        // attached role. OAuth users have no `role` — handled below.
        if (account?.provider === "google") {
          // Temporarily hijack the user param to detect OAuth sign-in.
          const email = (profile?.email ?? user.email ?? "").trim().toLowerCase()
          if (email) {
            let dbUser = await db.user.findUnique({
              where: { email },
              select: { id: true, role: true, status: true, image: true, name: true, emailVerified: true },
            })
            if (!dbUser) {
              // First Google sign-in — create the account exactly like the
              // register route does (username, trial, audits).
              const provisioned = await provisionOAuthUser(email, profile?.name ?? null, profile?.image ?? null)
              if (provisioned) {
                dbUser = { id: provisioned.id, role: "USER", status: "ACTIVE", image: provisioned.image, name: provisioned.name, emailVerified: new Date() }
                token.id = provisioned.id
                token.role = "USER"
                token.image = provisioned.image
                return token
              }
            } else {
              if (dbUser.status === "ACTIVE") {
                // Google verified this email — record verification on the
                // local account (the register form never sets this).
                if (!dbUser.emailVerified) {
                  await db.user.update({ where: { id: dbUser.id }, data: { emailVerified: new Date() } })
                }
                token.id = dbUser.id
                token.role = dbUser.role
                token.image = dbUser.image ?? profile?.image ?? null
                if (isAdminRole(dbUser.role)) {
                  await recordAuditSafe({
                    actorId: dbUser.id,
                    action: "ADMIN_LOGIN",
                    targetType: "user",
                    targetId: dbUser.id,
                    detail: `${dbUser.role} signed in via Google.`,
                  })
                }
              }
            }
          }
          return token
        }
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