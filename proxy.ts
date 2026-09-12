import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

/**
 * Server-side route protection.
 *
 * Next 16 renamed the `middleware` file convention to `proxy`; this is that file.
 * It imports `auth.config.ts`, never `auth.ts` — proxy runs on the Edge runtime
 * and `auth.ts` pulls in node:fs and node:crypto. The `authorized` callback in
 * the config decides which paths need a session.
 *
 * This is the actual security boundary. `AuthGate` on the client only exists to
 * stop a half-built screen from flashing.
 */
const { auth } = NextAuth(authConfig);

export default auth;

export const config = {
  /**
   * Everything except Next internals, the auth endpoint itself and static files.
   * Matching the auth endpoint would make signing in require being signed in.
   */
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon.ico|.*\.(?:png|jpg|jpeg|gif|svg|webp|avif|ico|mp4|webm|txt|xml|woff2?)$).*)",
  ],
};
