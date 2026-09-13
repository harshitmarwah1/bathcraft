import type { CostTier } from "@/lib/planner/types";

export type BrandBand = "premium" | "mid" | "budget";

export interface Brand {
  name: string;
  band: BrandBand;
  categories: string[];
  note: string;
}

/** Seeded brand guide — real, well-known India-market bathroom brands.
 *  Positioning is factual/general; not an endorsement or live pricing. */
export const BRANDS: Brand[] = [
  { name: "KOHLER", band: "premium", categories: ["Sanitaryware", "Faucets", "Showers"], note: "US premium; wide design range and showrooms." },
  { name: "GROHE", band: "premium", categories: ["Faucets", "Showers"], note: "German engineering; strong warranties on fittings." },
  { name: "Jaquar", band: "mid", categories: ["Sanitaryware", "Faucets", "Showers"], note: "India's most popular full-range brand; easy service." },
  { name: "CERA", band: "mid", categories: ["Sanitaryware", "Faucets"], note: "Good-value Indian brand; wide availability." },
  { name: "Hindware", band: "mid", categories: ["Sanitaryware"], note: "Popular Indian sanitaryware; budget-to-mid." },
  { name: "Parryware", band: "budget", categories: ["Sanitaryware"], note: "Reliable budget sanitaryware (Roca group)." },
  { name: "Kajaria", band: "mid", categories: ["Tiles"], note: "India's largest tile maker; huge range." },
  { name: "Somany", band: "budget", categories: ["Tiles"], note: "Value tiles; wide dealer network." },
];

/** Which band to spotlight for the homeowner's chosen cost tier. */
export function recommendedBand(tier: CostTier): BrandBand {
  switch (tier) {
    case "budget":
      return "budget";
    case "costEffective":
    case "goodQuality":
      return "mid";
    case "topOfLine":
      return "premium";
  }
}

export const BAND_ORDER: BrandBand[] = ["premium", "mid", "budget"];
