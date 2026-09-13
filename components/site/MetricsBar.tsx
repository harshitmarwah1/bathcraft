import Icon from "@/components/ui/Icon";
import Reveal from "@/components/ui/Reveal";
import { METRICS } from "@/lib/content";

/** Pale-blue rounded strip. Values are prototype placeholders — see lib/content.ts. */
export default function MetricsBar() {
  return (
    <section id="metrics" className="mx-auto max-w-[1280px] px-5 py-8 sm:px-6">
      <Reveal>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-6 rounded-card bg-wash px-6 py-6 lg:grid-cols-4 lg:px-10">
          {METRICS.map(({ icon, value, label }) => (
            <div key={label} className="flex items-center gap-3.5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-surface-raised text-brand shadow-soft">
                <Icon name={icon} size={21} />
              </span>
              <div className="min-w-0">
                <dt className="text-[20px] leading-tight font-bold text-ink">{value}</dt>
                <dd className="mt-0.5 truncate text-[12.5px] text-body-soft">{label}</dd>
              </div>
            </div>
          ))}
        </dl>
      </Reveal>
    </section>
  );
}
