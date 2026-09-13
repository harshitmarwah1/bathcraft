import type { FixtureChoice, FixtureType, FixtureVariant, Placement } from "@/lib/planner/types";

/** Footprint of a fixture against its wall, in inches.
 *  `along` = extent parallel to the wall; `from` = depth projecting into the room. */
export interface Footprint {
  along: number;
  from: number;
}

const WC: Partial<Record<FixtureVariant, Footprint>> = {
  floorMounted: { along: 20, from: 28 },
  wallHung: { along: 20, from: 22 },
  smart: { along: 22, from: 28 },
};

const VANITY: Partial<Record<FixtureVariant, Footprint>> = {
  countertop: { along: 24, from: 20 },
  wallHungBasin: { along: 22, from: 16 },
  pedestal: { along: 22, from: 20 },
};

/** Shower footprint keyed by its enclosure type (stored in `placement`). */
const SHOWER: Partial<Record<Placement, Footprint>> = {
  walkIn: { along: 36, from: 36 },
  enclosed: { along: 34, from: 34 },
  tubCombo: { along: 60, from: 30 },
};

const ALMIRAH: Footprint = { along: 24, from: 16 };

const DEFAULT: Record<FixtureType, Footprint> = {
  wc: WC.floorMounted!,
  vanity: VANITY.countertop!,
  shower: SHOWER.walkIn!,
  almirah: ALMIRAH,
};

/** Resolve the footprint for a fixture from its type + variant/placement. */
export function footprintFor(fixture: FixtureChoice): Footprint {
  switch (fixture.type) {
    case "wc":
      return (fixture.variant && WC[fixture.variant]) || DEFAULT.wc;
    case "vanity":
      return (fixture.variant && VANITY[fixture.variant]) || DEFAULT.vanity;
    case "shower":
      return SHOWER[fixture.placement] || DEFAULT.shower;
    case "almirah":
      return ALMIRAH;
  }
}

/** Minimum recommended clearance in front of a WC (inches). */
export const WC_FRONT_CLEARANCE_MIN = 18;
