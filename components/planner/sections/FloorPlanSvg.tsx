"use client";

import { useI18n } from "@/lib/planner/i18n/provider";
import { useTheme } from "@/lib/planner/theme/provider";
import { inchesToFeetInchesShort } from "@/lib/planner/units";
import type { Dictionary } from "@/lib/planner/i18n/dictionaries";
import type { FixtureType, GeneratedPlan, Opening, Room } from "@/lib/planner/types";

const PAD = 30; // inches of margin around the room for labels

function fixtureColor(type: FixtureType, dark: boolean): { stroke: string; fill: string } {
  const light: Record<FixtureType, string> = {
    wc: "#1d4ed8",
    vanity: "#0f766e",
    shower: "#4338ca",
    almirah: "#0e7490",
  };
  const darkC: Record<FixtureType, string> = {
    wc: "#93c5fd",
    vanity: "#5eead4",
    shower: "#a5b4fc",
    almirah: "#67e8f9",
  };
  const stroke = dark ? darkC[type] : light[type];
  return { stroke, fill: dark ? `${stroke}22` : `${stroke}18` };
}

const LABEL_KEY: Record<FixtureType, keyof Dictionary> = {
  wc: "markerWc",
  vanity: "markerBasin",
  shower: "markerShower",
  almirah: "markerAlmirah",
};

/** Coordinates of an opening's segment endpoints on its wall. */
function openingSegment(o: Opening, room: Room) {
  const { lengthInches: L, widthInches: W } = room;
  const half = o.widthInches / 2;
  switch (o.wall) {
    case "back":
      return { x1: o.offsetInches - half, y1: 0, x2: o.offsetInches + half, y2: 0 };
    case "front":
      return { x1: o.offsetInches - half, y1: W, x2: o.offsetInches + half, y2: W };
    case "left":
      return { x1: 0, y1: o.offsetInches - half, x2: 0, y2: o.offsetInches + half };
    default:
      return { x1: L, y1: o.offsetInches - half, x2: L, y2: o.offsetInches + half };
  }
}

export function FloorPlanSvg({ room, plan }: { room: Room; plan: GeneratedPlan }) {
  const { t } = useI18n();
  const { theme } = useTheme();
  const dark = theme === "dark";
  const { lengthInches: L, widthInches: W } = room;

  const gridLines: React.ReactNode[] = [];
  for (let x = 12; x < L; x += 12) {
    gridLines.push(<line key={`vx${x}`} x1={x} y1={0} x2={x} y2={W} stroke="var(--color-primary)" strokeOpacity={0.08} strokeWidth={0.5} />);
  }
  for (let y = 12; y < W; y += 12) {
    gridLines.push(<line key={`hy${y}`} x1={0} y1={y} x2={L} y2={y} stroke="var(--color-primary)" strokeOpacity={0.08} strokeWidth={0.5} />);
  }

  const door = openingSegment(room.door, room);
  const win = room.window ? openingSegment(room.window, room) : null;

  return (
    <svg
      viewBox={`${-PAD} ${-PAD} ${L + PAD * 2} ${W + PAD * 2}`}
      width="100%"
      role="img"
      aria-label="Generated 2D bathroom floor plan"
      style={{ display: "block", background: "var(--color-surface-low)", borderRadius: 12 }}
    >
      {/* floor */}
      <rect x={0} y={0} width={L} height={W} fill="var(--color-surface-lowest)" />
      {gridLines}

      {/* walls */}
      <rect
        x={0}
        y={0}
        width={L}
        height={W}
        fill="none"
        stroke="var(--color-primary)"
        strokeWidth={2}
        vectorEffect="non-scaling-stroke"
      />

      {/* door: white gap + swing arc + leaf */}
      <line x1={door.x1} y1={door.y1} x2={door.x2} y2={door.y2} stroke="var(--color-surface-lowest)" strokeWidth={4} vectorEffect="non-scaling-stroke" />
      <DoorSwing opening={room.door} room={room} />

      {/* window: double line */}
      {win && (
        <>
          <line x1={win.x1} y1={win.y1} x2={win.x2} y2={win.y2} stroke={dark ? "#93ccff" : "#006194"} strokeWidth={5} vectorEffect="non-scaling-stroke" strokeOpacity={0.25} />
          <line x1={win.x1} y1={win.y1} x2={win.x2} y2={win.y2} stroke={dark ? "#93ccff" : "#006194"} strokeWidth={1.5} vectorEffect="non-scaling-stroke" />
        </>
      )}

      {/* fixtures */}
      {plan.fixtures.map((f, i) => {
        const c = fixtureColor(f.type, dark);
        const cx = f.x + f.widthInches / 2;
        const cy = f.y + f.depthInches / 2;
        return (
          <g key={`${f.type}-${i}`}>
            <rect
              x={f.x}
              y={f.y}
              width={f.widthInches}
              height={f.depthInches}
              rx={3}
              fill={c.fill}
              stroke={c.stroke}
              strokeWidth={1.5}
              vectorEffect="non-scaling-stroke"
            />
            <text
              x={cx}
              y={cy}
              fill={c.stroke}
              fontSize={6}
              fontWeight={700}
              textAnchor="middle"
              dominantBaseline="central"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              {t[LABEL_KEY[f.type]]}
            </text>
          </g>
        );
      })}

      {/* dimension labels */}
      <text x={L / 2} y={-12} fill="var(--color-primary-accent)" fontSize={7} fontWeight={700} textAnchor="middle" style={{ fontFamily: "var(--font-sans)" }}>
        {inchesToFeetInchesShort(L)}
      </text>
      <text x={-14} y={W / 2} fill="var(--color-primary-accent)" fontSize={7} fontWeight={700} textAnchor="middle" transform={`rotate(-90 ${-14} ${W / 2})`} style={{ fontFamily: "var(--font-sans)" }}>
        {inchesToFeetInchesShort(W)}
      </text>
    </svg>
  );
}

/** Quarter-circle door swing + leaf, drawn into the room from the door. */
function DoorSwing({ opening, room }: { opening: Opening; room: Room }) {
  const seg = openingSegment(opening, room);
  const r = opening.widthInches;
  // hinge at the first endpoint; leaf swings toward the room interior
  const intoRoom = { back: 1, front: -1, left: 1, right: -1 }[opening.wall];
  let hinge: { x: number; y: number };
  let leafEnd: { x: number; y: number };
  let arcEnd: { x: number; y: number };

  if (opening.wall === "back" || opening.wall === "front") {
    hinge = { x: seg.x1, y: seg.y1 };
    leafEnd = { x: seg.x1, y: seg.y1 + r * intoRoom };
    arcEnd = { x: seg.x2, y: seg.y1 };
  } else {
    hinge = { x: seg.x1, y: seg.y1 };
    leafEnd = { x: seg.x1 + r * intoRoom, y: seg.y1 };
    arcEnd = { x: seg.x1, y: seg.y2 };
  }

  const stroke = "var(--color-on-surface-variant)";
  return (
    <g stroke={stroke} strokeOpacity={0.5} fill="none" vectorEffect="non-scaling-stroke">
      <line x1={hinge.x} y1={hinge.y} x2={leafEnd.x} y2={leafEnd.y} strokeWidth={1.2} vectorEffect="non-scaling-stroke" />
      <path d={`M ${leafEnd.x} ${leafEnd.y} A ${r} ${r} 0 0 1 ${arcEnd.x} ${arcEnd.y}`} strokeWidth={1} strokeDasharray="3 3" vectorEffect="non-scaling-stroke" />
    </g>
  );
}
