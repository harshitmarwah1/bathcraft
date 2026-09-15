"use client";

import Icon from "@/components/ui/Icon";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { MATERIALS, MEASUREMENTS, STEPS, TILE_SWATCHES } from "@/lib/content";
import { useT } from "@/lib/i18n/useT";
import { SWATCH_STYLE } from "./swatches";

/**
 * The four-step journey. Each card's visual is drawn in the DOM rather than
 * shipped as a screenshot, so the product UI inside them stays crisp at any
 * density and editable in one place.
 */
export default function HowItWorks() {
  const t = useT();
  return (
    <section id="how-it-works" className="bg-wash">
      <div className="mx-auto max-w-[1280px] 2xl:max-w-[1440px] px-5 py-16 sm:px-6 lg:py-20">
        <SectionHeading
          align="center"
          title={t("Plan. Visualize. Build. In 4 simple steps.")}
        />

        <ol className="mt-14 grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map(({ n, title, body, visual }, i) => (
            <Reveal as="li" key={n} delay={i * 100} className="relative">
              <span className="absolute -top-3 -left-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-brand text-[13px] font-bold text-on-brand shadow-[0_4px_12px_rgb(7_140_200/0.35)]">
                {n}
              </span>

              <div className="flex h-[188px] items-center justify-center overflow-hidden rounded-card bg-surface-raised p-4 shadow-soft ring-1 ring-hairline">
                {visual === "phone" && <PhoneVisual />}
                {visual === "floorplan" && <FloorPlanVisual />}
                {visual === "moodboard" && <MoodboardVisual />}
                {visual === "materials" && <MaterialsVisual />}
              </div>

              <h3 className="mt-5 text-[18px] font-semibold text-ink">{t(title)}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-body-soft">{t(body)}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

/** Step 1 — a phone with the measurement form. */
function PhoneVisual() {
  const t = useT();
  return (
    <div className="h-full w-[122px] rounded-[14px] bg-ink p-[3px] shadow-lift">
      <div className="flex h-full flex-col rounded-[11px] bg-surface-raised px-2.5 py-2">
        <div className="mx-auto mb-2 h-[3px] w-7 rounded-full bg-hairline" />
        <p className="mb-1.5 text-[6px] font-semibold tracking-[0.12em] text-body-soft uppercase">
          {t("Bathroom")}
        </p>
        <div className="space-y-1">
          {MEASUREMENTS.map(({ label, value }) => (
            <div
              key={label}
              className="flex items-center justify-between rounded-[5px] bg-wash px-1.5 py-[5px]"
            >
              <span className="text-[7px] text-body">{t(label)}</span>
              <span className="text-[7px] font-semibold text-ink">{value}</span>
            </div>
          ))}
        </div>
        <div className="mt-auto rounded-[5px] bg-brand py-[5px] text-center text-[7px] font-semibold text-on-brand">
          {t("Next")}
        </div>
      </div>
    </div>
  );
}

/** Step 2 — a 2D floor plan of the same room used in the before/after wipe. */
function FloorPlanVisual() {
  return (
    <svg viewBox="0 0 150 120" className="h-full w-auto" aria-hidden="true">
      <rect width="150" height="120" fill="#fbfdff" />
      <g fill="none" stroke="#1d3a61" strokeLinejoin="round">
        <rect x="12" y="12" width="126" height="96" strokeWidth="2" />
        <g strokeWidth="0.9">
          <rect x="20" y="20" width="38" height="42" />
          <circle cx="39" cy="30" r="3.4" />
          <rect x="74" y="21" width="17" height="10" rx="1.5" />
          <path d="M76 31h13l-1.6 14a4 4 0 0 1-4 3.4h-1.8a4 4 0 0 1-4-3.4z" />
          <rect x="103" y="20" width="27" height="17" rx="2" />
          <ellipse cx="116.5" cy="28.5" rx="8.5" ry="5" />
          <rect x="80" y="76" width="50" height="26" rx="12" />
          <path d="M20 100V76" />
          <path d="M20 76a24 24 0 0 1 24 24" strokeDasharray="3 4" opacity="0.6" />
        </g>
        <g strokeWidth="0.7" opacity="0.55">
          <path d="M12 6h126M12 2v8M138 2v8" />
        </g>
      </g>
      <text
        x="75"
        y="5"
        textAnchor="middle"
        fill="#1d3a61"
        fontSize="5"
        fontFamily="ui-monospace, monospace"
        opacity="0.7"
      >
        8&apos;-0&quot;
      </text>
    </svg>
  );
}

/** Step 3 — a tile and finish mood board. */
function MoodboardVisual() {
  const tiles = [...TILE_SWATCHES, ...TILE_SWATCHES].slice(0, 9);
  return (
    <div className="grid h-full w-full grid-cols-3 gap-1.5">
      {tiles.map((t, i) => (
        <span
          key={`${t.id}-${i}`}
          className="rounded-[4px] ring-1 ring-ink/5"
          style={SWATCH_STYLE[t.id]}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

/** Step 4 — the generated material list. */
function MaterialsVisual() {
  const tr = useT();
  return (
    <div className="w-full space-y-1.5">
      {MATERIALS.map(({ icon, label, qty }) => (
        <div
          key={label}
          className="flex items-center gap-2 rounded-[7px] bg-wash px-2.5 py-2"
        >
          <span className="text-brand">
            <Icon name={icon} size={14} />
          </span>
          <span className="text-[10.5px] text-body">{tr(label)}</span>
          <span className="ml-auto text-[10.5px] font-semibold text-ink">{qty}</span>
        </div>
      ))}
    </div>
  );
}
