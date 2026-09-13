"use client";

import Image from "next/image";
import Link from "next/link";
import Icon from "@/components/ui/Icon";
import { FOOTER_LINKS, SOCIALS } from "@/lib/content";
import { useT } from "@/lib/i18n/useT";
import { useResolvedTheme } from "@/lib/useTheme";

/** White footer. The logo here is the static lockup — it has already animated. */
export default function Footer() {
  const t = useT();
  // logo-full.png has no alpha — see BathCraftLogoAnimation.
  const dark = useResolvedTheme() === "dark";
  return (
    <footer className="border-t border-hairline bg-surface">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-8 px-5 py-10 sm:px-6 lg:flex-row lg:items-center lg:gap-10">
        <div className="shrink-0">
          <Image
            src={dark ? "/logo/logo-white.png" : "/logo/logo-full.png"}
            alt="BathCraft"
            width={846}
            height={272}
            className="h-9 w-auto"
          />
          <p className="mt-2 text-[11.5px] text-body-soft">{t("Plan Better. Build Smarter.")}</p>
        </div>

        <nav aria-label="Footer" className="lg:mx-auto">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {FOOTER_LINKS.map(({ label, href }) => (
              <li key={label}>
                <Link
                  href={href}
                  className="text-[13px] text-body transition-colors hover:text-brand"
                >
                  {t(label)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <ul className="flex items-center gap-2">
          {SOCIALS.map(({ label, href, icon }) => (
            <li key={label}>
              <a
                href={href}
                aria-label={t(label)}
                className="flex h-9 w-9 items-center justify-center rounded-full text-body transition-colors hover:bg-wash hover:text-brand max-sm:h-11 max-sm:w-11"
              >
                <Icon name={icon} size={18} />
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="mx-auto max-w-[1280px] px-5 pb-8 text-right text-[11.5px] text-body-soft sm:px-6">
        © {new Date().getFullYear()} BathCraft. {t("All rights reserved.")}
      </div>
    </footer>
  );
}
