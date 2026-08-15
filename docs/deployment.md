# Deployment

CodeMastery is a standard Next.js 16 application with `output: "standalone"`. It deploys anywhere Node.js runs.

## Option 1 — Docker (most portable)

```bash
docker build -t codemastery .
docker run -p 3000:3000 \
  --env-file .env \
  -v $(pwd)/db:/app/db \
  -v $(pwd)/uploads:/app/uploads \
  codemastery
```

With PostgreSQL:

```bash
docker compose up
```

See [docker.md](docker.md).

## Option 2 — Vercel

```bash
vercel
```

- Set all env vars in the Vercel dashboard.
- Use Vercel Postgres or an external PostgreSQL.
- Set `DATABASE_PROVIDER=postgresql`.
- For storage, use S3-compatible (Vercel filesystem is ephemeral).

## Option 3 — Railway / Render / Fly.io

These platforms support Docker images or buildpacks:

```bash
# Railway
railway up

# Fly.io
fly launch
fly deploy
```

- Set env vars in the platform dashboard.
- Use a managed Postgres add-on.
- Mount a persistent volume for SQLite if not using Postgres.

## Option 4 — VPS (Docker)

```bash
git clone <repo> /opt/codemastery
cd /opt/codemastery
cp .env.example .env  # edit production values
docker compose up -d
# reverse-proxy (nginx/caddy) on port 80/443 -> 3000
```

## Option 5 — VPS (PM2, no Docker)

```bash
git clone <repo> /opt/codemastery
cd /opt/codemastery
bun install
cp .env.example .env  # edit
bun run db:push
bun run build
bun add -g pm2
pm2 start "node .next/standalone/server.js" --name codemastery
pm2 startup && pm2 save
```

Then put nginx/Caddy in front:

```nginx
server {
  listen 80;
  server_name codemastery.example.com;
  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $remote_addr;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

## Environment checklist (production)

- [ ] `DATABASE_PROVIDER=postgresql` + valid `DATABASE_URL`
- [ ] `AUTH_SECRET` ≥ 32 chars (`openssl rand -base64 32`)
- [ ] `NEXTAUTH_URL` = your production domain
- [ ] `NEXT_PUBLIC_APP_URL` = your production domain
- [ ] `STORAGE_PROVIDER=s3` (with bucket env vars) — NOT local, for multi-instance
- [ ] `EMAIL_PROVIDER=smtp` (with SMTP creds) — for real email
- [ ] `NODE_ENV=production`
- [ ] HTTPS terminating reverse proxy
- [ ] Database backups scheduled
- [ ] (Optional) `AI_ENABLED=true` + provider config

## Post-deploy verification

1. Visit the deployed URL — homepage loads.
2. Register an account.
3. Read a tutorial; progress is saved.
4. Complete a quiz; XP is awarded.
5. Bookmark a tutorial; check dashboard.
6. (Admin) Export content via `/api/admin/export`.
