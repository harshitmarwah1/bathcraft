/**
 * The only place that touches the Mixpanel SDK.
 *
 * Three properties this module guarantees, so no call site has to think about
 * them:
 *
 *  1. **Silent without a token.** With `NEXT_PUBLIC_MIXPANEL_TOKEN` unset every
 *     function is a no-op. Local development and preview deploys therefore do
 *     not need the variable, and — more importantly — do not pour test traffic
 *     into the production project. A missing token is a configuration state,
 *     never an error.
 *
 *  2. **Browser only.** `mixpanel-browser` touches `document` at import time,
 *     so it is loaded through a dynamic import that only ever runs in the
 *     browser. A static import would break every server-rendered page that sits
 *     above a component calling `track`.
 *
 *  3. **No dropped events.** The SDK arrives asynchronously. Calls made before
 *     it lands queue on the same promise instead of being discarded, which
 *     matters because the most interesting event in the app — the first page
 *     view — fires within milliseconds of mount.
 *
 * Nothing here throws. Analytics failing is not a reason for the product to
 * fail, so every path degrades to doing nothing.
 */
import type { EventName } from "./events";

type Mixpanel = typeof import("mixpanel-browser").default;

const TOKEN = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;

let pending: Promise<Mixpanel | null> | null = null;

function enabled(): boolean {
  return typeof window !== "undefined" && Boolean(TOKEN);
}

/** Loads and initialises the SDK exactly once, whoever asks first. */
function client(): Promise<Mixpanel | null> {
  if (!enabled()) return Promise.resolve(null);
  pending ??= import("mixpanel-browser")
    .then(({ default: mixpanel }) => {
      mixpanel.init(TOKEN as string, {
        /**
         * Page views are sent by AnalyticsProvider on every route change.
         * Mixpanel's own autocapture would double-count them, and in an App
         * Router SPA it misses client-side navigations anyway.
         */
        track_pageview: false,
        persistence: "localStorage",
        /**
         * Without this the SDK writes a cookie on the apex domain. localStorage
         * persistence plus no cookie keeps the whole thing first-party and out
         * of the way of any future consent work.
         */
        api_host: "https://api-js.mixpanel.com",
        debug: process.env.NODE_ENV === "development",
      });
      return mixpanel;
    })
    .catch(() => null);
  return pending;
}

/** Fire-and-forget. Never awaited by product code, never throws. */
export function track(event: EventName, properties?: Record<string, unknown>): void {
  if (!enabled()) return;
  void client().then((mp) => mp?.track(event, properties));
}

/**
 * Binds the anonymous history Mixpanel has already collected to a real user.
 *
 * Called on every session load, not just at the moment of sign-in: a returning
 * user arrives already authenticated, and without this their events would stay
 * anonymous for the whole visit.
 */
export function identify(user: { id: string; email: string; name?: string }): void {
  if (!enabled()) return;
  void client().then((mp) => {
    if (!mp) return;
    mp.identify(user.id);
    // `set_once` for the signup date so a later session cannot overwrite it
    // with today's; plain `set` for details that legitimately change.
    mp.people.set({ $email: user.email, $name: user.name });
    mp.people.set_once({ "First Seen": new Date().toISOString() });
  });
}

/**
 * Severs the link between this browser and the user on sign-out.
 *
 * Without it, a second person signing in on a shared machine inherits the first
 * one's distinct_id, and their events merge into one profile.
 */
export function reset(): void {
  if (!enabled()) return;
  void client().then((mp) => mp?.reset());
}

/** True when a token is configured. Exported so the provider can skip work. */
export const analyticsEnabled = enabled;
