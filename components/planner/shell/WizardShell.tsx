import type { ReactNode } from "react";
import { AppHeader } from "./AppHeader";
import { BottomNav } from "./BottomNav";

interface WizardShellProps {
  subtitle?: string;
  /** Sticky footer area (e.g. the step CTA), pinned above the bottom nav. */
  footer?: ReactNode;
  children: ReactNode;
}

/** The app frame: header, scrollable content, sticky footer, bottom nav.
 *  Full-height on phones; a centred device frame on desktop. */
export function WizardShell({ subtitle, footer, children }: WizardShellProps) {
  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "flex",
        justifyContent: "center",
        background: "var(--color-surface)",
      }}
    >
      <div
        className="app-frame"
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 440,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          background: "var(--color-surface)",
        }}
      >
        <AppHeader subtitle={subtitle} />
        <div className="nsb" style={{ flex: 1, overflowY: "auto", paddingBottom: 24 }}>
          {children}
        </div>
        {footer}
        <BottomNav />
      </div>
    </div>
  );
}
