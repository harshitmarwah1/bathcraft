"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";

/**
 * Scroll reveal: 20px up, fade in, once. Everything on the page that animates
 * on scroll goes through this so the timing curve and distance stay uniform.
 *
 * Under prefers-reduced-motion the content is simply present from first paint —
 * the observer never runs, so there is no flash of hidden content either.
 */
export default function Reveal({
  children,
  as: Tag = "div",
  delay = 0,
  className = "",
  ...rest
}: {
  children: ReactNode;
  as?: ElementType;
  delay?: number;
  className?: string;
  /** Passed through to the rendered element — `id` for anchor targets, etc. */
  [key: string]: unknown;
}) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Reduced motion needs no branch here: the hidden class carries
    // motion-reduce overrides, so the content is already visible.
    if (typeof IntersectionObserver === "undefined") {
      // Never leave content permanently hidden on an engine without IO.
      const t = window.setTimeout(() => setShown(true), 0);
      return () => window.clearTimeout(t);
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        setShown(true);
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={[
        "transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none",
        shown ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100",
        className,
      ].join(" ")}
      style={{ transitionDelay: shown ? `${delay}ms` : "0ms" }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
