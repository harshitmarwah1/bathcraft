import type { CSSProperties } from "react";

/**
 * Tile and finish textures, built from layered CSS gradients.
 *
 * These are materials, not photographs — synthesising them keeps the six
 * finishes tonally consistent with each other and with the warm neutral
 * photography, which a grab-bag of stock tile shots would not be. They are
 * shared by the step-3 mood board and the tile visualiser so a change to a
 * finish shows up in both.
 */
export const SWATCH_STYLE: Record<string, CSSProperties> = {
  marble: {
    background:
      "linear-gradient(128deg, rgb(255 255 255 / 0.9), rgb(255 255 255 / 0) 46%), " +
      "linear-gradient(72deg, transparent 44%, rgb(170 182 196 / 0.55) 46%, transparent 48%), " +
      "linear-gradient(104deg, transparent 62%, rgb(150 164 180 / 0.4) 64%, transparent 66%), " +
      "#eef1f4",
  },
  cream: {
    background:
      "linear-gradient(140deg, rgb(255 255 255 / 0.55), rgb(0 0 0 / 0.04)), #e8ddcd",
  },
  slate: {
    background:
      "linear-gradient(118deg, rgb(255 255 255 / 0.10), transparent 48%), " +
      "linear-gradient(58deg, transparent 40%, rgb(255 255 255 / 0.07) 42%, transparent 45%), " +
      "#3d4650",
  },
  blue: {
    background:
      "linear-gradient(135deg, rgb(255 255 255 / 0.28), rgb(0 0 0 / 0.10)), #2e6f92",
  },
  terracotta: {
    background:
      "linear-gradient(140deg, rgb(255 255 255 / 0.24), rgb(0 0 0 / 0.10)), #b26a4a",
  },
  wood: {
    background:
      "repeating-linear-gradient(94deg, rgb(0 0 0 / 0.055) 0 2px, transparent 2px 9px), " +
      "linear-gradient(140deg, rgb(255 255 255 / 0.16), rgb(0 0 0 / 0.10)), #9a6a43",
  },
};
