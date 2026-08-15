# CodeMastery

> A production-grade **Computer Science & AI Engineering learning platform** — structured tutorials, quizzes, gamified progress (XP, levels, streaks, achievements), leaderboards, learning paths, and analytics. Built with Next.js 16, TypeScript, Tailwind CSS, shadcn/ui, Prisma, and NextAuth.

![status](https://img.shields.io/badge/status-active-success) ![stack](https://img.shields.io/badge/stack-Next.js%2016%20%7C%20TS%20%7C%20Prisma%20%7C%20Tailwind-blue) ![license](https://img.shields.io/badge/license-MIT-green)

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Architecture](#architecture)
4. [Technology Stack](#technology-stack)
5. [Prerequisites](#prerequisites)
6. [Local Development](#local-development)
7. [Environment Variables](#environment-variables)
8. [Database Setup](#database-setup)
9. [Authentication Setup](#authentication-setup)
10. [Storage Setup](#storage-setup)
11. [Running Tests](#running-tests)
12. [Building for Production](#building-for-production)
13. [Docker Setup](#docker-setup)
14. [Deployment](#deployment)
15. [Migration](#migration)
16. [Backup & Restore](#backup--restore)
17. [Content Management](#content-management)
18. [API Documentation](#api-documentation)
19. [Troubleshooting](#troubleshooting)
20. [Platform Migration Guide](#platform-migration-guide)

---

## Project Overview

CodeMastery is a single, structured learning destination for Computer Science — from C and Python fundamentals through Data Structures & Algorithms, Operating Systems, Networks, DBMS, to Machine Learning, Deep Learning, LLMs, System Design, and interview prep.

The platform combines:

- **Deep, technically-accurate tutorials** written in Markdown and rendered with syntax-highlighted code, callouts, and a comfortable reading experience.
- **A learning model** with progress tracking, reading progress, bookmarks, and notes.
- **Gamification** (XP, levels, streaks, achievements, leaderboards) designed to reward *meaningful* learning, not farming.
- **Learning paths** that sequence tutorials into coherent journeys.
- **Quizzes** tied to tutorials with server-side verified scoring.

### Design Principles

- **Platform-independent**: No hard dependency on any specific cloud, AI provider, database, storage, or auth vendor. Everything is behind an abstraction and configured via environment variables.
- **API-first**: A clean REST API under `/api/*` backs every feature, so the same backend can serve a web UI, a future mobile app, or third-party integrations.
- **Content-portable**: Tutorials are stored as Markdown and exportable to JSON at any time.
- **Secure by default**: Server-side validation for all business logic, password hashing with scrypt, rate limiting on auth, role-based admin checks.

---

## Features

### Learning
- Structured subjects → modules → tutorials hierarchy
- Rich tutorial reader with table of contents, reading progress, prev/next navigation
- Bookmarks and per-tutorial notes (anchored to headings)
- Search across all tutorials
- Learning paths (curated journeys across subjects)
- Quizzes with explanations and passing thresholds

### Gamification
- XP and levels (server-verified, quadratic curve)
- Daily streaks (timezone-aware, server-tracked)
- Achievements (learning, streak, skill, milestone categories)
- Leaderboards (weekly / all-time)
- Daily XP cap to prevent farming
- Activity log of all XP-earning actions

### Account
- Email/password authentication (NextAuth, credentials provider)
- Profile with bio, avatar, experience level, learning goal
- Onboarding flow
- Dark / light theme
- Personal dashboard with stats, continue-learning, recent activity

### Admin
- Content management (subjects, modules, tutorials, quizzes)
- User role management
- Content export/import (JSON) for portability

---

## Architecture

```
┌──────────────────────────────────────────────────────────┐
│                        Browser (SPA)                      │
│  React + Tailwind + shadcn/ui — client-side view routing  │
└─────────────────────────────┬────────────────────────────┘
                              │  fetch /api/*
┌─────────────────────────────┴────────────────────────────┐
│              Next.js 16 App Router (Server)               │
│   Route Handlers under /api/* — REST + JSON               │
│   NextAuth (credentials, JWT sessions, role-augmented)    │
└───────┬───────────┬───────────────┬──────────────┬───────┘
        │           │               │              │
   ┌────▼───┐ ┌─────▼─────┐ ┌──────▼──────┐ ┌────▼─────┐
   │ Storage│ │  AI (opt) │ │   Search    │ │  Email   │
   │ Service│ │  Service  │ │   Service   │ │ Service  │
   │ local/ │ │ zai/openai│ │ db (LIKE)   │ │ console/ │
   │  s3    │ │  (pluggable)│ │ meili/es   │ │  smtp    │
   └────────┘ └───────────┘ └──────┬──────┘ └──────────┘
                                    │
                           ┌────────▼─────────┐
                           │  Prisma ORM       │
                           │  SQLite (dev) /   │
                           │  PostgreSQL (prod) │
                           └────────────────────┘
```

Every external service is behind an interface:

- `StorageService` — `local` | `s3`-compatible
- `AIService` — `zai` | `openai` (optional; core works without it)
- `SearchService` — `db` | `meilisearch` | `elasticsearch`
- `EmailService` — `console` | `smtp`

Swapping a provider is a single env var change — no code changes required.

See [`docs/architecture.md`](docs/architecture.md) for the full breakdown.

---

## Technology Stack

| Layer         | Technology                                             |
|---------------|--------------------------------------------------------|
| Framework     | Next.js 16 (App Router)                                 |
| Language      | TypeScript 5                                            |
| UI            | Tailwind CSS 4 + shadcn/ui (New York) + Lucide icons    |
| State         | Zustand (client view routing) + TanStack Query (server) |
| Auth          | NextAuth v4 (credentials, JWT, role-augmented)           |
| DB            | Prisma ORM → SQLite (dev) / PostgreSQL (prod)           |
| Markdown      | react-markdown + react-syntax-highlighter               |
| Charts        | Recharts                                                |
| Animations    | Framer Motion                                           |
| Storage       | Local FS / S3-compatible (lazy SDK)                      |
| AI (optional) | z-ai-web-dev-sdk / OpenAI-compatible (lazy SDK)          |
| Email (opt)   | nodemailer (lazy import)                                |

---

## Prerequisites

- **Node.js** ≥ 20 (or **Bun** ≥ 1.1, recommended)
- **PostgreSQL** ≥ 14 (for production) — or use SQLite for dev (default)
- A terminal, Git, and an editor

---

## Local Development

```bash
# 1. Clone
git clone <repository-url> codemastery
cd codemastery

# 2. Install dependencies (Bun recommended, npm works)
bun install          # or: npm install

# 3. Configure environment
cp .env.example .env
#   Edit .env — defaults work for SQLite dev with no external services.

# 4. Apply database schema
bun run db:push      # or: npx prisma db push

# 5. (Optional) Seed sample CS content
bun run prisma/seed.ts

# 6. Start dev server
bun run dev          # or: npm run dev
#   Open http://localhost:3000
```

The dev server runs on port 3000 with hot reload.

---

## Environment Variables

All configuration is environment-driven. See [`.env.example`](.env.example) for the complete list with comments. Summary:

| Variable                  | Purpose                                     | Default                          |
|---------------------------|---------------------------------------------|----------------------------------|
| `NEXT_PUBLIC_APP_URL`     | Public app URL                              | `http://localhost:3000`          |
| `DATABASE_URL`            | DB connection (SQLite path or PG URL)       | `file:./db/custom.db`            |
| `DATABASE_PROVIDER`       | `sqlite` / `postgresql`                     | `sqlite`                         |
| `AUTH_SECRET`             | NextAuth JWT secret                         | dev default (override in prod)   |
| `STORAGE_PROVIDER`        | `local` / `s3`                              | `local`                          |
| `AI_ENABLED`              | Enable optional AI features                  | `false`                          |
| `AI_PROVIDER`             | `zai` / `openai` / `none`                   | `none`                           |
| `SEARCH_PROVIDER`         | `db` / `meilisearch` / `elasticsearch`      | `db`                             |
| `EMAIL_PROVIDER`          | `console` / `smtp`                          | `console`                        |
| `RATE_LIMIT_ENABLED`      | Toggle in-memory rate limiting              | `true`                           |

**Never commit real secrets.** The `.gitignore` excludes `.env*` files.

---

## Database Setup

### SQLite (default, dev)

No extra setup — Prisma creates the file automatically:

```bash
bun run db:push
```

### PostgreSQL (production)

1. Provision a PostgreSQL database (any provider).
2. Set in `.env`:
   ```env
   DATABASE_PROVIDER=postgresql
   DATABASE_URL=postgresql://user:pass@host:5432/codemastery
   ```
3. Apply the schema:
   ```bash
   bun run db:push        # or: npx prisma migrate deploy
   ```

The Prisma schema is written to be portable between SQLite and PostgreSQL. For a full migration workflow, see [`docs/database.md`](docs/database.md).

---

## Authentication Setup

CodeMastery uses **NextAuth v4** with a credentials (email + password) provider. Passwords are hashed with Node's `scrypt` (no external dependency, constant-time comparison).

### To add OAuth providers (Google, GitHub, etc.)

Edit `src/lib/auth.ts` and add providers to the `providers` array:

```ts
import GoogleProvider from "next-auth/providers/google"
// ...
GoogleProvider({
  clientId: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
})
```

Then set `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` in your environment.

See [`docs/authentication.md`](docs/authentication.md).

---

## Storage Setup

File uploads (avatars, etc.) go through the `StorageService` abstraction.

- **Local** (default): writes to `./uploads/`, served at `/uploads/*`. Good for dev and single-server.
- **S3-compatible**: AWS S3, Cloudflare R2, MinIO, Backblaze B2, Wasabi. Install `@aws-sdk/client-s3` and set `STORAGE_PROVIDER=s3` plus the S3 env vars.

See [`docs/storage.md`](docs/storage.md).

---

## Running Tests

> Test runner is not bundled to keep the image lean. To add tests:

```bash
bun add -d vitest @testing-library/react jsdom
bun run test   # add a "test": "vitest" script
```

The platform is verified end-to-end with browser automation (agent-browser) during development.

---

## Building for Production

```bash
# 1. Configure production .env (secrets, DB URL, storage, etc.)
# 2. Build standalone output:
bun run build
# 3. Run:
NODE_ENV=production bun .next/standalone/server.js
```

Next.js is configured with `output: "standalone"` so the build produces a self-contained server.

---

## Docker Setup

```bash
# Quick start (PostgreSQL via docker-compose — recommended)
docker compose up

# Or build a standalone image and run it against any external Postgres:
docker build -t codemastery .
docker run -p 3000:3000 --env-file .env codemastery
```

The `Dockerfile` is a multi-stage build producing a small Alpine image with `output: "standalone"`. `docker-compose.yml` includes a PostgreSQL 16 service with a persistent volume — this is the **easiest way to run a production-like setup locally**. See [`docs/docker.md`](docs/docker.md).

---

## Deployment

CodeMastery is designed to deploy anywhere Next.js runs. The **recommended free deployment** is **GitHub + Vercel + Neon (Postgres) + Cloudflare R2 (storage)** — total cost $0 for a hobby project.

### 🚀 Quick deploy (free tier)

| Step | Where | Guide |
|---|---|---|
| 1. Push code | GitHub | `git push origin main` |
| 2. Create free Postgres | [Neon](https://neon.tech) or [Supabase](https://supabase.com) | [`docs/deployment-vercel.md`](docs/deployment-vercel.md) |
| 3. Import repo + set env vars | [Vercel](https://vercel.com) | [`docs/deployment-vercel.md`](docs/deployment-vercel.md) |
| 4. Seed the DB (one-time) | local terminal → production DB | `DATABASE_URL=… bun run db:seed` |

The `vercel-build` script (`prisma generate` → `prisma db push` → `next build`) runs automatically on every Vercel deploy, creating tables in your Postgres. You then seed once from your local machine.

### All deployment options

- **Vercel + Neon/Supabase** (recommended free) — see [`docs/deployment-vercel.md`](docs/deployment-vercel.md)
- **Docker / docker-compose** (self-hosted) — see [`docs/docker.md`](docs/docker.md) and [`docs/deployment.md`](docs/deployment.md)
- **Railway / Render / Fly.io** — use the Dockerfile or buildpack; see [`docs/deployment.md`](docs/deployment.md)
- **VPS (PM2 / Docker)** — `docker compose up -d` or `pm2 start`; see [`docs/deployment.md`](docs/deployment.md)
- **Chinese cloud providers** (Aliyun / Tencent / Huawei / Baidu) — see [`docs/chinese-cloud-alternatives.md`](docs/chinese-cloud-alternatives.md)

### Why two database providers?

The Prisma schema defaults to **PostgreSQL** (`prisma/schema.prisma`) for production (Vercel, Docker, etc.). For quick local development without Docker, a SQLite variant (`prisma/schema.sqlite.prisma`) is provided:

```bash
# PostgreSQL (production — Neon/Supabase/Railway/local Docker)
bun run db:push && bun run db:seed

# SQLite (optional local dev — no Docker needed)
bun run db:push:sqlite && bun run db:seed:sqlite
```

Vercel's serverless filesystem is **ephemeral**, so SQLite does not work in production — you must use PostgreSQL (or MySQL) on Vercel.

---

## Migration

Moving off any specific dev platform (including Z.ai) is straightforward:

1. `git clone` the repository onto your machine/server.
2. `cp .env.example .env` and set production values.
3. Apply the DB schema (`bun run db:push` or `prisma migrate deploy`).
4. (Optional) Import content via the JSON export API.
5. `bun run build && bun .next/standalone/server.js`  (or `docker compose up`).

Full step-by-step: [`docs/migration.md`](docs/migration.md).

---

## Backup & Restore

```bash
# SQLite backup
cp db/custom.db db/custom.db.bak

# PostgreSQL backup
pg_dump $DATABASE_URL > backup.sql

# Restore
psql $DATABASE_URL < backup.sql

# Content export (via API, requires admin)
curl -H "Cookie: ..." $APP_URL/api/admin/export -o content.json
```

See [`docs/backup-restore.md`](docs/backup-restore.md).

---

## Content Management

Tutorials are Markdown stored in the database. They can be:

- Authored in the admin dashboard
- Bulk-imported from JSON (`POST /api/admin/import`)
- Exported to JSON (`GET /api/admin/export`) for portability/migration

See [`docs/content-management.md`](docs/content-management.md).

---

## API Documentation

All features are exposed as REST endpoints under `/api/*`. Key routes:

| Method | Route                          | Purpose                              |
|--------|--------------------------------|--------------------------------------|
| POST   | `/api/auth/register`           | Register a new account               |
| GET    | `/api/subjects`                | List subjects (with filters)         |
| GET    | `/api/subjects/[slug]`         | Get a subject with tutorials/modules |
| GET    | `/api/tutorials/[subjectSlug]/[tutorialSlug]` | Get a tutorial          |
| POST   | `/api/progress`                | Upsert reading progress              |
| POST   | `/api/bookmarks`               | Toggle bookmark                      |
| GET    | `/api/bookmarks`               | List user bookmarks                  |
| POST   | `/api/notes`                   | Create a note                        |
| GET    | `/api/notes`                   | List user notes                      |
| GET    | `/api/search`                  | Search tutorials                     |
| POST   | `/api/quizzes/[id]/attempt`    | Submit a quiz attempt                |
| GET    | `/api/leaderboard`              | Get leaderboard                      |
| GET    | `/api/achievements`             | List achievements + user unlocks     |
| GET    | `/api/me`                      | Get current user + stats             |
| GET    | `/api/admin/export`             | Export all content (JSON)           |
| POST   | `/api/admin/import`             | Import content (JSON)                |

All endpoints return `{ ok: true, data }` or `{ ok: false, error }`.

---

## Troubleshooting

| Problem                        | Fix                                                            |
|--------------------------------|----------------------------------------------------------------|
| `prisma` not found             | `bun add prisma @prisma/client` then `bun run db:push`          |
| Auth fails                     | Ensure `AUTH_SECRET` is set and ≥ 32 chars in prod            |
| `next-auth` session missing    | Check `NEXTAUTH_URL` matches your deployed domain              |
| Database locked (SQLite)       | Stop duplicate dev servers; one process only                  |
| Prisma client out of sync      | `bun run db:generate`                                          |
| Port 3000 in use               | Set `PORT=3001` (and update gateway if using one)             |

See [`docs/troubleshooting.md`](docs/troubleshooting.md).

---

## Platform Migration Guide

This application is **fully independent of its development environment**. To move it:

1. **Export source** — `git clone` / download the repo.
2. **Push to GitHub** — `git remote add origin ... && git push -u origin main`.
3. **Provision infrastructure** — any Node host + PostgreSQL (or SQLite for small deploys).
4. **Set env vars** — copy `.env.example`, fill in `DATABASE_URL`, `AUTH_SECRET`, storage, etc.
5. **Apply schema** — `bun run db:push` (or `prisma migrate deploy`).
6. **(Optional) Import content** — `POST /api/admin/import` with exported JSON.
7. **Deploy** — Vercel/Railway/Docker/VPS.
8. **Verify** — visit the deployed URL, register, read a tutorial, complete a quiz.

Detailed guide: [`docs/migration.md`](docs/migration.md).

---

## License

MIT — this project belongs to the project owner and is free to use, modify, and deploy anywhere.
