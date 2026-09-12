# BathCraft

Landing page for BathCraft, a bathroom planning and renovation platform, built
to match a supplied design reference.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm run lint
```

Next.js 16 (App Router) · React 19 · Tailwind v4 · Inter + Caveat. No animation
library — motion is CSS plus a couple of IntersectionObservers.

## Read this before publishing

Three things in here are **prototype-grade and must not ship as-is**:

1. **Metrics and testimonials are invented.** "10,000+ happy homeowners",
   "4.8/5", "30% average cost savings", "50+ trusted brands" and all three
   customer quotes are placeholders with no basis. They are isolated at the top
   of [`lib/content.ts`](lib/content.ts) behind a warning comment. Substantiate
   or delete them.
2. **The photography is licensed stock, not BathCraft's work** — including the
   testimonial thumbnails, which are not the homes of the people quoted. See
   [`public/photos/CREDITS.md`](public/photos/CREDITS.md).
3. **Brand names are set in type, not logos.** Jaquar, CERA, Hindware, KOHLER
   and GROHE are real companies; drawing an approximation of a trademark would
   misrepresent them. Swap in licensed logo files once you have permission.

## Structure

```
app/
  layout.tsx            fonts, metadata
  page.tsx              section composition only
  globals.css           design tokens + shared keyframes
lib/content.ts          every repeated string and list
components/ui/          Button, Icon, SectionHeading, Reveal, Annotation
components/site/        one file per section
components/BathCraftLogoAnimation.tsx   the logo, three variants
scripts/gen-logo-layers.js              slices the logo raster
docs/logo-geometry.md                   measurements behind that slicing
```

Sections, in page order: `Navbar` · `Hero` · `ValuePropositionBar` ·
`BathroomPlanningSection` (wraps `BeforeAfterSlider`) · `HowItWorks` ·
`PlannerDemo` · `StyleExplorer` · `BrandComparison` · `TileVisualizer` ·
`MetricsBar` · `Testimonials` · `FinalCTA` · `Footer`.

## Design system

| Token | Value | Role |
| --- | --- | --- |
| `ink` | `#102B4E` | headings, nav |
| `body` | `#42566F` | running copy |
| `brand` | `#078CC8` | primary actions, eyebrows, active state |
| `wash` | `#F3FAFE` | sections that sit back from white |

Cards 14px, buttons fully pill, two shadow steps (`--shadow-soft`,
`--shadow-lift`). Warmth lives only inside the photographs.

## The things that actually do something

Not a screenshot — these were each exercised and verified in a browser:

- **Sticky navbar** gains a hairline, shadow and backdrop blur past 8px of scroll.
- **Watch Video** opens a real dialog: focus moves in, Tab is trapped, Escape
  and backdrop click close it, scroll is locked, focus returns to the trigger.
  The frame holds a labelled placeholder — there is no film yet.
- **Before/after slider** drags by pointer and by ←/→/Home/End, with
  `role="slider"` and live `aria-valuetext`. Both halves are the *same* room:
  the blueprint is hand-drawn SVG of the photograph's own layout.
- **Planner** — the selected fixture is draggable and arrow-key movable, and the
  toolbar changes what is selected.
- **Tile swatches** fan on hover and are individually selectable.
- **Mobile nav** toggles `aria-expanded`, goes `inert` when closed, locks scroll.
- **Scroll reveal** via one shared `Reveal` component, staggered per section.

## Logo

`components/BathCraftLogoAnimation.tsx`, three variants:

| Variant | Where | Length |
| --- | --- | --- |
| `navbar` | header | ~2.0s, plays once, then it is just the logo |
| `inline` | beside copy | 4.85s desktop / 3.0s mobile |
| `splash` | full-screen opener | 8.5s desktop / 5.3s mobile |

Pace is one number — `--d` on `.stage` — and `PLAY_MS` reads it back off the
element so the JS timer cannot drift from the CSS.

The supplied logo is a flat raster, so nothing redraws it.
`scripts/gen-logo-layers.js` slices the original PNG into disjoint layers and
the animation reveals slices of those originals through animated SVG masks.
Verified against the source: the four icon layers stacked over white reproduce
the supplied crop with **zero differing pixels**, and icon + wordmark halves
recompose byte-identically. Geometry is recorded in
[`docs/logo-geometry.md`](docs/logo-geometry.md) — replace the asset and you
must re-measure and re-run the script.

## Hero video

`components/site/VideoModal.tsx`, opened by the hero's Watch Video button.
The file is served statically from `public/media/video-project-4.mp4` with
`preload="metadata"`, so landing on the page costs a few KB of header rather
than the 26MB asset; playback only ever starts from the click that opens the
dialog.

