"use client";

import { SessionProvider, signOut as authSignOut, useSession } from "next-auth/react";
import { useCallback, useMemo } from "react";
import { saveOnboarding } from "@/app/actions/auth";
import type { OnboardingAnswers } from "@/lib/db/types";

export type { OnboardingAnswers };

export type SessionUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  image: string | null;
};

/**
 * React binding over the Auth.js session.
 *
 * The session itself lives in an encrypted, HTTP-only cookie that client
 * JavaScript cannot read; `SessionProvider` fetches the safe projection of it
 * from /api/auth/session and shares it, so a refresh or a route change does not
 * re-authenticate. Nothing here holds a token.
 *
 * The hook keeps the shape the UI already consumed when this was a localStorage
 * mock, so the navbar, gate and pages did not need reworking.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}

export function useAuth() {
  const { data, status, update } = useSession();

  const user: SessionUser | null = useMemo(() => {
    if (!data?.user?.id) return null;
    return {
      id: data.user.id,
      firstName: data.user.firstName ?? "",
      lastName: data.user.lastName ?? "",
      email: data.user.email ?? "",
      image: data.user.image ?? null,
    };
  }, [data]);

  const signOut = useCallback(async () => {
    // Clears the session cookie server-side, then hard-navigates to the landing
    // page. It has to be one navigation: clearing the cookie and letting React
    // re-render a protected page first lets that page's own guard fire and
    // bounce the user to /signin instead of home.
    await authSignOut({ callbackUrl: "/" });
  }, []);

  const completeOnboarding = useCallback(
    async (answers: OnboardingAnswers) => {
      await saveOnboarding(answers);
      /**
       * Re-mint the JWT so `onboarded` flips without a sign-out/sign-in round
       * trip. The argument is required, not decorative: next-auth's `update()`
       * sends a GET when called with nothing, and only a POST sets the
       * `trigger: "update"` that makes the jwt callback re-read the store.
       * The payload itself is ignored — auth.ts reloads from the user record.
       */
      await update({ onboarded: true });
    },
    [update],
  );

  return useMemo(
    () => ({
      user,
      onboarding: data?.user?.onboarding ?? null,
      ready: status !== "loading",
      signOut,
      completeOnboarding,
    }),
    [user, data, status, signOut, completeOnboarding],
  );
}
