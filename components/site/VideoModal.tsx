"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useT } from "@/lib/i18n/useT";
import { createPortal } from "react-dom";
import Icon from "@/components/ui/Icon";

/**
 * Cinematic video overlay.
 *
 * Playback starts only from the click that opened this — never on page load —
 * and the file is `preload="metadata"`, so landing on the hero costs a few KB
 * of header rather than the whole 26MB.
 *
 * The dialog owns everything about the video: focus trap, Escape, backdrop
 * dismissal, scroll lock and reset-on-close. Hero only holds the boolean.
 *
 * Rendered through a portal to <body>. The hero section is `isolate`, which
 * creates a stacking context — without the portal no z-index could lift this
 * above the fixed navbar, and the dialog would open underneath it.
 */
export default function VideoModal({
  isOpen,
  onClose,
  videoSrc,
  title,
}: {
  isOpen: boolean;
  onClose: () => void;
  videoSrc: string;
  title: string;
}) {
  const t = useT();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ended, setEnded] = useState(false);

  /** Pause, rewind, and let the parent unmount us. */
  const close = useCallback(() => {
    const v = videoRef.current;
    if (v) {
      v.pause();
      v.currentTime = 0;
    }
    setEnded(false);
    onClose();
  }, [onClose]);

  // Start from the top on every fresh open, then play. The click that opened
  // the dialog is the user gesture, so sound is allowed; if a browser refuses
  // anyway, fall back to muted rather than showing a dead frame.
  useEffect(() => {
    if (!isOpen) return;
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = 0;
    v.play().catch(() => {
      v.muted = true;
      v.play().catch(() => {
        /* Leave the poster frame and the native controls to the user. */
      });
    });
  }, [isOpen]);

  // Scroll lock that does not shift the page: the gap left by the hidden
  // scrollbar is replaced with padding of exactly the same width.
  useEffect(() => {
    if (!isOpen) return;
    const { body, documentElement: html } = document;
    const gap = window.innerWidth - html.clientWidth;
    const prevOverflow = body.style.overflow;
    const prevPad = body.style.paddingRight;
    body.style.overflow = "hidden";
    if (gap > 0) body.style.paddingRight = `${gap}px`;
    return () => {
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPad;
    };
  }, [isOpen]);

  // Focus moves in on open and returns to the trigger on close.
  //
  // This deliberately depends on `isOpen` alone. Folding it into the keyboard
  // effect below ties it to `close`, whose identity changes on every render of
  // the parent — the cleanup would then run on every render and snatch focus
  // straight back out of the dialog.
  useEffect(() => {
    if (!isOpen) return;
    const restoreTo = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    // preventScroll matters: the trigger sits in the hero, so restoring focus
    // to it from a scrolled-down page would yank the page back to the top.
    return () => restoreTo?.focus({ preventScroll: true });
  }, [isOpen]);

  // Escape closes; Tab cycles within the dialog.
  useEffect(() => {
    if (!isOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== "Tab") return;
      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], video, input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusables?.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, close]);

  if (!isOpen || typeof document === "undefined") return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="video-modal-title"
      onMouseDown={(e) => {
        // Only a press that both starts and ends on the backdrop dismisses.
        // Anything inside the player — including a seek that drags out of it —
        // must not close the dialog.
        if (e.target === e.currentTarget) close();
      }}
      className="fixed inset-0 z-[80] flex animate-[fade-in_260ms_ease-out_both] items-center justify-center bg-[rgb(5_15_25/0.88)] p-4 backdrop-blur-lg sm:p-6 motion-reduce:animate-none"
    >
      <div
        ref={panelRef}
        className="w-[94vw] animate-[modal-rise_300ms_cubic-bezier(0.16,1,0.3,1)_both] sm:w-[90vw] lg:w-[min(1100px,85vw)] motion-reduce:animate-none"
      >
        {/* Small title above the frame — present for the dialog's accessible
            name whether or not it is visible. */}
        <div className="mb-3 flex items-end justify-between gap-4 px-1">
          <div className="min-w-0">
            <p className="text-[10.5px] font-semibold tracking-[0.24em] text-white/45 uppercase">
              Milagro Universe
            </p>
            <h2
              id="video-modal-title"
              className="mt-0.5 truncate text-[13.5px] font-medium text-white/80"
            >
              {title}
            </h2>
          </div>

          <button
            ref={closeRef}
            type="button"
            onClick={close}
            aria-label={t("Close video")}
            className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full bg-white/12 text-white transition-[background-color,transform] duration-200 hover:scale-105 hover:bg-white/22 motion-reduce:hover:scale-100"
          >
            <Icon name="close" size={20} />
          </button>
        </div>

        {/*
          The asset is a 1920x1080 file whose picture is portrait, pillarboxed
          with the black bars baked into the frames — see the README. On a phone
          a 16:9 box would shrink that already-narrow picture to a thin strip
          between two much larger bars.

          So below sm the frame is 9:16 and the video is object-cover. That is
          not an approximation: covering a 9:16 box with 16:9 content scales to
          fit the height and shows the middle (9/16) / (16/9) = 31.6% of the
          width, which is exactly the pillarboxed picture. The bars fall out of
          the geometry rather than being cropped by a hand-tuned number.

          Desktop keeps contain, so nothing there changes.
        */}
        <div className="relative overflow-hidden rounded-[16px] bg-black shadow-[0_30px_80px_rgb(0_0_0/0.55)] max-sm:aspect-[9/16] max-sm:max-h-[80vh]">
          <video
            ref={videoRef}
            src={videoSrc}
            controls
            playsInline
            preload="metadata"
            onEnded={() => setEnded(true)}
            onPlay={() => setEnded(false)}
            className="block h-auto max-h-[76vh] w-full max-sm:h-full max-sm:max-h-none max-sm:object-cover"
            /* 1920x1080 — declared so the box is correct before metadata lands,
               which keeps the opening animation from resizing mid-flight. */
            width={1920}
            height={1080}
          >
            {t("Your browser cannot play this video.")}
          </video>

          {ended && (
            <EndState
              onReplay={() => {
                const v = videoRef.current;
                if (!v) return;
                v.currentTime = 0;
                void v.play();
              }}
              onClose={close}
            />
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}

/**
 * Shown on the final frame. The frame stays visible behind it.
 *
 * Takes callbacks rather than the video ref: the element belongs to the dialog,
 * and handing a child a ref to mutate makes ownership ambiguous.
 */
function EndState({ onReplay, onClose }: { onReplay: () => void; onClose: () => void }) {
  const t = useT();
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 flex animate-[fade-in_260ms_ease-out_both] flex-col items-center gap-3 bg-[linear-gradient(to_top,rgb(5_15_25/0.92),rgb(5_15_25/0))] px-5 pt-16 pb-6 sm:flex-row sm:justify-center motion-reduce:animate-none">
      <p className="pointer-events-auto text-[14px] font-medium text-white/85 sm:mr-2">
        {t("Ready to plan your bathroom?")}
      </p>

      <a
        href="#planner"
        onClick={onClose}
        className="pointer-events-auto inline-flex h-11 items-center gap-2 rounded-pill bg-white px-5 text-[14px] font-semibold text-ink transition-transform duration-200 hover:-translate-y-px motion-reduce:hover:translate-y-0"
      >
        {t("Start Planning Free")}
        <Icon name="arrowRight" size={15} />
      </a>

      <button
        type="button"
        onClick={onReplay}
        className="pointer-events-auto inline-flex h-11 items-center gap-2 rounded-pill border border-white/35 px-5 text-[14px] font-medium text-white transition-[background-color,border-color] duration-200 hover:border-white/60 hover:bg-white/10"
      >
        <span aria-hidden="true">↻</span> {t("Watch Again")}
      </button>
    </div>
  );
}
