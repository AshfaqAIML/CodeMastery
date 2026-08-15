#!/usr/bin/env bash
# Smart Prisma db push — picks the right schema based on DATABASE_URL.
#
# - If DATABASE_URL starts with "file:"  → push SQLite schema (local dev)
# - If DATABASE_URL starts with "postgres" → push PostgreSQL schema (prod/Vercel)
# - If DATABASE_URL is unset → error (we can't guess)
#
# After pushing, the schema is reflected in the target database. Run
# `bun run db:seed` afterwards to populate content (idempotent).

set -euo pipefail
cd "$(dirname "$0")/.."

URL="${DATABASE_URL:-}"
SCHEMA="prisma/schema.prisma"          # PostgreSQL (default)

if [[ -z "$URL" ]]; then
  echo "[db-push] ERROR: DATABASE_URL is not set. Set it in .env first."
  echo "           For local SQLite: DATABASE_URL=file:./db/custom.db"
  echo "           For Postgres:     DATABASE_URL=postgresql://user:pass@host:5432/db"
  exit 1
fi

if [[ "$URL" == file:* ]]; then
  SCHEMA="prisma/schema.sqlite.prisma"
  echo "[db-push] DATABASE_URL is a file: path → pushing SQLite schema"
else
  echo "[db-push] DATABASE_URL is postgres:// → pushing PostgreSQL schema"
fi

exec bunx prisma db push --schema="$SCHEMA" --accept-data-loss
