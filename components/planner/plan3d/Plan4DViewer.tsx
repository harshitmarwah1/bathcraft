"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import type { CSSProperties } from "react";
import { FloorPlanSvg } from "@/components/planner/sections/FloorPlanSvg";
import { MaterialIcon } from "@/components/planner/ui/MaterialIcon";
import { useI18n } from "@/lib/planner/i18n/provider";
import { generateEstimate } from "@/lib/planner/estimate/engine";
import {
  buildPhases,
  phaseAt,
  progressAt,
  totalDays,
  type BuildPhaseKey,
} from "@/lib/planner/build/phases";
import type { Dictionary } from "@/lib/planner/i18n/dictionaries";
import type { GeneratedPlan, Project } from "@/lib/planner/types";
import type { BathroomScene } from "./BathroomScene";

const PHASE_LABEL: Record<BuildPhaseKey, keyof Dictionary> = {
  prep: "phasePrep",
  plumbing: "phasePlumbing",
  waterproofing: "phaseWaterproofing",
  tiling: "phaseTiling",
  fixtures: "phaseFixtures",
  finishing: "phaseFinishing",
};

/** The whole build plays in about this long. */
const PLAY_SECONDS = 9;
/** With reduced motion, the build steps phase by phase at this interval. */
const STEP_MS = 1100;

