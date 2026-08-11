"use client";

import { HeroSprite } from "@/components/HeroSprite";
import { GoldCoin } from "@/components/GoldCoin";
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
    <header className="glass-bar z-30 shrink-0 border-b px-3 py-2.5">
      <div className="mx-auto flex max-w-lg items-center gap-3">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-sky-2 to-white shadow-sm ring-1 ring-ink/5">
          <HeroSprite
            avatar={hero.avatar}
            equipped={state.equipped}
            size={52}
            showGearBadges={false}
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate font-display text-base text-ink">
              {hero.name}
            </p>
            <button
              type="button"
              onClick={onLevelTap}
              className="shrink-0 rounded-full bg-xp/15 px-2.5 py-0.5 text-xs font-bold text-emerald-700"
              aria-label={`Level ${state.level}`}
            >
              Lv {state.level}
            </button>
          </div>
          <div id="xp-bar-target" className="progress-track mt-1.5">
            <div className="progress-fill" style={{ width: `${pct}%` }} />
          </div>
          <p className="mt-1 text-[11px] text-ink-soft">
            {state.xp}/{xpNeeded} XP
            {xpPctBonus > 0 ? ` · +${xpPctBonus}% gear` : ""}
          </p>
        </div>
        <div
          id="gold-target"
          className="flex shrink-0 items-center gap-1.5 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-200/80 px-2.5 py-2 shadow-sm"
        >
          <GoldCoin size={22} />
          <span className="font-display text-base text-amber-900">
            {state.gold}
          </span>
        </div>
      </div>
    </header>
  );
}
