import Icon from "@/components/ui/Icon";
import Reveal from "@/components/ui/Reveal";
import { BRANDS } from "@/lib/content";

/**
 * Brand row.
 *
 * Set in type rather than with logo artwork: these are real companies, and
 * drawing an approximation of someone's trademark would misrepresent them.
 * Drop licensed logo files in and swap the <span> for an <Image> when you have
 * permission to use them.
 */
export default function BrandComparison() {
  return (
    <Reveal id="brands" as="section">
      <h2 className="text-[21px] font-bold tracking-[-0.01em] text-ink">
        Top brands. Real comparisons.
      </h2>
      <p className="mt-2 max-w-md text-[13.5px] leading-relaxed text-body">
        Compare prices, warranty and service for trusted brands.
      </p>

      <ul className="mt-5 flex gap-2.5 overflow-x-auto pb-1 [scrollbar-width:none] sm:flex-wrap sm:overflow-visible [&::-webkit-scrollbar]:hidden">
        {BRANDS.map((brand) => (
          <li key={brand} className="shrink-0">
            <a
              href="#brands"
              className="flex h-[46px] min-w-[92px] items-center justify-center rounded-[10px] bg-surface-raised px-4 text-[13px] font-semibold tracking-[0.02em] text-body ring-1 ring-hairline transition-[color,box-shadow,transform] duration-200 hover:-translate-y-px hover:text-brand hover:shadow-soft hover:ring-brand/30 motion-reduce:hover:translate-y-0"
            >
              {brand}
            </a>
          </li>
        ))}
      </ul>

      <a
        href="#brands"
        className="group mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-brand"
      >
        View all brands
        <Icon
          name="arrowRight"
          size={14}
          className="transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:group-hover:translate-x-0"
        />
      </a>
    </Reveal>
  );
}
