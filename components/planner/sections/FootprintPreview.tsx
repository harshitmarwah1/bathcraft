"use client";

import type { CSSProperties } from "react";
import { StepCard } from "@/components/planner/ui/StepCard";
import { MaterialIcon } from "@/components/planner/ui/MaterialIcon";
import { useI18n } from "@/lib/planner/i18n/provider";
import { useTheme } from "@/lib/planner/theme/provider";
import { useProjectStore } from "@/lib/planner/store/project-store";
import { inchesToFeetInchesShort } from "@/lib/planner/units";
import type { Opening, Placement, Wall } from "@/lib/planner/types";

/** Marker palettes (light/dark) — from the export. */
function markerColors(dark: boolean) {
  return {
    indigo: dark
      ? { tint: "rgba(255,255,255,0.08)", border: "#4a4640", text: "#d9d5cf" }
      : { tint: "#efeeec", border: "#cfcbc5", text: "#4a4640" },
    blue: dark
      ? { tint: "rgba(138,90,43,0.28)", border: "#8a5a2b", text: "#e0b98c" }
      : { tint: "#f6efe7", border: "#dcc4a8", text: "#8a5a2b" },
    teal: dark
      ? { tint: "rgba(79,107,74,0.3)", border: "#4f6b4a", text: "#b9cdb3" }
      : { tint: "#eef2ec", border: "#c5d1c1", text: "#4f6b4a" },
    cyan: dark
      ? { tint: "rgba(138,79,53,0.3)", border: "#8a4f35", text: "#e2b8a4" }
      : { tint: "#f5ebe6", border: "#dbbfb1", text: "#8a4f35" },
  };
}

function wcPos(p: Placement): CSSProperties {
  if (p === "left") return { top: "50%", left: 8, transform: "translateY(-50%)" };
  if (p === "right") return { top: "50%", right: 8, transform: "translateY(-50%)" };
  return { bottom: 8, left: 8 };
}
function vanityPos(p: Placement): CSSProperties {
  if (p === "left") return { top: 8, left: 8 };
  if (p === "nearEntry") return { bottom: 8, right: 8 };
  return { top: 8, right: 8 };
}

export function FootprintPreview() {
  const { t } = useI18n();
  const { theme } = useTheme();
  const dark = theme === "dark";
  const room = useProjectStore((s) => s.project?.room);
  const fixtures = useProjectStore((s) => s.project?.fixtures);
  const resetDims = useProjectStore((s) => s.resetDims);
  if (!room || !fixtures) return null;

  const c = markerColors(dark);
  const wc = fixtures.find((f) => f.type === "wc")?.placement ?? "back";
  const vanity = fixtures.find((f) => f.type === "vanity")?.placement ?? "right";

  const boxWidth = Math.round(Math.min(240, Math.max(150, 150 + (room.lengthInches - 72) * 0.45)));
  const boxHeight = Math.round(Math.min(130, Math.max(80, 80 + (room.widthInches - 48) * 0.4)));

  return (
    <StepCard style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <MaterialIcon name="draw" size={18} color="var(--color-primary-accent)" />
          <span style={{ fontWeight: 700, fontSize: "calc(12px * var(--pl-fs, 1))", color: "var(--color-on-surface)" }}>
            {t.previewTitle}
          </span>
        </div>
        <span style={{ fontSize: "calc(10px * var(--pl-fs, 1))", fontWeight: 700, color: "var(--color-primary-accent)" }}>
          {t.liveScale}
        </span>
      </div>

      <div
        style={{
          position: "relative",
          width: "100%",
          height: 144,
          background: "var(--color-surface-low)",
          borderRadius: 12,
          padding: 8,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          border: "1px solid var(--color-surface-high)",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.2,
            backgroundImage: "radial-gradient(var(--color-primary) 1px, transparent 1px)",
            backgroundSize: "12px 12px",
          }}
        />
        <div
          style={{
            position: "relative",
            borderRadius: 8,
            background: "var(--color-surface-lowest)",
            border: "2px solid var(--color-primary)",
            boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
            width: boxWidth,
            height: boxHeight,
            // Scale the whole drawing (outline + door/window marks, which are
            // positioned in unscaled px) with the planner's density multiplier.
            zoom: "var(--pl-sp, 1)",
          }}
        >
          {/* dimension labels */}
          <EdgeLabel style={{ top: -16, left: "50%", transform: "translateX(-50%)" }}>
            {inchesToFeetInchesShort(room.lengthInches)}
          </EdgeLabel>
          <EdgeLabel style={{ right: -24, top: "50%", transform: "translateY(-50%) rotate(90deg)" }}>
            {inchesToFeetInchesShort(room.widthInches)}
          </EdgeLabel>

          {/* door & window on the walls */}
          <OpeningMark opening={room.door} boxWidth={boxWidth} boxHeight={boxHeight} kind="door" />
          {room.window && (
            <OpeningMark opening={room.window} boxWidth={boxWidth} boxHeight={boxHeight} kind="window" />
          )}

          {/* fixture markers */}
          <Marker color={c.indigo} icon="shower" label={t.markerWet} style={{ top: 8, left: 8 }} />
          <Marker color={c.blue} icon="wc" label={t.markerWc} style={wcPos(wc)} />
          <Marker color={c.teal} icon="countertops" label={t.markerBasin} style={vanityPos(vanity)} />
          <Marker color={c.cyan} icon="kitchen" label={t.markerAlmirah} style={{ bottom: 8, right: 8 }} />
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: "calc(11px * var(--pl-fs, 1))",
          color: "var(--color-on-surface-variant)",
          padding: "0 2px",
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--color-primary)" }} />
          <span>{t.footnote}</span>
        </span>
        <span
          onClick={resetDims}
          style={{ fontWeight: 700, color: "var(--color-primary-accent)", cursor: "pointer" }}
        >
          {t.resetDefault}
        </span>
      </div>
    </StepCard>
  );
}

