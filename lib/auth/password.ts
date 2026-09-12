import { randomBytes, scrypt as scryptCb, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptCb) as (
  password: string,
  salt: Buffer,
  keylen: number,
) => Promise<Buffer>;

/**
 * Password hashing on node:crypto's scrypt rather than a dependency.
 *
 * scrypt is a memory-hard KDF built for exactly this and it ships with Node, so
 * there is no third-party package in the path between a user's password and the
 * disk. Parameters are the Node defaults (N=16384, r=8, p=1).
 *
 * Format: scrypt$<salt-hex>$<hash-hex> — the algorithm is recorded in the string
 * so a future change of KDF can be rolled out per-user instead of invalidating
 * every password at once.
 */
const KEYLEN = 64;

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const hash = await scrypt(password, salt, KEYLEN);
  return `scrypt$${salt.toString("hex")}$${hash.toString("hex")}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [scheme, saltHex, hashHex] = stored.split("$");
  if (scheme !== "scrypt" || !saltHex || !hashHex) return false;

  const expected = Buffer.from(hashHex, "hex");
  if (expected.length !== KEYLEN) return false;

  const actual = await scrypt(password, Buffer.from(saltHex, "hex"), KEYLEN);
  // Constant-time: a plain === leaks how much of the hash matched, by timing.
  return timingSafeEqual(actual, expected);
}
