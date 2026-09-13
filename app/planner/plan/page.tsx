"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { WizardShell } from "@/components/planner/shell/WizardShell";
import { ProgressBar } from "@/components/planner/shell/ProgressBar";
import { StepFooterCta } from "@/components/planner/sections/StepFooterCta";
import { StepCard } from "@/components/planner/ui/StepCard";
import { MaterialIcon } from "@/components/planner/ui/MaterialIcon";
import { FloorPlanSvg } from "@/components/planner/sections/FloorPlanSvg";
import { useI18n } from "@/lib/planner/i18n/provider";
import { useEnsureProject } from "@/lib/planner/store/use-ensure-project";
import { useProjectStore } from "@/lib/planner/store/project-store";
import type { ClearanceWarning } from "@/lib/planner/types";

export default function PlanStepPage() {
  const { t } = useI18n();
  const router = useRouter();
  const { ready } = useEnsureProject();
  const project = useProjectStore((s) => s.project);
  const generatePlan = useProjectStore((s) => s.generatePlan);

  // Generate from the current inputs whenever the plan step is opened.
  useEffect(() => {
    if (ready) generatePlan();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  const plan = project?.plan ?? null;

  return (
    <WizardShell
      subtitle={t.appSub4}
      footer={
        <StepFooterCta
          label={t.s4CtaText}
          subLabel={t.s4CtaSub}
          onClick={() => router.push("/planner/estimate")}
          onBack={() => router.push("/planner/fixtures")}
          backLabel={t.backCta}
          disabled={!ready}
        />
      }
    >
      <ProgressBar badge={t.step4Badge} step={4} total={6} icon="draw" />
      {ready && project && plan ? (
        <div style={{ padding: "0 16px", display: "flex", flexDirection: "column", gap: 16 }}>
          <StepCard style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <MaterialIcon name="draw" size={20} color="var(--color-primary-accent)" />
                <div>
                  <h2 style={{ fontWeight: 700, fontSize: 14, margin: 0, color: "var(--color-on-surface)" }}>
                    {t.planTitle}
                  </h2>
                  <p style={{ fontSize: 11, margin: 0, color: "var(--color-on-surface-variant)" }}>
                    {t.planSub}
                  </p>
                </div>
              </div>
              <button
                onClick={() => generatePlan()}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  padding: "6px 10px",
                  borderRadius: 999,
                  background: "var(--color-surface-low)",
                  border: "1px solid var(--color-surface-high)",
                  color: "var(--color-primary-accent)",
                  fontWeight: 700,
                  fontSize: 11,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                <MaterialIcon name="refresh" size={14} color="var(--color-primary-accent)" />
                {t.regenerate}
              </button>
            </div>

            <FloorPlanSvg room={project.room} plan={plan} />

            <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "var(--color-on-surface-variant)" }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--color-primary)" }} />
              <span>{t.planLegend}</span>
            </div>
          </StepCard>

          <StepCard style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <MaterialIcon name="rule" size={20} color="var(--color-primary-accent)" />
              <h2 style={{ fontWeight: 700, fontSize: 14, margin: 0, color: "var(--color-on-surface)" }}>
                {t.clearancesTitle}
              </h2>
            </div>
            {plan.warnings.length === 0 ? (
              <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--color-on-surface-variant)", fontSize: 12.5 }}>
                <MaterialIcon name="check_circle" size={18} color="#16a34a" />
                <span>{t.allClear}</span>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {plan.warnings.map((w, i) => (
                  <WarningRow key={i} warning={w} />
                ))}
              </div>
            )}
          </StepCard>
        </div>
      ) : (
        <div style={{ padding: "40px 16px", textAlign: "center", color: "var(--color-on-surface-variant)", fontSize: 13 }}>
          Loading…
        </div>
      )}
    </WizardShell>
  );
}

function WarningRow({ warning }: { warning: ClearanceWarning }) {
  const isError = warning.severity === "error";
  const color = isError ? "#dc2626" : "#d97706";
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 8,
        padding: 10,
        borderRadius: 12,
        background: isError ? "rgba(220,38,38,0.08)" : "rgba(217,119,6,0.08)",
        border: `1px solid ${isError ? "rgba(220,38,38,0.25)" : "rgba(217,119,6,0.25)"}`,
      }}
    >
      <MaterialIcon name={isError ? "error" : "warning"} size={18} color={color} style={{ flexShrink: 0, marginTop: 1 }} />
      <span style={{ fontSize: 12, color: "var(--color-on-surface)", lineHeight: 1.4 }}>{warning.message}</span>
    </div>
  );
}
