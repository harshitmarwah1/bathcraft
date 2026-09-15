"use client";

import { setLocale } from "@/lib/i18n/locale";
import { useLocale, useT } from "@/lib/i18n/useT";

/**
 * English / Hindi switch for the navbar.
 *
 * The button shows the language you would switch TO, not the one you are in —
 * someone who cannot read the current language needs to recognise the way out,
 * and "हिं" is recognisable to a Hindi reader looking at an English page.
 *
 * The label is deliberately not translated in both directions: "View in
 * English" stays English so it is legible to someone stuck in a language they
 * did not want.
 */
export default function LanguageToggle({ className = "" }: { className?: string }) {
  const locale = useLocale();
  const t = useT();
  const next = locale === "hi" ? "en" : "hi";
  const label = locale === "hi" ? "View in English" : t("Switch to Hindi");

  return (
    <button
      type="button"
      onClick={() => setLocale(next)}
      aria-label={label}
      title={label}
      lang={next}
      className={[
        "flex h-10 min-w-10 items-center justify-center rounded-full px-2.5",
        "text-[12.5px] font-semibold text-body transition-colors hover:bg-wash hover:text-brand",
        "max-sm:h-11 max-sm:min-w-11",
        className,
      ].join(" ")}
    >
      {locale === "hi" ? "EN" : "हिं"}
    </button>
  );
}
