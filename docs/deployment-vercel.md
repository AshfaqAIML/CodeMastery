# Deploying CodeMastery to GitHub + Vercel + Free PostgreSQL

This guide walks you through deploying the **frontend + backend (API routes) to Vercel** and the **database to a free PostgreSQL provider** (Neon, Supabase, or Railway). Total cost: **$0** for a hobby project.

> **Architecture note**: CodeMastery is a Next.js 16 full-stack app. The "backend" (API routes for auth, tutorials, progress, quizzes, gamification) deploys **together with the frontend** to Vercel as serverless functions — there is no separate backend server to host. Only the **database** and **file storage** need external hosting.

---

## 0. Prerequisites

- A [GitHub](https://github.com) account (free)
- A [Vercel](https://vercel.com) account (free hobby tier — sign in with GitHub)
- A free PostgreSQL provider account (pick one — all have generous free tiers):
  - **[Neon](https://neon.tech)** — recommended; 0.5 GB, serverless, branching, best Vercel integration
  - **[Supabase](https://supabase.com)** — 500 MB, Postgres + auth + storage + realtime
  - **[Railway](https://railway.app)** — $5 free trial credit, then $5/mo hobby (not strictly free)
- A free object-storage provider (for uploaded files — Vercel's filesystem is ephemeral):
  - **[Cloudflare R2](https://developers.cloudflare.com/r2/)** — 10 GB free, no egress fees ⭐ recommended
  - **[Backblaze B2](https://www.backblaze.com/cloud-storage)** — 10 GB free + 1 GB/day egress
  - **[AWS S3](https://aws.amazon.com/s3/)** — 5 GB free for 12 months
  - *The app works without S3 — uploads are just disabled in production. Safe to skip for a demo.*

---

## 1. Push the code to GitHub

If you haven't already:

```bash
cd /path/to/codemastery

# Initialise git (skip if already a git repo)
git init
git add -A
git commit -m "Initial commit: CodeMastery platform"

# Create an empty repo on GitHub first (no README/license), then:
git remote add origin https://github.com/<your-username>/codemastery.git
git branch -M main
git push -u origin main
```

> **`.gitignore`** already excludes `node_modules/`, `.env`, `db/`, `uploads/`, `.next/`. Double-check `.env` is NOT committed — it contains secrets.

---

## 2. Create a free PostgreSQL database

### Option A — Neon (recommended, best Vercel integration)

1. Go to <https://neon.tech> → **Sign up** (free, no credit card).
2. **Create a new project** → name it `codemastery` → pick a region close to Vercel's (default `us-east-1`).
3. On the project dashboard, copy the **Connection string** — it looks like:
   ```
   postgresql://neondb_owner:np_xxxxxxxxxxxx@ep-cool-name-123456.us-east-2.aws.neon.tech/codemastery?sslmode=require
   ```
4. **Save this string** — you'll paste it into Vercel as `DATABASE_URL`.

Neon free tier: **0.5 GB storage**, 100 compute hours/month, unlimited projects. Perfect for a learning platform.

### Option B — Supabase (Postgres + extras)

1. Go to <https://supabase.com> → **Start your project** (free, no credit card).
2. Create a new project → name `codemastery` → set a strong DB password → pick a region.
3. Wait ~2 min for provisioning.
4. Go to **Project Settings → Database → Connection string → URI**. Copy:
   ```
   postgresql://postgres:<your-password>@db.<project-ref>.supabase.co:5432/postgres
   ```
5. **Save this string** — it's your `DATABASE_URL`.

Supabase free tier: **500 MB storage**, 2 projects, pauses after 1 week of inactivity (unpause on visit).

### Option C — Railway (not strictly free long-term)

1. Go to <https://railway.app> → sign in with GitHub.
2. **New Project → Provision PostgreSQL**.
3. On the Postgres service → **Connect** tab → copy the **Postgres Connection URL**.
4. You get **$5 of free trial credit** (~500 hours of a small Postgres). After that, $5/month for hobby tier.

---

## 3. Deploy to Vercel

### 3.1 Import the GitHub repo

1. Go to <https://vercel.com> → **Sign In** with GitHub.
2. **Add New… → Project** → find your `codemastery` repo → **Import**.
3. Vercel auto-detects Next.js. **Do not click Deploy yet** — first configure env vars.

### 3.2 Set environment variables

In the Vercel project setup page, expand **Environment Variables** and add each of these (set them for **Production**, **Preview**, AND **Development** environments — toggle "All"):

| Name | Value | Required |
|---|---|---|
| `DATABASE_URL` | your Neon/Supabase/Railway connection string from step 2 | ✅ |
| `AUTH_SECRET` | generate with `openssl rand -base64 32` in a terminal | ✅ |
| `NEXTAUTH_SECRET` | same value as `AUTH_SECRET` | ✅ |
| `NEXTAUTH_URL` | `https://<your-project>.vercel.app` (you'll know the URL after first deploy — set a placeholder now, then edit) | ✅ |
| `NEXT_PUBLIC_APP_URL` | same as `NEXTAUTH_URL` | ✅ |
| `STORAGE_PROVIDER` | `local` (for demo) **or** `s3` (if you set up R2/B2 below) | optional |
| `AI_ENABLED` | `false` (or `true` if you have a Z.AI/OpenAI key) | optional |
| `DATABASE_PROVIDER` | `postgresql` | optional (default) |

> **Tip**: For `NEXTAUTH_URL`/`NEXT_PUBLIC_APP_URL`, use a placeholder like `https://codemastery.vercel.app` for now and **edit it after the first deploy** once Vercel tells you your real URL.

### 3.3 (Optional) Configure S3-compatible storage

If you want uploads (cover images, profile pictures) to work in production, set these too:

| Name | Value |
|---|---|
| `STORAGE_PROVIDER` | `s3` |
| `STORAGE_ENDPOINT` | e.g. `https://<account>.r2.cloudflarestorage.com` for R2 |
| `STORAGE_REGION` | `auto` for R2, or your AWS region |
| `STORAGE_ACCESS_KEY` | your access key |
| `STORAGE_SECRET_KEY` | your secret key |
| `STORAGE_BUCKET` | your bucket name |
| `STORAGE_PUBLIC_URL` | public CDN URL |
| `STORAGE_S3_FORCE_PATH_STYLE` | `true` for R2/MinIO, `false` for AWS S3 |

For **Cloudflare R2**: create a bucket → Settings → R2 API Tokens → create a token with Object Read & Write → use the returned endpoint + keys.

### 3.4 Deploy

1. Click **Deploy**.
2. Vercel runs the build:
   - `bun install` (installs dependencies + runs `postinstall` → `prisma generate`)
   - `bun run vercel-build` → runs `prisma generate` + `prisma db push` (creates tables in your Postgres) + `next build`
3. First build takes ~3–5 minutes. Watch the build logs.
4. When it's green, click **Visit**. You should see the CodeMastery homepage. 🎉

### 3.5 Seed the database (one-time)

The Vercel build runs `prisma db push` (creates tables) but **does not seed** content (tutorials, subjects, achievements, learning paths). To populate the DB, run the seed from your local machine pointing at the production Postgres:

```bash
# On your local machine:
# 1. Temporarily point DATABASE_URL at your production Neon/Supabase DB:
export DATABASE_URL="postgresql://...your-production-connection-string..."

# 2. Run the seed:
bun run db:seed
```

You'll see output like:
```
🌱 Seeding CodeMastery content...
  ✓ 4 domains
  ✓ Subject: Computer Fundamentals
  ...
🎉 Seed complete: { subjects: 36, modules: 42, tutorials: 137, ... }
```

Now visit your Vercel URL — the homepage and Browse page will show all the seeded content.

> **Alternative**: If you can't run the seed locally, you can trigger it as a Vercel **deploy hook** or add a one-time script. See [Vercel docs: Running scripts](https://vercel.com/docs/functions/run-scripts).

### 3.6 Fix `NEXTAUTH_URL`

After the first successful deploy, Vercel gives you a URL like `https://codemastery-abc123.vercel.app`.

1. Go to **Project → Settings → Environment Variables**.
2. Edit `NEXTAUTH_URL` and `NEXT_PUBLIC_APP_URL` to the real URL.
3. **Redeploy** (Deployments → most recent → ⋮ → Redeploy).

---

## 4. Verify the deployment

1. **Homepage loads** at your Vercel URL.
2. **Browse** shows 36 subjects grouped by domain.
3. Click a subject → a tutorial → it renders with the breadcrumb, learning objectives, content, and key takeaways.
4. **Register an account** → should work (NextAuth credentials flow).
5. **Read a tutorial** → progress should save (check by refreshing — the % bar persists).
6. **Complete a quiz** → XP is awarded.
7. **Dashboard** → shows your stats, XP, level.

If something's broken, check **Vercel → Functions → Logs** for server errors.

---

## 5. Free tier limits & scaling

| Service | Free tier | When you'll outgrow it |
|---|---|---|
| **Vercel Hobby** | 100 GB bandwidth, 1000 serverless function invocations/day, 100h build time/mo | ~10k daily active users |
| **Neon Free** | 0.5 GB storage, 100 compute hours/mo | ~100 tutorials + 1000 users |
| **Supabase Free** | 500 MB DB, 50k monthly active users (auth), 1 GB storage | similar |
| **Cloudflare R2 Free** | 10 GB storage, no egress fees | 10 GB of uploaded images |

For a personal learning platform or a small cohort, you'll stay on the free tier indefinitely.

---

## 6. Continuous deployment

Once set up, **every `git push` to `main`** triggers a Vercel rebuild + deploy automatically. Pull requests get **preview deployments** (isolated URLs) so you can review changes before merging.

To skip a deploy on a docs-only commit, add `[skip vercel]` to the commit message.

---

## 7. Common issues & fixes

### `Error: P1013: The provided database string is invalid`

Your `DATABASE_URL` is malformed. Re-copy it from Neon/Supabase exactly. It must start with `postgresql://` (or `postgres://`). For Neon, include `?sslmode=require`.

### `Error: P1001: Can't reach database server`

Vercel can't connect to your DB. Check:
- The connection string has no typos.
- For Neon: the project is **active** (not suspended). Neon auto-suspends after 5 min of inactivity — the first request after suspension takes ~1s to wake.
- For Supabase: the project isn't paused (free tier pauses after 1 week of no visits).

### `NEXTAUTH_URL` callback error on login

You forgot to set `NEXTAUTH_URL` to your real Vercel URL (step 3.6). Fix it in Vercel env vars and redeploy.

### Uploaded images disappear

You're using `STORAGE_PROVIDER=local` on Vercel. Vercel's filesystem is ephemeral — switch to `s3` with Cloudflare R2 (step 3.3).

### Build fails with `prisma generate` error

Make sure `DATABASE_URL` is set in Vercel env vars BEFORE the first build. The `vercel-build` script runs `prisma db push` which needs the URL.

### Seed duplicates quizzes every time

**Fixed** — the seed now calls `db.quiz.deleteMany({ where: { tutorialId } })` before recreating quizzes, so re-seeding is safe and idempotent.

---

## 8. Custom domain (optional)

On Vercel Hobby you can add **one free custom domain**:

1. Vercel → Project → Settings → Domains → Add your domain.
2. Add the DNS records Vercel shows you at your registrar (CNAME + A).
3. Wait for DNS to propagate (minutes to hours).
4. Update `NEXTAUTH_URL` and `NEXT_PUBLIC_APP_URL` to `https://yourdomain.com`.
5. Redeploy.

---

## 9. What about the websocket mini-services?

CodeMastery ships with an optional websocket example in `examples/websocket/`. Vercel **does not support long-running websocket servers** (only Edge WebSocket on paid plans). If you need real-time features in production:

- Deploy the websocket service to **[Railway](https://railway.app)**, **[Render](https://render.com)**, or **[Fly.io](https://fly.io)** (all have free tiers).
- Or rewrite the realtime feature using Vercel's Edge Functions with a managed pub/sub (Pusher, Ably, Supabase Realtime).

For a learning platform, you likely don't need websockets at all — the app works fully without them.

---

## 10. Quick reference — env vars for Vercel

```
DATABASE_URL=postgresql://...           (REQUIRED — from Neon/Supabase/Railway)
AUTH_SECRET=<openssl rand -base64 32>   (REQUIRED)
NEXTAUTH_SECRET=<same as AUTH_SECRET>    (REQUIRED)
NEXTAUTH_URL=https://your-app.vercel.app (REQUIRED — edit after first deploy)
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
DATABASE_PROVIDER=postgresql
STORAGE_PROVIDER=local    # or s3
# + S3 creds if STORAGE_PROVIDER=s3
AI_ENABLED=false          # or true + AI_PROVIDER + API key
```

That's it — you're live on the free tier. 🚀
