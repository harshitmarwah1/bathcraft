"use client";

import { useSyncExternalStore } from "react";
import Icon from "@/components/ui/Icon";
import {
  getResolvedServerSnapshot,
  getResolvedSnapshot,
  setTheme,
  subscribe,
  type ResolvedTheme,
} from "@/lib/theme";

/**
 * Sun / moon switch for the navbar.
 *
 * Clicking sets an explicit light or dark preference. The third state,
 * "system", is the default and is reachable by clearing site data — a
 * three-way control in the header would cost more than it is worth here, but
 * the store keeps the distinction so the page follows the OS until asked not to.
 *
 * The resolved theme comes through useSyncExternalStore, so the hydration
 * render uses the server value and the real one lands on the pass after.
 * Reading matchMedia during render instead is exactly what produces a
 * hydration mismatch and a console full of warnings.
 */
export default function ThemeToggle({ className = "" }: { className?: string }) {
  const resolved = useSyncExternalStore<ResolvedTheme>(
    subscribe,
    getResolvedSnapshot,
    getResolvedServerSnapshot,
  );
  const isDark = resolved === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className={[
        "relative flex h-10 w-10 items-center justify-center rounded-full text-body",
        "max-sm:h-11 max-sm:w-11",
        "transition-colors hover:bg-wash hover:text-brand",
        className,
      ].join(" ")}
    >
      {/* Both icons are always present and cross-fade. Swapping the element
          instead would make the button jump as the glyph metrics change. */}
      <Icon
        name="sun"
        size={18}
        className={[
          "absolute transition-[opacity,transform] duration-200",
          isDark ? "rotate-90 scale-75 opacity-0" : "rotate-0 scale-100 opacity-100",
          "motion-reduce:transition-none",
        ].join(" ")}
      />
      <Icon
        name="moon"
        size={18}
        className={[
          "absolute transition-[opacity,transform] duration-200",
          isDark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-75 opacity-0",
          "motion-reduce:transition-none",
        ].join(" ")}
      />
    </button>
  );
}
