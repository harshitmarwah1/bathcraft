"use client";

import { useRouter } from "next/navigation";
import { WizardShell } from "@/components/planner/shell/WizardShell";
import { ProgressBar } from "@/components/planner/shell/ProgressBar";
import { StepFooterCta } from "@/components/planner/sections/StepFooterCta";
import { StyleSection } from "@/components/planner/sections/StyleSection";
import { BudgetSection } from "@/components/planner/sections/BudgetSection";
import { useI18n } from "@/lib/planner/i18n/provider";
import { useEnsureProject } from "@/lib/planner/store/use-ensure-project";

export default function StyleStepPage() {
  const { t } = useI18n();
  const router = useRouter();
  const { ready } = useEnsureProject();

  return (
    <WizardShell
      subtitle={t.appSub2}
      footer={
        <StepFooterCta
          label={t.s2CtaText}
          subLabel={t.s2CtaSub}
          onClick={() => router.push("/planner/fixtures")}
          onBack={() => router.push("/planner/space")}
          backLabel={t.backCta}
          disabled={!ready}
        />
      }
    >
      <ProgressBar badge={t.step2Badge} step={2} total={6} icon="palette" />
      {ready ? (
        <div style={{ padding: "0 16px", display: "flex", flexDirection: "column", gap: 16 }}>
          <StyleSection />
          <BudgetSection />
        </div>
      ) : (
        <div style={{ padding: "40px 16px", textAlign: "center", color: "var(--color-on-surface-variant)", fontSize: 13 }}>
          Loading…
        </div>
      )}
    </WizardShell>
  );
}
