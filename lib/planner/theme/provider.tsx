"use client";

import { createContext, useContext } from "react";
import type { Theme } from "@/lib/planner/types";
import { setTheme as setSiteTheme } from "@/lib/theme";
import { useResolvedTheme } from "@/lib/useTheme";

/*
 * The planner follows the site's single theme (lib/theme.ts): same storage key,
 * same root attribute, same "system" default. It used to keep its own copy,
 * which only wrote storage and never the root attribute, so the site tokens the
 * planner now reads would not repaint when it was toggled here.
 */

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useResolvedTheme();
  const value: ThemeContextValue = {
    theme,
    setTheme: (next) => setSiteTheme(next),
    toggleTheme: () => setSiteTheme(theme === "dark" ? "light" : "dark"),
  };
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
