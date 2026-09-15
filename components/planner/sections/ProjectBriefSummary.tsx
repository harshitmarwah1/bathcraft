"use client";

import { StepCard } from "@/components/planner/ui/StepCard";
import { MaterialIcon } from "@/components/planner/ui/MaterialIcon";
import { Plan4DViewer } from "@/components/planner/plan3d/Plan4DViewer";
import { useI18n } from "@/lib/planner/i18n/provider";
import { inchesToFeetInchesShort, areaSqft, formatInr } from "@/lib/planner/units";
import type { Dictionary } from "@/lib/planner/i18n/dictionaries";
import type {
  ArchitectureStyle,
  CostTier,
  FixtureType,
  Project,
} from "@/lib/planner/types";

type Key = keyof Dictionary;

const FIXTURE_NAME: Record<FixtureType, Key> = {
  wc: "elemWc",
  vanity: "elemVanity",
  shower: "elemShower",
  almirah: "elemAlmirah",
};
const STYLE_KEY: Record<ArchitectureStyle, Key> = {
  modern: "styleModern",
  traditional: "styleTraditional",
  minimal: "styleMinimal",
  luxury: "styleLuxury",
};
const TIER_KEY: Record<CostTier, Key> = {
  budget: "tierBudget",
  costEffective: "tierCostEffective",
  goodQuality: "tierGoodQuality",
  topOfLine: "tierTopOfLine",
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12 }}>
      <span style={{ fontSize: "calc(12px * var(--pl-fs, 1))", color: "var(--color-on-surface-variant)" }}>{label}</span>
      <span style={{ fontSize: "calc(12.5px * var(--pl-fs, 1))", fontWeight: 700, color: "var(--color-on-surface)", textAlign: "right" }}>{value}</span>
    </div>
  );
}

function Block({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <MaterialIcon name={icon} size={16} color="var(--color-primary-accent)" />
        <span style={{ fontSize: "calc(12px * var(--pl-fs, 1))", fontWeight: 800, letterSpacing: "0.3px", textTransform: "uppercase", color: "var(--color-primary-accent)" }}>
          {title}
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, paddingLeft: 22 }}>{children}</div>
    </div>
  );
}

export function ProjectBriefSummary({ project }: { project: Project }) {
  const { t } = useI18n();
  const { room, style, fixtures, addOns, plan, estimate } = project;
  const sqft = areaSqft(room.lengthInches, room.widthInches);

  return (
    <StepCard style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: "calc(18px * var(--pl-fs, 1))", fontWeight: 800, color: "var(--color-on-surface)" }}>{room.name}</span>
          <span style={{ fontSize: "calc(11px * var(--pl-fs, 1))", color: "var(--color-on-surface-variant)" }}>{t.briefTitle}</span>
        </div>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: "var(--color-primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <MaterialIcon name="architecture" size={22} color="var(--color-on-primary)" />
        </div>
      </div>

      <Block icon="straighten" title={t.briefSpaceLabel}>
        <Row label={t.dimTitle} value={`${inchesToFeetInchesShort(room.lengthInches)} × ${inchesToFeetInchesShort(room.widthInches)} × ${inchesToFeetInchesShort(room.heightInches)}`} />
        <Row label={t.areaCalc} value={`${sqft} sq.ft`} />
      </Block>

      <Block icon="palette" title={t.briefStyleLabel}>
        <Row label={t.styleTitle} value={t[STYLE_KEY[style.architecture]]} />
        <Row label={t.budgetTitle} value={t[TIER_KEY[style.costTier]]} />
        <Row label={t.budgetLabel} value={formatInr(style.budgetInr)} />
      </Block>

      <Block icon="grid_view" title={t.briefFixturesLabel}>
        {fixtures.map((f) => (
          <Row
            key={f.type}
            label={t[FIXTURE_NAME[f.type]]}
            value={[f.variant && t[f.variant as Key], t[f.placement as Key]].filter(Boolean).join(" · ")}
          />
        ))}
        {addOns.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 2 }}>
            {addOns.map((a) => (
              <span key={a} style={{ fontSize: "calc(10.5px * var(--pl-fs, 1))", fontWeight: 700, padding: "3px 8px", borderRadius: 999, background: "var(--color-surface-container)", color: "var(--color-on-surface-variant)" }}>
                {t[a as Key]}
              </span>
            ))}
          </div>
        )}
      </Block>

      {plan && (
        <Block icon="draw" title={t.briefPlanLabel}>
          <div style={{ marginLeft: -22 }}>
            <Plan4DViewer project={project} plan={plan} />
          </div>
        </Block>
      )}

      {estimate && (
        <Block icon="payments" title={t.briefEstimateLabel}>
          <Row label={t.materialCost} value={formatInr(estimate.materialCostInr)} />
          <Row label={t.labourCost} value={formatInr(estimate.labourCostInr)} />
          <Row label={t.timeEstimate} value={`${estimate.timeDays} ${t.daysUnit}`} />
          <div style={{ height: 1, background: "var(--color-surface-high)", margin: "2px 0" }} />
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
            <span style={{ fontSize: "calc(13px * var(--pl-fs, 1))", fontWeight: 800, color: "var(--color-on-surface)" }}>{t.totalCost}</span>
            <span style={{ fontSize: "calc(18px * var(--pl-fs, 1))", fontWeight: 800, color: "var(--color-primary-accent)" }}>{formatInr(estimate.totalCostInr)}</span>
          </div>
        </Block>
      )}
    </StepCard>
  );
}
