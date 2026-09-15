"use client";

import Image from "next/image";
import { StepCard } from "@/components/planner/ui/StepCard";
import { MaterialIcon } from "@/components/planner/ui/MaterialIcon";
import { useI18n } from "@/lib/planner/i18n/provider";
import { useProjectStore } from "@/lib/planner/store/project-store";
import type { ArchitectureStyle } from "@/lib/planner/types";

/** Two real bathrooms per style (see public/photos/CREDITS.md). */
export const STYLE_PHOTOS: Record<ArchitectureStyle, [string, string]> = {
  modern: ["/photos/inspo-modern.jpg", "/photos/style-modern.jpg"],
  traditional: ["/photos/inspo-traditional.jpg", "/photos/style-traditional.jpg"],
  minimal: ["/photos/inspo-minimal.jpg", "/photos/style-minimal.jpg"],
  luxury: ["/photos/inspo-luxury.jpg", "/photos/style-luxury.jpg"],
};

const STYLE_KEY = {
  modern: "styleModern",
  traditional: "styleTraditional",
  minimal: "styleMinimal",
  luxury: "styleLuxury",
} as const;

/** Photography for the chosen style, beside the plan it will be built as. */
export function StyleInspiration() {
  const { t } = useI18n();
  const architecture = useProjectStore((s) => s.project?.style.architecture);
  if (!architecture) return null;
  const styleName = t[STYLE_KEY[architecture]];

  return (
    <StepCard style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <MaterialIcon name="photo_library" size={20} color="var(--color-primary-accent)" />
          <div>
            <h2 style={{ fontWeight: 700, fontSize: "calc(17px * var(--pl-fs, 1))", margin: 0, color: "var(--color-on-surface)" }}>
              {t.inspirationTitle}
            </h2>
            <p style={{ fontSize: "calc(12px * var(--pl-fs, 1))", margin: 0, color: "var(--color-on-surface-variant)" }}>{t.inspirationSub}</p>
          </div>
        </div>
        <span className="pl-chip">{styleName}</span>
      </div>
      <div className="pl-inspo">
        {STYLE_PHOTOS[architecture].map((src, i) => (
          <figure key={src} className="pl-inspo-photo" data-lead={i === 0 ? "true" : "false"}>
            <Image
              src={src}
              alt={`${styleName} bathroom`}
              fill
              sizes="(min-width: 1024px) 480px, 90vw"
              style={{ objectFit: "cover" }}
            />
          </figure>
        ))}
      </div>
    </StepCard>
  );
}
