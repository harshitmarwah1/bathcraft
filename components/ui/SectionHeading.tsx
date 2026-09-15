import type { ReactNode } from "react";
import Reveal from "./Reveal";

/**
 * Heading + optional lede. There is deliberately no eyebrow slot: a tracked
 * uppercase kicker above every section is template grammar, and the landing's
 * one kicker belongs to the hero. The heading is always ink navy. Centred or
 * left, nothing else.
 */
export default function SectionHeading({
  title,
  lede,
  align = "left",
  className = "",
}: {
  title: ReactNode;
  lede?: ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  const centred = align === "center";
  return (
    <Reveal className={[centred ? "text-center" : "", className].join(" ")}>
      <h2
        className={[
          "font-bold text-balance text-ink text-[clamp(2.25rem,1.6rem+1.6vw,3.5rem)] leading-[1.08] tracking-[-0.03em]",
        ].join(" ")}
      >
        {title}
      </h2>
      {lede && (
        <p
          className={[
            "mt-4 text-[16px] leading-relaxed text-body lg:text-[18px]",
            centred ? "mx-auto max-w-2xl" : "max-w-xl",
          ].join(" ")}
        >
          {lede}
        </p>
      )}
    </Reveal>
  );
}
