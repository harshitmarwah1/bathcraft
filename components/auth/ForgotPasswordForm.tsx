"use client";

import { useState } from "react";
import Icon from "@/components/ui/Icon";
import { useT } from "@/lib/i18n/useT";
import { requestPasswordReset } from "@/app/actions/auth";
import { validateEmail } from "@/lib/auth/validation";
import { SubmitButton, TextField } from "./fields";

export default function ForgotPasswordForm({ onBack }: { onBack: () => void }) {
  const t = useT();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const next = validateEmail(email);
    setError(next);
    if (next) return;

    setPending(true);
    const result = await requestPasswordReset(email);
    setPending(false);

    // The action answers the same way whether or not the address is registered,
    // so a success here is not a hint that an account exists. It only fails when
    // the mail transport itself is down — which is worth telling the user about.
    if (!result.ok) {
      setError(result.message);
      return;
    }
    setSentTo(email.trim());
  }

  if (sentTo) {
    return (
      <div>
        <span className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-wash text-brand">
          <Icon name="check" size={26} strokeWidth={2.2} />
        </span>
        <h1 className="text-[36px] leading-[1.1] font-bold tracking-[-0.03em] text-balance text-ink lg:text-[40px]">
          {t("Check your inbox")}
        </h1>
        <p className="mt-3 text-[16px] leading-relaxed text-body">
          {t("We’ve sent a password reset link to:")}
        </p>
        <p className="mt-1 text-[16px] font-semibold break-all text-ink">{sentTo}</p>

        <button
          type="button"
          onClick={onBack}
          className="mt-8 flex h-[52px] w-full items-center justify-center rounded-[14px] bg-action text-[16px] font-semibold text-on-action shadow-[0_6px_18px_rgb(138_90_43/0.28)] transition-[transform,background-color] duration-200 hover:-translate-y-px hover:bg-action-dark motion-reduce:hover:translate-y-0"
        >
          {t("Back to Sign In")}
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-[36px] leading-[1.1] font-bold tracking-[-0.03em] text-balance text-ink lg:text-[40px]">
        {t("Forgot your password?")}
      </h1>
      <p className="mt-3 text-[16px] text-body">
        {t("Enter your email and we’ll send you a reset link.")}
      </p>

      <form onSubmit={submit} noValidate className="mt-7">
        <TextField
          label={t("Email address")}
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={error}
        />
        <div className="mt-6">
          <SubmitButton pending={pending} pendingLabel={t("Sending…")}>
            {t("Send Reset Link")}
          </SubmitButton>
        </div>
      </form>

      <button
        type="button"
        onClick={onBack}
        className="mt-6 flex w-full items-center justify-center gap-2 text-[15px] font-semibold text-body transition-colors hover:text-brand"
      >
        <span aria-hidden="true">←</span> {t("Back to Sign In")}
      </button>
    </div>
  );
}
