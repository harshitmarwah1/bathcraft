"use client";

import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import { Annotation, CurvedArrow } from "@/components/ui/Annotation";
import { HERO_METRICS } from "@/lib/content";
import { useT } from "@/lib/i18n/useT";
import BeforeAfterSlider from "./BeforeAfterSlider";

/**
 * "Your bathroom, your way" — copy left (45%), the blueprint↔finished wipe
 * right (55%), with the two handwritten notes that label each half.
 */
export default function BathroomPlanningSection() {
  const t = useT();
  return (
    <section id="about" className="bg-surface">
      <div className="mx-auto grid max-w-[1280px] 2xl:max-w-[1440px] items-center gap-12 px-5 py-16 sm:px-6 lg:grid-cols-[45fr_55fr] lg:gap-14 lg:py-24">
        <div>
          <Reveal>
            <h2 className="font-bold text-ink text-[clamp(2.25rem,1.6rem+1.6vw,3.5rem)] leading-[1.08] tracking-[-0.03em]">
              {t("A simpler way")}
              <br />
              {t("to plan your bathroom")}
            </h2>
            <p className="mt-6 max-w-lg text-[17px] leading-relaxed text-body lg:text-[18px]">
              {t(
                "Whether you're renovating or building new, Milagro Universe helps you make better decisions with clear plans, real products and accurate estimates.",
              )}
            </p>
            <Button href="#planner" variant="primary" size="lg" withArrow className="mt-8">
              {t("Start Your Plan")}
            </Button>
          </Reveal>

          <Reveal delay={140}>
            {/* The one stats row on the page, next to the argument it backs.
                #metrics keeps the navbar's anchor landing somewhere real. */}
            <dl id="metrics" className="mt-10 flex scroll-mt-28 flex-wrap gap-x-12 gap-y-6">
              {HERO_METRICS.map(({ value, label }) => (
                <div key={label}>
                  <dt className="text-[30px] font-bold tracking-[-0.02em] text-brand">{value}</dt>
                  <dd className="mt-1 text-[14px] text-body-soft">{t(label)}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        <Reveal delay={120} className="relative">
          {/* Handwritten labels sit outside the frame on desktop, where there
              is margin for them; on small screens they would collide, so they
              are dropped rather than crammed. */}
          <div className="pointer-events-none absolute -top-11 left-2 z-10 hidden items-end gap-1 text-ink xl:flex">
            <Annotation className="text-[19px] leading-tight text-ink" rotate={-6}>
              {t("Your measurements")}
            </Annotation>
            <CurvedArrow dir="down-left" width={52} className="mb-1" />
          </div>

          <div className="pointer-events-none absolute -top-12 right-3 z-10 hidden items-end gap-1 text-ink xl:flex">
            <CurvedArrow dir="down-right" width={52} className="mb-1" />
            <Annotation className="text-right text-[19px] leading-tight text-ink" rotate={5}>
              {t("Your dream")}
              <br />
              {t("bathroom")}
            </Annotation>
          </div>

          <div className="overflow-hidden rounded-card shadow-soft ring-1 ring-hairline">
            <BeforeAfterSlider />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
