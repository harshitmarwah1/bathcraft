import type { Metadata } from "next";
import { Caveat, Inter } from "next/font/google";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { THEME_SCRIPT } from "@/lib/theme";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
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
    <html lang="en" className={`${inter.variable} ${caveat.variable}`} suppressHydrationWarning>
      <head>
        {/* Sets data-theme before first paint. Anything later — a component, an
            effect, even a blocking <script src> — lands after the browser has
            already painted, which reads as a white flash on a dark page. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
