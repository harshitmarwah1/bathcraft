import type {
  ClearanceWarning,
  FixtureChoice,
  FixtureType,
  GeneratedPlan,
  PlacedFixture,
  Placement,
  Room,
  Wall,
} from "@/lib/planner/types";
import { footprintFor, type Footprint, WC_FRONT_CLEARANCE_MIN } from "./footprints";

/*
 * Rule-based archetype layout engine.
 *
 * Coordinate system: origin (0,0) at the back-left corner. x runs along the
 * room length (0..L), y along the width (0..W). Walls: back = y:0 edge,
 * front = y:W edge, left = x:0 edge, right = x:L edge.
 *
 * Each fixture is snapped to a wall and packed along it (greedy, from the
 * origin corner), skipping the door opening and any fixture already placed.
 * Clearances are validated afterward and surfaced as warnings.
 */

interface Interval {
  start: number;
  end: number;
}

const ALL_WALLS: Wall[] = ["back", "front", "left", "right"];
const ROTATION: Record<Wall, number> = { back: 0, front: 180, left: 90, right: 270 };

const OPPOSITE: Record<Wall, Wall> = {
  back: "front",
  front: "back",
  left: "right",
  right: "left",
};

function isHorizontal(wall: Wall): boolean {
  return wall === "back" || wall === "front";
}

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

/** Map a fixture's placement value to a wall, when it denotes one. */
function placementToWall(placement: Placement, door: Wall, fallback: Wall): Wall {
  if (placement === "back" || placement === "front" || placement === "left" || placement === "right")
    return placement;
  if (placement === "nearEntry") return door;
  return fallback;
}

function firstFreePos(occupied: Interval[], wallLen: number, need: number): number | null {
  const sorted = [...occupied].sort((a, b) => a.start - b.start);
  let cursor = 0;
  for (const iv of sorted) {
    if (iv.start - cursor >= need) return cursor;
    cursor = Math.max(cursor, iv.end);
  }
  if (wallLen - cursor >= need) return cursor;
  return null;
}

function toBox(type: FixtureType, wall: Wall, pos: number, fp: Footprint, room: Room): PlacedFixture {
  const L = room.lengthInches;
  const W = room.widthInches;
  const base = { type, rotation: ROTATION[wall] };
  switch (wall) {
    case "back":
      return { ...base, x: pos, y: 0, widthInches: fp.along, depthInches: fp.from };
    case "front":
      return { ...base, x: pos, y: W - fp.from, widthInches: fp.along, depthInches: fp.from };
    case "left":
      return { ...base, x: 0, y: pos, widthInches: fp.from, depthInches: fp.along };
    case "right":
      return { ...base, x: L - fp.from, y: pos, widthInches: fp.from, depthInches: fp.along };
  }
}

function wallLength(wall: Wall, room: Room): number {
  return isHorizontal(wall) ? room.lengthInches : room.widthInches;
}

/** Preferred wall for a fixture (before packing/fallback). */
function preferredWall(
  fixture: FixtureChoice,
  room: Room,
  wallOf: Partial<Record<FixtureType, Wall>>,
): Wall {
  const door = room.door.wall;
  switch (fixture.type) {
    case "wc":
      return placementToWall(fixture.placement, door, "back");
    case "vanity":
      return placementToWall(fixture.placement, door, "right");
    case "shower": {
      // Wet zone: prefer a wall that isn't the entry wall, favouring the back.
      const order: Wall[] = ["back", "left", "right", "front"];
      return order.find((w) => w !== door) ?? "back";
    }
    case "almirah":
      if (fixture.placement === "underVanity") return wallOf.vanity ?? "left";
      if (fixture.placement === "wallRecess") return "back";
      return "left"; // dryCorner
  }
}

function overlapsAlong(a: Interval, b: Interval): boolean {
  return a.start < b.end && a.end > b.start;
}

/** Along-wall interval a placed fixture occupies (x for horizontal walls, y otherwise). */
function alongInterval(p: PlacedFixture, wall: Wall): Interval {
  return isHorizontal(wall)
    ? { start: p.x, end: p.x + p.widthInches }
    : { start: p.y, end: p.y + p.depthInches };
}

function wallOfPlaced(p: PlacedFixture, room: Room): Wall {
  if (Math.abs(p.y) < 0.5) return "back";
  if (Math.abs(p.y + p.depthInches - room.widthInches) < 0.5) return "front";
  if (Math.abs(p.x) < 0.5) return "left";
  return "right";
}

const FIXTURE_LABEL: Record<FixtureType, string> = {
  wc: "WC",
  vanity: "wash basin",
  shower: "shower",
  almirah: "almirah",
};

/** Fixtures that need approach clearance in front of them. */
const NEEDS_FRONT_CLEARANCE: FixtureType[] = ["wc", "vanity", "shower"];

