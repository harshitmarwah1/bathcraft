"use client";

import Link from "next/link";
import AuthGate from "@/components/auth/AuthGate";
import { useAuth } from "@/components/auth/AuthProvider";
import Navbar from "@/components/site/Navbar";
import Icon from "@/components/ui/Icon";
import { useT } from "@/lib/i18n/useT";

export default function BathroomsPage() {
  // Access is enforced in proxy.ts before this ever renders; AuthGate only
  // holds the frame while the session loads.
  const { onboarding } = useAuth();
  const t = useT();

  return (
    <AuthGate>
      <Navbar />
      <main className="min-h-screen bg-surface pt-[72px]">
        <div className="mx-auto max-w-[1280px] px-5 py-14 sm:px-6 lg:py-20">
          <h1 className="text-[30px] font-bold tracking-[-0.02em] text-ink sm:text-[34px]">
            {t("My Bathrooms")}
          </h1>

          {onboarding?.bathroomName ? (
            <>
              <p className="mt-2 text-[14.5px] text-body">
                {t("Picking up where you left off.")}
              </p>
              <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <li className="rounded-card border border-field bg-surface-raised p-5 shadow-soft">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-wash text-brand">
                    <Icon name="bathtub" size={22} />
                  </span>
                  <h2 className="mt-4 text-[16px] font-semibold text-ink">
                    {onboarding.bathroomName}
                  </h2>
                  <p className="mt-1 text-[13px] text-body-soft">
                    {onboarding.priorities.length
                      ? `${onboarding.priorities.length} ${t("priorities set")}`
                      : t("No measurements yet")}
                  </p>
                  <Link
                    href="/onboarding"
                    className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-brand hover:underline"
                  >
                    {t("Continue planning")}
                    <Icon name="arrowRight" size={14} />
                  </Link>
                </li>
              </ul>
            </>
          ) : (
            <EmptyState />
          )}
        </div>
      </main>
    </AuthGate>
  );
}

/** Newly-registered users land here. Blueprint icon, one sentence, one action. */
function EmptyState() {
  const t = useT();
  return (
    <div className="mt-10 flex flex-col items-center rounded-card border border-field bg-wash/50 px-6 py-16 text-center">
      <svg viewBox="0 0 120 96" width="132" aria-hidden="true" focusable="false" className="mb-7">
        <g fill="none" stroke="var(--color-brand)" strokeLinejoin="round" strokeLinecap="round">
          <rect x="14" y="14" width="92" height="68" rx="3" strokeWidth="2" opacity="0.9" />
          <g strokeWidth="1.2" opacity="0.55">
            <rect x="24" y="24" width="26" height="34" rx="12" />
            <rect x="76" y="24" width="20" height="12" rx="2" />
            <ellipse cx="86" cy="64" rx="10" ry="6" />
            <path d="M24 70h30" />
          </g>
          <g strokeWidth="1" opacity="0.35">
            <path d="M14 8h92M14 4v8M106 4v8" />
          </g>
        </g>
      </svg>

      <h2 className="text-[19px] font-semibold text-ink">
        {t("You haven't created a bathroom yet.")}
      </h2>
      <p className="mt-2 max-w-sm text-[14px] text-body">
        {t("Start with a name and a few measurements — BathCraft takes it from there.")}
      </p>

      <Link
        href="/onboarding"
        className="mt-7 inline-flex h-[52px] items-center justify-center gap-2 rounded-[14px] bg-brand px-7 text-[15px] font-semibold text-on-brand shadow-[0_6px_18px_rgb(7_140_200/0.28)] transition-[transform,background-color] duration-200 hover:-translate-y-px hover:bg-brand-dark motion-reduce:hover:translate-y-0"
      >
        <Icon name="plus" size={17} />
        {t("Create Your First Bathroom")}
      </Link>
    </div>
  );
}
