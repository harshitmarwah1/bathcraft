"use client";

import { createContext, useContext, useSyncExternalStore } from "react";
import type { Theme } from "@/lib/planner/types";

const STORAGE_KEY = "bathcraft.theme";

/* ── Module-level store, read via useSyncExternalStore ──
 * The planner is scoped to a `.bc-planner` wrapper (see PlannerFrame); that
 * element carries `data-theme`, so this store only tracks the value + persists
 * it — it never touches the document root, keeping the landing's theme intact. */

let current: Theme | null = null;
const listeners = new Set<() => void>();

function readInitial(): Theme {
  if (typeof window === "undefined") return "light";
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY) as Theme | null;
    if (saved === "light" || saved === "dark") return saved;
    if (window.matchMedia?.("(prefers-color-scheme: dark)").matches) return "dark";
  } catch {
    /* ignore */
  }
  return "light";
}

function getSnapshot(): Theme {
  if (current === null) current = readInitial();
  return current;
}

function getServerSnapshot(): Theme {
  return "light";
}

function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function setThemeValue(theme: Theme) {
  current = theme;
  try {
    window.localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    /* ignore */
  }
  listeners.forEach((cb) => cb());
}

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const value: ThemeContextValue = {
    theme,
    setTheme: setThemeValue,
    toggleTheme: () => setThemeValue(theme === "dark" ? "light" : "dark"),
  };
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
