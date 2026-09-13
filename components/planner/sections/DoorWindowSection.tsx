"use client";

import { StepCard } from "@/components/planner/ui/StepCard";
import { MaterialIcon } from "@/components/planner/ui/MaterialIcon";
import { useI18n } from "@/lib/planner/i18n/provider";
import { useProjectStore } from "@/lib/planner/store/project-store";
import type { Opening, Wall } from "@/lib/planner/types";

const WALLS: { value: Wall; labelKey: "back" | "frontWall" | "left" | "right" }[] = [
  { value: "back", labelKey: "back" },
  { value: "front", labelKey: "frontWall" },
  { value: "left", labelKey: "left" },
  { value: "right", labelKey: "right" },
];

export function DoorWindowSection() {
  const { t } = useI18n();
  const room = useProjectStore((s) => s.project?.room);
  const setDoor = useProjectStore((s) => s.setDoor);
  const setWindow = useProjectStore((s) => s.setWindow);
  if (!room) return null;

  const wallSpan = (wall: Wall) =>
    wall === "back" || wall === "front" ? room.lengthInches : room.widthInches;

  return (
    <StepCard style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <MaterialIcon name="sensor_door" size={20} color="var(--color-primary-accent)" />
        <div>
          <h2 style={{ fontWeight: 700, fontSize: 14, margin: 0, color: "var(--color-on-surface)" }}>
            {t.doorWindowTitle}
          </h2>
          <p style={{ fontSize: 11, margin: 0, color: "var(--color-on-surface-variant)" }}>
            {t.doorWindowSub}
          </p>
        </div>
      </div>

      <OpeningRow
        icon="sensor_door"
        label={t.doorLabel}
        opening={room.door}
        maxOffset={wallSpan(room.door.wall)}
        walls={WALLS.map((w) => ({ ...w, label: t[w.labelKey] }))}
        onChange={setDoor}
      />
      <OpeningRow
        icon="window"
        label={t.windowLabel}
        opening={room.window ?? { wall: "back", offsetInches: 60, widthInches: 36 }}
        maxOffset={wallSpan((room.window ?? { wall: "back" }).wall)}
        walls={WALLS.map((w) => ({ ...w, label: t[w.labelKey] }))}
        onChange={setWindow}
      />
    </StepCard>
  );
}

function OpeningRow({
  icon,
  label,
  opening,
  maxOffset,
  walls,
  onChange,
}: {
  icon: string;
  label: string;
  opening: Opening;
  maxOffset: number;
  walls: { value: Wall; label: string }[];
  onChange: (o: Opening) => void;
}) {
  return (
    <div
      style={{
        padding: 10,
        borderRadius: 12,
        background: "var(--color-surface-low)",
        border: "1px solid var(--color-surface-high)",
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 10,
            background: "var(--color-primary-tint)",
            color: "var(--color-primary-accent)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <MaterialIcon name={icon} size={18} />
        </div>
        <span style={{ fontWeight: 700, fontSize: 12, color: "var(--color-on-surface)" }}>{label}</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
        {walls.map((w) => {
          const active = opening.wall === w.value;
          return (
            <button
              key={w.value}
              onClick={() => onChange({ ...opening, wall: w.value })}
              style={{
                padding: "6px 4px",
                borderRadius: 8,
                fontSize: 11,
                fontWeight: active ? 700 : 600,
                background: active ? "var(--color-primary)" : "var(--color-surface-lowest)",
                color: active ? "var(--color-on-primary)" : "var(--color-on-surface)",
                border: active ? "none" : "1px solid var(--color-surface-high)",
                cursor: "pointer",
                fontFamily: "inherit",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {w.label}
            </button>
          );
        })}
      </div>

      <input
        type="range"
        min={0}
        max={maxOffset}
        step={3}
        value={Math.min(opening.offsetInches, maxOffset)}
        onChange={(e) => onChange({ ...opening, offsetInches: Number(e.target.value) })}
        aria-label={`${label} position`}
        style={{ width: "100%", accentColor: "var(--color-primary)", cursor: "pointer" }}
      />
    </div>
  );
}
