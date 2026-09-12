import Image from "next/image";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import { Annotation, CurvedArrow } from "@/components/ui/Annotation";

/** Full-bleed dark closing banner: photograph left, copy centre, note right. */
export default function FinalCTA() {
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

      <div className="relative z-10 mx-auto max-w-[1280px] px-5 py-16 sm:px-6 lg:py-20">
        <Reveal className="mx-auto max-w-xl text-center">
          <p className="text-[11px] font-semibold tracking-[0.22em] text-white/65 uppercase">
            Ready to plan your bathroom?
          </p>
          <h2 className="mt-4 text-[28px] leading-[1.15] font-semibold tracking-[-0.02em] text-balance text-white sm:text-[36px]">
            Let&apos;s build a better bathroom,
            <br className="hidden sm:block" /> together.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-[14.5px] text-white/75">
            Less confusion. Better choices. A smoother renovation journey.
          </p>
          <Button href="#planner" variant="white" size="lg" withArrow className="mt-8">
            Start Planning Free
          </Button>
        </Reveal>

        {/* Handwritten note, pointing back at the button. */}
        <div className="pointer-events-none absolute top-1/2 right-8 hidden -translate-y-1/2 text-white/85 xl:block">
          <Annotation className="block text-[19px] leading-snug text-white" rotate={-7}>
            Your perfect
            <br />
            bathroom is just
            <br />a few clicks away.
          </Annotation>
          <CurvedArrow dir="left-down" width={78} className="mt-1 -ml-2" />
        </div>
      </div>
    </section>
  );
}
