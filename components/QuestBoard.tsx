"use client";

import { useEffect, useMemo, useState } from "react";
import { ChestIcon } from "@/components/ChestIcon";
import { GoldCoin } from "@/components/GoldCoin";
import { IdleBanner } from "@/components/IdleBanner";
import {
  canStartDungeon,
  DUNGEON_COST,
  DUNGEON_ROOMS,
  dungeonProgress,
} from "@/lib/dungeon";
import {
  formatLongCountdown,
  isQuestFullyDoneToday,
  questCompletionsToday,
  questCooldownRemainingMs,
  questMaxPerDay,
} from "@/lib/math";
import { getQuestById, getPlayableQuests } from "@/lib/questResolve";
import { QUEST_CATEGORIES } from "@/lib/quests";
import { playClick } from "@/lib/sounds";
import type { GameState, QuestCategory, QuestId } from "@/lib/types";

export function QuestBoard({
  state,
  onOpen,
  onStartDungeon,
  idleStartedAt,
  onClaimIdle,
}: {
  state: GameState;
  onOpen: (id: QuestId) => void;
  onStartDungeon: () => void;
  idleStartedAt: number;
  onClaimIdle: (gold: number, xp: number) => void;
}) {
  const [category, setCategory] = useState<(typeof QUEST_CATEGORIES)[number]>(
    "All Quests",
  );
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 30_000);
    return () => window.clearInterval(t);
  }, []);

  const filtered = useMemo(() => {
    return getPlayableQuests(state).filter((q) => {
      return (
        category === "All Quests" || q.category === (category as QuestCategory)
      );
    });
  }, [category, state]);

  const dungeon = state.activeDungeon;
  const dungeonProg = dungeonProgress(dungeon);
  const canDungeon = canStartDungeon(state, now);
  const dungeonUsedToday =
    !dungeon && state.dungeonDate === state.completedDate;

  return (
    <div className="mx-auto w-full max-w-lg px-3 pb-5 pt-4">
      <h2 className="font-display text-2xl text-ink">Quest Board</h2>
      <p className="mt-0.5 text-sm text-ink-soft">Pick a chore. Become a legend.</p>

      <IdleBanner startedAt={idleStartedAt} onClaim={onClaimIdle} />

      <div className="surface-strong mt-4 overflow-hidden p-4">
        <div className="flex items-start gap-3">
          <ChestIcon variant="crystal" size={56} />
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-wide text-violet-700">
              Crystal Dungeon
            </p>
            <h3 className="font-display text-lg text-ink">Daily run</h3>
            {dungeon ? (
              <>
                <p className="mt-1 text-sm text-ink-soft">
                  Clear {dungeonProg.cleared}/{dungeonProg.total} dungeon chores
                  for a Crystal Chest.
                </p>
                <ul className="mt-2 space-y-1">
                  {dungeon.questIds.map((qid) => {
                    const q = getQuestById(state, qid);
                    const cleared = dungeon.clearedIds.includes(qid);
                    return (
                      <li key={qid}>
                        <button
                          type="button"
                          onClick={() => {
                            playClick();
                            onOpen(qid);
                          }}
                          className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm ${
                            cleared
                              ? "bg-emerald-50 text-emerald-800"
                              : "bg-violet-50 text-violet-900"
                          }`}
                        >
                          <span>
                            {cleared ? "✓ " : "◇ "}
                            {q?.icon} {q?.name ?? qid}
                          </span>
                          {!cleared && (
                            <span className="text-xs font-bold">Open</span>
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </>
            ) : dungeonUsedToday ? (
              <p className="mt-1 text-sm text-ink-soft">
                Cleared for today — returns at midnight.
              </p>
            ) : (
              <>
                <p className="mt-1 text-sm text-ink-soft">
                  Spend {DUNGEON_COST} gold · do {DUNGEON_ROOMS} chores · earn a
                  Crystal Chest packed with mythic loot.
                </p>
                <button
                  type="button"
                  disabled={!canDungeon}
                  onClick={() => {
                    playClick();
                    onStartDungeon();
                  }}
                  className="btn btn-primary mt-3 min-h-10 w-full text-sm disabled:opacity-40"
                >
                  {state.gold < DUNGEON_COST ? (
                    <>Need {DUNGEON_COST} gold</>
                  ) : (
                    <span className="inline-flex items-center gap-1.5">
                      Enter · <GoldCoin size={14} />
                      {DUNGEON_COST}
                    </span>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="hide-scrollbar mt-4 flex gap-2 overflow-x-auto pb-1">
        {QUEST_CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => {
              playClick();
              setCategory(c);
            }}
            className={`chip shrink-0 ${category === c ? "chip-active" : ""}`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-4 flex flex-col gap-3.5">
        {filtered.map((quest, i) => {
          const max = questMaxPerDay(quest);
          const doneCount = questCompletionsToday(state, quest.id);
          const fullyDone = isQuestFullyDoneToday(state, quest);
          const cooldownMs = questCooldownRemainingMs(state, quest, now);
          const onCooldown = cooldownMs > 0 && !fullyDone;
          const active = state.activeQuests.some((q) => q.questId === quest.id);
          const isDungeonRoom = Boolean(
            dungeon?.questIds.includes(quest.id) &&
              !dungeon.clearedIds.includes(quest.id),
          );

          return (
            <article
              key={quest.id}
              className={`surface-strong cursor-pointer overflow-hidden rise-in ${
                isDungeonRoom ? "ring-2 ring-violet-400" : ""
              }`}
              style={{ animationDelay: `${Math.min(i, 6) * 40}ms` }}
              onClick={() => {
                playClick();
                onOpen(quest.id);
              }}
            >
              <div className="relative flex items-center justify-center bg-gradient-to-br from-sky-2 via-white to-teal/10 py-7">
                <span className="text-5xl drop-shadow-sm">{quest.icon}</span>
                <div className="absolute right-3 top-3 flex flex-col items-end gap-1">
                  {isDungeonRoom && (
                    <span className="chip border-violet-200 bg-violet-50 text-violet-800">
                      Dungeon room
                    </span>
                  )}
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
                  {max > 1 && (
                    <span className="chip border-ink/10 bg-white/80 text-ink-soft">
                      {doneCount}/{max} today
                    </span>
                  )}
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
                  {fullyDone ? (
                    <p className="rounded-xl bg-xp/10 px-3 py-3 text-center text-sm font-semibold text-emerald-700">
                      {max > 1
                        ? `Done ${max}× today — returns at midnight`
                        : "Cleared today — returns at midnight"}
                    </p>
                  ) : onCooldown ? (
                    <p className="rounded-xl bg-amber-50 px-3 py-3 text-center text-sm font-semibold text-amber-800">
                      Ready again in {formatLongCountdown(cooldownMs)}
                      {max > 1 ? ` · ${doneCount}/${max} done` : ""}
                    </p>
                  ) : active ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        playClick();
                        onOpen(quest.id);
                      }}
                      className="btn btn-secondary w-full"
                    >
                      Open Quest Card
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        playClick();
                        onOpen(quest.id);
                      }}
                      className="btn btn-primary w-full"
                    >
                      {doneCount > 0 && max > 1 ? "View Again" : "View Quest"}
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
