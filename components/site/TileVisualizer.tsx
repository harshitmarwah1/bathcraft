"use client";

import { useState } from "react";
import Icon from "@/components/ui/Icon";
import Reveal from "@/components/ui/Reveal";
import { TILE_SWATCHES } from "@/lib/content";
import { useT } from "@/lib/i18n/useT";
import { SWATCH_STYLE } from "./swatches";

/**
 * Tile visualiser card. The stack of swatches fans out on hover and each one
 * is selectable, so the "try it" claim is backed by something that responds.
 */
export default function TileVisualizer() {
  const [active, setActive] = useState(TILE_SWATCHES[0].id);
  const t = useT();

  return (
    <Reveal as="section">
      <div className="flex flex-col gap-5 overflow-hidden rounded-card bg-wash p-5 ring-1 ring-hairline sm:flex-row sm:items-center">
        <div className="min-w-0 flex-1">
          <h2 className="text-[17px] font-bold tracking-[-0.01em] text-ink">
            {t("Try tiles and wallpapers instantly")}
          </h2>
          <p className="mt-1.5 text-[13px] leading-relaxed text-body">
            {t("Upload a brochure or pick from our library.")}
          </p>
          <a
            href="#styles"
            className="group mt-3 inline-flex items-center gap-1.5 text-[13px] font-semibold text-brand"
          >
            {t("Try now")}
            <Icon
              name="arrowRight"
              size={14}
              className="transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:group-hover:translate-x-0"
            />
          </a>
        </div>

        {/* Diagonal swatch stack. */}
        <ul className="group/stack relative flex h-[104px] w-[188px] shrink-0 items-center justify-center">
          {TILE_SWATCHES.map((sw, i) => {
            const offset = i - (TILE_SWATCHES.length - 1) / 2;
            const isActive = sw.id === active;
            return (
              <li
                key={sw.id}
                className="absolute transition-transform duration-300 ease-out motion-reduce:transition-none"
                style={{
                  transform: `translateX(${offset * 20}px) translateY(${offset * 7}px) rotate(${offset * 4}deg)`,
                  zIndex: isActive ? 20 : 10 - Math.abs(offset),
                }}
              >
                <button
                  type="button"
                  onClick={() => setActive(sw.id)}
                  aria-pressed={isActive}
                  title={t(sw.label)}
                  className={[
                    "block h-[64px] w-[48px] rounded-[6px] shadow-soft transition-transform duration-300 ease-out",
                    "hover:-translate-y-1.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0",
                    isActive ? "-translate-y-2 ring-2 ring-brand" : "ring-1 ring-ink/10",
                  ].join(" ")}
                  style={SWATCH_STYLE[sw.id]}
                >
                  <span className="sr-only">{t(sw.label)}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </Reveal>
  );
}
