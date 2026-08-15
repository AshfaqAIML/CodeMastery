# Database

CodeMastery uses Prisma ORM with a schema that works on both **SQLite** (dev default) and **PostgreSQL** (production). Switching is a configuration change, not a code change.

## Schema overview

Core models:

- `User` — account + gamification state (totalXP, points, level, streaks, role)
- `Account`, `Session`, `VerificationToken` — NextAuth
- `Subject` → `Module` → `Tutorial` — content taxonomy
- `TutorialProgress`, `Bookmark`, `Note` — per-user learning state
- `Quiz` → `QuizQuestion`, `QuizAttempt` → `QuizAnswer` — assessments
- `LearningPath` → `LearningPathStep`, `LearningPathProgress` — curated journeys
- `Achievement`, `UserAchievement` — gamification
- `ActivityLog` — audit trail of XP-earning actions

Relationships use `onDelete: Cascade` for ownership (user → their progress) and `SetNull` for soft links (tutorial → module).

## SQLite (default, dev)

```env
DATABASE_PROVIDER=sqlite
DATABASE_URL=file:./db/custom.db
```

Apply:
```bash
bun run db:push
```

## PostgreSQL (production)

```env
DATABASE_PROVIDER=postgresql
DATABASE_URL=postgresql://user:pass@host:5432/codemastery
```

Apply:
```bash
bun run db:push          # dev: syncs schema directly
# or for managed migrations:
bunx prisma migrate dev --name init
bunx prisma migrate deploy   # production
```

## Migrations

For a managed migration workflow (recommended in production):

```bash
bunx prisma migrate dev --name <change-name>   # create + apply
bunx prisma migrate deploy                      # apply in CI/prod
bunx prisma migrate status                      # check state
bunx prisma migrate reset                       # DEV ONLY: full reset
```

## Portability notes

- The schema avoids SQLite-only types. All fields map cleanly to PostgreSQL.
- `String` is used for JSON-encoded arrays (e.g. quiz options) for cross-DB compatibility.
- Timestamps are `DateTime` (ISO).
- Enums are modeled as plain `String` with app-level validation.

## Backups

```bash
# SQLite
cp db/custom.db db/backup-$(date +%F).db

# PostgreSQL
pg_dump "$DATABASE_URL" > backup-$(date +%F).sql
# restore:
psql "$DATABASE_URL" < backup-YYYY-MM-DD.sql
```

## Content export/import

Use the admin API to export/import all content as JSON (see [content-management.md](content-management.md)). This is the portable way to move the knowledge base between environments.

## Prisma Studio

Inspect data interactively:

```bash
bunx prisma studio
```
