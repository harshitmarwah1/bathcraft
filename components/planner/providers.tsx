"use client";

import type { ReactNode } from "react";
import { ThemeProvider } from "@/lib/planner/theme/provider";
import { I18nProvider } from "@/lib/planner/i18n/provider";

/** App-wide client providers (theme + i18n). */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <I18nProvider>{children}</I18nProvider>
    </ThemeProvider>
  );
}
