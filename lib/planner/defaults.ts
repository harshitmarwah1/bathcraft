import type { Room, StyleChoice, FixtureChoice, AddOnType } from "@/lib/planner/types";

/** Default room — mirrors the Stitch export's initial state (102" x 72" x 108"). */
export function defaultRoom(): Room {
  return {
    name: "Master Ensuite",
    preset: "master",
    lengthInches: 102,
    widthInches: 72,
    heightInches: 108,
    door: { wall: "front", offsetInches: 36, widthInches: 32 },
    window: { wall: "back", offsetInches: 60, widthInches: 36 },
  };
}

export function defaultStyle(): StyleChoice {
  return {
    architecture: "modern",
    costTier: "goodQuality",
    budgetInr: 150000,
  };
}

export function defaultFixtures(): FixtureChoice[] {
  return [
    { type: "wc", placement: "back", variant: "floorMounted" },
    { type: "vanity", placement: "right", variant: "countertop" },
    { type: "shower", placement: "walkIn", variant: "handheld" },
    { type: "almirah", placement: "underVanity", variant: "mirrorCabinet" },
  ];
}

/** Common essentials pre-selected for an Indian bathroom. */
export function defaultAddOns(): AddOnType[] {
  return ["geyser", "exhaustFan"];
}

/** Dimension bounds (inches) — from the export's adjustDim clamps. */
export const DIM_BOUNDS = {
  length: { min: 48, max: 240, step: 6 },
  width: { min: 36, max: 180, step: 6 },
  height: { min: 84, max: 144, step: 6 },
} as const;
