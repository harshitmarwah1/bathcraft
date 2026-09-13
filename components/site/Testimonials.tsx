"use client";

import Image from "next/image";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { TESTIMONIALS } from "@/lib/content";
import { useT } from "@/lib/i18n/useT";

/**
 * Three quote cards. On phones they become a snap-scrolling carousel rather
 * than a tall stack, which is the behaviour the reference implies at that width.
 *
 * The quotes are prototype placeholders — see the warning in lib/content.ts.
 */
export default function Testimonials() {
  const t = useT();
  return (
    <section className="bg-surface">
      <div className="mx-auto max-w-[1280px] px-5 py-14 sm:px-6 lg:py-16">
        <SectionHeading
          align="center"
          title={t("Trusted by homeowners like you")}
          lede={t("Real stories. Real bathrooms. Real confidence.")}
        />

        <ul className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:none] sm:grid sm:grid-cols-3 sm:overflow-visible sm:pb-0 [&::-webkit-scrollbar]:hidden">
          {TESTIMONIALS.map(({ quote, name, role, src, alt }, i) => (
            <Reveal
              as="li"
              key={name}
              delay={i * 110}
              className="w-[86vw] shrink-0 snap-start sm:w-auto"
            >
              <figure className="flex h-full gap-4 rounded-card bg-surface-raised p-4 shadow-soft ring-1 ring-hairline">
                <Image
                  src={src}
                  alt={t(alt)}
                  width={300}
                  height={400}
                  sizes="120px"
                  className="h-[132px] w-[98px] shrink-0 rounded-[9px] object-cover"
                />
                <div className="flex min-w-0 flex-col">
                  <blockquote className="text-[13px] leading-relaxed text-body">
                    &ldquo;{t(quote)}&rdquo;
                  </blockquote>
                  <figcaption className="mt-auto pt-3">
                    <span className="block text-[13px] font-semibold text-ink">{name}</span>
                    <span className="block text-[11.5px] text-body-soft">{t(role)}</span>
                  </figcaption>
                </div>
              </figure>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
