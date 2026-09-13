"use client";

import Link from "next/link";
import Icon from "@/components/ui/Icon";
import { useT } from "@/lib/i18n/useT";

/**
 * Post-signup confirmation. The tick draws itself once — a stroke-dashoffset
 * sweep plus one small scale on the ring, no bounce.
 */
export default function AuthSuccess({ onStart }: { onStart: () => void }) {
  const t = useT();
  return (
    <div className="text-center">
      <span className="mx-auto mb-7 flex h-20 w-20 animate-[pop-in_420ms_cubic-bezier(0.16,1,0.3,1)_both] items-center justify-center rounded-full bg-wash motion-reduce:animate-none">
        <svg viewBox="0 0 52 52" width="40" height="40" aria-hidden="true" focusable="false">
          <path
            d="M14 27.5 22.5 36 38 18"
            fill="none"
            stroke="var(--color-brand)"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={1}
            className="animate-[draw-tick_520ms_cubic-bezier(0.65,0,0.35,1)_180ms_both] [stroke-dasharray:1] motion-reduce:animate-none motion-reduce:[stroke-dashoffset:0]"
          />
        </svg>
      </span>

      <h1 className="text-[28px] leading-tight font-bold tracking-[-0.02em] text-balance text-ink">
        {t("Your BathCraft account is ready.")}
      </h1>
      <p className="mt-3 text-[15px] text-body">{t("Let’s start planning your bathroom.")}</p>

      <button
        type="button"
        onClick={onStart}
        className="mt-8 flex h-[52px] w-full items-center justify-center gap-2 rounded-[14px] bg-brand text-[15px] font-semibold text-on-brand shadow-[0_6px_18px_rgb(7_140_200/0.28)] transition-[transform,background-color] duration-200 hover:-translate-y-px hover:bg-brand-dark motion-reduce:hover:translate-y-0"
      >
        {t("Start My First Bathroom")}
        <Icon name="arrowRight" size={16} />
      </button>

      <Link
        href="/"
        className="mt-3 flex h-[52px] w-full items-center justify-center rounded-[14px] border border-field bg-surface-raised text-[14.5px] font-semibold text-ink transition-colors duration-200 hover:bg-wash"
      >
        {t("Explore BathCraft")}
      </Link>
    </div>
  );
}
