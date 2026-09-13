"use client";

import { StepCard } from "@/components/planner/ui/StepCard";
import { MaterialIcon } from "@/components/planner/ui/MaterialIcon";
import { useI18n } from "@/lib/planner/i18n/provider";
import { useProjectStore } from "@/lib/planner/store/project-store";
import { DIM_BOUNDS } from "@/lib/planner/defaults";
import { primaryDim, secondaryDim, areaSqft, areaSqm } from "@/lib/planner/units";

type DimKey = keyof typeof DIM_BOUNDS;

export function DimensionsSection() {
  const { t } = useI18n();
  const room = useProjectStore((s) => s.project?.room);
  const unit = useProjectStore((s) => s.unit);
  const setUnit = useProjectStore((s) => s.setUnit);
  const adjustDim = useProjectStore((s) => s.adjustDim);
  if (!room) return null;

  const rows: { key: DimKey; icon: string; label: string; sub: string; value: number }[] = [
    { key: "length", icon: "straighten", label: t.lenLabel, sub: t.lenSub, value: room.lengthInches },
    { key: "width", icon: "width", label: t.widLabel, sub: t.widSub, value: room.widthInches },
    { key: "height", icon: "height", label: t.hgtLabel, sub: t.hgtSub, value: room.heightInches },
  ];

  const sqft = areaSqft(room.lengthInches, room.widthInches);
  const sqm = areaSqm(sqft);
  const ratio = (room.lengthInches / room.widthInches).toFixed(1);

  return (
    <StepCard style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <MaterialIcon name="straighten" size={20} color="var(--color-primary-accent)" />
          <div>
            <h2 style={{ fontWeight: 700, fontSize: 14, margin: 0, color: "var(--color-on-surface)" }}>
              {t.dimTitle}
            </h2>
            <p style={{ fontSize: 11, margin: 0, color: "var(--color-on-surface-variant)" }}>
              {t.dimSub}
            </p>
          </div>
        </div>
        <div
          style={{
            background: "var(--color-surface-low)",
            padding: 4,
            borderRadius: 12,
            display: "flex",
            alignItems: "center",
            border: "1px solid var(--color-surface-high)",
          }}
        >
          <UnitButton label="ft / in" active={unit === "imperial"} onClick={() => setUnit("imperial")} />
          <UnitButton label="cm / m" active={unit === "metric"} onClick={() => setUnit("metric")} />
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, paddingTop: 4 }}>
        {rows.map((row) => (
          <div
            key={row.key}
            style={{
              padding: 10,
              borderRadius: 12,
              background: "var(--color-surface-low)",
              border: "1px solid var(--color-surface-high)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: "var(--color-primary-tint)",
                  color: "var(--color-primary-accent)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <MaterialIcon name={row.icon} size={18} />
              </div>
              <div style={{ minWidth: 0 }}>
                <p style={{ fontWeight: 700, fontSize: 12, margin: 0, color: "var(--color-on-surface)", whiteSpace: "nowrap" }}>
                  {row.label}
                </p>
                <p style={{ fontSize: 10, margin: 0, color: "var(--color-on-surface-variant)", whiteSpace: "nowrap" }}>
                  {row.sub}
                </p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <StepBtn icon="remove" ariaLabel="Decrease" onClick={() => adjustDim(row.key, -DIM_BOUNDS[row.key].step)} />
              <div style={{ minWidth: 80, textAlign: "center" }}>
                <span style={{ fontWeight: 700, fontSize: 12, display: "block", color: "var(--color-on-surface)" }}>
                  {primaryDim(row.value, unit)}
                </span>
                <span style={{ fontSize: 10, fontWeight: 600, display: "block", color: "var(--color-primary-accent)" }}>
                  {secondaryDim(row.value, unit)}
                </span>
              </div>
              <StepBtn icon="add" ariaLabel="Increase" onClick={() => adjustDim(row.key, DIM_BOUNDS[row.key].step)} />
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: 2,
          padding: 12,
          borderRadius: 12,
          background: "var(--color-primary-tint)",
          border: "1px solid var(--color-primary-tint-border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 10,
              background: "var(--color-primary)",
              color: "var(--color-on-primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <MaterialIcon name="square_foot" size={18} />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6, flexWrap: "wrap" }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "var(--color-primary-accent)", textTransform: "uppercase", letterSpacing: "0.4px" }}>
                {t.areaCalc}
              </span>
              <span style={{ fontWeight: 700, fontSize: 14, color: "var(--color-on-surface)" }}>{sqft} sq.ft</span>
              <span style={{ fontSize: 11, color: "var(--color-on-surface-variant)" }}>({sqm} m²)</span>
            </div>
            <p style={{ fontSize: 10, margin: 0, color: "var(--color-on-surface-variant)" }}>{t.spaceVerdict}</p>
          </div>
        </div>
        <div
          style={{
            width: 52,
            height: 36,
            borderRadius: 8,
            background: "var(--color-surface-lowest)",
            border: "1px solid var(--color-primary-tint-border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
            fontSize: 11,
            color: "var(--color-primary-accent)",
            flexShrink: 0,
          }}
        >
          {ratio} : 1
        </div>
      </div>
    </StepCard>
  );
}

function UnitButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "4px 10px",
        borderRadius: 8,
        fontWeight: active ? 700 : 600,
        fontSize: 12,
        background: active ? "var(--color-primary)" : "transparent",
        color: active ? "var(--color-on-primary)" : "var(--color-on-surface-variant)",
        border: "none",
        cursor: "pointer",
        whiteSpace: "nowrap",
        fontFamily: "inherit",
      }}
    >
      {label}
    </button>
  );
}

function StepBtn({ icon, ariaLabel, onClick }: { icon: string; ariaLabel: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      style={{
        width: 32,
        height: 32,
        borderRadius: 10,
        background: "var(--color-surface-lowest)",
        border: "1px solid var(--color-surface-high)",
        color: "var(--color-on-surface)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
      }}
    >
      <MaterialIcon name={icon} size={16} />
    </button>
  );
}
