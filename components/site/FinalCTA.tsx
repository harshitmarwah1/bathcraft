"use client";

import Image from "next/image";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import { Annotation, CurvedArrow } from "@/components/ui/Annotation";
import { useT } from "@/lib/i18n/useT";

/** Full-bleed dark closing banner: photograph left, copy centre, note right. */
export default function FinalCTA() {
  const t = useT();
  return (
    <section className="relative isolate overflow-hidden bg-ink">
      <Image
        src="/photos/cta.jpg"
        alt=""
        aria-hidden="true"
        fill
        sizes="100vw"
        className="object-cover opacity-90"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(95deg,rgb(9_17_29/0.30),rgb(9_17_29/0.86)_44%,rgb(9_17_29/0.82))]"
      />

      <div className="relative z-10 mx-auto max-w-[1280px] 2xl:max-w-[1440px] px-5 py-16 sm:px-6 lg:py-20">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-[17px] font-medium text-white/75">
            {t("Ready to plan your bathroom?")}
          </p>
          <h2 className="mt-3 font-semibold text-balance text-white text-[clamp(2.25rem,1.6rem+1.6vw,3.5rem)] leading-[1.08] tracking-[-0.03em]">
            {t("Let's build a better bathroom, together.")}
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-[17px] text-white/75 lg:text-[18px]">
            {t("Less confusion. Better choices. A smoother renovation journey.")}
          </p>
          <Button href="#planner" variant="white" size="lg" withArrow className="mt-8">
            {t("Start Planning Free")}
          </Button>
        </Reveal>

        {/* Handwritten note, pointing back at the button. */}
        <div className="pointer-events-none absolute top-1/2 right-8 hidden -translate-y-1/2 text-white/85 xl:block">
          <Annotation className="block text-[19px] leading-snug text-white" rotate={-7}>
            {t("Your perfect bathroom is just a few clicks away.")}
          </Annotation>
          <CurvedArrow dir="left-down" width={78} className="mt-1 -ml-2" />
        </div>
      </div>
    </section>
  );
}
