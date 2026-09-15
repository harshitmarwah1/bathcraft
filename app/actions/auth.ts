"use server";

import { headers } from "next/headers";
import { auth } from "@/auth";
import { hashPassword } from "@/lib/auth/password";
import {
  createResetToken,
  hashResetToken,
  isResetTokenExpired,
  resetTokenExpiry,
} from "@/lib/auth/reset-token";
import { validateNewPassword } from "@/lib/auth/validation";
import { normaliseEmail, store } from "@/lib/db/store";
import type { OnboardingAnswers } from "@/lib/db/types";
import { sendMail } from "@/lib/mail/mailer";
import { resetEmail } from "@/lib/mail/reset-email";

/**
 * Server actions for the two things the client must not do itself: hashing a
 * password, and writing to the user store. Both run only on the server, and
 * `saveOnboarding` takes the user id from the session rather than the argument
 * list — otherwise anyone could post onboarding answers for anyone else.
 */

export type RegisterResult = { ok: true } | { ok: false; message: string };

export async function registerWithPassword(input: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}): Promise<RegisterResult> {
  const email = normaliseEmail(input.email);
  if (!email || input.password.length < 8) {
    return { ok: false, message: "Enter a valid email and a password of at least 8 characters." };
  }

  const existing = await store.findUserByEmail(email);
  if (existing) {
    const accounts = await store.listAccounts(existing.id);
    if (accounts.some((a) => a.provider === "credentials")) {
      return { ok: false, message: "An account with that email already exists." };
    }
    // Google-only account adding a password: that is linking, and it needs the
    // person to prove they hold the Google account first. Send them there.
    return {
      ok: false,
      message: "This email is already registered with Google. Use Continue with Google to sign in.",
    };
  }

  await store.createUser(
    { email, firstName: input.firstName, lastName: input.lastName, image: null },
    { provider: "credentials", providerAccountId: email, passwordHash: await hashPassword(input.password) },
  );
  return { ok: true };
}

export async function saveOnboarding(answers: OnboardingAnswers): Promise<{ ok: boolean }> {
  const session = await auth();
  if (!session?.user?.id) return { ok: false };

  await store.setOnboarding(session.user.id, {
    bathroomName: answers.bathroomName.trim().slice(0, 120),
    intent: answers.intent,
    priorities: answers.priorities.slice(0, 12),
  });
  return { ok: true };
}

/** The origin the app is served from, for building an absolute reset link. */
async function requestOrigin(): Promise<string> {
  const h = await headers();
  const host = h.get("host");
  // On Vercel the proxy sets x-forwarded-proto; locally it is plain http.
  const proto = h.get("x-forwarded-proto") ?? (host?.startsWith("localhost") ? "http" : "https");
  return host ? `${proto}://${host}` : "http://localhost:3000";
}

export type ResetResult = { ok: true } | { ok: false; message: string };

/**
 * Step 1 of reset: email a one-time link.
 *
 * The response is the same whether or not the address has an account, and the
 * same whether or not that account even has a password — anything else would
 * let someone probe which emails are registered. A link is actually sent only
 * when there is a credentials account to reset; the caller is never told which
 * case it was. The only `ok:false` is a mail-transport failure, which is
 * independent of the address and so leaks nothing.
 */
export async function requestPasswordReset(email: string): Promise<ResetResult> {
  const normalised = normaliseEmail(email);
  if (!normalised) return { ok: true };

  const user = await store.findUserByEmail(normalised);
  if (user) {
    const hasPassword = (await store.listAccounts(user.id)).some(
      (a) => a.provider === "credentials" && a.passwordHash,
    );

    if (hasPassword) {
      const { rawToken, tokenHash } = createResetToken();
      await store.createPasswordReset({
        userId: user.id,
        tokenHash,
        expiresAt: resetTokenExpiry(),
      });

      const origin = await requestOrigin();
      const resetUrl = `${origin}/reset-password?token=${rawToken}`;

      try {
        await sendMail(resetEmail({ to: user.email, resetUrl, firstName: user.firstName }));
      } catch (err) {
        // Transport is down or misconfigured — the token exists but no mail went
        // out. Roll it back and ask the user to try again. This branch does not
        // depend on the address, so it reveals nothing about who is registered.
        await store.deletePasswordReset(tokenHash);
        console.error("[bathcraft] password reset email failed to send:", err);
        return { ok: false, message: "We couldn't send the email just now. Please try again." };
      }
    }
  }

  return { ok: true };
}

/**
 * Step 2 of reset: consume the link and set the new password.
 *
 * The token is looked up by its hash, checked for expiry, then deleted before
 * the password is written — so a link works exactly once, even if two tabs
 * submit it together. A weak new password is rejected with the same rules as
 * sign-up.
 */
export async function resetPassword(input: {
  token: string;
  password: string;
}): Promise<ResetResult> {
  const badPassword = validateNewPassword(input.password);
  if (badPassword) return { ok: false, message: badPassword };

  const token = input.token?.trim();
  if (!token) return { ok: false, message: "This reset link is invalid or has expired." };

  const record = await store.findPasswordReset(hashResetToken(token));
  if (!record || isResetTokenExpired(record.expiresAt)) {
    return { ok: false, message: "This reset link is invalid or has expired." };
  }

  // Single-use: retire the token first, so a racing second submit finds nothing.
  await store.deletePasswordReset(record.tokenHash);

  const changed = await store.setCredentialsPassword(
    record.userId,
    await hashPassword(input.password),
  );
  if (!changed) {
    return { ok: false, message: "This reset link is invalid or has expired." };
  }

  return { ok: true };
}
