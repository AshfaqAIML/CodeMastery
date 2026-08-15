# Migration Guide — Moving Off the Dev Environment

This application is **fully independent** of any specific dev platform. The dev environment was just a place to write code; the product belongs to the project owner and runs anywhere.

## Step-by-step

### 1. Export the source code

```bash
# From the dev environment
git init && git add -A && git commit -m "CodeMastery initial"
git remote add origin https://github.com/<you>/codemastery.git
git push -u origin main
```

Or download a tarball of the project directory.

### 2. Clone on your machine

```bash
git clone https://github.com/<you>/codemastery.git
cd codemastery
```

### 3. Install dependencies

```bash
bun install    # or npm install / yarn install
```

### 4. Configure environment

```bash
cp .env.example .env
# Edit .env with production values:
#   - DATABASE_URL / DATABASE_PROVIDER
#   - AUTH_SECRET (openssl rand -base64 32)
#   - NEXTAUTH_URL, NEXT_PUBLIC_APP_URL
#   - STORAGE_* (s3 for prod)
#   - EMAIL_* (smtp for prod)
#   - AI_* (optional)
```

### 5. Configure the database

**PostgreSQL (recommended for production):**

```bash
# Create a database
createdb codemastery   # or via your provider's dashboard

# Set in .env:
#   DATABASE_PROVIDER=postgresql
#   DATABASE_URL=postgresql://user:pass@host:5432/codemastery

# Apply schema
bun run db:push
# or for managed migrations:
bunx prisma migrate deploy
```

**SQLite (small/personal deploys):**

```bash
# .env defaults work (file:./db/custom.db)
bun run db:push
```

### 6. Import content (if migrating data)

If you exported content from the dev environment:

```bash
# Auth as admin first to obtain a session cookie, then:
curl -b cookies.txt -X POST -H "Content-Type: application/json" \
  --data @content.json \
  $APP_URL/api/admin/import
```

Or seed fresh content:

```bash
bun run prisma/seed.ts
```

### 7. Configure storage

For multi-instance / cloud deploys, use S3-compatible storage:

```env
STORAGE_PROVIDER=s3
STORAGE_ENDPOINT=...
STORAGE_BUCKET=...
# ... (see docs/storage.md)
```

For single-server deploys, local storage works.

### 8. Configure authentication

OAuth providers (optional) — see [authentication.md](authentication.md). Set `GOOGLE_CLIENT_ID` etc. in `.env`.

### 9. Configure a domain

Point your domain's DNS at your host, set up TLS (Caddy/Let's Encrypt), and reverse-proxy to port 3000. Set `NEXTAUTH_URL` and `NEXT_PUBLIC_APP_URL` to your domain.

### 10. Deploy

Choose any method from [deployment.md](deployment.md):

```bash
# Docker
docker compose up -d

# Or build + run
bun run build
NODE_ENV=production node .next/standalone/server.js
```

### 11. Run production tests

1. Visit the deployed URL → homepage renders.
2. Register an account → success, can log in.
3. Read a tutorial → progress saved.
4. Complete a quiz → XP awarded, level may rise.
5. Bookmark + note a tutorial → appears in dashboard.
6. Check leaderboard → your name appears.
7. (Admin) Export content → JSON downloads.

### 12. Verify everything works

- [ ] Homepage loads
- [ ] Registration + login work
- [ ] Tutorial reading + progress tracking work
- [ ] Quizzes submit and score correctly
- [ ] XP / streak / level update
- [ ] Bookmarks + notes persist
- [ ] Leaderboard updates
- [ ] Achievements unlock at thresholds
- [ ] Dark/light theme toggle works
- [ ] Mobile layout is usable
- [ ] (If enabled) AI features respond
- [ ] (If configured) Email sending works

## Lock-in audit

Before considering migration complete, search the codebase for platform-specific dependencies:

```bash
grep -ri "z.ai\|zai_\|chatglm\|z-cdn" src/ --include="*.ts" --include="*.tsx"
```

Expected result: only references inside `src/lib/ai/zai.ts` (the optional AI provider). No hard dependencies elsewhere. The app runs with `AI_ENABLED=false`.

## If something doesn't work

- Check `docs/troubleshooting.md`.
- Check environment variables are all set.
- Check the database is reachable.
- Check logs: `tail -f dev.log` or `docker logs -f codemastery`.
