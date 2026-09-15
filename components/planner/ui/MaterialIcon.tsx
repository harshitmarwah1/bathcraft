import type { CSSProperties } from "react";

interface MaterialIconProps {
  name: string;
  size?: number;
  color?: string;
  className?: string;
  style?: CSSProperties;
}

/** Renders a Material Symbols Outlined glyph. The font is loaded in layout.tsx.
 *  Scales with the planner's type multiplier so icons keep pace with text. */
export function MaterialIcon({ name, size = 24, color, className, style }: MaterialIconProps) {
  return (
    <span
      className={`msi${className ? ` ${className}` : ""}`}
      aria-hidden="true"
      style={{ fontSize: `calc(${size}px * var(--pl-fs, 1))`, color, ...style }}
    >
      {name}
    </span>
  );
}
