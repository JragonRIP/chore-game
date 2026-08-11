"use client";

import { useMemo, useState } from "react";
import { GEAR_BY_ID } from "@/lib/gear";
import { QUESTS } from "@/lib/quests";
import { xpToNextLevel } from "@/lib/math";
import { GearIcon, RarityBadge } from "@/components/PixelGearIcon";
import type { GameState, QuestId } from "@/lib/types";

type VaultFilter = "Active Quests" | "Done Today" | "Loot Unlocked";

export function TreasureVault({
  state,
  onComplete,
  onOpenActive,
}: {
  state: GameState;
  onComplete: (id: QuestId) => void;
  onOpenActive: (id: QuestId) => void;
}) {
  const [filter, setFilter] = useState<VaultFilter>("Active Quests");
  const [query, setQuery] = useState("");
  const xpNeeded = xpToNextLevel(state.level);
  const pct = Math.min(100, Math.round((state.xp / xpNeeded) * 100));

  const active = useMemo(
    () => QUESTS.filter((q) => state.activeQuestIds.includes(q.id)),
    [state.activeQuestIds],
  );
  const done = useMemo(
    () => QUESTS.filter((q) => state.completedToday.includes(q.id)),
    [state.completedToday],
  );
  const loot = useMemo(
    () =>
      state.lootLog
        .map((id) => GEAR_BY_ID[id])
        .filter(Boolean)
        .filter(
          (g) =>
            !query.trim() ||
            g.name.toLowerCase().includes(query.toLowerCase()),
        ),
    [state.lootLog, query],
  );

  return (
    <div className="mx-auto w-full max-w-lg px-3 pb-5 pt-4">
      <h2 className="font-display text-2xl text-ink">Treasure Vault</h2>
      <p className="mt-0.5 text-sm text-ink-soft">Active quests, wins, and loot.</p>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Filter vault…"
        className="field mt-4"
      />

      <div className="hide-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1">
        {(
          ["Active Quests", "Done Today", "Loot Unlocked"] as VaultFilter[]
        ).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`chip shrink-0 ${filter === f ? "chip-active" : ""}`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="surface mt-4 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
          Level Progress
        </p>
        <div className="progress-track mt-2">
          <div className="progress-fill" style={{ width: `${pct}%` }} />
        </div>
        <p className="mt-2 text-sm text-ink-soft">
          Level {state.level} · {state.xp}/{xpNeeded} XP to next
        </p>
      </div>

      {filter === "Active Quests" && (
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {active.length === 0 && (
            <p className="text-sm text-ink-soft">
              No active quests. Start one from the Quest Board!
            </p>
          )}
          {active.map((q) => (
            <article key={q.id} className="surface p-3.5">
              <div className="flex items-start gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-2/60 text-2xl">
                  {q.icon}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="font-display text-base text-ink">{q.name}</h3>
                  <p className="mt-0.5 text-xs font-medium text-amber-700">
                    In progress
                  </p>
                  <button
                    type="button"
                    onClick={() => onOpenActive(q.id)}
                    className="btn btn-ghost mt-3 min-h-10 w-full text-sm"
                  >
                    Open Card
                  </button>
                  <button
                    type="button"
                    onClick={() => onComplete(q.id)}
                    className="btn btn-secondary mt-2 min-h-10 w-full text-sm"
                  >
                    Mark Complete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {filter === "Done Today" && (
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {done.length === 0 && (
            <p className="text-sm text-ink-soft">Nothing cleared yet today.</p>
          )}
          {done.map((q) => (
            <article key={q.id} className="surface flex items-center gap-3 p-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-xp/15 text-sm font-bold text-emerald-700">
                ✓
              </span>
              <span className="text-xl">{q.icon}</span>
              <h3 className="font-display text-sm text-ink">{q.name}</h3>
            </article>
          ))}
        </div>
      )}

      {filter === "Loot Unlocked" && (
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {loot.length === 0 && (
            <p className="text-sm text-ink-soft">
              Level up to open chests and fill your vault!
            </p>
          )}
          {loot.map((g, i) => (
            <article
              key={`${g.id}-${i}`}
              className="surface flex items-center gap-3 p-3"
            >
              <GearIcon gear={g} size={48} />
              <div className="min-w-0">
                <p className="truncate font-display text-sm text-ink">{g.name}</p>
                <div className="mt-1">
                  <RarityBadge rarity={g.rarity} />
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
