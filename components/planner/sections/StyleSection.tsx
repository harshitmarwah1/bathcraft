"use client";

import Image from "next/image";
import { StepCard } from "@/components/planner/ui/StepCard";
import { MaterialIcon } from "@/components/planner/ui/MaterialIcon";
import { useI18n } from "@/lib/planner/i18n/provider";
import { useProjectStore } from "@/lib/planner/store/project-store";
import type { ArchitectureStyle } from "@/lib/planner/types";
import { STYLE_PHOTOS } from "./StyleInspiration";

const STYLES: { value: ArchitectureStyle; labelKey: "styleModern" | "styleTraditional" | "styleMinimal" | "styleLuxury" }[] = [
  { value: "modern", labelKey: "styleModern" },
  { value: "traditional", labelKey: "styleTraditional" },
  { value: "minimal", labelKey: "styleMinimal" },
  { value: "luxury", labelKey: "styleLuxury" },
];

/** Architecture style, chosen by looking at real bathrooms rather than icons. */
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
          <h2 style={{ fontWeight: 700, fontSize: "calc(17px * var(--pl-fs, 1))", margin: 0, color: "var(--color-on-surface)" }}>
            {t.styleTitle}
          </h2>
          <p style={{ fontSize: "calc(12px * var(--pl-fs, 1))", margin: 0, color: "var(--color-on-surface-variant)" }}>{t.styleSub}</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10 }}>
        {STYLES.map((s) => {
          const active = style.architecture === s.value;
          return (
            <button
              key={s.value}
              type="button"
              className="pl-style-card"
              aria-pressed={active}
              onClick={() => setArchitecture(s.value)}
            >
              <span className="pl-style-photo">
                <Image
                  src={STYLE_PHOTOS[s.value][0]}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 240px, 45vw"
                  style={{ objectFit: "cover" }}
                />
              </span>
              <span className="pl-style-label">
                {t[s.labelKey]}
                {active && <MaterialIcon name="check_circle" size={18} color="var(--color-primary)" />}
              </span>
            </button>
          );
        })}
      </div>
    </StepCard>
  );
}
