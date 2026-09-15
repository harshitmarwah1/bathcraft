"use client";

import { StepCard } from "@/components/planner/ui/StepCard";
import { MaterialIcon } from "@/components/planner/ui/MaterialIcon";
import { useI18n } from "@/lib/planner/i18n/provider";
import { useProjectStore } from "@/lib/planner/store/project-store";
import { BRANDS, BAND_ORDER, recommendedBand, type BrandBand } from "@/lib/planner/branddata";

export function BrandGuideSection() {
  const { t } = useI18n();
  const tier = useProjectStore((s) => s.project?.style.costTier);
  if (!tier) return null;
  const recommended = recommendedBand(tier);

  const bandLabel: Record<BrandBand, string> = {
    premium: t.bandPremium,
    mid: t.bandMid,
    budget: t.bandBudget,
  };

  return (
    <StepCard style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <MaterialIcon name="verified" size={20} color="var(--color-primary-accent)" />
        <div>
          <h2 style={{ fontWeight: 700, fontSize: "calc(17px * var(--pl-fs, 1))", margin: 0, color: "var(--color-on-surface)" }}>
            {t.brandGuideTitle}
          </h2>
          <p style={{ fontSize: "calc(11px * var(--pl-fs, 1))", margin: 0, color: "var(--color-on-surface-variant)" }}>{t.brandGuideSub}</p>
        </div>
      </div>

      {BAND_ORDER.map((band) => {
        const brands = BRANDS.filter((b) => b.band === band);
        if (brands.length === 0) return null;
        const isRec = band === recommended;
        return (
          <div key={band} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: "calc(11px * var(--pl-fs, 1))", fontWeight: 800, letterSpacing: "0.4px", textTransform: "uppercase", color: "var(--color-on-surface-variant)" }}>
                {bandLabel[band]}
              </span>
              {isRec && (
                <span
                  style={{
                    fontSize: "calc(10px * var(--pl-fs, 1))",
                    fontWeight: 700,
                    padding: "2px 8px",
                    borderRadius: 999,
                    background: "var(--color-primary)",
                    color: "var(--color-on-primary)",
                  }}
                >
                  {t.recommendedForYou}
                </span>
              )}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {brands.map((b) => (
                <div
                  key={b.name}
                  style={{
                    padding: 12,
                    borderRadius: 12,
                    background: isRec ? "var(--color-primary-tint)" : "var(--color-surface-low)",
                    border: isRec ? "1px solid var(--color-primary-tint-border)" : "1px solid var(--color-surface-high)",
                    display: "flex",
                    flexDirection: "column",
                    gap: 4,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                    <span style={{ fontWeight: 800, fontSize: "calc(13px * var(--pl-fs, 1))", color: "var(--color-on-surface)", letterSpacing: "0.2px" }}>
                      {b.name}
                    </span>
                    <span style={{ fontSize: "calc(10px * var(--pl-fs, 1))", color: "var(--color-primary-accent)", fontWeight: 600, textAlign: "right" }}>
                      {b.categories.join(" · ")}
                    </span>
                  </div>
                  <span style={{ fontSize: "calc(11px * var(--pl-fs, 1))", color: "var(--color-on-surface-variant)", lineHeight: 1.35 }}>{b.note}</span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </StepCard>
  );
}
