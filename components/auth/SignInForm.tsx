"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import Icon from "@/components/ui/Icon";
import { validateEmail, validatePassword } from "@/lib/auth/validation";
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

export default function SignInForm({
  continueUrl,
  onCreateAccount,
  onForgotPassword,
  onSignedIn,
}: {
  /** Where to land after authenticating — /auth/continue decides the final page. */
  continueUrl: string;
  onCreateAccount: () => void;
  onForgotPassword: () => void;
  onSignedIn: (url: string) => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string | null; password?: string | null }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [googlePending, setGooglePending] = useState(false);

  const busy = pending || googlePending;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;

    const next = { email: validateEmail(email), password: validatePassword(password) };
    setErrors(next);
    setFormError(null);
    if (next.email || next.password) return;

    setPending(true);
    try {
      const result = await signIn("credentials", { email, password, redirect: false });
      if (!result || result.error) {
        // Deliberately not "no such account" — that would confirm which
        // addresses are registered to anyone who asks.
        setFormError("We couldn't sign you in.");
        return;
      }
      onSignedIn(continueUrl);
    } catch {
      setFormError("We couldn't reach BathCraft. Check your connection and try again.");
    } finally {
      setPending(false);
    }
  }

  /**
   * A full-page redirect to Google, not a popup. Popups are blocked or silently
   * broken in iOS Safari and most in-app browsers; the redirect flow is the one
   * Google recommends and the only one that works everywhere.
   */
  async function google() {
    if (busy) return;
    setGooglePending(true);
    setFormError(null);
    try {
      await signIn("google", { callbackUrl: continueUrl });
      // On success the browser navigates away and nothing below runs.
    } catch {
      setGooglePending(false);
      setFormError("We couldn't sign you in with Google.");
    }
  }

  return (
    <div>
      <h1 className="text-[32px] leading-[1.15] font-bold tracking-[-0.02em] text-balance text-ink">
        Let&rsquo;s bring your bathroom to life.
      </h1>
      <p className="mt-3 text-[14.5px] leading-relaxed text-body">
        Sign in to continue planning, comparing and designing.
      </p>

      <form onSubmit={submit} noValidate className="mt-7">
        {formError && (
          <AuthAlert
            title={formError}
            body="Please check your email and password and try again."
          />
        )}

        <TextField
          label="Email address"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
        />

        <PasswordField
          className="mt-4"
          label="Password"
          autoComplete="current-password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
        />

        <div className="mt-4 flex items-center justify-between gap-4">
          <Checkbox label="Remember me" name="remember" defaultChecked />
          <button
            type="button"
            onClick={onForgotPassword}
            className="text-[13px] font-semibold text-brand hover:underline"
          >
            Forgot password?
          </button>
        </div>

        <div className="mt-6">
          <SubmitButton pending={pending} pendingLabel="Signing in…">
            Sign In
            <Icon name="arrowRight" size={16} />
          </SubmitButton>
        </div>
      </form>

      <OrRule />

      <SocialButton onClick={google} disabled={busy}>
        {googlePending ? (
          <>
            <Spinner className="border-brand/25 border-t-brand" />
            Connecting to Google…
          </>
        ) : (
          <>
            <GoogleMark />
            Continue with Google
          </>
        )}
      </SocialButton>

      <p className="mt-7 text-center text-[13.5px] text-body">
        New to BathCraft?{" "}
        <button
          type="button"
          onClick={onCreateAccount}
          className="font-semibold text-brand hover:underline"
        >
          Create an account
        </button>
      </p>
    </div>
  );
}
