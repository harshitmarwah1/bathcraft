"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import BrandLockup from "@/components/brand/BrandLockup";
import { useI18n } from "@/lib/planner/i18n/provider";
import { useTheme } from "@/lib/planner/theme/provider";
import { MaterialIcon } from "@/components/planner/ui/MaterialIcon";
import { PLANNER_NAV, isNavActive } from "./BottomNav";

/**
 * Planner top bar: the Milagro Universe lockup (the same mark as the site),
 * the planner's destinations on laptops, then language and theme. The step
 * name lives in the step heading, not here.
 */
export function AppHeader() {
  const { t, toggleLanguage } = useI18n();
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();

  return (
    <header className="pl-header">
      <div className="pl-header-inner">
        <Link href="/" className="pl-brand" aria-label={`${t.appName} — home`}>
          <BrandLockup tone={theme === "dark" ? "dark" : "brand"} className="pl-brand-lockup" />
        </Link>

        <nav className="pl-topnav" aria-label={t.appName}>
          {PLANNER_NAV.map((item) => {
            const active = isNavActive(pathname, item);
            return (
              <Link
                key={item.key}
                href={item.href}
                className="pl-topnav-link"
                aria-current={active ? "page" : undefined}
              >
                <MaterialIcon name={item.icon} size={18} />
                {t[item.key]}
              </Link>
            );
          })}
        </nav>

        <div className="pl-header-actions">
          <button type="button" onClick={toggleLanguage} aria-label="Switch language" className="pl-lang">
            <MaterialIcon name="translate" size={15} />
            <span className="pl-lang-current">{t.langLabel}</span>
            <span className="pl-lang-sep" aria-hidden="true">|</span>
            <span className="pl-lang-other">{t.langSecondary}</span>
          </button>
          <button type="button" onClick={toggleTheme} aria-label="Toggle theme" className="pl-icon-btn">
            <MaterialIcon name={theme === "dark" ? "light_mode" : "dark_mode"} size={19} />
          </button>
        </div>
      </div>
    </header>
  );
}
