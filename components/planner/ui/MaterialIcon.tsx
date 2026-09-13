import type { CSSProperties } from "react";

interface MaterialIconProps {
  name: string;
  size?: number;
  color?: string;
  className?: string;
  style?: CSSProperties;
}

/** Renders a Material Symbols Outlined glyph. The font is loaded in layout.tsx. */
export function MaterialIcon({ name, size = 24, color, className, style }: MaterialIconProps) {
  return (
    <span
      className={`msi${className ? ` ${className}` : ""}`}
      aria-hidden="true"
      style={{ fontSize: size, color, ...style }}
    >
      {name}
    </span>
  );
}
