"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import AuthLayout from "@/components/auth/AuthLayout";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import Icon from "@/components/ui/Icon";
import { useT } from "@/lib/i18n/useT";

/**
 * The page an emailed reset link opens. It is deliberately outside the
 * protected prefixes (auth.config.ts) — someone resetting a password is by
 * definition signed out. The token rides in `?token=`; without a valid-looking
 * one there is nothing to do but send the person back to request a fresh link.
 */
function ResetPasswordInner() {
  const t = useT();
  const params = useSearchParams();
  const token = params.get("token")?.trim() ?? "";

  return (
    <AuthLayout>
      <div className="relative">
        <Link
          href="/"
          aria-label="Close and return to the Milagro Universe home page"
          className="absolute -top-2 right-0 z-10 flex h-10 w-10 items-center justify-center rounded-full text-body-soft transition-colors hover:bg-wash hover:text-ink max-sm:h-11 max-sm:w-11 lg:-top-6"
        >
          <Icon name="close" size={20} />
        </Link>

        <div className="animate-[panel-in_260ms_cubic-bezier(0.16,1,0.3,1)_both] motion-reduce:animate-none">
          {token ? (
            <ResetPasswordForm token={token} />
          ) : (
            <div>
              <span className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-danger/10 text-danger">
                <Icon name="warning" size={26} />
              </span>
              <h1 className="text-[30px] leading-tight font-bold tracking-[-0.02em] text-ink">
                {t("This link isn't valid")}
              </h1>
              <p className="mt-3 text-[14.5px] leading-relaxed text-body">
                {t(
                  "The reset link is missing or incomplete. Request a new one and we'll email you a fresh link.",
                )}
              </p>
              <Link
                href="/signin"
                className="mt-8 flex h-[52px] w-full items-center justify-center rounded-[14px] bg-brand text-[15px] font-semibold text-on-brand shadow-[0_6px_18px_rgb(7_140_200/0.28)] transition-[transform,background-color] duration-200 hover:-translate-y-px hover:bg-brand-dark motion-reduce:hover:translate-y-0"
              >
                {t("Back to Sign In")}
              </Link>
            </div>
          )}
        </div>
      </div>
    </AuthLayout>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordInner />
    </Suspense>
  );
}
