"use client";

import type { ReactNode } from "react";
import { useAuth } from "./AuthProvider";
import { useT } from "@/lib/i18n/useT";
import { Spinner } from "./fields";

/**
 * Renders nothing until the stored profile has been read, then only for a
 * signed-in user. This is a *UX* guard, not a security boundary — there is no
 * server here, so it keeps signed-out visitors from seeing a half-built screen
 * and nothing more. Real protection belongs in middleware plus an API that
 * refuses unauthenticated requests.
 */
export default function AuthGate({ children }: { children: ReactNode }) {
  const { user, ready } = useAuth();
  const t = useT();

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner className="border-brand/25 border-t-brand" />
        <span className="sr-only">{t("Loading your account…")}</span>
      </div>
    );
  }
  if (!user) return null;
  return <>{children}</>;
}
