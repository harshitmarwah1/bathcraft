"use client";

import { useCallback, useSyncExternalStore } from "react";
import { hi } from "./dictionary";
import { getServerSnapshot, getSnapshot, subscribe, type Locale } from "./locale";

/** The active language, read through the store so hydration stays honest. */
export function useLocale(): Locale {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/**
 * Translate. `t("Sign in")` returns the Hindi when the locale is Hindi and a
 * translation exists, and the English string itself otherwise.
 *
 * The fallback is the point: a missing entry shows correct English rather than
 * a key like `auth.signIn`, so an incomplete dictionary degrades into a
 * partly-English page instead of a broken one.
 */
export function useT() {
  const locale = useLocale();
  return useCallback((s: string) => (locale === "hi" ? (hi[s] ?? s) : s), [locale]);
}