function checkFrontClearance(placed: PlacedFixture[], room: Room, warnings: ClearanceWarning[]) {
  for (const p of placed) {
    if (!NEEDS_FRONT_CLEARANCE.includes(p.type)) continue;
    const wall = wallOfPlaced(p, room);
    const span = isHorizontal(wall) ? room.widthInches : room.lengthInches;
    const depth = isHorizontal(wall) ? p.depthInches : p.widthInches;
    // subtract the deepest fixture on the opposite wall whose along-range overlaps
    const oppWall = OPPOSITE[wall];
    let oppDepth = 0;
    for (const q of placed) {
      if (q === p) continue;
      if (wallOfPlaced(q, room) !== oppWall) continue;
      if (!overlapsAlong(alongInterval(p, wall), alongInterval(q, oppWall))) continue;
      const qDepth = isHorizontal(oppWall) ? q.depthInches : q.widthInches;
      oppDepth = Math.max(oppDepth, qDepth);
    }
    const clearance = span - depth - oppDepth;
    if (clearance < WC_FRONT_CLEARANCE_MIN) {
      warnings.push({
        fixture: p.type,
        code: "front-clearance",
        severity: clearance < 12 ? "error" : "warning",
        message: `Only ${Math.round(clearance)}" of clearance in front of the ${FIXTURE_LABEL[p.type]} (aim for ${WC_FRONT_CLEARANCE_MIN}"+).`,
      });
    }
  }
}

function checkDoorSwing(placed: PlacedFixture[], room: Room, warnings: ClearanceWarning[]) {
  const d = room.door;
  const dw = d.widthInches;
  const len = wallLength(d.wall, room);
  const start = clamp(d.offsetInches - dw / 2, 0, len);
  const end = clamp(d.offsetInches + dw / 2, 0, len);
  let zone: PlacedFixture;
  const swing = dw; // depth of the swing zone into the room
  switch (d.wall) {
    case "back":
      zone = { type: "wc", x: start, y: 0, widthInches: end - start, depthInches: swing, rotation: 0 };
      break;
    case "front":
      zone = { type: "wc", x: start, y: room.widthInches - swing, widthInches: end - start, depthInches: swing, rotation: 0 };
      break;
    case "left":
      zone = { type: "wc", x: 0, y: start, widthInches: swing, depthInches: end - start, rotation: 0 };
      break;
    default:
      zone = { type: "wc", x: room.lengthInches - swing, y: start, widthInches: swing, depthInches: end - start, rotation: 0 };
  }
  const overlaps = (a: PlacedFixture, b: PlacedFixture) =>
    a.x < b.x + b.widthInches &&
    a.x + a.widthInches > b.x &&
    a.y < b.y + b.depthInches &&
    a.y + a.depthInches > b.y;
  for (const p of placed) {
    if (overlaps(p, zone)) {
      warnings.push({
        fixture: p.type,
        code: "door-swing",
        severity: "warning",
        message: `The ${FIXTURE_LABEL[p.type]} sits in the door's swing path.`,
      });
    }
  }
}

function archetypeName(room: Room, count: number): string {
  const ratio = room.lengthInches / Math.max(1, room.widthInches);
  const shape = ratio >= 1.5 ? "galley" : ratio <= 1.15 ? "square" : "standard";
  return `${shape}-${count}piece`;
}

export function generateLayout(room: Room, fixtures: FixtureChoice[]): GeneratedPlan {
  const warnings: ClearanceWarning[] = [];
  const placed: PlacedFixture[] = [];
  const wallOf: Partial<Record<FixtureType, Wall>> = {};

  const occupied: Record<Wall, Interval[]> = { back: [], front: [], left: [], right: [] };

  // Block the door opening on its wall.
  const doorLen = wallLength(room.door.wall, room);
  occupied[room.door.wall].push({
    start: clamp(room.door.offsetInches - room.door.widthInches / 2, 0, doorLen),
    end: clamp(room.door.offsetInches + room.door.widthInches / 2, 0, doorLen),
  });

  for (const fixture of fixtures) {
    const fp = footprintFor(fixture);
    const primary = preferredWall(fixture, room, wallOf);
    const tryOrder: Wall[] = [primary, ...ALL_WALLS.filter((w) => w !== primary)];

    let chosen: { wall: Wall; pos: number } | null = null;
    for (const wall of tryOrder) {
      const pos = firstFreePos(occupied[wall], wallLength(wall, room), fp.along);
      if (pos !== null) {
        chosen = { wall, pos };
        break;
      }
    }

    if (!chosen) {
      warnings.push({
        fixture: fixture.type,
        code: "no-space",
        severity: "error",
        message: `Not enough wall space for the ${FIXTURE_LABEL[fixture.type]}.`,
      });
      const wall = primary;
      chosen = { wall, pos: Math.max(0, wallLength(wall, room) - fp.along) };
    } else {
      occupied[chosen.wall].push({ start: chosen.pos, end: chosen.pos + fp.along });
    }

    wallOf[fixture.type] = chosen.wall;
    placed.push(toBox(fixture.type, chosen.wall, chosen.pos, fp, room));
  }

  checkFrontClearance(placed, room, warnings);
  checkDoorSwing(placed, room, warnings);

  return { fixtures: placed, warnings, archetype: archetypeName(room, fixtures.length) };
}
