import { createHash, randomBytes } from "node:crypto";

/**
 * Password-reset tokens.
 *
 * The token that goes in the email link is 32 random bytes — 256 bits, far
 * beyond guessing. Because it is already high-entropy, a plain SHA-256 is the
 * right thing to store: unlike a password there is nothing to brute-force, so
 * the slow, salted KDF used for passwords (lib/auth/password.ts) would buy
 * nothing here. We store only the hash; the raw token exists only in the link.
 *
 * Lookups compare hashes, so a stolen database row cannot be turned back into a
 * usable link.
 */

/** How long a reset link stays valid. Short: it is a one-time hand-off, not a session. */
export const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

/** SHA-256 of the raw token, hex. One definition so issue and lookup cannot drift. */
export function hashResetToken(rawToken: string): string {
  return createHash("sha256").update(rawToken).digest("hex");
}

/**
 * Mint a new token. Returns the raw token (for the email link) and its hash
 * (for the database) together, so the caller cannot accidentally store the raw
 * one. `base64url` is URL-safe with no padding, so it drops straight into a
 * query string.
 */
export function createResetToken(): { rawToken: string; tokenHash: string } {
  const rawToken = randomBytes(32).toString("base64url");
  return { rawToken, tokenHash: hashResetToken(rawToken) };
}

/** An ISO timestamp TTL from now — what goes in the row's expires_at. */
export function resetTokenExpiry(now: number = Date.now()): string {
  return new Date(now + RESET_TOKEN_TTL_MS).toISOString();
}

/** A stored expiry is in the past. Central so the comparison is written once. */
export function isResetTokenExpired(expiresAt: string, now: number = Date.now()): boolean {
  return new Date(expiresAt).getTime() <= now;
}
