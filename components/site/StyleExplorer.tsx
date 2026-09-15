"use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import Reveal from "@/components/ui/Reveal";
import { STYLES } from "@/lib/content";
import { useT } from "@/lib/i18n/useT";

/**
 * Style coverflow.
 *
 * The centre card is the selected one; its neighbours sit smaller and dimmed,
 * and the row slides so the selection is always centred.
 *
 * The track is anchored at `left-1/2` and translated back by the distance to
 * the middle of the active card, which is what keeps it centred at every
 * breakpoint without measuring anything in JS. `--card` and `--gap` are the
 * only numbers, so a breakpoint changes the size and the maths follows.
 *
 * Only transform and opacity animate — the same rule the logo timeline follows,
 * and the reason this stays on the compositor. Width and aspect deliberately do
 * NOT change between states: animating those would relayout on every frame.
 *
 * There is no autoplay. A carousel that moves on its own steals focus from
 * people reading it and is a well-earned accessibility complaint; this one
 * moves when asked.
 */
export default function StyleExplorer() {
  const t = useT();
  const [active, setActive] = useState(0);
  const last = STYLES.length - 1;

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowRight") { e.preventDefault(); setActive((i) => Math.min(i + 1, last)); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); setActive((i) => Math.max(i - 1, 0)); }
      else if (e.key === "Home") { e.preventDefault(); setActive(0); }
      else if (e.key === "End") { e.preventDefault(); setActive(last); }
    },
    [last],
  );

  return (
    <Reveal id="styles" as="section">
      <h2 className="text-[26px] font-bold tracking-[-0.02em] text-ink lg:text-[30px]">
        {t("Explore styles for every home")}
      </h2>
      <p className="mt-2 max-w-md text-[15px] leading-relaxed text-body lg:text-[16px]">
        {t("From modern to traditional, we have ideas for every taste and budget.")}
      </p>

      <div
        role="group"
        aria-label={t("Explore styles for every home")}
        tabIndex={0}
        onKeyDown={onKeyDown}
        className="relative mt-6 h-[228px] overflow-hidden rounded-card [--card:150px] [--gap:12px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand sm:h-[260px] sm:[--card:210px] lg:[--card:240px] lg:[--gap:16px]"
      >
        <ul
          className="absolute top-1/2 left-1/2 flex items-center gap-[var(--gap)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none"
          style={{
            transform:
              "translate(calc(-1 * (var(--card) + var(--gap)) * " +
              active +
              " - var(--card) / 2), -50%)",
          }}
        >
          {STYLES.map(({ label, src, alt }, i) => {
            const isActive = i === active;
            return (
              <li key={label} className="shrink-0 [width:var(--card)]">
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  aria-label={`${t("Explore")} ${t(label)} ${t("bathrooms")}`}
                  aria-current={isActive ? "true" : undefined}
                  /* Inactive cards are reachable by the arrow keys through the
                     group, so they stay out of the tab order themselves. */
                  tabIndex={isActive ? 0 : -1}
                  className={[
                    "block w-full origin-center transition-[transform,opacity] duration-500",
                    "ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none",
                    isActive ? "scale-100 opacity-100" : "scale-[0.82] opacity-55 hover:opacity-80",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "block overflow-hidden rounded-[14px] ring-1 transition-shadow duration-500",
                      isActive ? "ring-brand/30 shadow-lift" : "ring-hairline",
                    ].join(" ")}
                  >
                    <Image
                      src={src}
                      alt={t(alt)}
                      width={400}
                      height={300}
                      sizes="(max-width: 640px) 45vw, 240px"
                      className="aspect-[4/3] w-full object-cover"
                    />
                  </span>
                  <span
                    className={[
                      "mt-2 block text-center text-[14px] font-semibold transition-colors duration-300",
                      isActive ? "text-ink" : "text-body-soft",
                    ].join(" ")}
                  >
                    {t(label)}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Indicators. Same pill language as the hero's rail. */}
      {/* Each button is a 44px hit area around a 3px pill — the pill is what
          you see, the box is what a finger or an unsteady pointer finds. */}
      <div className="mt-2 flex items-center justify-center">
        {STYLES.map(({ label }, i) => (
          <button
            key={label}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`${t("Explore")} ${t(label)} ${t("bathrooms")}`}
            aria-current={i === active ? "true" : undefined}
            className="group flex h-11 min-w-11 items-center justify-center px-1"
          >
            <span
              className={[
                "block h-[3px] rounded-full transition-[width,background-color] duration-300",
                i === active ? "w-9 bg-brand" : "w-5 bg-field group-hover:bg-brand/40",
              ].join(" ")}
            />
          </button>
        ))}
      </div>
    </Reveal>
  );
}
