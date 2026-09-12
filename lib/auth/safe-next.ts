/**
 * Narrows an arbitrary `next` parameter to a path we are willing to send a
 * freshly-authenticated user to.
 *
 * Only same-site absolute paths pass. `//evil.example` is rejected explicitly:
 * it is protocol-relative, so a browser reads it as another origin even though
 * it starts with a slash — the classic open-redirect hole.
 */
export function safeNext(value: string | string[] | undefined | null): string | null {
  const raw = Array.isArray(value) ? value[0] : value;
  if (typeof raw !== "string" || !raw.startsWith("/")) return null;
  if (raw.startsWith("//") || raw.startsWith("/\\")) return null;
  return raw;
}
