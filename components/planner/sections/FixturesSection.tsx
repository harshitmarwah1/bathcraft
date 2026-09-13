"use client";

import { StepCard } from "@/components/planner/ui/StepCard";
import { MaterialIcon } from "@/components/planner/ui/MaterialIcon";
import { useI18n } from "@/lib/planner/i18n/provider";
import { useTheme } from "@/lib/planner/theme/provider";
import { useProjectStore } from "@/lib/planner/store/project-store";
import type { Dictionary } from "@/lib/planner/i18n/dictionaries";
import type { FixtureType, Placement } from "@/lib/planner/types";

type LabelKey = keyof Dictionary;

interface FixtureDef {
  type: FixtureType;
  icon: string;
  nameKey: LabelKey;
  subKey: LabelKey;
  palette: { bgLight: string; bgDark: string; fgLight: string; fgDark: string; badge: string };
  options: { value: Placement; icon: string; labelKey: LabelKey }[];
}

const FIXTURES: FixtureDef[] = [
  {
    type: "wc",
    icon: "wc",
    nameKey: "elemWc",
    subKey: "elemWcSub",
    palette: { bgLight: "#dbeafe", bgDark: "rgba(30,58,138,0.4)", fgLight: "#006194", fgDark: "#93c5fd", badge: "rgba(0,97,148,0.15)" },
    options: [
      { value: "back", icon: "arrow_downward", labelKey: "back" },
      { value: "left", icon: "arrow_back", labelKey: "left" },
      { value: "right", icon: "arrow_forward", labelKey: "right" },
    ],
  },
  {
    type: "vanity",
    icon: "countertops",
    nameKey: "elemVanity",
    subKey: "elemVanitySub",
    palette: { bgLight: "#ccfbf1", bgDark: "rgba(19,78,74,0.4)", fgLight: "#0f766e", fgDark: "#5eead4", badge: "rgba(20,184,166,0.15)" },
    options: [
      { value: "left", icon: "arrow_back", labelKey: "left" },
      { value: "right", icon: "arrow_forward", labelKey: "right" },
      { value: "nearEntry", icon: "door_sliding", labelKey: "nearEntry" },
    ],
  },
  {
    type: "shower",
    icon: "shower",
    nameKey: "elemShower",
    subKey: "elemShowerSub",
    palette: { bgLight: "#e0e7ff", bgDark: "rgba(49,46,129,0.4)", fgLight: "#4338ca", fgDark: "#a5b4fc", badge: "rgba(99,102,241,0.15)" },
    options: [
      { value: "walkIn", icon: "shower", labelKey: "walkIn" },
      { value: "enclosed", icon: "door_sliding", labelKey: "enclosed" },
      { value: "tubCombo", icon: "bathtub", labelKey: "tubCombo" },
    ],
  },
  {
    type: "almirah",
    icon: "kitchen",
    nameKey: "elemAlmirah",
    subKey: "elemAlmirahSub",
    palette: { bgLight: "#cffafe", bgDark: "rgba(22,78,99,0.4)", fgLight: "#0e7490", fgDark: "#67e8f9", badge: "rgba(6,182,212,0.15)" },
    options: [
      { value: "underVanity", icon: "vertical_align_bottom", labelKey: "underVanity" },
      { value: "dryCorner", icon: "square", labelKey: "dryCorner" },
      { value: "wallRecess", icon: "in_home_mode", labelKey: "wallRecess" },
    ],
  },
];

export function FixturesSection() {
  const { t } = useI18n();
  const { theme } = useTheme();
  const dark = theme === "dark";
  const fixtures = useProjectStore((s) => s.project?.fixtures);
  const setFixturePlacement = useProjectStore((s) => s.setFixturePlacement);
  if (!fixtures) return null;

  const placementOf = (type: FixtureType): Placement =>
    fixtures.find((f) => f.type === type)?.placement ?? "back";

  return (
    <StepCard style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <MaterialIcon name="grid_view" size={20} color="var(--color-primary-accent)" />
          <div>
            <h2 style={{ fontWeight: 700, fontSize: 14, margin: 0, color: "var(--color-on-surface)" }}>
              {t.fixturesTitle}
            </h2>
            <p style={{ fontSize: 11, margin: 0, color: "var(--color-on-surface-variant)" }}>
              {t.fixturesSub}
            </p>
          </div>
        </div>
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            padding: "2px 8px",
            borderRadius: 999,
            background: "var(--color-surface-container)",
            color: "var(--color-on-surface-variant)",
            whiteSpace: "nowrap",
          }}
        >
          {FIXTURES.length} {t.itemsSuffix}
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, paddingTop: 4 }}>
        {FIXTURES.map((f) => {
          const current = placementOf(f.type);
          const fg = dark ? f.palette.fgDark : f.palette.fgLight;
          const bg = dark ? f.palette.bgDark : f.palette.bgLight;
          return (
            <div
              key={f.type}
              style={{
                padding: 12,
                borderRadius: 12,
                background: "var(--color-surface-low)",
                border: "1px solid var(--color-surface-high)",
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 10,
                      background: bg,
                      color: fg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <MaterialIcon name={f.icon} size={18} />
                  </div>
                  <div>
                    <span style={{ fontWeight: 700, fontSize: 12, display: "block", color: "var(--color-on-surface)" }}>
                      {t[f.nameKey]}
                    </span>
                    <span style={{ fontSize: 10, color: "var(--color-on-surface-variant)" }}>{t[f.subKey]}</span>
                  </div>
                </div>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: fg,
                    background: f.palette.badge,
                    padding: "2px 8px",
                    borderRadius: 6,
                    whiteSpace: "nowrap",
                  }}
                >
                  {t[current as LabelKey] ?? current}
                </span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
                {f.options.map((opt) => {
                  const active = current === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => setFixturePlacement(f.type, opt.value)}
                      style={{
                        padding: "6px 8px",
                        borderRadius: 10,
                        fontSize: 11,
                        fontWeight: active ? 700 : 600,
                        background: active ? "var(--color-primary)" : "var(--color-surface-lowest)",
                        color: active ? "var(--color-on-primary)" : "var(--color-on-surface)",
                        border: active ? "none" : "1px solid var(--color-surface-high)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 4,
                        cursor: "pointer",
                        fontFamily: "inherit",
                      }}
                    >
                      <MaterialIcon name={opt.icon} size={13} />
                      <span>{t[opt.labelKey]}</span>
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
