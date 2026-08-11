"use client";

import { useMemo, useState } from "react";
import { GoldCoin } from "@/components/GoldCoin";
import { QUESTS, QUEST_CATEGORIES } from "@/lib/quests";
import type { GameState, QuestCategory, QuestId } from "@/lib/types";

export function QuestBoard({
  state,
  onStart,
  onOpenActive,
}: {
  state: GameState;
  onStart: (id: QuestId) => void;
  onOpenActive: (id: QuestId) => void;
}) {
  const [category, setCategory] = useState<(typeof QUEST_CATEGORIES)[number]>(
    "All Quests",
  );

  const filtered = useMemo(() => {
    return QUESTS.filter((q) => {
      return (
        category === "All Quests" || q.category === (category as QuestCategory)
      );
    });
  }, [category]);

  return (
    <div className="mx-auto w-full max-w-lg px-3 pb-5 pt-4">
      <h2 className="font-display text-2xl text-ink">Quest Board</h2>
      <p className="mt-0.5 text-sm text-ink-soft">Pick a chore. Become a legend.</p>

      <div className="hide-scrollbar mt-4 flex gap-2 overflow-x-auto pb-1">
        {QUEST_CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategory(c)}
            className={`chip shrink-0 ${category === c ? "chip-active" : ""}`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-4 flex flex-col gap-3.5">
        {filtered.map((quest, i) => {
          const done = state.completedToday.includes(quest.id);
          const active = state.activeQuests.some((q) => q.questId === quest.id);
          return (
            <article
              key={quest.id}
              className="surface-strong overflow-hidden rise-in"
              style={{ animationDelay: `${Math.min(i, 6) * 40}ms` }}
            >
              <div className="relative flex items-center justify-center bg-gradient-to-br from-sky-2 via-white to-teal/10 py-7">
                <span className="text-5xl drop-shadow-sm">{quest.icon}</span>
                <div className="absolute right-3 top-3">
                  <span
                    className={`chip ${
                      quest.difficulty === "quick"
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : "border-sky-200 bg-sky-50 text-sky-700"
                    }`}
                  >
                    {quest.difficulty === "quick"
                      ? `Quick · ${quest.minutes}m`
                      : `Epic · ${quest.minutes}m`}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-display text-lg leading-snug text-ink">
                  {quest.name}
                </h3>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  <span className="chip border-emerald-200 bg-emerald-50 text-emerald-700">
                    +{quest.xp} XP
                  </span>
                  <span className="chip border-amber-200 bg-amber-50 text-amber-800">
                    <GoldCoin size={14} />+{quest.coins}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                  {quest.goal}
                </p>
                <div className="mt-4">
                  {done ? (
                    <p className="rounded-xl bg-xp/10 px-3 py-3 text-center text-sm font-semibold text-emerald-700">
                      Cleared today — returns at midnight
                    </p>
                  ) : active ? (
                    <button
                      type="button"
                      onClick={() => onOpenActive(quest.id)}
                      className="btn btn-secondary w-full"
                    >
                      Open Quest Card
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onStart(quest.id)}
                      className="btn btn-primary w-full"
                    >
                      Start Quest
                    </button>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
