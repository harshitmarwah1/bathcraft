"use client";

import { useRouter } from "next/navigation";
import { WizardShell } from "@/components/planner/shell/WizardShell";
import { ProgressBar } from "@/components/planner/shell/ProgressBar";
import { StepFooterCta } from "@/components/planner/sections/StepFooterCta";
import { FixtureSpecsSection } from "@/components/planner/sections/FixtureSpecsSection";
import { AddOnsSection } from "@/components/planner/sections/AddOnsSection";
import { useI18n } from "@/lib/planner/i18n/provider";
import { useEnsureProject } from "@/lib/planner/store/use-ensure-project";

export default function FixturesStepPage() {
  const { t } = useI18n();
  const router = useRouter();
  const { ready } = useEnsureProject();

  return (
    <WizardShell
      subtitle={t.appSub3}
      footer={
        <StepFooterCta
          label={t.s3CtaText}
          subLabel={t.s3CtaSub}
          onClick={() => router.push("/planner/plan")}
          onBack={() => router.push("/planner/style")}
          backLabel={t.backCta}
          disabled={!ready}
        />
      }
    >
      <ProgressBar badge={t.step3Badge} step={3} total={6} icon="grid_view" />
      {ready ? (
        <div style={{ padding: "0 16px", display: "flex", flexDirection: "column", gap: 16 }}>
          <FixtureSpecsSection />
          <AddOnsSection />
        </div>
      ) : (
        <div style={{ padding: "40px 16px", textAlign: "center", color: "var(--color-on-surface-variant)", fontSize: 13 }}>
          Loading…
        </div>
      )}
    </WizardShell>
  );
}
