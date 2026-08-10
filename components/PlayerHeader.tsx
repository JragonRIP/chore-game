"use client";

import { PixelAvatar } from "@/components/PixelAvatar";
import type { GameState } from "@/lib/types";

export function PlayerHeader({
  state,
  xpNeeded,
  xpPctBonus,
  onLevelTap,
}: {
  state: GameState;
  xpNeeded: number;
  xpPctBonus: number;
  onLevelTap: () => void;
}) {
  const hero = state.hero!;
  const pct = Math.min(100, Math.round((state.xp / xpNeeded) * 100));

  return (
    <header className="sticky top-0 z-30 border-b-2 border-cyan-900/80 bg-navy-deep/95 px-2 py-2 backdrop-blur-sm">
      <div className="mx-auto flex max-w-lg items-center gap-2">
        <div className="pixel-frame flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden bg-navy">
          <PixelAvatar id={hero.avatar} size={48} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate font-pixel text-[10px] text-gold">
              {hero.name}
            </p>
            <button
              type="button"
              onClick={onLevelTap}
              className="pixel-chip shrink-0 border-lime-xp text-[9px] text-lime-xp"
              aria-label={`Level ${state.level}`}
            >
              LV {state.level}
            </button>
          </div>
          <div className="mt-1 h-2.5 w-full overflow-hidden border border-cyan-800 bg-navy">
            <div
              className="h-full bg-lime-xp transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="mt-0.5 text-[10px] text-cyan-200/70">
            {state.xp}/{xpNeeded} XP
            {xpPctBonus > 0 ? ` · +${xpPctBonus}% gear` : ""}
          </p>
        </div>
        <div className="pixel-chip shrink-0 border-gold text-[10px] text-gold">
          🪙 {state.gold}
        </div>
      </div>
    </header>
  );
}
