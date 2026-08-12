"use client";

import { useEffect, useState } from "react";
import { GoldCoin } from "@/components/GoldCoin";
import { getQuestById } from "@/lib/questResolve";
import {
  canCompleteQuest,
  canStartQuest,
  formatCountdown,
  formatLongCountdown,
  isQuestFullyDoneToday,
  questCooldownRemainingMs,
  questMaxPerDay,
  questRemainingMs,
} from "@/lib/math";
import type { ActiveQuest, GameState, QuestId } from "@/lib/types";

export function ActiveQuestSheet({
  questId,
  active,
  state,
  onClose,
  onStart,
  onComplete,
}: {
  questId: QuestId;
  active: ActiveQuest | undefined;
  state: GameState;
  onClose: () => void;
  onStart: (id: QuestId) => void;
  onComplete: (id: QuestId) => void;
}) {
  const quest = getQuestById(state, questId);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 250);
    return () => window.clearInterval(t);
  }, []);

  if (!quest) return null;

  const started = Boolean(active);
  const remaining = active
    ? questRemainingMs(active, quest.minutes, now)
    : 0;
  const ready = canCompleteQuest(active, quest.minutes, now);
  const total = quest.minutes * 60 * 1000;
  const progress = started
    ? Math.min(100, ((total - remaining) / total) * 100)
    : 0;
  const max = questMaxPerDay(quest);
  const fullyDone = isQuestFullyDoneToday(state, quest);
  const cooldownMs = questCooldownRemainingMs(state, quest, now);
  const canStart = canStartQuest(state, quest, now);

  return (
    <div className="fixed inset-0 z-40 flex flex-col justify-end">
      <button
        type="button"
        aria-label="Close quest card"
        className="absolute inset-0 bg-ink/35 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div className="relative z-10 mx-auto flex max-h-[92dvh] w-full max-w-lg flex-col overflow-hidden rounded-t-[1.75rem] bg-paper shadow-[0_-20px_50px_-20px_rgba(21,32,51,0.35)] sheet-up">
        <div className="mx-auto mt-3 h-1.5 w-12 rounded-full bg-ink/15" />

        <div className="relative flex flex-col items-center bg-gradient-to-br from-sky-2 via-white to-teal/15 px-5 pb-6 pt-5">
          <span className="chip absolute right-4 top-4 border-teal/20 bg-white/80 text-teal-deep">
            {quest.difficulty === "quick"
              ? `Quick · ${quest.minutes}m`
              : `Epic · ${quest.minutes}m`}
          </span>
          <div className="flex h-28 w-28 items-center justify-center rounded-full bg-white/80 text-6xl shadow-sm float-y">
            {quest.icon}
          </div>
          <p className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-teal">
            {started ? "Quest in progress" : "Quest"}
          </p>
          <h2 className="mt-1 text-center font-display text-2xl leading-tight text-ink sm:text-3xl">
            {quest.name}
          </h2>
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4">
          <p className="text-base leading-relaxed text-ink-soft">{quest.goal}</p>

          {started ? (
            <div className="mt-4 rounded-2xl bg-sky-1/90 p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-wide text-ink-soft">
                  Timer
                </p>
                <p
                  className={`font-display text-2xl tabular-nums ${
                    ready ? "text-emerald-600" : "text-ink"
                  }`}
                >
                  {ready ? "Ready!" : formatCountdown(remaining)}
                </p>
              </div>
              <div className="progress-track mt-3">
                <div
                  className="progress-fill"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="mt-2 text-sm text-ink-soft">
                {ready
                  ? "Time’s up — tap Complete when the chore is done."
                  : `Work on the chore for ${quest.minutes} minute${quest.minutes === 1 ? "" : "s"} before you can finish.`}
              </p>
            </div>
          ) : (
            <div className="mt-4 rounded-2xl bg-sky-1/90 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-ink-soft">
                Time needed
              </p>
              <p className="mt-1 font-display text-2xl text-ink">
                {quest.minutes} min
              </p>
              <p className="mt-2 text-sm text-ink-soft">
                The timer starts when you tap Start Chore.
              </p>
            </div>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="chip border-emerald-200 bg-emerald-50 text-emerald-700">
              +{quest.xp} XP
            </span>
            <span className="chip border-amber-200 bg-amber-50 text-amber-800">
              <GoldCoin size={14} />+{quest.coins}
            </span>
          </div>

          <div className="mt-auto flex flex-col gap-2.5 pt-6">
            {started ? (
              <>
                <button
                  type="button"
                  disabled={!ready}
                  onClick={() => onComplete(quest.id)}
                  className="btn btn-secondary w-full text-base"
                >
                  {ready
                    ? "Complete Quest"
                    : `Wait ${formatCountdown(remaining)}`}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="btn btn-ghost w-full text-sm"
                >
                  Keep Going — Close Card
                </button>
              </>
            ) : fullyDone ? (
              <p className="rounded-xl bg-xp/10 px-3 py-3 text-center text-sm font-semibold text-emerald-700">
                {max > 1
                  ? `Done ${max}× today — returns at midnight`
                  : "Cleared today — returns at midnight"}
              </p>
            ) : cooldownMs > 0 ? (
              <p className="rounded-xl bg-amber-50 px-3 py-3 text-center text-sm font-semibold text-amber-800">
                Ready again in {formatLongCountdown(cooldownMs)}
              </p>
            ) : (
              <button
                type="button"
                disabled={!canStart}
                onClick={() => onStart(quest.id)}
                className="btn btn-primary w-full text-base"
              >
                Start Chore
              </button>
            )}
            {!started && (
              <button
                type="button"
                onClick={onClose}
                className="btn btn-ghost w-full text-sm"
              >
                Close
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
