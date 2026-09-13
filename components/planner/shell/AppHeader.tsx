"use client";

import { useI18n } from "@/lib/planner/i18n/provider";
import { useTheme } from "@/lib/planner/theme/provider";
import { MaterialIcon } from "@/components/planner/ui/MaterialIcon";

/** Top app bar — logo + PWA badge + language and theme toggles. Matches the
 *  Stitch export header 1:1. */
export function AppHeader({ subtitle }: { subtitle?: string }) {
  const { t, toggleLanguage } = useI18n();
  const { theme, toggleTheme } = useTheme();

  return (
    <header
      style={{
        flexShrink: 0,
        height: 64,
        padding: "0 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 8,
        background: "var(--color-header-bg)",
        borderBottom: "1px solid var(--color-surface-high)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0, flex: 1 }}>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: "var(--color-primary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <MaterialIcon name="architecture" size={18} color="var(--color-on-primary)" />
        </div>
        <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span
              style={{
                fontWeight: 800,
                fontSize: 17,
                color: "var(--color-on-surface)",
                letterSpacing: "-0.2px",
              }}
            >
              {t.appName}
            </span>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 2,
                padding: "2px 6px",
                borderRadius: 6,
                background: "var(--color-primary-fixed)",
                color: "var(--color-on-primary-fixed)",
                fontSize: 10,
                fontWeight: 800,
                letterSpacing: "0.3px",
              }}
            >
              PWA
            </span>
          </div>
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: "var(--color-primary-accent)",
              display: "flex",
              alignItems: "center",
              gap: 4,
              whiteSpace: "nowrap",
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "var(--color-primary)",
                flexShrink: 0,
              }}
            />
            <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
              {subtitle ?? t.appSub}
            </span>
          </span>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
        <button
          onClick={toggleLanguage}
          aria-label="Switch language"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            padding: "6px 10px",
            borderRadius: 999,
            background: "var(--color-surface-low)",
            border: "1px solid var(--color-surface-high)",
            color: "var(--color-on-surface)",
            fontWeight: 700,
            fontSize: 12,
            cursor: "pointer",
          }}
        >
          <MaterialIcon name="translate" size={15} color="var(--color-primary-accent)" />
          <span style={{ color: "var(--color-primary-accent)", fontWeight: 800 }}>
            {t.langLabel}
          </span>
          <span style={{ color: "var(--color-on-surface-variant)", fontSize: 10 }}>|</span>
          <span style={{ color: "var(--color-on-surface-variant)", fontSize: 10 }}>
            {t.langSecondary}
          </span>
        </button>
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          style={{
            width: 36,
            height: 36,
            borderRadius: 999,
            background: "var(--color-surface-low)",
            border: "1px solid var(--color-surface-high)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <MaterialIcon
            name={theme === "dark" ? "light_mode" : "dark_mode"}
            size={19}
            color="var(--color-theme-icon)"
          />
        </button>
      </div>
    </header>
  );
}
