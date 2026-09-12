import Image from "next/image";
import Reveal from "@/components/ui/Reveal";
import { STYLES } from "@/lib/content";

/** Four style cards. Image zooms 1.03 on hover; the label stays put. */
export default function StyleExplorer() {
  return (
    <Reveal id="styles" as="section">
      <h2 className="text-[21px] font-bold tracking-[-0.01em] text-ink">
        Explore styles for every home
      </h2>
      <p className="mt-2 max-w-md text-[13.5px] leading-relaxed text-body">
        From modern to traditional, we have ideas for every taste and budget.
      </p>

      <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {STYLES.map(({ label, src, alt }) => (
          <li key={label}>
            <a
              href="#styles"
              className="group block rounded-[10px] focus-visible:outline-offset-4"
              aria-label={`Explore ${label} bathrooms`}
            >
              <span className="block overflow-hidden rounded-[10px] ring-1 ring-hairline">
                <Image
                  src={src}
                  alt={alt}
                  width={400}
                  height={300}
                  sizes="(max-width: 640px) 45vw, 140px"
                  className="h-[104px] w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                />
              </span>
              <span className="mt-2 block text-[12.5px] font-semibold text-ink">{label}</span>
            </a>
          </li>
        ))}
      </ul>
    </Reveal>
  );
}
