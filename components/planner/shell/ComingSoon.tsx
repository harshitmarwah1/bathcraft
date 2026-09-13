"use client";

import { WizardShell } from "./WizardShell";
import { MaterialIcon } from "@/components/planner/ui/MaterialIcon";

/** Simple placeholder for nav destinations not yet built. */
export function ComingSoon({
  title,
  icon,
  subtitle,
}: {
  title: string;
  icon: string;
  subtitle?: string;
}) {
  return (
    <WizardShell subtitle={title}>
      <div
        style={{
          padding: "48px 24px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 14,
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 18,
            background: "var(--color-primary-tint)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <MaterialIcon name={icon} size={32} color="var(--color-primary-accent)" />
        </div>
        <h1 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "var(--color-on-surface)" }}>
          {title}
        </h1>
        <p style={{ margin: 0, fontSize: 13, color: "var(--color-on-surface-variant)", maxWidth: 280 }}>
          {subtitle ?? "This section is coming soon."}
        </p>
      </div>
    </WizardShell>
  );
}
