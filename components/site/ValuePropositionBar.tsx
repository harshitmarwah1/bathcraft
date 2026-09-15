"use client";

import Reveal from "@/components/ui/Reveal";
import { VALUE_PROPS } from "@/lib/content";
import { useT } from "@/lib/i18n/useT";

/**
 * The four promises, set as one quiet strip directly under the hero — a spec
 * line, not four icon-and-caption cards. Hairlines separate the items; each is
 * a title over its proof, left aligned so the row reads across. Below lg it
 * wraps to two columns and the dividers become a cross of rules.
 */
export default function ValuePropositionBar() {
  const t = useT();
  return (
    <section id="value" className="border-b border-hairline bg-surface">
      <Reveal as="ul" className="mx-auto grid max-w-[1280px] 2xl:max-w-[1440px] grid-cols-2 px-5 sm:px-6 lg:grid-cols-4">
        {VALUE_PROPS.map(({ title, body }, i) => (
          <li
            key={title}
            className={[
              "py-6 lg:py-9",
              // Laptop: one row, a rule between neighbours.
              i > 0 ? "lg:border-l lg:border-hairline lg:pl-8" : "lg:pl-0",
              i < VALUE_PROPS.length - 1 ? "lg:pr-8" : "",
              // Narrow: two columns, a vertical rule in the middle and a
              // horizontal one between the rows.
              i % 2 === 1 ? "max-lg:border-l max-lg:border-hairline max-lg:pl-5" : "max-lg:pr-5",
              i >= 2 ? "max-lg:border-t max-lg:border-hairline" : "",
            ].join(" ")}
          >
            <p className="text-[17px] font-semibold text-ink">{t(title)}</p>
            <p className="mt-1 text-[15px] leading-relaxed text-body">{t(body)}</p>
          </li>
        ))}
      </Reveal>
    </section>
  );
}