The dialog is rendered through a **portal to `<body>`**. The hero section is
`isolate`, so without the portal no z-index could lift the overlay above the
fixed navbar and it would open underneath it.

Closes on the X, on Escape, and on a backdrop press — but never on a press that
begins inside the player, so dragging the seek bar out of the frame is safe.
Closing pauses, rewinds to 0 and returns focus to the trigger with
`preventScroll`, which keeps a scrolled-down page exactly where it was.

**Note on the asset:** the supplied MP4 is a 1920x1080 file whose picture is
portrait, pillarboxed with black bars baked into the frames. The player shows it
at its true aspect ratio rather than cropping, so those bars are visible. Re-export
at the real portrait ratio to fill the frame.

## Accessibility

Semantic landmarks, one `h1`, keyboard-operable slider and planner, focus
trapped in the modal, visible brand-blue focus ring everywhere, descriptive alt
text, decorative images `aria-hidden`. `prefers-reduced-motion: reduce` removes
the hero settle, the reveals, the scroll cue and the logo sequence, and turns
off smooth scrolling.

## Authentication

Real, server-side authentication on [Auth.js v5](https://authjs.dev)
(`next-auth@5`) with two providers against one user account:

| Provider | Path |
| --- | --- |
| Google (OAuth 2.0 / OIDC) | `Continue with Google` → `/api/auth/callback/google` |
| Credentials (email + password) | the sign-in form, scrypt-hashed |

**Setup.** Copy `.env.example` to `.env.local` and fill it in. `AUTH_SECRET`
comes from `npx auth secret`; `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET` come from
Google Cloud Console → Google Auth Platform → Clients → Web application, with:

- Authorized JavaScript origin `http://localhost:3000`
- Authorized redirect URI `http://localhost:3000/api/auth/callback/google`
- Scopes `openid`, `email`, `profile` — nothing else

**Sessions** are JWTs in an encrypted, HTTP-only cookie. No token ever reaches
client JavaScript and nothing is kept in `localStorage`. Google's authorization
request carries `state`, `nonce` and PKCE (S256), all generated and verified by
Auth.js. The flow is a full-page redirect, never a popup, so it works in iOS
Safari and in-app browsers.

**Route protection** lives in `proxy.ts` (Next 16's renamed `middleware`), which
covers `/bathrooms`, `/my-bathrooms`, `/my-plans`, `/onboarding`, `/account` and
`/planner`. Turning an unauthenticated visitor away sets `?callbackUrl=`, and
`/auth/continue` spends it after sign-in: new users go to onboarding, returning
users go to where they were headed, defaulting to `/bathrooms`. `AuthGate` is
still only a UX guard — the boundary is the proxy.

**Account linking** is explicit. Signing in with Google using an email that
already has a password account is refused (`?error=AccountExists`) rather than
silently merged; the user signs in with their password first, and clicking
Continue with Google then links the two. `allowDangerousEmailAccountLinking` is
off deliberately.

### The database seam — read before deploying

`lib/db/store.ts` defines a `UserStore` interface and implements it against a
**JSON file** in `.data/`. That is development-only: serverless hosts have a
read-only filesystem and one copy per instance, so users would vanish or
duplicate. Implement `UserStore` against a real database and export that
instead — every caller goes through the interface, so nothing else changes.

Password reset is also unimplemented: `requestPasswordReset` in
`app/actions/auth.ts` always resolves without sending mail, and says so.

| Route | Contents |
| --- | --- |
| `/signin` | Sign in, sign up, forgot password and the success state -- one route, four steps, no reload between them. `?mode=signup` opens on registration. |
| `/auth/continue` | Post-authentication router: onboarding vs. dashboard vs. intended page |
| `/onboarding` | Three questions: name, intent, priorities |
| `/bathrooms` | The list, with an empty state for new accounts |

Components: `AuthLayout` `SignInForm` `SignUpForm` `ForgotPasswordForm`
`AuthSuccess` `AuthErrorNotice` `OnboardingFlow` `UserMenu` `AuthGate`, plus
shared inputs in `components/auth/fields.tsx`.

## Known gaps

- **Breakpoints were not verified on a real viewport.** The browser available
  during the build refused to resize, so 1440/1280/1024/768/390 were checked by
  code and by simulation rather than by rendering. Open it at those widths
  before you trust it.
- No `/products`, `/pricing` or `/about` routes exist yet — nav links are
  in-page anchors. `/terms` and `/privacy`, linked from the sign-up consent
  checkbox, do not exist either.
- The auth screens were verified at desktop width only, for the same reason.
- Google sign-in is wired and verified up to Google's authorization endpoint,
  but the full round trip has not been run — that needs real OAuth credentials.
