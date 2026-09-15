import type { CSSProperties, ReactNode } from "react";

/** The white rounded section card used throughout the wizard (from the export). */
export function StepCard({
  children,
  style,
}: {
  children: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <section
      style={{
        background: "var(--color-surface-lowest)",
        borderRadius: 16,
        padding: "calc(16px * var(--pl-sp, 1))",
        boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
        border: "1px solid var(--color-card-border)",
        ...style,
      }}
    >
      {children}
    </section>
  );
}
