"use client";

import { GoldCoin } from "@/components/GoldCoin";
import { IDLE_MAX_GOLD, IDLE_MAX_XP } from "@/lib/idle";
import { playClick, playIdleClaim } from "@/lib/sounds";

export function IdleBanner({
  claim,
  onClaim,
}: {
  claim: { gold: number; xp: number } | null;
  onClaim: () => void;
}) {
  if (!claim || (claim.gold <= 0 && claim.xp <= 0)) return null;

  const progress = Math.min(
    1,
    Math.max(claim.gold / IDLE_MAX_GOLD, claim.xp / IDLE_MAX_XP),
  );

  return (
    <div className="surface mt-4 overflow-hidden p-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wide text-teal-deep">
            While You Were Away
          </p>
          <p className="mt-0.5 text-sm font-semibold text-ink">
            The realm gathered loot for you
          </p>
          <p className="mt-1 flex flex-wrap items-center gap-2 text-xs text-ink-soft">
            <span className="inline-flex items-center gap-1 font-bold text-amber-800">
              <GoldCoin size={12} />+{claim.gold}
            </span>
            <span className="font-bold text-emerald-700">+{claim.xp} XP</span>
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            playClick();
            playIdleClaim();
            onClaim();
          }}
          className="btn btn-primary shrink-0 min-h-9 px-3 text-xs"
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
