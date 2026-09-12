import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

/**
 * The half of the Auth.js config that is safe to run on the Edge runtime.
 *
 * Middleware runs on Edge, where `node:crypto` and `node:fs` do not exist — so
 * anything that touches the user store or hashes a password lives in `auth.ts`
 * instead and is spread on top of this. Middleware only needs to *verify* the
 * session cookie and decide whether a route is allowed, which needs neither.
 *
 * This split is Auth.js's documented pattern, not a workaround.
 */

/**
 * Routes that require a signed-in user. `/bathrooms` and `/onboarding` exist
 * today; the rest are listed so they are protected from the moment someone
 * builds them, rather than shipping open and being noticed later.
 */
export const PROTECTED_PREFIXES = [
  "/bathrooms",
  "/my-bathrooms",
  "/my-plans",
  "/onboarding",
  "/account",
  "/planner",
] as const;

export const isProtected = (pathname: string) =>
  PROTECTED_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));

export const authConfig = {
  providers: [
    Google({
      /**
       * The minimum for authentication and nothing else. No Gmail, Drive or
       * Calendar — asking for a scope BathCraft does not use costs the user a
       * scarier consent screen and costs us a Google verification review.
       */
      authorization: {
        params: { scope: "openid email profile", prompt: "select_account" },
      },
      /**
       * Off, deliberately. With this on, anyone who can get Google to assert an
       * email address takes over the matching password account. Linking is
       * handled explicitly in `auth.ts` and requires proving control of the
       * existing account first.
       */
      allowDangerousEmailAccountLinking: false,
      /**
       * PKCE alone already binds the authorization code to this browser, but
       * state and nonce are free and cover different things: state ties the
       * callback to the request that started it, nonce ties the ID token to it.
       * Auth.js generates and verifies all three — none of it is hand-rolled.
       */
      checks: ["pkce", "state", "nonce"],
    }),
  ],

  /**
   * JWT, not database sessions: there is no database adapter (see lib/db/store.ts).
   * Auth.js encrypts the token into an HTTP-only, SameSite=Lax, Secure-in-prod
   * cookie. Nothing sensitive is ever handed to client JavaScript.
   */
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },

  pages: {
    signIn: "/signin",
    error: "/signin",
  },

  callbacks: {
    /** Route protection. Runs in middleware, so it must stay Edge-safe. */
    authorized({ request, auth }) {
      if (!isProtected(request.nextUrl.pathname)) return true;
      return Boolean(auth?.user);
    },

    /**
     * Only ever redirect within BathCraft. An open redirect here would let a
     * crafted `callbackUrl` bounce a freshly-authenticated user to an attacker's
     * page with the referrer intact.
     */
    redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      try {
        if (new URL(url).origin === baseUrl) return url;
      } catch {
        // Unparseable — fall through to baseUrl.
      }
      return baseUrl;
    },
  },

  trustHost: true,
} satisfies NextAuthConfig;
