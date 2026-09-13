import type {
  AddOnType,
  BomLine,
  Estimate,
  FixtureChoice,
  FixtureType,
  Room,
  StyleChoice,
} from "@/lib/planner/types";
import {
  ADDON_PRICE,
  ANGLE_VALVE_EACH,
  BADARPUR_PER_CFT,
  CEMENT_PER_BAG,
  CFT_PER_CEMENT_BAG,
  CREW_SIZE,
  DIVERTER_EACH,
  FIXTURE_PRICE,
  LABOUR_DAY_RATE,
  PIPE_DRAIN_PER_FT,
  PIPE_SUPPLY_PER_FT,
  PTRAP_EACH,
  SQFT_PER_CEMENT_BAG,
  TILE_AREA_SQFT,
  TILE_PRICE_PER_SQFT,
  TILE_WASTAGE,
} from "./rates";

const FIXTURE_LABEL: Record<FixtureType, string> = {
  wc: "W.C. / Commode",
  vanity: "Wash basin & counter",
  shower: "Shower fittings",
  almirah: "Almirah / storage",
};

const ADDON_LABEL: Record<AddOnType, string> = {
  geyser: "Geyser (water heater)",
  exhaustFan: "Exhaust fan",
  towelRail: "Towel rail",
  healthFaucet: "Health faucet",
  floorDrain: "Floor drain",
  niche: "Wall niche",
};

/** Supply-pipe run (ft) needed to reach each element. */
const SUPPLY_FT_FIXTURE: Partial<Record<FixtureType, number>> = { wc: 8, vanity: 6, shower: 10 };
const SUPPLY_FT_ADDON: Partial<Record<AddOnType, number>> = { geyser: 8, healthFaucet: 4 };
const DRAIN_FT_FIXTURE: Partial<Record<FixtureType, number>> = { wc: 6, vanity: 5, shower: 6 };
const DRAIN_FT_ADDON: Partial<Record<AddOnType, number>> = { floorDrain: 3 };

function line(
  key: string,
  label: string,
  quantity: number,
  unit: string,
  unitCostInr: number,
): BomLine {
  return { key, label, quantity, unit, unitCostInr, totalInr: Math.round(quantity * unitCostInr) };
}

export function generateEstimate(
  room: Room,
  style: StyleChoice,
  fixtures: FixtureChoice[],
  addOns: AddOnType[],
): Estimate {
  const tier = style.costTier;
  const bom: BomLine[] = [];

  // 1. Fixtures
  for (const f of fixtures) {
    bom.push(line(`fixture:${f.type}`, FIXTURE_LABEL[f.type], 1, "no.", FIXTURE_PRICE[f.type][tier]));
  }

  // 2. Add-ons
  for (const a of addOns) {
    bom.push(line(`addon:${a}`, ADDON_LABEL[a], 1, "no.", ADDON_PRICE[a][tier]));
  }

  // 3. Tiling — floor + walls (to ceiling), minus openings, plus wastage
  const L = room.lengthInches;
  const W = room.widthInches;
  const floorSqft = (L * W) / 144;
  const perimeterIn = 2 * (L + W);
  const wallGrossSqft = (perimeterIn * room.heightInches) / 144;
  const doorSqft = (room.door.widthInches * 80) / 144; // ~80" door height
  const windowSqft = room.window ? (room.window.widthInches * 36) / 144 : 0;
  const wallSqft = Math.max(0, wallGrossSqft - doorSqft - windowSqft);
  const tileSqft = (floorSqft + wallSqft) * (1 + TILE_WASTAGE);
  const tilePieces = Math.ceil(tileSqft / TILE_AREA_SQFT);
  const tilePiecePrice = Math.round(TILE_PRICE_PER_SQFT[tier] * TILE_AREA_SQFT);
  bom.push(line("tiles", "Tiles (floor + walls)", tilePieces, "tiles", tilePiecePrice));

  // 4. Cement + badarpur (sand) for laying/plaster
  const cementBags = Math.ceil((floorSqft + wallSqft) / SQFT_PER_CEMENT_BAG);
  bom.push(line("cement", "Cement", cementBags, "bags", CEMENT_PER_BAG));
  const badarpurCft = cementBags * CFT_PER_CEMENT_BAG;
  bom.push(line("badarpur", "Badarpur (sand)", badarpurCft, "cft", BADARPUR_PER_CFT));

  // 5. Plumbing
  const hasAddon = (a: AddOnType) => addOns.includes(a);
  const count = (t: FixtureType) => fixtures.filter((f) => f.type === t).length;

  let supplyFt = 0;
  let drainFt = 0;
  for (const f of fixtures) {
    supplyFt += SUPPLY_FT_FIXTURE[f.type] ?? 0;
    drainFt += DRAIN_FT_FIXTURE[f.type] ?? 0;
  }
  for (const a of addOns) {
    supplyFt += SUPPLY_FT_ADDON[a] ?? 0;
    drainFt += DRAIN_FT_ADDON[a] ?? 0;
  }
  if (supplyFt > 0) bom.push(line("pipe-supply", "Water supply pipe", supplyFt, "ft", PIPE_SUPPLY_PER_FT[tier]));
  if (drainFt > 0) bom.push(line("pipe-drain", "Drain pipe", drainFt, "ft", PIPE_DRAIN_PER_FT[tier]));

  const angleValves =
    count("vanity") * 2 + count("wc") * 1 + (hasAddon("healthFaucet") ? 1 : 0) + (hasAddon("geyser") ? 2 : 0);
  if (angleValves > 0) bom.push(line("angle-valve", "Angle valves", angleValves, "no.", ANGLE_VALVE_EACH[tier]));

  const diverters = count("shower");
  if (diverters > 0) bom.push(line("diverter", "Diverter", diverters, "no.", DIVERTER_EACH[tier]));

  const pTraps = count("wc") + count("vanity") + (hasAddon("floorDrain") ? 1 : 0);
  if (pTraps > 0) bom.push(line("p-trap", "P-traps / wastes", pTraps, "no.", PTRAP_EACH[tier]));

  // Totals
  const materialCostInr = bom.reduce((s, l) => s + l.totalInr, 0);

  // 6. Labour + time
  const timeDays = Math.ceil(3 + fixtures.length + floorSqft / 20 + addOns.length * 0.5);
  const labourCostInr = timeDays * LABOUR_DAY_RATE[tier] * CREW_SIZE;

  return {
    bom,
    materialCostInr,
    labourCostInr,
    totalCostInr: materialCostInr + labourCostInr,
    timeDays,
  };
}
