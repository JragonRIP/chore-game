"use client";

import { useMemo, useState } from "react";
import { GEAR_BY_ID } from "@/lib/gear";
import { QUESTS } from "@/lib/quests";
import { xpToNextLevel } from "@/lib/math";
import { PixelGearIcon, RarityBadge } from "@/components/PixelGearIcon";
import type { GameState, QuestId } from "@/lib/types";

type VaultFilter = "Active Quests" | "Done Today" | "Loot Unlocked";

export function TreasureVault({
  state,
  onComplete,
}: {
  state: GameState;
  onComplete: (id: QuestId) => void;
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
    <div className="mx-auto w-full max-w-lg px-2 pb-4 pt-3">
      <h2 className="font-pixel text-xs text-gold sm:text-sm">Treasure Vault</h2>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Filter vault…"
        className="pixel-input mt-3 w-full min-h-11 text-sm"
      />

      <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {(
          ["Active Quests", "Done Today", "Loot Unlocked"] as VaultFilter[]
        ).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`pixel-chip shrink-0 min-h-9 px-3 text-[10px] ${
              filter === f
                ? "border-gold bg-gold/15 text-gold"
                : "border-cyan-700 text-cyan-200"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="pixel-panel mt-3 p-3">
        <p className="font-pixel text-[9px] text-cyan-300">Hero Level Progress</p>
        <div className="mt-2 h-3 border border-cyan-800 bg-navy">
          <div className="h-full bg-lime-xp" style={{ width: `${pct}%` }} />
        </div>
        <p className="mt-1 text-[11px] text-cyan-100/70">
          Level {state.level} · {state.xp}/{xpNeeded} XP to next
        </p>
      </div>

      {filter === "Active Quests" && (
        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {active.length === 0 && (
            <p className="text-sm text-cyan-200/70">
              No active quests. Start one from the Quest Board!
            </p>
          )}
          {active.map((q) => (
            <article key={q.id} className="pixel-panel p-3">
              <div className="flex items-start gap-2">
                <span className="text-2xl">{q.icon}</span>
                <div className="min-w-0 flex-1">
                  <h3 className="font-pixel text-[10px] leading-4 text-cyan-50">
                    {q.name}
                  </h3>
                  <p className="mt-1 text-[10px] text-gold">★★★☆☆ in progress</p>
                  <button
                    type="button"
                    onClick={() => onComplete(q.id)}
                    className="pixel-btn pixel-btn-primary mt-2 min-h-10 w-full font-pixel text-[9px]"
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
        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {done.length === 0 && (
            <p className="text-sm text-cyan-200/70">Nothing cleared yet today.</p>
          )}
          {done.map((q) => (
            <article key={q.id} className="pixel-panel p-3 opacity-90">
              <div className="flex items-center gap-2">
                <span className="pixel-frame flex h-6 w-6 items-center justify-center border-lime-xp text-lime-xp">
                  ✓
                </span>
                <span className="text-xl">{q.icon}</span>
                <h3 className="font-pixel text-[10px] text-cyan-50">{q.name}</h3>
              </div>
            </article>
          ))}
        </div>
      )}

      {filter === "Loot Unlocked" && (
        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {loot.length === 0 && (
            <p className="text-sm text-cyan-200/70">
              Level up to open chests and fill your vault!
            </p>
          )}
          {loot.map((g, i) => (
            <article
              key={`${g.id}-${i}`}
              className="pixel-panel flex items-center gap-2 p-2"
            >
              <PixelGearIcon gear={g} size={44} />
              <div className="min-w-0">
                <p className="truncate font-pixel text-[9px] text-cyan-50">
                  {g.name}
                </p>
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
