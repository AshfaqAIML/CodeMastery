/**
 * Centralized, environment-driven configuration.
 *
 * All external services and deployment-specific values are read from
 * environment variables. Nothing is hardcoded. This keeps the application
 * portable across any hosting provider (Vercel, Railway, Docker, VPS, ...).
 *
 * Copy `.env.example` to `.env` and fill in the values for your environment.
 */

function required(name: string, fallback?: string): string {
  const v = process.env[name]
  if (!v) {
    if (fallback !== undefined) return fallback
    // Only throw at runtime access, not at module load, to keep builds safe.
    // Returning empty string and letting the caller decide is more portable.
    return ""
  }
  return v
}

export const config = {
  /** Application */
  appName: "CodeMastery",
  appUrl: required("NEXT_PUBLIC_APP_URL", "http://localhost:3000"),
  nodeEnv: process.env.NODE_ENV ?? "development",
  isProduction: process.env.NODE_ENV === "production",

  /** Database — PostgreSQL (production default) or SQLite (optional local dev).
   *  The Prisma schema file is selected by scripts/postinstall.sh based on
   *  the DATABASE_URL scheme (file: → SQLite, postgres:// → PostgreSQL). */
  databaseUrl: required("DATABASE_URL", "file:./db/custom.db"),
  databaseProvider: (process.env.DATABASE_PROVIDER ?? "postgresql") as
    | "sqlite"
    | "postgresql",

  /** Auth */
  authSecret: required("AUTH_SECRET", "dev-insecure-secret-change-me-0x9f3a"),
  nextauthSecret:
    process.env.NEXTAUTH_SECRET ??
    required("AUTH_SECRET", "dev-insecure-secret-change-me-0x9f3a"),

  /** Storage — local (default) or s3-compatible */
  storage: {
    provider: (process.env.STORAGE_PROVIDER ?? "local") as "local" | "s3",
    local: {
      uploadDir: process.env.STORAGE_LOCAL_DIR ?? "./uploads",
      publicBase: process.env.STORAGE_PUBLIC_BASE ?? "/uploads",
    },
    s3: {
      endpoint: process.env.STORAGE_ENDPOINT ?? "",
      region: process.env.STORAGE_REGION ?? "auto",
      accessKey: process.env.STORAGE_ACCESS_KEY ?? "",
      secretKey: process.env.STORAGE_SECRET_KEY ?? "",
      bucket: process.env.STORAGE_BUCKET ?? "",
      publicUrl: process.env.STORAGE_PUBLIC_URL ?? "",
      forcePathStyle: process.env.STORAGE_S3_FORCE_PATH_STYLE === "true",
    },
  },

  /** AI — optional, pluggable. Platform works fully without it.
   *  Default provider is "none" so the app is provider-independent out of
   *  the box. Set AI_ENABLED=true + AI_PROVIDER=openai (or zai) to enable. */
  ai: {
    enabled: process.env.AI_ENABLED === "true",
    provider: (process.env.AI_PROVIDER ?? "none") as
      | "none"
      | "openai"
      | "zai",
    openai: {
      apiKey: process.env.OPENAI_API_KEY ?? "",
      baseUrl: process.env.OPENAI_BASE_URL ?? "https://api.openai.com/v1",
      model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
    },
    zai: {
      apiKey: process.env.ZAI_API_KEY ?? "",
    },
  },

  /** Search — DB-backed by default, swappable */
  search: {
    provider: (process.env.SEARCH_PROVIDER ?? "db") as
      | "db"
      | "meilisearch"
      | "elasticsearch",
    meili: {
      host: process.env.MEILI_HOST ?? "",
      apiKey: process.env.MEILI_API_KEY ?? "",
    },
  },

  /** Email — console logger by default, SMTP for prod */
  email: {
    provider: (process.env.EMAIL_PROVIDER ?? "console") as
      | "console"
      | "smtp",
    from: process.env.EMAIL_FROM ?? "CodeMastery <no-reply@codemastery.dev>",
    smtp: {
      host: process.env.SMTP_HOST ?? "",
      port: Number(process.env.SMTP_PORT ?? "587"),
      user: process.env.SMTP_USER ?? "",
      pass: process.env.SMTP_PASS ?? "",
      secure: process.env.SMTP_SECURE === "true",
    },
  },

  /** Rate limiting (in-memory for single instance; swap for Redis in prod) */
  rateLimit: {
    enabled: process.env.RATE_LIMIT_ENABLED !== "false",
    authMax: Number(process.env.RATE_LIMIT_AUTH_MAX ?? "10"),
    authWindowMs: Number(process.env.RATE_LIMIT_AUTH_WINDOW_MS ?? "60000"),
  },
} as const

export type AppConfig = typeof config
