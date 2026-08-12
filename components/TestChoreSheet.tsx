"use client";

import { useEffect, useState } from "react";
import { formatCountdown } from "@/lib/math";
import { playClick } from "@/lib/sounds";

const TEST_MS = 3000;

export function TestChoreSheet({
  startedAt,
  onClose,
  onComplete,
}: {
  startedAt: number;
  onClose: () => void;
  onComplete: () => void;
}) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 100);
    return () => window.clearInterval(t);
  }, []);

  const remaining = Math.max(0, startedAt + TEST_MS - now);
  const ready = remaining <= 0;
  const progress = Math.min(100, ((TEST_MS - remaining) / TEST_MS) * 100);

  return (
    <div className="fixed inset-0 z-40 flex flex-col justify-end">
      <button
        type="button"
        aria-label="Close test chore"
        className="absolute inset-0 bg-ink/35 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div className="relative z-10 mx-auto flex max-h-[92dvh] w-full max-w-lg flex-col overflow-hidden rounded-t-[1.75rem] bg-paper shadow-[0_-20px_50px_-20px_rgba(21,32,51,0.35)] sheet-up">
        <div className="mx-auto mt-3 h-1.5 w-12 rounded-full bg-ink/15" />

        <div className="relative flex flex-col items-center bg-gradient-to-br from-rose-50 via-white to-amber-50 px-5 pb-6 pt-5">
          <span className="chip absolute right-4 top-4 border-rose-200 bg-white/80 text-rose-700">
            Test · 3s
          </span>
          <div className="flex h-28 w-28 items-center justify-center rounded-full bg-white/80 text-6xl shadow-sm">
            🧪
          </div>
          <p className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-rose-600">
            Test chore
          </p>
          <h2 className="mt-1 text-center font-display text-2xl text-ink">
            Practice Quest
          </h2>
          <p className="mt-2 text-center text-sm text-ink-soft">
            No gold or XP — used to try encounters.
          </p>
        </div>

        <div className="flex flex-1 flex-col px-5 pb-6 pt-4">
          <div className="progress-track h-3">
            <div
              className="progress-fill h-3"
              style={{
                width: `${progress}%`,
                background: "linear-gradient(90deg, #fb7185, #f43f5e)",
              }}
            />
          </div>
          <p className="mt-2 text-center text-sm font-semibold text-ink-soft">
            {ready ? "Ready!" : `Wait ${formatCountdown(remaining)}`}
          </p>

          <div className="mt-auto flex flex-col gap-2.5 pt-6">
            <button
              type="button"
              disabled={!ready}
              onClick={() => {
                playClick();
                onComplete();
              }}
              className="btn btn-secondary w-full text-base disabled:opacity-40"
            >
              {ready ? "Complete Test" : `Wait ${formatCountdown(remaining)}`}
            </button>
            <button
              type="button"
              onClick={() => {
                playClick();
                onClose();
              }}
              className="btn btn-ghost w-full text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
