import type { ReactNode } from "react";

/**
 * The handwritten marginalia from the reference: "Your measurements", "Your
 * dream bathroom", "Move & explore", "Your perfect bathroom is just a few
 * clicks away". Caveat, ink navy, paired with a hand-drawn curved arrow.
 *
 * Colour is set by the caller, never here: these notes sit on white in one
 * place and on a near-black photograph in another.
 *
 * Reserved for these four notes only — never for UI copy. Decorative, so it is
 * hidden from assistive technology; the surrounding sections carry the same
 * meaning in real prose.
 */
export function Annotation({
  children,
  className = "",
  rotate = -3,
}: {
  children: ReactNode;
  className?: string;
  rotate?: number;
}) {
  return (
    <span
      aria-hidden="true"
      className={["pointer-events-none font-hand select-none", className].join(" ")}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      {children}
    </span>
  );
}

/**
 * Curved arrow. `dir` picks one of four hand-drawn sweeps; they are deliberately
 * not mirror images of each other, so a page using several does not look
 * mechanical.
 */
export function CurvedArrow({
  dir = "down-right",
  className = "",
  width = 64,
}: {
  dir?: "down-right" | "down-left" | "up-right" | "left-down";
  className?: string;
  width?: number;
}) {
  const D: Record<string, { d: string; head: string; box: string }> = {
    "down-right": {
      box: "0 0 64 48",
      d: "M3 6c10 0 24 3 33 12 5 5 8 12 9 21",
      head: "M39 37l6.5 4 3-7",
    },
    "down-left": {
      box: "0 0 64 48",
      d: "M61 6c-10 0-24 3-33 12-5 5-8 12-9 21",
      head: "M25 37l-6.5 4-3-7",
    },
    "up-right": {
      box: "0 0 64 48",
      d: "M3 42c10 0 24-3 33-12 5-5 8-12 9-21",
      head: "M39 11l6.5-4 3 7",
    },
    "left-down": {
      box: "0 0 72 40",
      d: "M69 4C52 4 30 8 14 20c-5 4-8 9-9 15",
      head: "M12 28l-7 7-6-6",
    },
  };
  const a = D[dir];
  return (
    <svg
      viewBox={a.box}
      width={width}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={["pointer-events-none", className].join(" ")}
    >
      <path d={a.d} />
      <path d={a.head} />
    </svg>
  );
}
