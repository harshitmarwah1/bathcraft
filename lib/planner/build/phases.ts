/**
 * The build timeline behind the 4D plan: the estimate's total days split into
 * the six trades a bathroom renovation actually runs through, in order.
 *
 * Shares are typical for an Indian bathroom renovation with a small crew and
 * are deliberately coarse — the timeline explains the sequence, it is not a
 * project schedule.
 */

export type BuildPhaseKey = "prep" | "plumbing" | "waterproofing" | "tiling" | "fixtures" | "finishing";

export interface BuildPhase {
  key: BuildPhaseKey;
  /** Inclusive start, exclusive end, in days from the start of work. */
  startDay: number;
  endDay: number;
}

/** How far each phase has got, 0..1, at one moment of the build. */
export type BuildProgress = Record<BuildPhaseKey, number>;

const SHARE: [BuildPhaseKey, number][] = [
  ["prep", 0.1],
  ["plumbing", 0.2],
  ["waterproofing", 0.12],
  ["tiling", 0.3],
  ["fixtures", 0.2],
  ["finishing", 0.08],
];

/** Whole days per phase (at least one each), summing exactly to the total. */
export function buildPhases(totalDays: number): BuildPhase[] {
  const total = Math.max(SHARE.length, Math.round(totalDays));
  const exact = SHARE.map(([, share]) => share * total);
  const days = exact.map((d) => Math.max(1, Math.floor(d)));

  // Largest-remainder rounding so the phases add up to the estimate.
  let left = total - days.reduce((a, b) => a + b, 0);
  const byRemainder = exact
    .map((d, i) => [d - Math.floor(d), i] as const)
    .sort((a, b) => b[0] - a[0]);
  for (let k = 0; left > 0; k++, left--) days[byRemainder[k % byRemainder.length][1]]++;
  while (left < 0) {
    const i = days.indexOf(Math.max(...days));
    days[i]--;
    left++;
  }

  let cursor = 0;
  return SHARE.map(([key], i) => {
    const phase = { key, startDay: cursor, endDay: cursor + days[i] };
    cursor += days[i];
    return phase;
  });
}

export function totalDays(phases: BuildPhase[]): number {
  return phases[phases.length - 1]?.endDay ?? 0;
}

export function progressAt(phases: BuildPhase[], day: number): BuildProgress {
  const out = {} as BuildProgress;
  for (const p of phases) {
    out[p.key] = Math.min(1, Math.max(0, (day - p.startDay) / (p.endDay - p.startDay)));
  }
  return out;
}

/** The phase in progress at `day` (the last phase once the build is done). */
export function phaseAt(phases: BuildPhase[], day: number): BuildPhase {
  return phases.find((p) => day < p.endDay) ?? phases[phases.length - 1];
}
