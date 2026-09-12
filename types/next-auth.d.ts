import type { DefaultSession } from "next-auth";
import type { OnboardingAnswers } from "@/lib/db/types";

/**
 * The extra fields the session callback in auth.ts puts on `session.user`.
 * Without this augmentation they exist at runtime but not to TypeScript.
 */
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      firstName: string;
      lastName: string;
      /** The three onboarding answers, or null if the flow was never finished. */
      onboarding: OnboardingAnswers | null;
      /** Convenience for `onboarding !== null` — what the redirect logic reads. */
      onboarded: boolean;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    uid?: string;
    firstName?: string;
    lastName?: string;
    onboarding?: OnboardingAnswers | null;
  }
}
