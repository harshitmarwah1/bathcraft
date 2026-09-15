"use client";

import { StepCard } from "@/components/planner/ui/StepCard";
import { MaterialIcon } from "@/components/planner/ui/MaterialIcon";
import { useI18n } from "@/lib/planner/i18n/provider";
import { useProjectStore } from "@/lib/planner/store/project-store";
import type { Dictionary } from "@/lib/planner/i18n/dictionaries";
import type { FixtureType, FixtureVariant } from "@/lib/planner/types";

type Key = keyof Dictionary;

const FIXTURES: {
  type: FixtureType;
  icon: string;
  nameKey: Key;
  variants: FixtureVariant[];
}[] = [
  { type: "wc", icon: "wc", nameKey: "elemWc", variants: ["wallHung", "floorMounted", "smart"] },
  { type: "vanity", icon: "countertops", nameKey: "elemVanity", variants: ["countertop", "wallHungBasin", "pedestal"] },
  { type: "shower", icon: "shower", nameKey: "elemShower", variants: ["rainShower", "handheld", "showerPanel"] },
  { type: "almirah", icon: "kitchen", nameKey: "elemAlmirah", variants: ["mirrorCabinet", "openShelf", "tallUnit"] },
];

export function FixtureSpecsSection() {
  const { t } = useI18n();
  const fixtures = useProjectStore((s) => s.project?.fixtures);
  const setFixtureVariant = useProjectStore((s) => s.setFixtureVariant);
  if (!fixtures) return null;

  const variantOf = (type: FixtureType) => fixtures.find((f) => f.type === type)?.variant;

  return (
    <StepCard style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <MaterialIcon name="tune" size={20} color="var(--color-primary-accent)" />
        <div>
          <h2 style={{ fontWeight: 700, fontSize: "calc(17px * var(--pl-fs, 1))", margin: 0, color: "var(--color-on-surface)" }}>
            {t.specsTitle}
          </h2>
          <p style={{ fontSize: "calc(11px * var(--pl-fs, 1))", margin: 0, color: "var(--color-on-surface-variant)" }}>{t.specsSub}</p>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {FIXTURES.map((f) => {
          const current = variantOf(f.type);
          return (
            <div key={f.type} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    background: "var(--color-primary-tint)",
                    color: "var(--color-primary-accent)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <MaterialIcon name={f.icon} size={16} />
                </div>
                <span style={{ fontWeight: 700, fontSize: "calc(13px * var(--pl-fs, 1))", color: "var(--color-on-surface)" }}>
                  {t[f.nameKey]}
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {f.variants.map((v) => {
                  const active = current === v;
                  const descKey = `${v}Desc` as Key;
                  return (
                    <button
                      key={v}
                      onClick={() => setFixtureVariant(f.type, v)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "10px 12px",
                        borderRadius: 12,
                        textAlign: "left",
                        background: active ? "var(--color-primary-tint)" : "var(--color-surface-low)",
                        border: active
                          ? "1.5px solid var(--color-primary)"
                          : "1px solid var(--color-surface-high)",
                        cursor: "pointer",
                        fontFamily: "inherit",
                      }}
                    >
                      <MaterialIcon
                        name={active ? "radio_button_checked" : "radio_button_unchecked"}
                        size={20}
                        color={active ? "var(--color-primary)" : "var(--color-on-surface-variant)"}
                        style={{ flexShrink: 0 }}
                      />
                      <span style={{ minWidth: 0 }}>
                        <span style={{ display: "block", fontWeight: active ? 800 : 700, fontSize: "calc(12.5px * var(--pl-fs, 1))", color: "var(--color-on-surface)" }}>
                          {t[v as Key]}
                        </span>
                        <span style={{ display: "block", fontSize: "calc(11px * var(--pl-fs, 1))", color: "var(--color-on-surface-variant)" }}>
                          {t[descKey]}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </StepCard>
  );
}
