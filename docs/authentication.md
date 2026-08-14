# Authentication

CodeMastery uses **NextAuth v4** with a credentials (email + password) provider by default. The architecture is provider-pluggable.

## How it works

- `src/lib/auth.ts` — NextAuth configuration (providers, callbacks, JWT, session).
- `src/app/api/auth/[...nextauth]/route.ts` — NextAuth route handler.
- `src/lib/password.ts` — scrypt-based password hashing (no external deps).
- `src/app/api/auth/register/route.ts` — registration endpoint.

Passwords are hashed with Node's built-in `scrypt`: format `scrypt:<salt-hex>:<hash-hex>`. Comparison uses `timingSafeEqual` to prevent timing attacks.

## JWT sessions

Sessions are JWT-based (30-day max age). The `id` and `role` are added to the token and surfaced on `session.user`. Server code uses `getServerSession(authOptions)` via `src/lib/session.ts`.

## Environment variables

```env
AUTH_SECRET=<openssl rand -base64 32>
NEXTAUTH_SECRET=<same value>
NEXTAUTH_URL=https://your-domain.com
```

## Adding OAuth providers

Install the provider and add it to `providers` in `src/lib/auth.ts`:

```ts
import GoogleProvider from "next-auth/providers/google"

providers: [
  CredentialsProvider({ /* ... */ }),
  GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  }),
]
```

Then set `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` in `.env`. The same pattern works for GitHub, Auth0, Okta, etc.

## Linking OAuth to existing accounts

If a user registers with email/password and later signs in via OAuth with the same email, NextAuth will, by default, create a separate session. To merge accounts, implement an `signIn` callback that links `Account` rows to the existing `User` by email.

## Rate limiting

Auth endpoints are rate-limited via the in-memory limiter in `src/lib/api.ts` (`RATE_LIMIT_AUTH_MAX` attempts per `RATE_LIMIT_AUTH_WINDOW_MS`). For multi-instance production, replace with a Redis-backed limiter.

## Roles

- `USER` (default) — can learn, track progress, earn XP, manage own content.
- `ADMIN` — additionally can manage subjects/tutorials/quizzes and export/import content.

Role is checked server-side on every admin endpoint via `getCurrentUser()`.

## Security notes

- Never trust client-supplied XP, points, streaks, or progress values — all mutations are server-derived.
- `AUTH_SECRET` must be ≥ 32 chars in production.
- Sessions invalidate when `AUTH_SECRET` changes.
