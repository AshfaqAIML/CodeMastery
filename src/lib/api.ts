import { NextResponse } from "next/server"
import type { ZodError } from "zod"

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ ok: true, data }, init)
}

export function err(message: string, status = 400, details?: unknown) {
  return NextResponse.json(
    { ok: false, error: message, ...(details ? { details } : {}) },
    { status }
  )
}

export function unauthorized(message = "You must be signed in.") {
  return err(message, 401)
}

export function forbidden(message = "You do not have permission to do that.") {
  return err(message, 403)
}

export function notFound(message = "Not found.") {
  return err(message, 404)
}

export function zodErr(e: ZodError) {
  return err("Validation failed", 422, e.flatten())
}

/**
 * Simple in-memory rate limiter (per process). For multi-instance production,
 * swap with Redis-backed limiter behind the same interface.
 */
const buckets = new Map<string, { count: number; resetAt: number }>()

export function rateLimit(
  key: string,
  max: number,
  windowMs: number
): { ok: boolean; remaining: number; resetAt: number } {
  const now = Date.now()
  const b = buckets.get(key)
  if (!b || b.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return { ok: true, remaining: max - 1, resetAt: now + windowMs }
  }
  if (b.count >= max) {
    return { ok: false, remaining: 0, resetAt: b.resetAt }
  }
  b.count++
  return { ok: true, remaining: max - b.count, resetAt: b.resetAt }
}
