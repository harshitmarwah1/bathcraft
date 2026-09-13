"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import Link from "next/link";
import AuthErrorNotice from "@/components/auth/AuthErrorNotice";
import AuthLayout from "@/components/auth/AuthLayout";
import AuthSuccess from "@/components/auth/AuthSuccess";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import SignInForm from "@/components/auth/SignInForm";
import SignUpForm from "@/components/auth/SignUpForm";
import Icon from "@/components/ui/Icon";
import { safeNext } from "@/lib/auth/safe-next";

type Step = "signin" | "signup" | "forgot" | "success";

/**
 * One route, four steps. Switching between them re-keys a wrapper so the
 * panel-in animation replays — no navigation, no reload, no lost form state
 * anywhere the user might come back to.
 *
 * `?mode=signup` lets the navbar's "Get Started" land straight on registration.
 * `?callbackUrl=` is set by middleware when it turns an unauthenticated visitor
 * away from a protected page, so signing in returns them to where they meant to go.
 * `?error=` is where Auth.js reports a failed OAuth round trip.
 */
function SignInPageInner() {
  const router = useRouter();
  const params = useSearchParams();
  const [step, setStep] = useState<Step>(params.get("mode") === "signup" ? "signup" : "signin");
  const [dismissedError, setDismissedError] = useState(false);

  const error = params.get("error");
  const showError = Boolean(error) && !dismissedError;

  /**
   * Middleware hands back an absolute URL; only its path is ever reused, and
   * only if it is same-origin. Everything else falls back to the dashboard.
   */
  const intended = (() => {
    const raw = params.get("callbackUrl");
    if (!raw) return null;
    if (raw.startsWith("/")) return safeNext(raw);
    try {
      const url = new URL(raw);
      if (url.origin !== window.location.origin) return null;
      return safeNext(url.pathname + url.search);
    } catch {
      return null;
    }
  })();

  // /auth/continue reads `next` after the session exists, and decides between
  // onboarding, the intended page, and My Bathrooms.
  const continueUrl = intended
    ? `/auth/continue?next=${encodeURIComponent(intended)}`
    : "/auth/continue";

  return (
    <AuthLayout>
      <div className="relative">
        <Link
          href="/"
          aria-label="Close and return to the BathCraft home page"
          className="absolute -top-2 right-0 z-10 flex h-10 w-10 items-center justify-center rounded-full text-body-soft transition-colors hover:bg-wash hover:text-ink max-sm:h-11 max-sm:w-11 lg:-top-6"
        >
          <Icon name="close" size={20} />
        </Link>

        <div
          key={step}
          className="animate-[panel-in_260ms_cubic-bezier(0.16,1,0.3,1)_both] motion-reduce:animate-none"
        >
          {showError && step !== "success" && (
            <AuthErrorNotice
              code={error as string}
              onRetry={() => {
                setDismissedError(true);
                router.replace(step === "signup" ? "/signin?mode=signup" : "/signin");
              }}
            />
          )}

          {step === "signin" && (
            <SignInForm
              continueUrl={continueUrl}
              onCreateAccount={() => setStep("signup")}
              onForgotPassword={() => setStep("forgot")}
              onSignedIn={(url) => {
                router.push(url);
                router.refresh();
              }}
            />
          )}

          {step === "signup" && (
            <SignUpForm
              continueUrl={continueUrl}
              onSignIn={() => setStep("signin")}
              onCreated={() => setStep("success")}
            />
          )}

          {step === "forgot" && <ForgotPasswordForm onBack={() => setStep("signin")} />}

          {step === "success" && <AuthSuccess onStart={() => router.push("/onboarding")} />}
        </div>
      </div>
    </AuthLayout>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={null}>
      <SignInPageInner />
    </Suspense>
  );
}
