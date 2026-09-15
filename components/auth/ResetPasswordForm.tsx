"use client";

import { useState } from "react";
import Link from "next/link";
import Icon from "@/components/ui/Icon";
import { resetPassword } from "@/app/actions/auth";
import {
  PASSWORD_RULES,
  validateConfirmPassword,
  validateNewPassword,
} from "@/lib/auth/validation";
import { useT } from "@/lib/i18n/useT";
import { AuthAlert, PasswordField, SubmitButton } from "./fields";

type Errors = Partial<Record<"password" | "confirm", string | null>>;

/**
 * Step 2 of the reset flow: the screen the emailed link lands on. The token
 * comes from the query string; a missing one is handled before we ever get
 * here (see the page), so this form can assume it has one to submit.
 */
export default function ResetPasswordForm({ token }: { token: string }) {
  const t = useT();
  const [values, setValues] = useState({ password: "", confirm: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);

  const set = <K extends keyof typeof values>(key: K, value: (typeof values)[K]) =>
    setValues((v) => ({ ...v, [key]: value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (pending) return;

    const next: Errors = {
      password: validateNewPassword(values.password),
      confirm: validateConfirmPassword(values.password, values.confirm),
    };
    setErrors(next);
    setFormError(null);
    if (Object.values(next).some(Boolean)) return;

    setPending(true);
    try {
      const result = await resetPassword({ token, password: values.password });
      if (!result.ok) {
        setFormError(result.message);
        return;
      }
      setDone(true);
    } catch {
      setFormError(t("We couldn't reach Milagro Universe. Check your connection and try again."));
    } finally {
      setPending(false);
    }
  }

  if (done) {
    return (
      <div>
        <span className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-wash text-brand">
          <Icon name="check" size={26} strokeWidth={2.2} />
        </span>
        <h1 className="text-[30px] leading-tight font-bold tracking-[-0.02em] text-ink">
          {t("Password updated")}
        </h1>
        <p className="mt-3 text-[14.5px] leading-relaxed text-body">
          {t("Your password has been changed. You can now sign in with your new password.")}
        </p>
        <Link
          href="/signin"
          className="mt-8 flex h-[52px] w-full items-center justify-center rounded-[14px] bg-brand text-[15px] font-semibold text-on-brand shadow-[0_6px_18px_rgb(7_140_200/0.28)] transition-[transform,background-color] duration-200 hover:-translate-y-px hover:bg-brand-dark motion-reduce:hover:translate-y-0"
        >
          {t("Go to Sign In")}
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-[30px] leading-tight font-bold tracking-[-0.02em] text-ink">
        {t("Choose a new password")}
      </h1>
      <p className="mt-2 text-[14.5px] text-body">
        {t("Pick a strong password you don't use anywhere else.")}
      </p>

      <form onSubmit={submit} noValidate className="mt-7">
        {formError && <AuthAlert title={t("We couldn't reset your password.")} body={formError} />}

        <PasswordField
          label={t("New password")}
          autoComplete="new-password"
          placeholder={t("Create a password")}
          value={values.password}
          onChange={(e) => set("password", e.target.value)}
          error={errors.password}
          hint={t("Use at least 8 characters with a mix of letters and numbers.")}
        />

        <PasswordChecklist value={values.password} />

        <PasswordField
          className="mt-4"
          label={t("Confirm new password")}
          autoComplete="new-password"
          placeholder={t("Re-enter your password")}
          value={values.confirm}
          onChange={(e) => set("confirm", e.target.value)}
          error={errors.confirm}
        />

        <div className="mt-6">
          <SubmitButton pending={pending} pendingLabel={t("Updating…")}>
            {t("Update Password")}
          </SubmitButton>
        </div>
      </form>

      <Link
        href="/signin"
        className="mt-6 flex w-full items-center justify-center gap-2 text-[13.5px] font-semibold text-body transition-colors hover:text-brand"
      >
        <span aria-hidden="true">←</span> {t("Back to Sign In")}
      </Link>
    </div>
  );
}

/** Live rule indicators, mirroring the sign-up form so the two screens agree. */
function PasswordChecklist({ value }: { value: string }) {
  return (
    <ul aria-live="polite" className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5">
      {PASSWORD_RULES.map((rule) => {
        const met = rule.test(value);
        return (
          <li
            key={rule.id}
            className={[
              "flex items-center gap-1.5 text-[12px] transition-colors duration-200",
              met ? "text-brand" : "text-body-soft",
            ].join(" ")}
          >
            <span
              className={[
                "flex h-4 w-4 items-center justify-center rounded-full transition-colors duration-200",
                met ? "bg-brand text-on-brand" : "bg-wash-deep text-transparent",
              ].join(" ")}
            >
              <Icon name="check" size={10} strokeWidth={2.6} />
            </span>
            {rule.label}
            <span className="sr-only">{met ? " — met" : " — not yet met"}</span>
          </li>
        );
      })}
    </ul>
  );
}
