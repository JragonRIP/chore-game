"use client";

import { useState } from "react";
import { GoldCoin } from "@/components/GoldCoin";
import {
  ACHIEVEMENTS,
  achievementStatus,
} from "@/lib/achievements";
import type { AchievementId, GameState } from "@/lib/types";

export function AchievementsPanel({
  open,
  onClose,
  state,
  onClaim,
}: {
  open: boolean;
  onClose: () => void;
  state: GameState;
  onClaim: (id: AchievementId) => void;
}) {
  const [toast, setToast] = useState<string | null>(null);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-4 backdrop-blur-sm sm:items-center">
      <div className="surface-strong max-h-[90dvh] w-full max-w-md overflow-y-auto p-5 rise-in">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-display text-xl text-ink">Achievements</h3>
            <p className="mt-0.5 text-sm text-ink-soft">
              Glow means tap to claim gold and XP.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-ghost min-h-10 px-3 text-sm"
          >
            Close
          </button>
        </div>

        {toast && (
          <p className="mt-3 rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            {toast}
          </p>
        )}

        <div className="mt-4 flex flex-col gap-2.5">
          {ACHIEVEMENTS.map((a) => {
            const status = achievementStatus(a, state);
            const ready = status === "ready";
            const claimed = status === "claimed";
            return (
              <button
                key={a.id}
                type="button"
                disabled={!ready}
                onClick={() => {
                  if (!ready) return;
                  onClaim(a.id);
                  setToast(`Claimed ${a.name}! +${a.gold} gold · +${a.xp} XP`);
                  window.setTimeout(() => setToast(null), 2200);
                }}
                className={`flex w-full items-center gap-3 rounded-2xl p-3 text-left transition ${
                  ready
                    ? "achievement-ready"
                    : claimed
                      ? "surface"
                      : "surface opacity-45 grayscale"
                }`}
              >
                <span
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-2xl ${
                    ready
                      ? "bg-amber-100"
                      : claimed
                        ? "bg-teal/10"
                        : "bg-ink/5"
                  }`}
                >
                  {a.icon}
                </span>
                <div className="min-w-0 flex-1">
                  <p
                    className={`font-display text-sm ${
                      ready ? "text-amber-900" : "text-ink"
                    }`}
                  >
                    {a.name}
                  </p>
                  <p className="mt-0.5 text-xs text-ink-soft">{a.description}</p>
                  <p className="mt-1 inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-800">
                    <GoldCoin size={12} />
                    {a.gold}
                    <span className="text-emerald-700">+{a.xp} XP</span>
                  </p>
                </div>
                <span className="shrink-0 text-[10px] font-bold uppercase tracking-wide">
                  {ready ? (
                    <span className="text-amber-700">Tap</span>
                  ) : claimed ? (
                    <span className="text-teal-deep">Done</span>
                  ) : (
                    <span className="text-ink-soft">Locked</span>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