function subscribeReducedMotion(cb: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

/**
 * The 4D plan: the bathroom in 3D, plus the build timeline that assembles it
 * day by day — prep, plumbing, waterproofing, tiling, fixtures, finishing.
 * The 2D plan stays one click away, prints in place of the 3D view, and is the
 * fallback wherever WebGL is unavailable.
 *
 * Three.js loads only when the 3D view is shown (dynamic import), so the rest
 * of the planner never pays for it.
 */
export function Plan4DViewer({ project, plan }: { project: Project; plan: GeneratedPlan }) {
  const { t } = useI18n();
  const reduced = useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );

  const { room, fixtures, addOns, style, estimate } = project;
  const architecture = style.architecture;

  // The plan step runs before the estimate step, so derive the day count
  // from the inputs when no estimate has been saved yet.
  const days = useMemo(
    () => estimate?.timeDays ?? generateEstimate(room, style, fixtures, addOns).timeDays,
    [estimate, room, style, fixtures, addOns],
  );
  const phases = useMemo(() => buildPhases(days), [days]);
  const total = totalDays(phases);

  const hostRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<BathroomScene | null>(null);
  const [view, setView] = useState<"3d" | "2d">("3d");
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [sceneVersion, setSceneVersion] = useState(0);
  // null = the finished bathroom; the timeline starts at the end so the first
  // thing anyone sees is the result, and Play rewinds to day 0.
  const [day, setDay] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const current = Math.min(day ?? total, total);
  const dayRef = useRef(current);

  useEffect(() => {
    dayRef.current = current;
  }, [current]);

  // Scene lifecycle: created when the 3D view mounts, disposed when it leaves.
  useEffect(() => {
    if (view !== "3d") return;
    const host = hostRef.current;
    if (!host) return;
    let cancelled = false;
    let instance: BathroomScene | null = null;
    import("./BathroomScene")
      .then(({ BathroomScene }) => {
        if (cancelled) return;
        instance = new BathroomScene(host, { reducedMotion: reduced });
        sceneRef.current = instance;
        setStatus("ready");
        setSceneVersion((v) => v + 1);
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
      instance?.dispose();
      sceneRef.current = null;
    };
  }, [view, reduced]);

  useEffect(() => {
    sceneRef.current?.setModel({ room, plan, fixtures, style: architecture, addOns });
  }, [room, plan, fixtures, architecture, addOns, sceneVersion]);

  useEffect(() => {
    sceneRef.current?.setProgress(progressAt(phases, current));
  }, [phases, current, sceneVersion]);

  // Playback.
  useEffect(() => {
    if (!playing) return;
    if (reduced) {
      const id = window.setInterval(() => {
        const next = phases.find((p) => p.endDay > dayRef.current + 1e-6);
        if (!next) {
          setPlaying(false);
          return;
        }
        dayRef.current = next.endDay;
        setDay(next.endDay);
      }, STEP_MS);
      return () => window.clearInterval(id);
    }
    let raf = 0;
    let last = performance.now();
    const step = (now: number) => {
      const next = Math.min(total, dayRef.current + ((now - last) / 1000) * (total / PLAY_SECONDS));
      last = now;
      dayRef.current = next;
      setDay(next);
      if (next >= total) {
        setPlaying(false);
        return;
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [playing, reduced, phases, total]);

  function togglePlay() {
    if (playing) {
      setPlaying(false);
      return;
    }
    if (current >= total - 1e-6) {
      dayRef.current = 0;
      setDay(0);
    }
    setPlaying(true);
  }

  function changeView(next: "3d" | "2d") {
    if (next === view) return;
    setPlaying(false);
    if (next === "3d") setStatus("loading");
    setView(next);
  }

  const phase = phaseAt(phases, current);
  const phaseName = t[PHASE_LABEL[phase.key]];
  const finished = current >= total - 1e-6;
  const dayLabel = finished
    ? t.buildComplete
    : t.dayOfTotal
        .replace("{day}", String(Math.min(total, Math.max(1, Math.ceil(current)))))
        .replace("{total}", String(total));

  return (
    <div className="pl-4d">
      <div className="pl-4d-stage">
        {view === "3d" ? (
          <>
            <div ref={hostRef} className="pl-4d-canvas" role="img" aria-label={t.view3dLabel} />
            {status === "loading" && (
              <p className="pl-4d-status" role="status">
                {t.loading3d}
              </p>
            )}
            {status === "error" && (
              <div className="pl-4d-fallback">
                <p className="pl-4d-status">{t.view3dUnavailable}</p>
                <FloorPlanSvg room={room} plan={plan} />
              </div>
            )}
          </>
        ) : (
          <div className="pl-4d-2d">
            <FloorPlanSvg room={room} plan={plan} />
          </div>
        )}

        <div className="pl-4d-toolbar">
          <div className="pl-4d-segment" role="group" aria-label={t.viewMode}>
            <button type="button" aria-pressed={view === "2d"} onClick={() => changeView("2d")}>
              {t.view2d}
            </button>
            <button type="button" aria-pressed={view === "3d"} onClick={() => changeView("3d")}>
              {t.view3d}
            </button>
          </div>
          {view === "3d" && status === "ready" && (
            <>
              <span className="pl-4d-hint">{t.dragHint}</span>
              <button
                type="button"
                className="pl-4d-icon"
                onClick={() => sceneRef.current?.resetView()}
                aria-label={t.resetView}
                title={t.resetView}
              >
                <MaterialIcon name="center_focus_strong" size={18} />
              </button>
            </>
          )}
        </div>
      </div>

      {view === "3d" && status !== "error" && (
        <div className="pl-4d-timeline">
          <button
            type="button"
            className="pl-4d-play"
            onClick={togglePlay}
            aria-label={playing ? t.pauseBuild : t.playBuild}
            title={playing ? t.pauseBuild : t.playBuild}
          >
            <MaterialIcon name={playing ? "pause" : finished ? "replay" : "play_arrow"} size={24} />
          </button>
          <div className="pl-4d-track">
            <div className="pl-4d-meta">
              <span className="pl-4d-phase">{finished ? t.buildTimeline : phaseName}</span>
              <span className="pl-4d-day">{dayLabel}</span>
            </div>
            <input
              className="pl-4d-range"
              type="range"
              min={0}
              max={total}
              step={0.01}
              value={current}
              onChange={(e) => {
                setPlaying(false);
                setDay(Number(e.target.value));
              }}
              aria-label={t.buildTimeline}
              aria-valuetext={`${dayLabel} · ${phaseName}`}
              style={{ "--pl-fill": `${(current / total) * 100}%` } as CSSProperties}
            />
            <ol className="pl-4d-phases">
              {phases.map((p) => {
                const state = current >= p.endDay - 1e-6 ? "done" : current >= p.startDay ? "current" : "todo";
                const name = t[PHASE_LABEL[p.key]];
                return (
                  <li key={p.key} style={{ flexGrow: p.endDay - p.startDay }}>
                    <button
                      type="button"
                      data-state={state}
                      title={name}
                      onClick={() => {
                        setPlaying(false);
                        setDay(p.endDay);
                      }}
                    >
                      {name}
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      )}

      <div className="pl-4d-print">
        <FloorPlanSvg room={room} plan={plan} />
      </div>
    </div>
  );
}
