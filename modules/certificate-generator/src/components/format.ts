/**
 * Shared formatting helpers for the certificate components.
 */

export function formatDate(date: Date): string {
  try {
    return date.toLocaleDateString("en-US", {
      year: "numeric", month: "long", day: "numeric",
    })
  } catch {
    return date.toISOString().slice(0, 10)
  }
}
