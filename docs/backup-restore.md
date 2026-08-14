# Backup & Restore

## What to back up

1. **Database** — users, progress, content, gamification state.
2. **Uploads** — avatar images, cover images (if using local storage).
3. **Environment** — `.env` (store securely, NOT in git).

## Database backups

### SQLite

```bash
# Stop the app (or use SQLite online backup) to ensure consistency
sqlite3 db/custom.db ".backup db/backup-$(date +%F).db"

# Restore
cp db/backup-YYYY-MM-DD.db db/custom.db
```

### PostgreSQL

```bash
# Backup (compressed)
pg_dump "$DATABASE_URL" -Fc -f backup-$(date +%F).dump

# Restore
pg_restore --clean --if-exists -d "$DATABASE_URL" backup-YYYY-MM-DD.dump

# Plain SQL
pg_dump "$DATABASE_URL" > backup-$(date +%F).sql
psql "$DATABASE_URL" < backup-YYYY-MM-DD.sql
```

### Automated (cron)

```bash
# crontab -e
0 2 * * * pg_dump "$DATABASE_URL" -Fc -f /backups/codemastery-$(date +\%F).dump && find /backups -name 'codemastery-*.dump' -mtime +14 -delete
```

## Content export/import (portable JSON)

The admin API supports exporting/importing all content as portable JSON, independent of the database engine:

```bash
# Export (requires admin session cookie)
curl -b cookies.txt $APP_URL/api/admin/export -o content-$(date +%F).json

# Import into another instance
curl -b cookies.txt -X POST -H "Content-Type: application/json" \
  --data @content.json \
  $APP_URL/api/admin/import
```

The JSON contains subjects, modules, tutorials, quizzes, achievements, and learning paths. This is the **recommended portable backup** for the knowledge base.

## Uploads backup (local storage)

```bash
# Tar the uploads dir
tar -czf uploads-$(date +%F).tar.gz uploads/

# Restore
tar -xzf uploads-YYYY-MM-DD.tar.gz
```

For S3 storage, versioning or bucket replication provides backup.

## Environment backup

Store `.env` in a secrets manager (Vault, AWS Secrets Manager, Doppler, etc.). Never commit it to git.

## Disaster recovery procedure

1. Provision a fresh server / database.
2. `git clone` the repo, `cp .env.example .env`, fill in production values.
3. `bun run db:push` to create the schema.
4. Restore the DB dump: `pg_restore ...` (or copy SQLite file).
5. (Optional) `POST /api/admin/import` to restore content from JSON.
6. Restore uploads (or mount S3 bucket).
7. Start the app, verify with the post-deploy checklist.

## Restore testing

Periodically test restores in a staging environment. A backup that has never been restored is not a backup.
