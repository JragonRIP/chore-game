"use client";

import { QUESTS } from "@/lib/quests";
import type { QuestId } from "@/lib/types";

export function ActiveQuestSheet({
  questId,
  onClose,
  onComplete,
}: {
  questId: QuestId;
  onClose: () => void;
  onComplete: (id: QuestId) => void;
}) {
  const quest = QUESTS.find((q) => q.id === questId);
  if (!quest) return null;

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
            Quest in progress
          </p>
          <h2 className="mt-1 text-center font-display text-2xl leading-tight text-ink sm:text-3xl">
            {quest.name}
          </h2>
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4">
          <p className="text-base leading-relaxed text-ink-soft">{quest.goal}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="chip border-emerald-200 bg-emerald-50 text-emerald-700">
              +{quest.xp} XP
            </span>
            <span className="chip border-amber-200 bg-amber-50 text-amber-800">
              +{quest.coins} Gold
            </span>
            <span className="chip">{quest.category}</span>
          </div>

          <div className="mt-5 rounded-2xl bg-sky-1/80 px-4 py-3 text-sm text-ink-soft">
            Go complete the chore in the real world, then come back and tap
            Complete when you&apos;re done.
          </div>

          <div className="mt-auto flex flex-col gap-2.5 pt-6">
            <button
              type="button"
              onClick={() => onComplete(quest.id)}
              className="btn btn-secondary w-full text-base"
            >
              Complete Quest
            </button>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost w-full text-sm"
            >
              Keep Going — Close Card
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
