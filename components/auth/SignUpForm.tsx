"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";
import Icon from "@/components/ui/Icon";
import { registerWithPassword } from "@/app/actions/auth";
import {
  PASSWORD_RULES,
  validateConfirmPassword,
  validateEmail,
  validateNewPassword,
  validateRequired,
} from "@/lib/auth/validation";
import { useT } from "@/lib/i18n/useT";
import {
  AuthAlert,
  Checkbox,
  GoogleMark,
  OrRule,
  PasswordField,
  SocialButton,
  Spinner,
  SubmitButton,
  TextField,
} from "./fields";

type Errors = Partial<Record<"firstName" | "lastName" | "email" | "password" | "confirm" | "terms", string | null>>;

export default function SignUpForm({
  continueUrl,
  onSignIn,
  onCreated,
}: {
  /** Where Google returns to — /auth/continue picks the final page. */
  continueUrl: string;
  onSignIn: () => void;
  onCreated: () => void;
}) {
  const t = useT();
  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirm: "",
    terms: false,
  });
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [googlePending, setGooglePending] = useState(false);

  const busy = pending || googlePending;

  const set = <K extends keyof typeof values>(key: K, value: (typeof values)[K]) =>
    setValues((v) => ({ ...v, [key]: value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    const next: Errors = {
      firstName: validateRequired(values.firstName, "First name"),
      lastName: validateRequired(values.lastName, "Last name"),
      email: validateEmail(values.email),
      password: validateNewPassword(values.password),
      confirm: validateConfirmPassword(values.password, values.confirm),
      terms: values.terms ? null : t("Please accept the Terms of Service to continue."),
    };
    setErrors(next);
    setFormError(null);
    if (Object.values(next).some(Boolean)) return;

    setPending(true);
    try {
      const created = await registerWithPassword({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
      });
      if (!created.ok) {
        setFormError(created.message);
        return;
      }
      // Registering does not sign anyone in by itself — the new credential is
      // verified on the server like any other, so there is one path to a session.
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });
      if (!result || result.error) {
        setFormError(t("Your account was created, but we couldn't sign you in. Please sign in."));
        return;
      }
      onCreated();
    } catch {
      setFormError(t("We couldn't reach BathCraft. Check your connection and try again."));
    } finally {
      setPending(false);
    }
  }

  /** Full-page redirect, not a popup — see the note in SignInForm. */
  async function google() {
    if (busy) return;
    setGooglePending(true);
    setFormError(null);
    try {
      await signIn("google", { callbackUrl: continueUrl });
    } catch {
      setGooglePending(false);
      setFormError(t("We couldn't sign you in with Google."));
    }
  }

  return (
    <div>
      <h1 className="text-[30px] leading-tight font-bold tracking-[-0.02em] text-ink">
        {t("Create your BathCraft account")}
      </h1>
      <p className="mt-2 text-[14.5px] text-body">
        {t("Start planning your bathroom with clarity and confidence.")}
      </p>

      <form onSubmit={submit} noValidate className="mt-7">
        {formError && <AuthAlert title={t("We couldn't create your account.")} body={formError} />}

        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            label={t("First name")}
            autoComplete="given-name"
            placeholder="Priya"
            value={values.firstName}
            onChange={(e) => set("firstName", e.target.value)}
            error={errors.firstName}
          />
          <TextField
            label={t("Last name")}
            autoComplete="family-name"
            placeholder="Sharma"
            value={values.lastName}
            onChange={(e) => set("lastName", e.target.value)}
            error={errors.lastName}
          />
        </div>

        <TextField
          className="mt-4"
          label={t("Email address")}
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={values.email}
          onChange={(e) => set("email", e.target.value)}
          error={errors.email}
        />

        <PasswordField
          className="mt-4"
          label={t("Password")}
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
          label={t("Confirm password")}
          autoComplete="new-password"
          placeholder={t("Re-enter your password")}
          value={values.confirm}
          onChange={(e) => set("confirm", e.target.value)}
          error={errors.confirm}
        />

        <Checkbox
          className="mt-5"
          checked={values.terms}
          onChange={(e) => set("terms", e.target.checked)}
          error={errors.terms}
          label={
            <>
              {t("I agree to the")}{" "}
              <Link href="/terms" className="font-semibold text-brand hover:underline">
                {t("Terms of Service")}
              </Link>{" "}
              {t("and")}{" "}
              <Link href="/privacy" className="font-semibold text-brand hover:underline">
                {t("Privacy Policy")}
              </Link>
              .
            </>
          }
        />

        <div className="mt-6">
          <SubmitButton pending={pending} pendingLabel={t("Creating account…")}>
            {t("Create Account")}
            <Icon name="arrowRight" size={16} />
          </SubmitButton>
        </div>
      </form>

      <OrRule />

      <SocialButton onClick={google} disabled={busy}>
        {googlePending ? (
          <>
            <Spinner className="border-brand/25 border-t-brand" />
            {t("Connecting to Google…")}
          </>
        ) : (
          <>
            <GoogleMark />
            {t("Continue with Google")}
          </>
        )}
      </SocialButton>

      <p className="mt-7 text-center text-[13.5px] text-body">
        {t("Already have an account?")}{" "}
        <button type="button" onClick={onSignIn} className="font-semibold text-brand hover:underline">
          {t("Sign in")}
        </button>
      </p>
    </div>
  );
}

/**
 * Live rule indicators. `aria-live="polite"` so a screen-reader user hears rules
 * being satisfied as they type instead of only finding out on submit.
 */
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
