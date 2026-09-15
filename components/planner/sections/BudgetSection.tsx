"use client";

import { StepCard } from "@/components/planner/ui/StepCard";
import { MaterialIcon } from "@/components/planner/ui/MaterialIcon";
import { useI18n } from "@/lib/planner/i18n/provider";
import { useProjectStore } from "@/lib/planner/store/project-store";
import { formatInr } from "@/lib/planner/units";
import type { CostTier } from "@/lib/planner/types";

const TIERS: { value: CostTier; rank: number; labelKey: "tierBudget" | "tierCostEffective" | "tierGoodQuality" | "tierTopOfLine" }[] = [
  { value: "budget", rank: 1, labelKey: "tierBudget" },
  { value: "costEffective", rank: 2, labelKey: "tierCostEffective" },
  { value: "goodQuality", rank: 3, labelKey: "tierGoodQuality" },
  { value: "topOfLine", rank: 4, labelKey: "tierTopOfLine" },
];

const BUDGET_MIN = 25000;
const BUDGET_MAX = 500000;
const BUDGET_STEP = 5000;

export function BudgetSection() {
  const { t } = useI18n();
  const style = useProjectStore((s) => s.project?.style);
  const setCostTier = useProjectStore((s) => s.setCostTier);
  const setBudget = useProjectStore((s) => s.setBudget);
  if (!style) return null;

  return (
    <>
      <StepCard style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <MaterialIcon name="workspace_premium" size={20} color="var(--color-primary-accent)" />
          <div>
            <h2 style={{ fontWeight: 700, fontSize: "calc(17px * var(--pl-fs, 1))", margin: 0, color: "var(--color-on-surface)" }}>
              {t.budgetTitle}
            </h2>
            <p style={{ fontSize: "calc(11px * var(--pl-fs, 1))", margin: 0, color: "var(--color-on-surface-variant)" }}>{t.budgetSub}</p>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {TIERS.map((tier) => {
            const active = style.costTier === tier.value;
            return (
              <button
                key={tier.value}
                onClick={() => setCostTier(tier.value)}
                style={{
                  padding: "12px",
                  borderRadius: 12,
                  background: active ? "var(--color-primary-tint)" : "var(--color-surface-low)",
                  border: active ? "1.5px solid var(--color-primary)" : "1px solid var(--color-surface-high)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <MaterialIcon
                    name={active ? "radio_button_checked" : "radio_button_unchecked"}
                    size={20}
                    color={active ? "var(--color-primary)" : "var(--color-on-surface-variant)"}
                  />
                  <span style={{ fontSize: "calc(13px * var(--pl-fs, 1))", fontWeight: active ? 800 : 600, color: "var(--color-on-surface)" }}>
                    {t[tier.labelKey]}
                  </span>
                </div>
                <QualityBars rank={tier.rank} />
              </button>
            );
          })}
        </div>
      </StepCard>

      <StepCard style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <MaterialIcon name="account_balance_wallet" size={20} color="var(--color-primary-accent)" />
            <div>
              <h2 style={{ fontWeight: 700, fontSize: "calc(17px * var(--pl-fs, 1))", margin: 0, color: "var(--color-on-surface)" }}>
                {t.budgetAmount}
              </h2>
              <p style={{ fontSize: "calc(11px * var(--pl-fs, 1))", margin: 0, color: "var(--color-on-surface-variant)" }}>
                {t.budgetAmountSub}
              </p>
            </div>
          </div>
          <span style={{ fontSize: "calc(18px * var(--pl-fs, 1))", fontWeight: 800, color: "var(--color-primary-accent)" }}>
            {formatInr(style.budgetInr)}
          </span>
        </div>
        <input
          type="range"
          min={BUDGET_MIN}
          max={BUDGET_MAX}
          step={BUDGET_STEP}
          value={Math.min(Math.max(style.budgetInr, BUDGET_MIN), BUDGET_MAX)}
          onChange={(e) => setBudget(Number(e.target.value))}
          aria-label="Budget amount"
          style={{ width: "100%", accentColor: "var(--color-primary)", cursor: "pointer" }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "calc(10px * var(--pl-fs, 1))", color: "var(--color-on-surface-variant)", fontWeight: 600 }}>
          <span>{formatInr(BUDGET_MIN)}</span>
          <span>{formatInr(BUDGET_MAX)}+</span>
        </div>
      </StepCard>
    </>
  );
}

function QualityBars({ rank }: { rank: number }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 18 }}>
      {[1, 2, 3, 4].map((i) => (
        <span
          key={i}
          style={{
            width: 5,
            height: 4 + i * 3.5,
            borderRadius: 2,
            background: i <= rank ? "var(--color-primary)" : "var(--color-surface-high)",
          }}
        />
      ))}
    </div>
  );
}
