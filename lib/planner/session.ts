"use client";

import { useAuth } from "@/components/auth/AuthProvider";

/**
 * Planner session, sourced from the landing's NextAuth (Auth.js) session.
 *
 * The planner used to run on a local mock auth; in the combined app it reads
 * the real session via the landing's `useAuth()`. `/planner` is a protected
 * route (see auth.config.ts PROTECTED_PREFIXES), so middleware guarantees a
 * signed-in user before any planner page renders. This hook just adapts the
 * landing's user shape to what the planner store expects.
 */
export function useSession() {
  const { user, ready } = useAuth();
  return {
    ready,
    user: user
      ? { id: user.id, email: user.email, name: user.firstName || user.email }
      : null,
  };
}
