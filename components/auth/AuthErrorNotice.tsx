"use client";

import Icon from "@/components/ui/Icon";
import { useT } from "@/lib/i18n/useT";

/**
 * Every way Google sign-in can fail, turned into something a person can act on.
 *
 * Auth.js funnels OAuth failures back to `pages.error` (here, /signin) with an
 * `?error=` code. Codes we do not recognise still land on a real message with a
 * retry rather than a blank screen or a spinner that never stops.
 */
const MESSAGES: Record<string, { title: string; body: string }> = {
  AccountExists: {
    title: "This email already has a BathCraft account.",
    body:
      "It was created with a password. Sign in with your password below, then use Continue with Google — we'll link the two.",
  },
  OAuthAccountNotLinked: {
    title: "This email already has a BathCraft account.",
    body:
      "Sign in the way you did originally, then use Continue with Google to link it.",
  },
  GoogleEmailUnverified: {
    title: "Google hasn't verified that email address.",
    body: "Verify your address with Google, then try again — or sign in with a password.",
  },
  AccessDenied: {
    title: "Google sign-in was cancelled.",
    body: "No changes were made. You can try again whenever you're ready.",
  },
  Configuration: {
    title: "Google sign-in isn't set up yet.",
    body: "The server is missing its Google credentials. This one is on us, not on you.",
  },
  SessionMissing: {
    title: "Your session has expired.",
    body: "Sign in again to pick up where you left off.",
  },
  CredentialsSignin: {
    title: "We couldn't sign you in.",
    body: "Please check your email and password and try again.",
  },
};

const FALLBACK = {
  title: "We couldn't sign you in with Google.",
  body: "Something went wrong on the way back from Google. Please try again.",
};

export default function AuthErrorNotice({
  code,
  onRetry,
}: {
  code: string;
  onRetry: () => void;
}) {
  const t = useT();
  const { title, body } = MESSAGES[code] ?? FALLBACK;

  return (
    <div
      role="alert"
      className="mb-5 rounded-[12px] border border-danger/25 bg-danger/[0.06] px-4 py-3.5"
    >
      <div className="flex gap-2.5">
        <span className="mt-px text-danger">
          <Icon name="warning" size={16} />
        </span>
        <div>
          <p className="text-[13.5px] font-semibold text-danger-dark">{t(title)}</p>
          <p className="mt-0.5 text-[12.5px] leading-relaxed text-danger-dark/80">{t(body)}</p>
          <button
            type="button"
            onClick={onRetry}
            className="mt-2.5 inline-flex h-9 items-center gap-1.5 rounded-[10px] border border-danger/30 bg-surface-raised px-3.5 text-[12.5px] font-semibold text-danger-dark transition-colors hover:bg-danger/[0.06]"
          >
            <Icon name="arrowRight" size={13} />
            {t("Try Again")}
          </button>
        </div>
      </div>
    </div>
  );
}
