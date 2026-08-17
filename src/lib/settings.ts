import { db } from "@/lib/db"

/**
 * PlatformSetting service — database-backed operational configuration.
 *
 * Design rules:
 * - Secrets (API keys, tokens) live ONLY in environment variables and are
 *   NEVER persisted through this store.
 * - `isSecret` entries are only ever returned masked to the admin UI.
 * - A short in-process cache keeps reads cheap; watch for multi-instance
 *   staleness (acceptable for operational config; env vars stay authoritative).
 */

const cache = new Map<string, { value: string; at: number }>()
const CACHE_TTL_MS = 30_000

type Loaded = { key: string; value: string; valueType: string; isSecret: boolean; group: string }

export async function getSetting(key: string): Promise<Loaded | null> {
  const hit = cache.get(key)
  if (hit && Date.now() - hit.at < CACHE_TTL_MS) {
    const raw = hit.value
    const entry = JSON.parse(raw) as Loaded
    return entry
  }
  const row = await db.platformSetting.findUnique({ where: { key } })
  if (!row) return null
  cache.set(key, { value: JSON.stringify(row), at: Date.now() })
  return {
    key: row.key,
    value: row.value,
    valueType: row.valueType,
    isSecret: row.isSecret,
    group: row.group,
  }
}

/** Read a setting with a typed fallback. */
export async function getSettingValue<T>(
  key: string,
  fallback: T
): Promise<T> {
  const s = await getSetting(key)
  if (!s) return fallback
  switch (s.valueType) {
    case "number":
      return (Number(s.value) as T) || fallback
    case "boolean":
      return (s.value === "true" || s.value === "1") as T || fallback
    case "json":
      try {
        return JSON.parse(s.value) as T
      } catch {
        return fallback
      }
    default:
      return (s.value as T) || fallback
  }
}

/** Mask a secret for admin display (e.g. "sk-abc…XYZ"). */
export function maskSecret(value: string): string {
  if (!value) return ""
  if (value.length <= 8) return "••••••••"
  return `${value.slice(0, 6)}••••${value.slice(-4)}`
}

/**
 * Upsert a setting keyed by unique `key`. Invalidates the cache.
 * `valueType` and `isSecret` describe how the UI may render it.
 */
export async function upsertSetting(input: {
  key: string
  value: string
  valueType?: string
  group?: string
  isSecret?: boolean
  updatedBy?: string | null
}) {
  const row = await db.platformSetting.upsert({
    where: { key: input.key },
    create: {
      key: input.key,
      value: input.value,
      valueType: input.valueType ?? "string",
      group: input.group ?? "general",
      isSecret: input.isSecret ?? false,
      updatedBy: input.updatedBy ?? null,
    },
    update: {
      value: input.value,
      valueType: input.valueType ?? undefined,
      group: input.group ?? undefined,
      isSecret: input.isSecret ?? undefined,
      updatedBy: input.updatedBy ?? null,
    },
  })
  cache.delete(input.key)
  return row
}

/** All settings in a group, with secrets masked. */
export async function listSettings(group?: string) {
  const rows = await db.platformSetting.findMany({
    where: group ? { group } : undefined,
    orderBy: { key: "asc" },
  })
  return rows.map((r) => ({
    key: r.key,
    value: r.isSecret ? maskSecret(r.value) : r.value,
    valueType: r.valueType,
    isSecret: r.isSecret,
    group: r.group,
    updatedAt: r.updatedAt,
    updatedBy: r.updatedBy,
  }))
}

export async function deleteSetting(key: string) {
  cache.delete(key)
  return db.platformSetting.delete({ where: { key } })
}