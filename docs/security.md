# Security

## Threat model summary

CodeMastery is a learning platform with user accounts, gamified state, and admin-managed content. The main threat surfaces are:

1. **Authentication** — account takeover, password brute-force, session theft.
2. **Gamification integrity** — XP/points/streak manipulation, farming.
3. **Admin abuse** — unauthorized content/role changes.
4. **Input injection** — XSS via tutorial content or notes, SQL injection.
5. **Abuse** — spam registrations, scraping.

## Mitigations in place

### Authentication & sessions
- Passwords hashed with `scrypt` (salted, 64-byte hash, constant-time compare).
- JWT sessions, 30-day max age, `AUTH_SECRET` required.
- Auth endpoints rate-limited (in-memory limiter; swap for Redis in prod).
- `emailVerified` field reserved for future email verification.

### Gamification integrity
- **No client-supplied XP/points/streak values are ever trusted.**
- The client sends *actions* (e.g., "I read 80% of tutorial X"); the server verifies and computes the award.
- Daily XP cap (`DAILY_XP_CAP = 500`) prevents refresh/page-open farming.
- Streaks computed server-side from `lastActivityDate`.
- Quiz scoring is server-side: answers compared server-side, not in the browser.
- Achievements unlocked by querying real metrics (e.g., `count(tutorials completed)`), not by client trigger.

### Admin protection
- Every admin route checks `getCurrentUser()` and asserts `role === "ADMIN"`.
- Admin actions are logged.

### Input validation & injection
- All mutating endpoints validate input with Zod.
- Prisma uses parameterized queries (no raw SQL concatenation).
- Tutorial content is Markdown rendered with `react-markdown` (safe by default — no `dangerouslySetInnerHTML`).
- Notes/bookmarks user content is escaped on render.

### XSS
- React escapes text by default.
- Code blocks rendered via `react-syntax-highlighter` (no `eval`).
- No `dangerouslySetInnerHTML` anywhere in the codebase.

### CSRF
- NextAuth credentials flow uses POST with JSON body; standard CSRF tokens apply.
- Cookie-based session is `httpOnly`, `sameSite=lax` by default.

### Rate limiting
- In-memory per-process limiter (`src/lib/api.ts`).
- For multi-instance production, replace with a Redis-backed limiter behind the same interface.

### Secrets
- All secrets via env vars (`.env`, never committed).
- `.gitignore` excludes `.env*` files.
- `AUTH_SECRET` validated to exist at runtime.

## Production hardening checklist

- [ ] `AUTH_SECRET` set to a strong random value (≥ 32 chars).
- [ ] `NODE_ENV=production`.
- [ ] HTTPS enforced (reverse proxy with TLS).
- [ ] `DATABASE_PROVIDER=postgresql` (not SQLite) for concurrency.
- [ ] Database backups scheduled.
- [ ] `STORAGE_PROVIDER=s3` for multi-instance (no local FS).
- [ ] Rate limiter backed by Redis if multi-instance.
- [ ] CSP headers configured (via `next.config.ts` headers).
- [ ] Admin accounts provisioned; default `USER` for everyone else.
- [ ] `AI_ENABLED` only if a provider is configured.
- [ ] Logs shipped to a log aggregator.
- [ ] Dependency audit: `bun audit` / `npm audit`.

## Reporting a vulnerability

If you find a security issue, please disclose responsibly to the project owner. Do not open a public issue.
