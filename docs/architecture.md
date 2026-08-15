# Architecture

## High-level

CodeMastery is a Next.js 16 App Router application with a strict separation between the **presentation layer** (a single-page client app on `/`) and the **business/data layer** (REST route handlers under `/api/*`).

```
Browser (SPA on /)
    │ fetch /api/*
    ▼
Next.js Route Handlers (REST + JSON)
    │
    ├── Business services (gamification, progress, search...)
    │
    ├── Provider abstractions (Storage / AI / Search / Email)
    │
    └── Prisma ORM → SQLite (dev) / PostgreSQL (prod)
```

## Routing model

Because the production preview environment exposes only the `/` route, the web UI is a **client-side SPA**: the root `page.tsx` renders a shell that switches between views ("home", "browse", "tutorial", "dashboard", ...) based on a Zustand store (`src/lib/store.ts`). The server-side route handlers under `/api/*` are fully independent REST endpoints and can be reused by any client (web, mobile, third-party).

This keeps the API surface clean and portable while satisfying the single-route deployment constraint.

## Data layer

Prisma ORM with a single schema (`prisma/schema.prisma`) that works on both SQLite and PostgreSQL. To switch providers, change `DATABASE_PROVIDER` and `DATABASE_URL` in `.env` and re-push.

## Provider abstractions

Every external concern is behind an interface, selected via env vars:

| Concern  | Interface           | Default impl          | Alternate impls                         |
|----------|---------------------|-----------------------|-----------------------------------------|
| Storage  | `IStorageProvider`  | Local filesystem      | S3-compatible (R2, MinIO, B2, AWS)      |
| AI       | `AIProvider`        | (disabled)            | z-ai-web-dev-sdk, OpenAI-compatible      |
| Search   | `SearchService`     | DB (LIKE)             | Meilisearch, Elasticsearch (future)     |
| Email    | `EmailService`      | Console logger        | SMTP (nodemailer)                        |

The heavy SDKs (`@aws-sdk/client-s3`, `nodemailer`, `z-ai-web-dev-sdk`) are imported **lazily**, so they are only required when the corresponding provider is active. The core platform has zero hard optional dependencies.

## Authentication

NextAuth v4 with a credentials provider. Passwords are hashed with Node's built-in `scrypt` (constant-time compare, no bcrypt dependency). Sessions are JWT-based. Roles (`USER`, `ADMIN`) are added to the session via callbacks. OAuth providers can be added by editing `src/lib/auth.ts`.

## Gamification integrity

All XP/point/streak mutations happen **server-side** inside route handlers. The client never sends an XP value; it sends an *action* (read tutorial, complete quiz), and the server:

1. Verifies the action actually happened (progress recorded, quiz submitted with answers).
2. Enforces a daily XP cap (`DAILY_XP_CAP`).
3. Updates streak based on real activity dates.
4. Awards achievements by querying real metrics (tutorials completed, quizzes passed, etc.).

This prevents refresh farming, fake reading, and point manipulation.

## Security model

- Passwords: scrypt hashed (format `scrypt:<salt>:<hash>`).
- Sessions: JWT, 30-day max age.
- Auth endpoints: in-memory rate limiter (swap for Redis in multi-instance prod).
- Admin actions: server-side role check on every request.
- Input: Zod validation on all mutating endpoints.
- No client-supplied XP/points/streak values are ever trusted.
