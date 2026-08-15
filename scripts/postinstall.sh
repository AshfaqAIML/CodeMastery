#!/usr/bin/env bash
# Smart Prisma client generator — picks the right schema based on DATABASE_URL.
#
# - If DATABASE_URL starts with "file:"  → generate from SQLite schema (local dev)
# - If DATABASE_URL starts with "postgres" → generate from PostgreSQL schema (prod)
# - If DATABASE_URL is unset → default to PostgreSQL (for Vercel build safety)
#
# This keeps `bun install` / `vercel build` working in both environments
# without manual schema swapping.

set -euo pipefail
cd "$(dirname "$0")/.."

URL="${DATABASE_URL:-}"
SCHEMA="prisma/schema.prisma"          # PostgreSQL (default)

if [[ "$URL" == file:* ]]; then
  SCHEMA="prisma/schema.sqlite.prisma"
  echo "[postinstall] DATABASE_URL is a file: path → using SQLite schema"
else
  echo "[postinstall] DATABASE_URL is postgres:// (or unset) → using PostgreSQL schema"
fi

exec bunx prisma generate --schema="$SCHEMA"
