import type { AddOnType, CostTier, FixtureType } from "@/lib/planner/types";

/**
 * Seeded India rate card (₹), keyed by cost tier. These are reasonable
 * placeholder rates for the estimate engine — intended to be editable later
 * (e.g. pulled from a shop/brand table). Kept in one place so pricing is
 * transparent and tunable.
 */
type ByTier = Record<CostTier, number>;

export const FIXTURE_PRICE: Record<FixtureType, ByTier> = {
  wc: { budget: 4000, costEffective: 7000, goodQuality: 12000, topOfLine: 25000 },
  vanity: { budget: 3500, costEffective: 6000, goodQuality: 11000, topOfLine: 22000 },
  shower: { budget: 2500, costEffective: 5000, goodQuality: 9000, topOfLine: 20000 },
  almirah: { budget: 3000, costEffective: 5500, goodQuality: 9000, topOfLine: 16000 },
};

export const ADDON_PRICE: Record<AddOnType, ByTier> = {
  geyser: { budget: 6000, costEffective: 9000, goodQuality: 14000, topOfLine: 22000 },
  exhaustFan: { budget: 1200, costEffective: 1800, goodQuality: 2800, topOfLine: 4500 },
  towelRail: { budget: 500, costEffective: 900, goodQuality: 1600, topOfLine: 3000 },
  healthFaucet: { budget: 600, costEffective: 1000, goodQuality: 1600, topOfLine: 2800 },
  floorDrain: { budget: 300, costEffective: 500, goodQuality: 900, topOfLine: 1500 },
  niche: { budget: 800, costEffective: 1200, goodQuality: 2000, topOfLine: 3500 },
};

export const TILE_PRICE_PER_SQFT: ByTier = { budget: 40, costEffective: 70, goodQuality: 120, topOfLine: 250 };
export const PIPE_SUPPLY_PER_FT: ByTier = { budget: 40, costEffective: 60, goodQuality: 90, topOfLine: 140 };
export const PIPE_DRAIN_PER_FT: ByTier = { budget: 60, costEffective: 90, goodQuality: 130, topOfLine: 200 };
export const ANGLE_VALVE_EACH: ByTier = { budget: 150, costEffective: 250, goodQuality: 400, topOfLine: 700 };
export const DIVERTER_EACH: ByTier = { budget: 1500, costEffective: 2800, goodQuality: 4500, topOfLine: 8000 };
export const PTRAP_EACH: ByTier = { budget: 250, costEffective: 400, goodQuality: 650, topOfLine: 1100 };
export const LABOUR_DAY_RATE: ByTier = { budget: 900, costEffective: 1100, goodQuality: 1400, topOfLine: 1800 };

export const CEMENT_PER_BAG = 400; // ₹ per 50kg bag
export const BADARPUR_PER_CFT = 55; // ₹ per cubic foot

/** A ceramic/vitrified tile covers ~1.5 sq.ft. */
export const TILE_AREA_SQFT = 1.5;
/** Extra tiles ordered to cover cuts/breakage. */
export const TILE_WASTAGE = 0.1;
/** One cement bag lays/plasters ~35 sq.ft of tiling. */
export const SQFT_PER_CEMENT_BAG = 35;
/** Sand (badarpur) per cement bag, cubic feet. */
export const CFT_PER_CEMENT_BAG = 4;
/** Small crew working in parallel. */
export const CREW_SIZE = 2;
