import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import { Annotation, CurvedArrow } from "@/components/ui/Annotation";
import { HERO_METRICS } from "@/lib/content";
import BeforeAfterSlider from "./BeforeAfterSlider";

/**
 * "Your bathroom, your way" — copy left (45%), the blueprint↔finished wipe
 * right (55%), with the two handwritten notes that label each half.
 */
export default function BathroomPlanningSection() {
  return (
    <section id="about" className="bg-white">
      <div className="mx-auto grid max-w-[1280px] items-center gap-12 px-5 py-16 sm:px-6 lg:grid-cols-[45fr_55fr] lg:gap-14 lg:py-24">
        <div>
          <Reveal>
            <p className="mb-3 text-[11px] font-semibold tracking-[0.18em] text-brand uppercase">
              Your bathroom, your way
            </p>
            <h2 className="text-[32px] leading-[1.14] font-bold tracking-[-0.02em] text-ink sm:text-[42px]">
              A simpler way
              <br />
              to plan your bathroom
            </h2>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-body">
              Whether you&apos;re renovating or building new, BathCraft helps you make better
              decisions with clear plans, real products and accurate estimates.
            </p>
            <Button href="#planner" variant="primary" size="md" withArrow className="mt-7">
              Start Your Plan
            </Button>
          </Reveal>

          <Reveal delay={140}>
            <dl className="mt-10 flex flex-wrap gap-x-12 gap-y-6">
              {HERO_METRICS.map(({ value, label }) => (
                <div key={label}>
                  <dt className="text-[22px] font-bold text-brand">{value}</dt>
                  <dd className="mt-0.5 text-[12.5px] text-body-soft">{label}</dd>
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
              Your measurements
            </Annotation>
            <CurvedArrow dir="down-left" width={52} className="mb-1" />
          </div>

          <div className="pointer-events-none absolute -top-12 right-3 z-10 hidden items-end gap-1 text-ink xl:flex">
            <CurvedArrow dir="down-right" width={52} className="mb-1" />
            <Annotation className="text-right text-[19px] leading-tight text-ink" rotate={5}>
              Your dream
              <br />
              bathroom
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
