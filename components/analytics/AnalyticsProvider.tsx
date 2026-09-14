"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { takeAuthIntent } from "@/lib/analytics/auth-intent";
import { EVENTS, plannerStepFromPath, PLANNER_STEPS } from "@/lib/analytics/events";
import { identify, reset, track } from "@/lib/analytics/mixpanel";

/**
 * Page views and identity, for the whole app.
 *
 * Everything here is derived from the router and the session, so no page has to
 * remember to call anything. Product events that carry real intent — a project
 * created, an invite accepted — are fired at their own call sites instead,
 * because only those sites know whether the thing actually succeeded.
 */
function Tracker() {
  const pathname = usePathname();
  // Read, but deliberately not sent: query strings on this app carry invite
  // tokens and callback URLs. Subscribing keeps the effect firing when only the
  // query changes; the value itself never leaves the browser.
  useSearchParams();

  const { user, ready } = useAuth();

  // Effects run twice in React StrictMode during development. Without this the
  // dev console shows every page view doubled, which is exactly the kind of
  // thing that gets debugged for an hour six months from now.
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    if (pathname === lastPath.current) return;
    lastPath.current = pathname;

    track(EVENTS.PAGE_VIEWED, { path: pathname });

    const step = plannerStepFromPath(pathname);
    if (step) {
      track(EVENTS.PLANNER_STEP_VIEWED, {
        step,
        // Mixpanel sorts string properties alphabetically, so a funnel built on
        // the name alone would read brief -> docs -> estimate. The index is what
        // makes the step order survive into the report.
        step_index: PLANNER_STEPS.indexOf(step) + 1,
      });
    }
  }, [pathname]);

  // Identify on every session load rather than only at sign-in: a returning user
  // arrives already authenticated and would otherwise stay anonymous all visit.
  const identified = useRef<string | null>(null);

  useEffect(() => {
    if (!ready) return;

    if (user) {
      if (identified.current === user.id) return;
      identified.current = user.id;
      identify({
        id: user.id,
        email: user.email,
        name: [user.firstName, user.lastName].filter(Boolean).join(" ") || undefined,
      });

      // An intent is only present on the visit that actually signed in, so this
      // fires once per sign-in and never on a returning session.
      const intent = takeAuthIntent();
      if (intent) {
        track(intent.kind === "signup" ? EVENTS.SIGNED_UP : EVENTS.SIGNED_IN, {
          provider: intent.provider,
        });
      }
      return;
    }

    // Signed out after having been signed in — break the link so the next
    // person on this browser does not inherit the previous profile.
    if (identified.current) {
      identified.current = null;
      reset();
    }
  }, [user, ready]);

  return null;
}

/**
 * `useSearchParams` opts the whole subtree into client rendering unless it sits
 * under a Suspense boundary. Since this provider wraps the app, without the
 * boundary every static marketing page would become dynamic — losing the
 * prerendering that makes the landing page fast.
 */
export default function AnalyticsProvider() {
  return (
    <Suspense fallback={null}>
      <Tracker />
    </Suspense>
  );
}
