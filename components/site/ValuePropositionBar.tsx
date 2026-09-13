"use client";

import Icon from "@/components/ui/Icon";
import Reveal from "@/components/ui/Reveal";
import { VALUE_PROPS } from "@/lib/content";
import { useT } from "@/lib/i18n/useT";

/** Four benefits on a pale wash, directly under the hero. Spacious, no cards. */
export default function ValuePropositionBar() {
  const t = useT();
  return (
    <section id="value" className="bg-wash">
      <div className="mx-auto grid max-w-[1280px] grid-cols-2 gap-x-6 gap-y-9 px-5 py-12 sm:px-6 lg:grid-cols-4 lg:py-14">
        {VALUE_PROPS.map(({ icon, title, body }, i) => (
          <Reveal key={title} delay={i * 90} className="text-center">
            <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-wash-deep text-brand">
              <Icon name={icon} size={22} />
            </span>
            <h3 className="text-[15px] font-semibold text-ink">{t(title)}</h3>
            <p className="mt-1 text-[13px] text-body-soft">{t(body)}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
