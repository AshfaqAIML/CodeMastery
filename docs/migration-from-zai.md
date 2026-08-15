# Migrating from Z.ai Development Environment

This document describes how to move the CodeMastery project from the Z.ai
development environment to fully independent hosting (Vercel, Railway, Docker,
VPS, or any other platform).

## Current State — Z.ai Independence

The project is **fully independent** of the Z.ai development platform. Z.ai
was only used as the initial development environment; the final application
has no hard dependency on it.

### What was removed / changed

| Area | Before | After |
|---|---|---|
| **AI provider default** | `AI_PROVIDER` defaulted to `"zai"` | Defaults to `"none"` — app is provider-independent out of the box |
| **Z.ai dev origins** | `next.config.ts` had `allowedDevOrigins: ["*.space-z.ai", ...]` | Removed — not needed for independent deployment |
| **z-ai-web-dev-sdk** | Hard dependency in `dependencies` | Moved to `optionalDependencies` — `npm install` won't fail if it can't be fetched |
| **Database provider default** | `config.ts` defaulted to `"sqlite"` | Defaults to `"postgresql"` (matches production schema) |
| **TypeScript errors** | ~15 pre-existing errors (would block `next build`) | **0 errors** — `tsc --noEmit` passes clean |

### What remains (by design)

- `src/lib/ai/zai.ts` — the Z.AI provider adapter. This is a **legitimate optional
  provider** (like the OpenAI provider). It's lazy-imported only when
  `AI_PROVIDER=zai` and `AI_ENABLED=true`. The app never imports it otherwise.
- `z-ai-web-dev-sdk` in `optionalDependencies` — installed if available, silently
  skipped if not. No build or runtime failure if absent.
- Documentation references (`.env.example`, `docs/ai.md`, `README.md`) that
  describe Z.AI as one of several optional AI providers.

This is the correct abstraction pattern — Z.ai is a **replaceable provider**,
not a platform dependency.

## Migration Steps

### 1. Export the source code

```bash
# If you have git access:
git clone <repo-url> codemastery
cd codemastery

# Or download the source archive and extract it
```

The repository is self-contained. No hidden Z.ai state is required.

### 2. Choose your hosting platform

See [`docs/deployment-vercel.md`](deployment-vercel.md) for the recommended
free path (GitHub + Vercel + Neon PostgreSQL + Cloudflare R2).

See [`docs/chinese-cloud-alternatives.md`](chinese-cloud-alternatives.md) for
Chinese cloud equivalents (Aliyun / Tencent / Huawei / Baidu).

See [`docs/deployment.md`](deployment.md) for Docker / Railway / VPS options.

### 3. Set environment variables

Copy `.env.example` to `.env` and fill in production values:

```bash
cp .env.example .env
```

**Critical variables:**

| Variable | Value |
|---|---|
| `DATABASE_URL` | `postgresql://user:pass@host:5432/db` (Neon/Supabase/Railway) |
| `AUTH_SECRET` | `openssl rand -base64 32` |
| `NEXTAUTH_URL` | `https://your-domain.com` |
| `NEXT_PUBLIC_APP_URL` | `https://your-domain.com` |
| `DATABASE_PROVIDER` | `postgresql` |

**Optional variables:**

| Variable | When to set |
|---|---|
| `STORAGE_PROVIDER=s3` + S3 creds | When deploying to Vercel (ephemeral filesystem) |
| `AI_ENABLED=true` + `AI_PROVIDER=openai` + `OPENAI_API_KEY` | When you want the AI Study Buddy feature |
| `EMAIL_PROVIDER=smtp` + SMTP creds | When you want real email sending |

### 4. Install dependencies

```bash
# Using bun (recommended — matches development):
bun install

# Or using npm:
npm install

# Or using pnpm:
pnpm install
```

The `postinstall` script (`scripts/postinstall.sh`) auto-detects the database
provider from `DATABASE_URL` and generates the correct Prisma client.

### 5. Set up the database

```bash
# Create tables (auto-detects SQLite vs PostgreSQL from DATABASE_URL):
bun run db:push

# Seed content (tutorials, subjects, achievements, learning paths):
bun run db:seed
```

### 6. Build and run

```bash
# Development:
bun run dev

# Production build:
bun run build
bun run start
```

### 7. Verify

1. Visit `http://localhost:3000` — homepage loads.
2. Browse subjects — 35 subjects across 4 domains.
3. Open a tutorial — breadcrumb, learning objectives, content, key takeaways
   all render.
4. Register an account — auth works.
5. Read a tutorial — progress saves.
6. Complete a quiz — XP is awarded.

## Architecture — Platform Independent

```
Users
   ↓
Web Application (Next.js 16 — frontend + API routes)
   ↓
Application / API Layer (App Router /api/*)
   ↓
Business Logic (src/lib/*)
   ↓
 ┌───────────────┬───────────────┬───────────────┐
 ↓               ↓               ↓               ↓
PostgreSQL      Storage         AI Provider      Search
(Neon/          (Local/S3/      (None/OpenAI/    (DB/
Supabase/       R2/OSS/COS)     Z.AI — all       Meilisearch/
Railway/                        optional)        Elasticsearch —
Docker)                                          all optional)
```

Every external service is behind an interface and configured via environment
variables. The core platform works with **zero** external services configured
(defaults: SQLite for dev, console email, DB search, AI disabled).

## Verification Checklist

- [x] `npm install` / `bun install` succeeds without Z.ai-specific packages
- [x] `npx tsc --noEmit` passes with 0 errors
- [x] `bun run lint` passes clean
- [x] `bun run test` — 31/31 unit tests pass
- [x] Dev server starts on port 3000 without Z.ai runtime
- [x] AI is disabled by default (`AI_PROVIDER=none`)
- [x] No `allowedDevOrigins` referencing Z.ai in `next.config.ts`
- [x] `z-ai-web-dev-sdk` is in `optionalDependencies` (not `dependencies`)
- [x] All auth-required API hooks are gated (`enabled: !!session`)
- [x] No Z.ai references in source code (only in the optional provider adapter)
- [x] `.env.example` documents all configuration without Z.ai assumptions
- [x] Docker, Vercel, and VPS deployment paths documented
- [x] Chinese cloud alternatives documented

## What You Need to Provide

| Requirement | Options |
|---|---|
| **Hosting** | Vercel (free), Railway, Render, Fly.io, Docker, VPS |
| **Database** | Neon (free), Supabase (free), Railway, self-hosted PostgreSQL |
| **File storage** (optional) | Cloudflare R2 (free), Backblaze B2, AWS S3, Alibaba OSS, Tencent COS |
| **AI provider** (optional) | OpenAI, Together, Groq, local llama-server, Z.AI — or none |
| **Email** (optional) | Any SMTP provider (Resend, SendGrid, Mailgun, etc.) |

**Minimum viable deployment**: Vercel + Neon = $0/month.
