"use client";

import { useMemo, useState } from "react";
import { QUESTS, QUEST_CATEGORIES } from "@/lib/quests";
import type { GameState, QuestCategory, QuestId } from "@/lib/types";

export function QuestBoard({
  state,
  onStart,
  onComplete,
}: {
  state: GameState;
  onStart: (id: QuestId) => void;
  onComplete: (id: QuestId) => void;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof QUEST_CATEGORIES)[number]>(
    "All Quests",
  );

  const filtered = useMemo(() => {
    return QUESTS.filter((q) => {
      const catOk =
        category === "All Quests" || q.category === (category as QuestCategory);
      const qOk =
        !query.trim() ||
        q.name.toLowerCase().includes(query.toLowerCase()) ||
        q.goal.toLowerCase().includes(query.toLowerCase());
      return catOk && qOk;
    });
  }, [category, query]);

  return (
    <div className="mx-auto w-full max-w-lg px-2 pb-4 pt-3">
      <h2 className="font-pixel text-xs text-gold sm:text-sm">Quest Board</h2>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search quests…"
        className="pixel-input mt-3 w-full min-h-11 text-sm"
      />

      <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {QUEST_CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategory(c)}
            className={`pixel-chip shrink-0 min-h-9 px-3 text-[10px] ${
              category === c
                ? "border-gold bg-gold/15 text-gold"
                : "border-cyan-700 text-cyan-200"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-3 flex flex-col gap-3">
        {filtered.map((quest) => {
          const done = state.completedToday.includes(quest.id);
          const active = state.activeQuestIds.includes(quest.id);
          return (
            <article key={quest.id} className="pixel-panel overflow-hidden">
              <div className="flex items-center justify-center bg-navy-deep py-5 text-5xl">
                {quest.icon}
              </div>
              <div className="p-3">
                <h3 className="font-pixel text-[11px] leading-5 text-cyan-50">
                  {quest.name}
                </h3>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <span className="pixel-chip border-lime-xp text-[9px] text-lime-xp">
                    ⭐ +{quest.xp} XP
                  </span>
                  <span className="pixel-chip border-gold text-[9px] text-gold">
                    🪙 +{quest.coins}
                  </span>
                  <span
                    className={`pixel-chip text-[9px] ${
                      quest.difficulty === "quick"
                        ? "border-emerald-400 text-emerald-300"
                        : "border-sky-400 text-sky-300"
                    }`}
                  >
                    {quest.difficulty === "quick"
                      ? `🟢 Quick Dash (${quest.minutes}m)`
                      : `🔵 Epic Raid (${quest.minutes}m)`}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-snug text-cyan-100/80">
                  {quest.goal}
                </p>
                <div className="mt-3">
                  {done ? (
                    <p className="font-pixel text-[10px] text-lime-xp">
                      ✓ Cleared today — returns at midnight
                    </p>
                  ) : active ? (
                    <button
                      type="button"
                      onClick={() => onComplete(quest.id)}
                      className="pixel-btn pixel-btn-primary min-h-12 w-full font-pixel text-[10px]"
                    >
                      Complete Quest!
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onStart(quest.id)}
                      className="pixel-btn pixel-btn-primary min-h-12 w-full font-pixel text-[10px]"
                    >
                      ⚔️ Start Quest!
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
