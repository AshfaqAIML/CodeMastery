# Troubleshooting

## Setup

| Problem                          | Cause                                       | Fix                                                          |
|----------------------------------|---------------------------------------------|--------------------------------------------------------------|
| `prisma: command not found`      | Not installed                               | `bun add -d prisma @prisma/client`                           |
| `Cannot find module @prisma/client` | Client not generated                       | `bun run db:generate`                                        |
| Database file not created        | `DATABASE_URL` path wrong                   | Ensure `.env` has `DATABASE_URL=file:./db/custom.db`         |
| `EADDRINUSE: 3000`               | Port in use                                 | Stop the other process, or set `PORT=3001`                   |
| Hydration mismatch               | Theme applied after mount                   | `next-themes` handles this; ensure `suppressHydrationWarning` on `<html>` (already set) |

## Auth

| Problem                          | Fix                                                            |
|----------------------------------|----------------------------------------------------------------|
| Login returns 401               | Check `AUTH_SECRET` is set; verify password hash format        |
| Session disappears on reload    | `NEXTAUTH_URL` must match your deployed domain                |
| "Too many attempts"             | Rate limiter — wait 60s or raise `RATE_LIMIT_AUTH_MAX`         |
| OAuth provider error             | Ensure redirect URL is `https://domain/api/auth/callback/<provider>` |

## Database

| Problem                          | Fix                                                            |
|----------------------------------|----------------------------------------------------------------|
| SQLite "database is locked"      | Stop duplicate dev servers; only one process should hold the DB |
| Prisma client out of sync        | `bun run db:generate` after schema changes                     |
| Migration drift                  | `bun run db:push` syncs directly; `prisma migrate resolve` for managed |
| Switching SQLite → Postgres      | Set `DATABASE_PROVIDER=postgresql` + `DATABASE_URL`, then `bun run db:push` |

## Build

| Problem                          | Fix                                                            |
|----------------------------------|----------------------------------------------------------------|
| Build fails on `z-ai-web-dev-sdk`| Set `AI_ENABLED=false` (default) — the SDK is optional        |
| Docker build OOM                 | Increase Docker memory limit; build with `--memory=4g`         |
| Alpine `libssl` error            | Ensure `openssl` apk in Dockerfile (already included)         |

## Runtime

| Problem                          | Fix                                                            |
|----------------------------------|----------------------------------------------------------------|
| 500 on /api/*                    | Check `dev.log` / `docker logs`; common cause: DB unreachable |
| XP not awarded                   | Check daily XP cap (`DAILY_XP_CAP`); server logs show awards   |
| Streak reset unexpectedly        | Streak requires daily activity; >1 day gap resets to 1         |
| Achievements not unlocking       | Achievements re-evaluated after each XP-earning action         |
| Tutorial content not rendering   | Ensure valid Markdown; check for unescaped backticks           |
| Search returns nothing          | Check the query string; DB search is substring-based           |

## Performance

| Problem                          | Fix                                                            |
|----------------------------------|----------------------------------------------------------------|
| Slow dashboard                   | Check for N+1 queries; use Prisma `include` selectively        |
| Slow search                      | Migrate `SEARCH_PROVIDER=db` to meilisearch for large corpora  |
| Large bundle                     | Audit with `bun run build`; lazy-import heavy libs             |

## Getting help

- Check `dev.log` (dev) or `docker logs codemastery` (prod).
- Read the relevant doc in `docs/`.
- Reproduce in a clean environment: `rm -rf node_modules .next && bun install && bun run dev`.
