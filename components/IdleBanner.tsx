"use client";

import { useEffect, useState } from "react";
import { GoldCoin } from "@/components/GoldCoin";
import {
  IDLE_CAP_MS,
  IDLE_MAX_GOLD,
  IDLE_MAX_XP,
  IDLE_START_MS,
  idleRewardsForElapsed,
} from "@/lib/idle";
import { playClick, playIdleClaim } from "@/lib/sounds";

export function IdleBanner({
  startedAt,
  onClaim,
}: {
  startedAt: number;
  onClaim: (gold: number, xp: number) => void;
}) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 2000);
    return () => window.clearInterval(t);
  }, []);

  const elapsed = Math.max(0, now - startedAt);
  const { gold, xp, progress } = idleRewardsForElapsed(elapsed);
  const ready = gold > 0 || xp > 0;
  const capped = elapsed >= IDLE_CAP_MS;
  const warming = elapsed < IDLE_START_MS;

  if (warming && elapsed < 15_000) return null;

  return (
    <div className="surface mt-4 overflow-hidden p-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wide text-teal-deep">
            Realm Idle
          </p>
          <p className="mt-0.5 text-sm font-semibold text-ink">
            {warming
              ? "Stay a minute to start earning…"
              : capped
                ? "Idle full — claim your haul!"
                : "Gold & XP while you’re here"}
          </p>
          <p className="mt-1 flex flex-wrap items-center gap-2 text-xs text-ink-soft">
            <span className="inline-flex items-center gap-1 font-bold text-amber-800">
              <GoldCoin size={12} />
              {gold}/{IDLE_MAX_GOLD}
            </span>
            <span className="font-bold text-emerald-700">
              {xp}/{IDLE_MAX_XP} XP
            </span>
          </p>
        </div>
        <button
          type="button"
          disabled={!ready}
          onClick={() => {
            if (!ready) return;
            playClick();
            playIdleClaim();
            onClaim(gold, xp);
          }}
          className="btn btn-primary shrink-0 min-h-9 px-3 text-xs disabled:opacity-40"
        >
          Claim
        </button>
      </div>
      <div className="progress-track mt-3 h-2">
        <div
          className="progress-fill h-2"
          style={{
            width: `${Math.round(progress * 100)}%`,
            background: "linear-gradient(90deg, #fbbf24, #14b8a6)",
          }}
        />
      </div>
    </div>
  );
}
