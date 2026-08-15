# Local Development

## Prerequisites

- Node.js ≥ 20 OR Bun ≥ 1.1 (Bun recommended for speed)
- Git
- A PostgreSQL instance (optional — SQLite is the dev default)

## First-time setup

```bash
git clone <repo-url> codemastery
cd codemastery
bun install          # or npm install
cp .env.example .env
bun run db:push      # creates SQLite DB at db/custom.db
bun run prisma/seed.ts   # optional: seed CS content
bun run dev          # starts on http://localhost:3000
```

## Useful scripts

| Script                  | Purpose                                  |
|-------------------------|------------------------------------------|
| `bun run dev`           | Start dev server (port 3000, hot reload) |
| `bun run build`         | Production build (standalone output)     |
| `bun run lint`          | ESLint + Next.js rules                    |
| `bun run db:push`       | Apply Prisma schema to DB (accepts data loss) |
| `bun run db:generate`   | Regenerate Prisma Client                  |
| `bun run db:migrate`    | Create + apply a migration (dev)          |
| `bun run db:reset`      | Drop + recreate DB (destructive)          |
| `bun run prisma/seed.ts`| Seed sample CS content                    |

## Database GUI

```bash
bunx prisma studio   # opens Prisma Studio at http://localhost:5555
```

## Regenerating the Prisma Client

After editing `prisma/schema.prisma`:

```bash
bun run db:push      # syncs schema + regenerates client
# or explicitly:
bun run db:generate
```

## File layout

```
src/
├── app/                  Next.js App Router (layout, page, api/*)
│   ├── api/              REST route handlers
│   │   ├── auth/         NextAuth + register
│   │   ├── subjects/
│   │   ├── tutorials/
│   │   ├── progress/
│   │   ├── bookmarks/
│   │   ├── notes/
│   │   ├── search/
│   │   ├── quizzes/
│   │   ├── leaderboard/
│   │   ├── achievements/
│   │   ├── me/
│   │   ├── onboarding/
│   │   └── admin/        content management + export/import
├── components/
│   ├── ui/               shadcn/ui primitives
│   ├── layout/           header, footer, sidebar, shell
│   ├── views/            SPA views
│   ├── shared/           reusable pieces
│   └── providers/        theme + app providers
├── lib/
│   ├── auth.ts           NextAuth config
│   ├── db.ts             Prisma client
│   ├── config.ts         env-driven config
│   ├── store.ts          Zustand SPA router
│   ├── gamification.ts   XP/level/streak math
│   ├── api.ts            response helpers + rate limit
│   ├── password.ts       scrypt hashing
│   ├── session.ts        server-side session helper
│   ├── storage/          StorageService abstraction
│   ├── ai/               AIService abstraction
│   ├── search/           SearchService abstraction
│   └── email/            EmailService abstraction
├── hooks/                React hooks
└── lib/                  shared utilities

prisma/
├── schema.prisma         full data model
└── seed.ts               content seed
```

## Adding a new feature

1. Add/modify models in `prisma/schema.prisma`, run `bun run db:push`.
2. Create route handler(s) under `src/app/api/<feature>/`.
3. Add a view under `src/components/views/`.
4. Register the view in the SPA shell switch.
5. Verify with the browser.
