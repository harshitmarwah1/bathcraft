"use client";

import Image from "next/image";
import { useState } from "react";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { useT } from "@/lib/i18n/useT";
import VideoModal from "./VideoModal";

/**
 * The cinematic hero. The photograph is the section — the overlay only has to
 * buy the white type enough contrast, so it stays a gentle top-and-bottom
 * gradient plus a light wash rather than a flat scrim that would kill the
 * bathroom behind it.
 */
export default function Hero() {
  const [videoOpen, setVideoOpen] = useState(false);
  const t = useT();

  return (
    <section
      id="top"
      className="relative isolate flex h-[560px] items-center justify-center overflow-hidden sm:h-[640px] lg:h-[700px]"
    >
      <Image
        src="/photos/hero.jpg"
        alt={t(
          "A warm, softly lit bathroom with a freestanding stone bath, a glass shower and a timber vanity",
        )}
        fill
        priority
        sizes="100vw"
        className="animate-[hero-settle_1.5s_cubic-bezier(0.16,1,0.3,1)_both] object-cover object-[center_60%] motion-reduce:animate-none"
      />

      {/* Legibility, not darkness: the bathroom must still read. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(to_bottom,rgb(10_20_35/0.55),rgb(10_20_35/0.18)_38%,rgb(10_20_35/0.28)_72%,rgb(10_20_35/0.62))]"
      />

      <div className="relative z-10 mx-auto w-full max-w-[1280px] 2xl:max-w-[1440px] px-5 text-center sm:px-6">
        <p className="animate-[fade-up_0.7s_ease-out_0.15s_both] text-[13px] font-semibold tracking-[0.26em] text-white/85 uppercase motion-reduce:animate-none">
          {t("Better bathrooms. Brighter spaces.")}
        </p>

        <h1 className="mx-auto mt-5 max-w-5xl animate-[fade-up_0.8s_cubic-bezier(0.16,1,0.3,1)_0.28s_both] text-[clamp(2.5rem,1.4rem+4.2vw,5.75rem)] leading-[1.03] font-semibold tracking-[-0.03em] text-balance text-white motion-reduce:animate-none">
          {t("From ideas to")}
          <br />
          {t("beautiful bathrooms")}
        </h1>

        <p className="mx-auto mt-6 max-w-2xl animate-[fade-up_0.8s_cubic-bezier(0.16,1,0.3,1)_0.42s_both] text-[17px] text-white/85 lg:text-[20px] motion-reduce:animate-none">
          {t("Plan, visualize, estimate and build — all in one place.")}
        </p>

        <div className="mt-8 flex animate-[fade-up_0.8s_cubic-bezier(0.16,1,0.3,1)_0.56s_both] flex-col items-center justify-center gap-3 sm:flex-row sm:gap-5 motion-reduce:animate-none">
          <Button href="#planner" variant="white" size="lg" withArrow>
            {t("Start Planning Free")}
          </Button>

          <button
            type="button"
            onClick={() => setVideoOpen(true)}
            aria-label={t("Watch Milagro Universe renovation video")}
            className="group inline-flex items-center gap-3 rounded-pill px-2 py-2 text-[15px] font-medium text-white transition-transform duration-200 hover:-translate-y-px motion-reduce:hover:translate-y-0"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/40 bg-white/12 transition-[background-color,border-color] duration-200 group-hover:border-white/70 group-hover:bg-white/20">
              <Icon
                name="play"
                size={15}
                className="ml-0.5 transition-transform duration-200 group-hover:translate-x-px motion-reduce:group-hover:translate-x-0"
              />
            </span>
            <span className="opacity-85 transition-opacity duration-200 group-hover:opacity-100">
              {t("Watch Video")}
            </span>
          </button>
        </div>
      </div>

      {/* Bottom rail: tagline, slide indicators, scroll cue. */}
      <div className="absolute inset-x-0 bottom-0 z-10 mx-auto flex max-w-[1280px] 2xl:max-w-[1440px] items-center px-5 pb-6 text-[14px] font-medium text-white/80 sm:px-6 sm:pb-7">
        <p className="hidden gap-5 sm:flex">
          <span>{t("Design it.")}</span>
          <span>{t("Plan it.")}</span>
          <span>{t("Build it.")}</span>
        </p>

        <div className="mx-auto flex items-center gap-2" aria-hidden="true">
          <span className="h-[3px] w-7 rounded-full bg-white/35" />
          <span className="h-[3px] w-9 rounded-full bg-white" />
          <span className="h-[3px] w-7 rounded-full bg-white/35" />
        </div>

        <a
          href="#value"
          className="ml-auto hidden items-center gap-1.5 transition-colors hover:text-white sm:flex"
        >
          {t("Scroll")}
          <Icon
            name="arrowDown"
            size={14}
            className="animate-[nudge_1.8s_ease-in-out_infinite] motion-reduce:animate-none"
          />
        </a>
      </div>

      <VideoModal
        isOpen={videoOpen}
        onClose={() => setVideoOpen(false)}
        videoSrc="/media/video-project-4.mp4"
        title={t("Take Control of Your Bathroom Renovation")}
      />

    </section>
  );
}
