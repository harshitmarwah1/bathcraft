import type { Metadata } from "next";
import { Caveat, Inter, Noto_Sans_Devanagari } from "next/font/google";
import AnalyticsProvider from "@/components/analytics/AnalyticsProvider";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { LOCALE_SCRIPT } from "@/lib/i18n/locale";
import { THEME_SCRIPT } from "@/lib/theme";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

/**
 * Devanagari. Inter covers no Devanagari at all, so Hindi would otherwise fall
 * back to whatever the OS happens to have — different metrics, different
 * weight, visibly not the same typeface. Listed after Inter in the stack so
 * Latin text inside Hindi copy (BathCraft, Google, KOHLER) still sets in Inter.
 */
const devanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  variable: "--font-devanagari",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

/** Handwritten marginalia only — see components/ui/Annotation.tsx. */
const caveat = Caveat({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-caveat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "BathCraft — From ideas to beautiful bathrooms",
  description:
    "Plan, visualize, estimate and build your bathroom in one place. Measurements to layouts, styles, material lists and costed plans.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${caveat.variable} ${devanagari.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Sets data-theme before first paint. Anything later — a component, an
            effect, even a blocking <script src> — lands after the browser has
            already painted, which reads as a white flash on a dark page. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        {/* Sets lang="hi" before paint, so the Devanagari stack applies on the
            first frame and screen readers announce the right language. */}
        <script dangerouslySetInnerHTML={{ __html: LOCALE_SCRIPT }} />
      </head>
      <body className="antialiased">
        <AuthProvider>
          <AnalyticsProvider />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
