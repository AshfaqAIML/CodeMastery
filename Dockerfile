# CodeMastery — Production Docker image
# Multi-stage build for a small, secure, portable image.
#
# Build:  docker build -t codemastery .
# Run:    docker run -p 3000:3000 --env-file .env -v $(pwd)/db:/app/db codemastery

# ---------- 1. Deps stage ----------
FROM node:20-alpine AS deps
WORKDIR /app
RUN apk add --no-cache libc6-compat openssl
COPY package.json bun.lock* yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f bun.lock ]; then npm i -g bun && bun install --frozen-lockfile; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable && pnpm i --frozen-lockfile; \
  elif [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
  else npm ci; fi

# ---------- 2. Build stage ----------
FROM node:20-alpine AS builder
WORKDIR /app
RUN apk add --no-cache libc6-compat openssl
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Prisma needs the client generated at build time
RUN npx prisma generate
ENV NEXT_TELEMETRY_DISABLED=1
RUN \
  if [ -f bun.lock ]; then npm i -g bun && bun run build; \
  else npm run build; fi

# ---------- 3. Runner stage ----------
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN apk add --no-cache libc6-compat openssl
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

# Standalone output from Next.js
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma

# Persist database and uploads
RUN mkdir -p /app/db /app/uploads && chown -R nextjs:nodejs /app/db /app/uploads
VOLUME ["/app/db", "/app/uploads"]

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Apply DB schema then start
CMD ["sh", "-c", "npx prisma db push --accept-data-loss && node server.js"]
