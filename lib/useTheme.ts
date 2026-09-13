"use client";

import { useSyncExternalStore } from "react";
import {
  getResolvedServerSnapshot,
  getResolvedSnapshot,
  subscribe,
  type ResolvedTheme,
} from "./theme";

/**
 * The theme actually on screen, for the few places that need to swap an asset
 * rather than a colour — the logo rasters, which have no alpha and so cannot be
 * recoloured with CSS.
 *
 * Read through useSyncExternalStore so the hydration render uses the server
 * value and the browser value lands on the pass after.
 */
export function useResolvedTheme(): ResolvedTheme {
  return useSyncExternalStore(subscribe, getResolvedSnapshot, getResolvedServerSnapshot);
}
