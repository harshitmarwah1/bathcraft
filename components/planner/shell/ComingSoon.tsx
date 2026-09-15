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
    <WizardShell subtitle={title} showSteps={false}>
      <div
        style={{
          padding: "64px 24px",
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
        <h1 style={{ margin: 0, fontSize: "calc(24px * var(--pl-fs, 1))", fontWeight: 700, color: "var(--color-on-surface)" }}>
          {title}
        </h1>
        <p style={{ margin: 0, fontSize: "calc(14px * var(--pl-fs, 1))", color: "var(--color-on-surface-variant)", maxWidth: 360 }}>
          {subtitle ?? "This section is coming soon."}
        </p>
      </div>
    </WizardShell>
  );
}
