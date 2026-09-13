"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/lib/planner/i18n/provider";
import { MaterialIcon } from "@/components/planner/ui/MaterialIcon";

const ITEMS = [
  { key: "navBathrooms", icon: "bathtub", href: "/bathrooms" },
  { key: "navPlanner", icon: "architecture", href: "/planner/space" },
  { key: "navGuides", icon: "menu_book", href: "/planner/guides" },
  { key: "navDocs", icon: "folder_shared", href: "/planner/docs" },
] as const;

export function BottomNav() {
  const { t } = useI18n();
  const pathname = usePathname();

  return (
    <nav
      style={{
        flexShrink: 0,
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        height: 64,
        alignItems: "center",
        background: "var(--color-surface-lowest)",
        borderTop: "1px solid var(--color-surface-high)",
        padding: "0 4px",
      }}
    >
      {ITEMS.map((item) => {
        // "Planner" stays active across all wizard steps; guides/docs are their
        // own /planner sub-routes, so exclude them from the Planner match.
        const active =
          item.key === "navPlanner"
            ? pathname.startsWith("/planner") &&
              !pathname.startsWith("/planner/guides") &&
              !pathname.startsWith("/planner/docs")
            : pathname.startsWith(item.href);
        const color = active ? "var(--color-primary-accent)" : "var(--color-on-surface-variant)";
        return (
          <Link
            key={item.key}
            href={item.href}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
              color,
              fontWeight: active ? 700 : 600,
              textDecoration: "none",
            }}
          >
            <MaterialIcon name={item.icon} size={22} color={color} />
            <span style={{ fontSize: 10, fontWeight: active ? 700 : 600 }}>{t[item.key]}</span>
          </Link>
        );
      })}
    </nav>
  );
}
