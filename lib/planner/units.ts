import type { Unit } from "@/lib/planner/types";

export function inchesToFeetInches(total: number): string {
  return `${Math.floor(total / 12)} ft ${total % 12} in`;
}

export function inchesToFeetInchesShort(total: number): string {
  return `${Math.floor(total / 12)}' ${total % 12}"`;
}

export function inchesToCm(total: number): number {
  return Math.round(total * 2.54);
}

export function inchesToMetresShort(total: number): string {
  return `${(total * 0.0254).toFixed(2)} m`;
}

/** Primary display for a dimension, honouring the chosen unit system. */
export function primaryDim(inches: number, unit: Unit): string {
  return unit === "imperial" ? inchesToFeetInches(inches) : `${inchesToCm(inches)} cm`;
}

/** Secondary (muted) display — the other unit system. */
export function secondaryDim(inches: number, unit: Unit): string {
  return unit === "imperial" ? `${inchesToCm(inches)} cm` : inchesToFeetInchesShort(inches);
}

export function areaSqft(lengthInches: number, widthInches: number): number {
  return +((lengthInches / 12) * (widthInches / 12)).toFixed(1);
}

export function areaSqm(sqft: number): number {
  return +(sqft * 0.092903).toFixed(2);
}

export function formatInr(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}
