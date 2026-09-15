"use client";

import { StepCard } from "@/components/planner/ui/StepCard";
import { MaterialIcon } from "@/components/planner/ui/MaterialIcon";
import { useI18n } from "@/lib/planner/i18n/provider";
import { useProjectStore } from "@/lib/planner/store/project-store";
import type { Dictionary } from "@/lib/planner/i18n/dictionaries";
import type { AddOnType } from "@/lib/planner/types";

type Key = keyof Dictionary;

const ADDONS: { value: AddOnType; icon: string }[] = [
  { value: "geyser", icon: "water_heater" },
  { value: "exhaustFan", icon: "mode_fan" },
  { value: "towelRail", icon: "dry_cleaning" },
  { value: "healthFaucet", icon: "water_drop" },
  { value: "floorDrain", icon: "water_damage" },
  { value: "niche", icon: "shelves" },
];

export function AddOnsSection() {
  const { t } = useI18n();
  const addOns = useProjectStore((s) => s.project?.addOns);
  const toggleAddOn = useProjectStore((s) => s.toggleAddOn);
  if (!addOns) return null;

  return (
    <StepCard style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <MaterialIcon name="add_circle" size={20} color="var(--color-primary-accent)" />
          <div>
            <h2 style={{ fontWeight: 700, fontSize: "calc(17px * var(--pl-fs, 1))", margin: 0, color: "var(--color-on-surface)" }}>
              {t.addOnsTitle}
            </h2>
            <p style={{ fontSize: "calc(11px * var(--pl-fs, 1))", margin: 0, color: "var(--color-on-surface-variant)" }}>{t.addOnsSub}</p>
          </div>
        </div>
        <span
          style={{
            fontSize: "calc(10px * var(--pl-fs, 1))",
            fontWeight: 700,
            padding: "2px 8px",
            borderRadius: 999,
            background: "var(--color-primary-tint)",
            color: "var(--color-primary-accent)",
            whiteSpace: "nowrap",
          }}
        >
          {addOns.length} {t.addOnsSelected}
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
        {ADDONS.map((a) => {
          const active = addOns.includes(a.value);
          const descKey = `${a.value}Desc` as Key;
          return (
            <button
              key={a.value}
              onClick={() => toggleAddOn(a.value)}
              aria-pressed={active}
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                gap: 6,
                padding: 12,
                borderRadius: 12,
                textAlign: "left",
                background: active ? "var(--color-primary-tint)" : "var(--color-surface-low)",
                border: active ? "1.5px solid var(--color-primary)" : "1px solid var(--color-surface-high)",
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 10,
                    background: active ? "var(--color-primary)" : "var(--color-surface-container)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <MaterialIcon
                    name={a.icon}
                    size={18}
                    color={active ? "var(--color-on-primary)" : "var(--color-primary-accent)"}
                  />
                </div>
                <MaterialIcon
                  name={active ? "check_circle" : "add_circle_outline"}
                  size={18}
                  color={active ? "var(--color-primary)" : "var(--color-on-surface-variant)"}
                />
              </div>
              <span style={{ fontWeight: 700, fontSize: "calc(12.5px * var(--pl-fs, 1))", color: "var(--color-on-surface)" }}>
                {t[a.value as Key]}
              </span>
              <span style={{ fontSize: "calc(10.5px * var(--pl-fs, 1))", color: "var(--color-on-surface-variant)", lineHeight: 1.35 }}>
                {t[descKey]}
              </span>
            </button>
          );
        })}
      </div>
    </StepCard>
  );
}
