"use client";

import { useState } from "react";
import MilagroIconAnimation from "./MilagroIconAnimation";

/**
 * Full-screen white stage for reviewing the icon animation. The replay control
 * sits outside the animation frame and only appears once the sequence has
 * finished, so nothing but the icon is on screen while it plays.
 */
export default function IconAnimationPreview() {
  const [run, setRun] = useState(0);
  const [done, setDone] = useState(false);

  return (
    <main className="fixed inset-0 grid place-items-center bg-white px-4">
      <div className="w-[min(78vmin,34rem)]">
        <MilagroIconAnimation key={run} onDone={() => setDone(true)} />
      </div>

      <button
        type="button"
        onClick={() => {
          setDone(false);
          setRun((n) => n + 1);
        }}
        className={`fixed bottom-[max(1.5rem,env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 rounded-full border border-[#4a5c72]/20 bg-white px-4 py-2 text-[13px] font-medium text-[#4a5c72] transition-opacity duration-500 hover:border-[#038fc2]/50 hover:text-[#038fc2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#038fc2] ${
          done ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!done}
        tabIndex={done ? 0 : -1}
      >
        Replay
      </button>
    </main>
  );
}
