import type { ReactNode } from "react";
import Reveal from "./Reveal";

/**
 * Eyebrow + heading + optional lede. The eyebrow is always uppercase, tracked
 * and brand blue; the heading is always ink navy. Centred or left, nothing else.
 */
export default function SectionHeading({
  eyebrow,
  title,
  lede,
  align = "left",
  className = "",
}: {
  eyebrow?: string;
  title: ReactNode;
  lede?: ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  const centred = align === "center";
  return (
    <Reveal className={[centred ? "text-center" : "", className].join(" ")}>
      {eyebrow && (
        <p className="mb-3 text-[11px] font-semibold tracking-[0.18em] text-brand uppercase">
          {eyebrow}
        </p>
      )}
      <h2
        className={[
          "font-bold tracking-[-0.02em] text-balance text-ink",
          centred ? "text-[28px] sm:text-[34px]" : "text-[30px] leading-[1.15] sm:text-[38px]",
        ].join(" ")}
      >
        {title}
      </h2>
      {lede && (
        <p
          className={[
            "mt-3 text-[15px] leading-relaxed text-body",
            centred ? "mx-auto max-w-xl" : "max-w-lg",
          ].join(" ")}
        >
          {lede}
        </p>
      )}
    </Reveal>
  );
}
