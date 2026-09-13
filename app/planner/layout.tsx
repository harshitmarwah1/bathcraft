"use client";

import "./planner.css";
import { AppProviders } from "@/components/planner/providers";
import { useTheme } from "@/lib/planner/theme/provider";

/** Applies the planner's scoped theme + tokens to everything under /planner,
 *  leaving the landing's own design untouched. */
function PlannerFrame({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  return (
    <div className="bc-planner" data-theme={theme}>
      {children}
    </div>
  );
}

export default function PlannerLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Planner fonts. React 19 hoists these <link>s into <head>; a remote CSS
          @import is dropped by Turbopack, so load them here instead. */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      {/* App Router hoists these; the no-page-custom-font rule targets the Pages
          Router _document and is a false positive here. display=block is correct
          for an icon font (avoids fallback ligature text flashing). */}
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
      />
      {/* eslint-disable-next-line @next/next/no-page-custom-font, @next/next/google-font-display */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block"
      />
      <AppProviders>
        <PlannerFrame>{children}</PlannerFrame>
      </AppProviders>
    </>
  );
}
