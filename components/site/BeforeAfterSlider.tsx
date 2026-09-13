"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import Icon from "@/components/ui/Icon";

/**
 * Blueprint ↔ finished bathroom wipe.
 *
 * Both halves show the SAME room: the blueprint is a hand-authored SVG of the
 * photograph's own layout — shower left, WC centre, vanity right under the
 * mirror — so dragging across reads as one space being drawn and then built,
 * not as two unrelated pictures.
 *
 * Driven by pointer events and by arrow/Home/End keys, with a real slider role,
 * so it is operable without a mouse.
 */
export default function BeforeAfterSlider() {
  const [pct, setPct] = useState(50);
  const [dragging, setDragging] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);

  const setFromClientX = useCallback((clientX: number) => {
    const box = frameRef.current?.getBoundingClientRect();
    if (!box) return;
    const next = ((clientX - box.left) / box.width) * 100;
    setPct(Math.min(100, Math.max(0, next)));
  }, []);

  useEffect(() => {
    if (!dragging) return;
    const move = (e: PointerEvent) => setFromClientX(e.clientX);
    const stop = () => setDragging(false);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", stop);
    window.addEventListener("pointercancel", stop);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", stop);
      window.removeEventListener("pointercancel", stop);
    };
  }, [dragging, setFromClientX]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 10 : 4;
    if (e.key === "ArrowLeft") setPct((v) => Math.max(0, v - step));
    else if (e.key === "ArrowRight") setPct((v) => Math.min(100, v + step));
    else if (e.key === "Home") setPct(0);
    else if (e.key === "End") setPct(100);
    else return;
    e.preventDefault();
  };

  return (
    <div
      ref={frameRef}
      className="on-light relative aspect-[4/3] w-full touch-none overflow-hidden rounded-card bg-white select-none sm:aspect-[16/11]"
      onPointerDown={(e) => {
        setDragging(true);
        setFromClientX(e.clientX);
      }}
    >
      {/* Finished room underneath. */}
      <Image
        src="/photos/after.jpg"
        alt="The finished bathroom: timber vanity, backlit mirror, walk-in shower and warm stone tiling"
        fill
        sizes="(max-width: 1024px) 100vw, 640px"
        className="object-cover"
      />

      {/* Blueprint on top, revealed from the left. */}
      <div
        className="absolute inset-0 bg-white"
        style={{ clipPath: `inset(0 ${100 - pct}% 0 0)` }}
      >
        <BlueprintRoom />
      </div>

      {/* Divider + handle. */}
      <div
        className="absolute inset-y-0 z-10 w-px bg-white/90 shadow-[0_0_0_1px_rgb(16_43_78/0.08)]"
        style={{ left: `${pct}%` }}
      >
        <button
          type="button"
          role="slider"
          aria-label="Reveal the plan or the finished bathroom"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pct)}
          aria-valuetext={`${Math.round(pct)}% plan, ${100 - Math.round(pct)}% finished bathroom`}
          tabIndex={0}
          onKeyDown={onKeyDown}
          onPointerDown={(e) => {
            e.stopPropagation();
            setDragging(true);
          }}
          className="absolute top-1/2 left-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-full bg-white text-brand shadow-lift transition-transform duration-150 hover:scale-105 active:scale-95 motion-reduce:transition-none"
        >
          <Icon name="swap" size={20} />
        </button>
      </div>
    </div>
  );
}

/**
 * The same room as `after.jpg`, drawn as an architect would: walls in heavy
 * line, fittings in thin line, dimension strings top and left.
 */
function BlueprintRoom() {
  return (
    <svg
      viewBox="0 0 480 360"
      className="h-full w-full"
      role="img"
      aria-label="Architectural line drawing of the same bathroom, with dimensions"
    >
      <defs>
        <pattern id="ba-grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0H0v20" fill="none" stroke="#102b4e" strokeWidth="0.5" opacity="0.09" />
        </pattern>
      </defs>
      <rect width="480" height="360" fill="#fbfdff" />
      <rect width="480" height="360" fill="url(#ba-grid)" />

      <g fill="none" stroke="#1d3a61" strokeLinecap="round" strokeLinejoin="round">
        {/* Room shell */}
        <rect x="58" y="64" width="364" height="252" strokeWidth="2.4" />
        <rect x="68" y="74" width="344" height="232" strokeWidth="0.9" opacity="0.45" />

        <g strokeWidth="1.15">
          {/* Shower enclosure, left */}
          <rect x="76" y="82" width="104" height="120" />
          <path d="M76 202h104M132 82v120" opacity="0.5" />
          <circle cx="128" cy="98" r="7" />
          <path d="M128 105v10" />

          {/* WC, centre */}
          <rect x="214" y="86" width="42" height="26" rx="3" />
          <path d="M219 112h32l-4 34a10 10 0 0 1-9 8h-6a10 10 0 0 1-9-8z" />

          {/* Vanity + basin, right */}
          <rect x="300" y="84" width="106" height="46" rx="4" />
          <ellipse cx="353" cy="107" rx="26" ry="15" />
          <path d="M353 92v6" />
          {/* Mirror above */}
          <rect x="316" y="66" width="74" height="10" rx="5" opacity="0.55" />

          {/* Bath, bottom right */}
          <rect x="258" y="222" width="148" height="74" rx="34" />
          <rect x="268" y="230" width="128" height="58" rx="28" opacity="0.45" />

          {/* Door swing, bottom left */}
          <path d="M76 296v-58" />
          <path d="M76 238a58 58 0 0 1 58 58" strokeDasharray="4 5" opacity="0.6" />
        </g>

        {/* Dimension strings */}
        <g strokeWidth="0.9" opacity="0.62">
          <path d="M58 44h364M58 38v12M422 38v12" />
          <path d="M36 64v252M30 64h12M30 316h12" />
        </g>
      </g>

      <g fill="#1d3a61" fontFamily="ui-monospace, monospace" fontSize="11" opacity="0.75">
        <text x="240" y="36" textAnchor="middle" letterSpacing="1.2">
          8&apos;-0&quot;
        </text>
        <text
          x="22"
          y="190"
          textAnchor="middle"
          letterSpacing="1.2"
          transform="rotate(-90 22 190)"
        >
          6&apos;-0&quot;
        </text>
      </g>
    </svg>
  );
}
