"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import BrandLockup from "@/components/brand/BrandLockup";
import Icon from "@/components/ui/Icon";
import { Annotation, CurvedArrow } from "@/components/ui/Annotation";
import { useT } from "@/lib/i18n/useT";

/**
 * The split-screen shell every auth step sits inside.
 *
 * Left is the cinematic panel — the landing page's own hero photograph under a
 * heavier scrim, so this reads as the same product rather than a bolted-on
 * login. Below 1024px it collapses to a short cropped strip and the form takes
 * the full width, because a half-height photograph on a phone is just something
 * to scroll past.
 */
export default function AuthLayout({ children }: { children: ReactNode }) {
  const t = useT();
  return (
    <div className="flex min-h-screen flex-col bg-surface lg:flex-row">
      {/* ---------------- Left: cinematic panel ---------------- */}
      <aside className="relative isolate h-[168px] shrink-0 overflow-hidden sm:h-[210px] lg:h-auto lg:w-[53%]">
        <Image
          src="/photos/hero.jpg"
          alt=""
          aria-hidden="true"
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 53vw"
          className="object-cover object-[center_58%]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(160deg,rgb(8_16_28/0.78),rgb(8_16_28/0.55)_45%,rgb(8_16_28/0.85))]"
        />

        {/* Compact on mobile: just the logo over the strip. */}
        <div className="relative z-10 flex h-full flex-col p-6 sm:p-8 lg:p-12">
          <Link href="/" aria-label={t("Milagro Universe — back to home")} className="w-fit">
            <BrandLockup tone="white" className="h-8 w-auto lg:h-10" />
          </Link>
          <p className="mt-4 hidden text-[16px] font-medium text-white/75 lg:block">
            {t("Plan · Visualize · Build")}
          </p>

          <div className="mt-auto hidden lg:block">
            <h2 className="max-w-lg text-[clamp(2.5rem,1.5rem+2vw,3.75rem)] leading-[1.05] font-semibold tracking-[-0.03em] text-white">
              {t("Plan better.")}
              <br />
              {t("Build with confidence.")}
            </h2>
            <p className="mt-6 max-w-md text-[17px] leading-relaxed text-white/75">
              {t(
                "Save your bathroom plans, compare ideas, track materials and continue your renovation journey from anywhere.",
              )}
            </p>

            {/* Handwritten note pointing at the blueprint detail. */}
            <div className="mt-12 flex items-end gap-3 text-white/85">
              <Annotation className="block text-[19px] leading-snug text-white" rotate={-4}>
                {t("Your dream bathroom starts with a plan.")}
              </Annotation>
              <CurvedArrow dir="down-right" width={58} className="mb-1" />
              <BlueprintDetail />
            </div>

            <ul className="mt-12 flex items-center gap-6 text-white/80">
              {[
                { icon: "home", a: t("Better"), b: t("Decisions") },
                { icon: "piggy", a: t("Save Time"), b: t("& Money") },
                { icon: "sparkle", a: t("Beautiful"), b: t("Results") },
              ].map(({ icon, a, b }) => (
                <li key={a} className="flex items-center gap-2.5">
                  <Icon name={icon as "home"} size={22} />
                  <span className="text-[14px] leading-tight">
                    {a}
                    <br />
                    {b}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </aside>

      {/* ---------------- Right: the form ---------------- */}
      <main className="flex flex-1 items-center justify-center px-5 py-10 sm:px-8 lg:px-12 lg:py-16">
        <div className="w-full max-w-[480px]">{children}</div>
      </main>
    </div>
  );
}

/** The faint plan drawing the handwritten note points at. Decorative. */
function BlueprintDetail() {
  return (
    <svg
      viewBox="0 0 150 112"
      width={168}
      aria-hidden="true"
      focusable="false"
      className="hidden shrink-0 opacity-55 xl:block"
    >
      <g fill="none" stroke="#ffffff" strokeLinejoin="round" strokeLinecap="round">
        <rect x="18" y="20" width="118" height="80" strokeWidth="1.6" />
        <g strokeWidth="0.9">
          <rect x="26" y="28" width="30" height="52" rx="14" />
          <rect x="96" y="28" width="16" height="10" rx="1.5" />
          <path d="M97 38h14l-1.8 15a4 4 0 0 1-4 3.4h-2.4a4 4 0 0 1-4-3.4z" />
          <rect x="100" y="70" width="28" height="18" rx="2" />
          <ellipse cx="114" cy="79" rx="9" ry="5.5" />
          <path d="M64 28v52" opacity="0.5" />
        </g>
        <g strokeWidth="0.8" opacity="0.75">
          <path d="M18 12h118M18 8v8M136 8v8" />
          <path d="M8 20v80M4 20h8M4 100h8" />
        </g>
      </g>
      <g fill="#ffffff" fontFamily="ui-monospace, monospace" fontSize="8">
        <text x="77" y="9" textAnchor="middle">
          8 ft
        </text>
        <text x="2" y="63" textAnchor="middle" transform="rotate(-90 2 63)">
          6 ft
        </text>
      </g>
    </svg>
  );
}
