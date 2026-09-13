"use client";

import { MaterialIcon } from "@/components/planner/ui/MaterialIcon";

/** Sticky footer with the primary step CTA (and optional Back), matching the
 *  export's bottom action area. Pinned above the bottom nav by WizardShell. */
export function StepFooterCta({
  label,
  subLabel,
  icon = "arrow_forward",
  onClick,
  onBack,
  backLabel,
  disabled,
}: {
  label: string;
  subLabel: string;
  icon?: string;
  onClick: () => void;
  onBack?: () => void;
  backLabel?: string;
  disabled?: boolean;
}) {
  return (
    <div
      className="no-print"
      style={{
        flexShrink: 0,
        padding: "10px 16px",
        background: "var(--color-surface-lowest)",
        borderTop: "1px solid var(--color-surface-high)",
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}
    >
      <div style={{ display: "flex", gap: 8 }}>
        {onBack && (
          <button
            onClick={onBack}
            style={{
              height: 48,
              padding: "0 16px",
              borderRadius: 12,
              background: "var(--color-surface-low)",
              color: "var(--color-on-surface)",
              fontWeight: 700,
              fontSize: 14,
              border: "1px solid var(--color-surface-high)",
              display: "flex",
              alignItems: "center",
              gap: 6,
              cursor: "pointer",
              fontFamily: "inherit",
              flexShrink: 0,
            }}
          >
            <MaterialIcon name="arrow_back" size={18} />
            {backLabel}
          </button>
        )}
        <button
          onClick={onClick}
          disabled={disabled}
          style={{
            flex: 1,
            height: 48,
            borderRadius: 12,
            background: "var(--color-primary)",
            color: "var(--color-on-primary)",
            fontWeight: 700,
            fontSize: 14,
            border: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            cursor: disabled ? "default" : "pointer",
            opacity: disabled ? 0.6 : 1,
            boxShadow: "0 2px 8px rgba(0,97,148,0.25)",
            fontFamily: "inherit",
          }}
        >
          <span>{label}</span>
          <MaterialIcon name={icon} size={18} color="var(--color-on-primary)" />
        </button>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          color: "var(--color-on-surface-variant)",
        }}
      >
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--color-primary)" }} />
        <span style={{ fontSize: 11, fontWeight: 600 }}>{subLabel}</span>
      </div>
    </div>
  );
}
