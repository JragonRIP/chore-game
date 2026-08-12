"use client";

import { useEffect, useRef, useState } from "react";
import { HeroSprite } from "@/components/HeroSprite";
import { GoldCoin } from "@/components/GoldCoin";
import { unclaimedAchievementCount } from "@/lib/achievements";
import type { GameState } from "@/lib/types";

export function PlayerHeader({
  state,
  xpNeeded,
  xpPctBonus,
  coinBonus,
  onLevelTap,
  onFriends,
  friendsBadge,
  onAchievements,
  achievementsBadge,
  onlineActive,
}: {
  state: GameState;
  xpNeeded: number;
  xpPctBonus: number;
  coinBonus: number;
  onLevelTap: () => void;
  onFriends?: () => void;
  friendsBadge?: number;
  onAchievements?: () => void;
  achievementsBadge?: number;
  onlineActive?: boolean;
}) {
  const hero = state.hero!;
  const pct = Math.min(100, Math.round((state.xp / xpNeeded) * 100));
  const readyCount =
    achievementsBadge ?? unclaimedAchievementCount(state);
  const portraitBadge = (friendsBadge ?? 0) + readyCount;
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [menuOpen]);

  return (
    <header className="glass-bar z-30 shrink-0 border-b px-3 py-2.5">
      <div className="mx-auto flex max-w-lg items-center gap-2.5">
        <div className="relative shrink-0" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-sky-2 to-white shadow-sm ring-1 ring-ink/5 transition hover:ring-teal/40"
            aria-label="Open hero menu"
            aria-expanded={menuOpen}
          >
            <HeroSprite
              avatar={hero.avatar}
              equipped={state.equipped}
              size={52}
              showGearBadges={false}
            />
            {onlineActive && (
              <span className="absolute bottom-1 right-1 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
            )}
            {portraitBadge > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-coral px-1 text-[9px] font-bold text-white">
                {portraitBadge}
              </span>
            )}
          </button>

          {menuOpen && (
            <div className="absolute left-0 top-[calc(100%+0.4rem)] z-50 min-w-[11rem] overflow-hidden rounded-2xl bg-white/95 shadow-lg ring-1 ring-ink/10 backdrop-blur-md rise-in">
              <p className="border-b border-ink/5 px-3 py-2 text-[10px] font-bold uppercase tracking-wide text-ink-soft">
                {hero.name}
              </p>
              {onFriends && (
                <button
                  type="button"
                  className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-sm font-semibold text-ink transition hover:bg-sky-1"
                  onClick={() => {
                    setMenuOpen(false);
                    onFriends();
                  }}
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal/10 text-teal-deep">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </span>
                  <span className="flex-1">Friends</span>
                  {(friendsBadge ?? 0) > 0 && (
                    <span className="rounded-full bg-coral px-1.5 py-0.5 text-[10px] font-bold text-white">
                      {friendsBadge}
                    </span>
                  )}
                </button>
              )}
              {onAchievements && (
                <button
                  type="button"
                  className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-sm font-semibold text-ink transition hover:bg-sky-1"
                  onClick={() => {
                    setMenuOpen(false);
                    onAchievements();
                  }}
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
                    🏅
                  </span>
                  <span className="flex-1">Achievements</span>
                  {readyCount > 0 && (
                    <span className="rounded-full bg-amber-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                      {readyCount}
                    </span>
                  )}
                </button>
              )}
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 items-center gap-1.5">
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
            {state.streakDays > 0 && (
              <span
                className="shrink-0 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-800"
                title="Quest streak"
              >
                🔥 {state.streakDays}
              </span>
            )}
            <div className="hide-scrollbar flex min-w-0 shrink items-center gap-1 overflow-x-auto">
              <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                +{xpPctBonus}% XP
              </span>
              <span className="inline-flex shrink-0 items-center gap-0.5 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                <GoldCoin size={10} />+{coinBonus}
              </span>
            </div>
          </div>
          <div id="xp-bar-target" className="progress-track mt-1.5">
            <div className="progress-fill" style={{ width: `${pct}%` }} />
          </div>
          <p className="mt-1 text-[11px] text-ink-soft">
            {state.xp}/{xpNeeded} XP
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
