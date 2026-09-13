"use client";

import { StepCard } from "@/components/planner/ui/StepCard";
import { MaterialIcon } from "@/components/planner/ui/MaterialIcon";
import { useI18n } from "@/lib/planner/i18n/provider";
import { useProjectStore } from "@/lib/planner/store/project-store";
import type { ArchitectureStyle } from "@/lib/planner/types";

const STYLES: { value: ArchitectureStyle; icon: string; labelKey: "styleModern" | "styleTraditional" | "styleMinimal" | "styleLuxury" }[] = [
  { value: "modern", icon: "auto_awesome", labelKey: "styleModern" },
  { value: "traditional", icon: "temple_hindu", labelKey: "styleTraditional" },
  { value: "minimal", icon: "crop_square", labelKey: "styleMinimal" },
  { value: "luxury", icon: "diamond", labelKey: "styleLuxury" },
];

export function StyleSection() {
  const { t } = useI18n();
  const style = useProjectStore((s) => s.project?.style);
  const setArchitecture = useProjectStore((s) => s.setArchitecture);
  if (!style) return null;

  return (
    <StepCard style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <MaterialIcon name="palette" size={20} color="var(--color-primary-accent)" />
        <div>
          <h2 style={{ fontWeight: 700, fontSize: 14, margin: 0, color: "var(--color-on-surface)" }}>
            {t.styleTitle}
          </h2>
          <p style={{ fontSize: 11, margin: 0, color: "var(--color-on-surface-variant)" }}>{t.styleSub}</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
        {STYLES.map((s) => {
          const active = style.architecture === s.value;
          return (
            <button
              key={s.value}
              onClick={() => setArchitecture(s.value)}
              style={{
                position: "relative",
                padding: "16px 12px",
                borderRadius: 12,
                background: active ? "var(--color-primary-tint)" : "var(--color-surface-low)",
                border: active
                  ? "1.5px solid var(--color-primary)"
                  : "1px solid var(--color-surface-high)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              {active && (
                <MaterialIcon
                  name="check_circle"
                  size={16}
                  color="var(--color-primary)"
                  style={{ position: "absolute", top: 8, right: 8 }}
                />
              )}
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  background: active ? "var(--color-primary)" : "var(--color-surface-container)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <MaterialIcon
                  name={s.icon}
                  size={22}
                  color={active ? "var(--color-on-primary)" : "var(--color-primary-accent)"}
                />
              </div>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: active ? 800 : 600,
                  color: "var(--color-on-surface)",
                }}
              >
                {t[s.labelKey]}
              </span>
            </button>
          );
        })}
      </div>
    </StepCard>
  );
}
