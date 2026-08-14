# Docker

## Quick start

```bash
docker build -t codemastery .
docker run -p 3000:3000 --env-file .env \
  -v $(pwd)/db:/app/db \
  -v $(pwd)/uploads:/app/uploads \
  codemastery
```

The image is a multi-stage Alpine build. The final image runs as a non-root user (`nextjs`), exposes port 3000, and persists data in two volumes:

- `/app/db` — SQLite database (when using the default)
- `/app/uploads` — uploaded files (when using local storage)

## With PostgreSQL

```bash
docker compose up
```

`docker-compose.yml` starts both the app and a PostgreSQL 16 container. To use Postgres, uncomment the Postgres env vars in `docker-compose.yml` (or pass them in `.env`):

```env
DATABASE_PROVIDER=postgresql
DATABASE_URL=postgresql://codemastery:codemastery@postgres:5432/codemastery
```

## Image details

- **Base**: `node:20-alpine`
- **Build**: multi-stage (deps → builder → runner)
- **Standalone output**: `.next/standalone` is a self-contained server
- **Prisma**: client generated at build, `prisma db push` runs at container start
- **User**: non-root `nextjs:nodejs` (uid 1001)
- **Telemetry**: disabled (`NEXT_TELEMETRY_DISABLED=1`)

## Building for a specific platform

```bash
# Build for ARM64 (e.g., Apple Silicon host, AWS Graviton)
docker buildx build --platform linux/arm64 -t codemastery:arm64 --load .
```

## Environment

Pass env vars via `--env-file .env` (recommended) or `-e KEY=value` flags. See `.env.example` for all variables.

## Health

The app responds to `GET /` with 200 when healthy. Add a healthcheck:

```yaml
# docker-compose.yml
services:
  app:
    healthcheck:
      test: ["CMD", "wget", "-qO-", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 5s
      retries: 3
```

(Requires a `/api/health` route — trivial to add.)

## Logs

```bash
docker logs -f codemastery
```

## Updating

```bash
git pull
docker compose build
docker compose up -d
```

## Common issues

| Problem                              | Fix                                                       |
|--------------------------------------|-----------------------------------------------------------|
| Prisma `libssl` errors              | Alpine needs `openssl` (already in the Dockerfile)        |
| Permission denied on `/app/db`      | Ensure host dir is writable by uid 1001                   |
| Port already in use                  | Map a different host port: `-p 8080:3000`                  |
| Build fails on Apple Silicon        | `docker buildx build --platform linux/amd64 ...`          |