function EdgeLabel({ children, style }: { children: React.ReactNode; style: CSSProperties }) {
  return (
    <div
      style={{
        position: "absolute",
        background: "var(--color-surface-lowest)",
        padding: "2px 6px",
        borderRadius: 6,
        fontSize: "calc(10px * var(--pl-fs, 1))",
        fontWeight: 700,
        color: "var(--color-primary-accent)",
        border: "1px solid var(--color-primary-tint-border)",
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Marker({
  color,
  icon,
  label,
  style,
}: {
  color: { tint: string; border: string; text: string };
  icon: string;
  label: string;
  style: CSSProperties;
}) {
  return (
    <div
      style={{
        position: "absolute",
        display: "flex",
        alignItems: "center",
        gap: 4,
        padding: "4px 6px",
        borderRadius: 6,
        background: color.tint,
        border: `1px solid ${color.border}`,
        fontSize: "calc(9px * var(--pl-fs, 1))",
        fontWeight: 700,
        color: color.text,
        ...style,
      }}
    >
      <MaterialIcon name={icon} size={12} color={color.text} />
      <span>{label}</span>
    </div>
  );
}

/** A door or window drawn on its wall of the scaled box. */
function OpeningMark({
  opening,
  boxWidth,
  boxHeight,
  kind,
}: {
  opening: Opening;
  boxWidth: number;
  boxHeight: number;
  kind: "door" | "window";
}) {
  const horizontal: Wall[] = ["back", "front"];
  const isHorizontal = horizontal.includes(opening.wall);
  // approximate wall length in inches for the fraction
  const wallLen = isHorizontal ? 102 : 72; // display-only reference span
  const frac = Math.min(0.85, Math.max(0.15, opening.offsetInches / wallLen));
  const segMain = 22; // px length of the opening along the wall
  const isDoor = kind === "door";
  const color = isDoor ? "var(--color-primary)" : "var(--color-primary-accent)";

  const base: CSSProperties = {
    position: "absolute",
    background: isDoor ? color : "var(--color-surface-lowest)",
    border: isDoor ? "none" : `2px solid ${color}`,
    borderRadius: 2,
  };

  let pos: CSSProperties;
  if (opening.wall === "back") pos = { top: -3, left: frac * boxWidth - segMain / 2, width: segMain, height: 4 };
  else if (opening.wall === "front") pos = { bottom: -3, left: frac * boxWidth - segMain / 2, width: segMain, height: 4 };
  else if (opening.wall === "left") pos = { left: -3, top: frac * boxHeight - segMain / 2, width: 4, height: segMain };
  else pos = { right: -3, top: frac * boxHeight - segMain / 2, width: 4, height: segMain };

  return <div title={kind} style={{ ...base, ...pos }} />;
}
