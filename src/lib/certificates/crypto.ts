import { randomBytes } from "crypto"

/**
 * Cryptographically strong verification token.
 * 24 random bytes → 32 URL-safe base64 chars (~192 bits entropy).
 * Never derived from the DB id or the certificate number: the token is what
 * makes a certificate unforgeable even though the number is sequential.
 */
export function makeVerificationToken(): string {
  return randomBytes(24).toString("base64url")
}