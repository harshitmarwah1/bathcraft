import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { safeNext } from "@/lib/auth/safe-next";

/**
 * Where Google sends everyone after a successful sign-in.
 *
 * Deciding "onboarding or dashboard" belongs on the server, after the session
 * exists — the client cannot be trusted to know whether a user is new, and
 * Auth.js's own redirect callback runs before the session is readable. One
 * route, so both the Google and password paths land in the same decision.
 */
export const dynamic = "force-dynamic";

export default async function AuthContinuePage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[] }>;
}) {
  const [session, params] = await Promise.all([auth(), searchParams]);

  if (!session?.user) redirect("/signin?error=SessionMissing");

  // A returning user never sees onboarding again; an interrupted one resumes it.
  if (!session.user.onboarded) redirect("/onboarding");

  redirect(safeNext(params.next) ?? "/bathrooms");
}
