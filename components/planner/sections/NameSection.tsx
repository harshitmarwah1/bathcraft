"use client";

import { StepCard } from "@/components/planner/ui/StepCard";
import { MaterialIcon } from "@/components/planner/ui/MaterialIcon";
import { useI18n } from "@/lib/planner/i18n/provider";
import { useProjectStore } from "@/lib/planner/store/project-store";
import type { RoomPreset } from "@/lib/planner/types";

const PRESETS: { key: RoomPreset; name: string; icon: string; labelKey: "master" | "guest" | "kids" | "powder" }[] = [
  { key: "master", name: "Master Ensuite", icon: "bathtub", labelKey: "master" },
  { key: "guest", name: "Guest Bath", icon: "wash", labelKey: "guest" },
  { key: "kids", name: "Kids Bath", icon: "child_care", labelKey: "kids" },
  { key: "powder", name: "Powder Room", icon: "clean_hands", labelKey: "powder" },
];

export function NameSection() {
  const { t } = useI18n();
  const room = useProjectStore((s) => s.project?.room);
  const setRoomName = useProjectStore((s) => s.setRoomName);
  const setPreset = useProjectStore((s) => s.setPreset);
  if (!room) return null;

  return (
    <StepCard>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 8,
        }}
      >
        <label
          style={{
            fontWeight: 700,
            fontSize: 14,
            color: "var(--color-on-surface)",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <MaterialIcon name="edit_square" size={18} color="var(--color-primary-accent)" />
          <span>{t.nameSpace}</span>
        </label>
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: "var(--color-primary-accent)",
            background: "var(--color-primary-tint)",
            padding: "2px 8px",
            borderRadius: 999,
          }}
        >
          {t.quickBadge}
        </span>
      </div>

      <div style={{ position: "relative", display: "flex", alignItems: "center", marginBottom: 12 }}>
        <MaterialIcon
          name="room_preferences"
          size={20}
          color="var(--color-on-surface-variant)"
          style={{ position: "absolute", left: 14 }}
        />
        <input
          type="text"
          value={room.name}
          onChange={(e) => setRoomName(e.target.value)}
          placeholder="e.g. Master Ensuite"
          style={{
            width: "100%",
            height: 44,
            padding: "0 16px 0 44px",
            borderRadius: 12,
            background: "var(--color-surface-low)",
            border: "1px solid var(--color-surface-high)",
            color: "var(--color-on-surface)",
            fontWeight: 700,
            fontSize: 14,
            outline: "none",
            boxSizing: "border-box",
            fontFamily: "inherit",
          }}
        />
      </div>

      <div
        className="nsb"
        style={{ display: "flex", alignItems: "center", gap: 8, overflowX: "auto", paddingBottom: 2 }}
      >
        {PRESETS.map((p) => {
          const active = room.preset === p.key;
          return (
            <button
              key={p.key}
              onClick={() => setPreset(p.key, p.name)}
              style={{
                flexShrink: 0,
                padding: "7px 12px",
                borderRadius: 12,
                fontWeight: active ? 700 : 500,
                fontSize: 12,
                background: active ? "var(--color-primary)" : "var(--color-surface-low)",
                color: active ? "var(--color-on-primary)" : "var(--color-on-surface)",
                border: active ? "none" : "1px solid var(--color-surface-high)",
                display: "flex",
                alignItems: "center",
                gap: 6,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              <MaterialIcon
                name={p.icon}
                size={16}
                color={active ? "var(--color-on-primary)" : "var(--color-primary-accent)"}
              />
              <span>{t[p.labelKey]}</span>
            </button>
          );
        })}
      </div>
    </StepCard>
  );
}
