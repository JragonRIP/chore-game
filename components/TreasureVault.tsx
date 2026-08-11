"use client";

import { useMemo, useState } from "react";
import { GEAR_BY_ID } from "@/lib/gear";
import { ChestIcon } from "@/components/ChestIcon";
import { GearIcon, RarityBadge } from "@/components/PixelGearIcon";
import type { GameState, VaultChest } from "@/lib/types";

type VaultFilter = "Chests" | "Loot";

export function TreasureVault({
  state,
  onOpenChest,
}: {
  state: GameState;
  onOpenChest: (chest: VaultChest) => void;
}) {
  const [filter, setFilter] = useState<VaultFilter>("Chests");

  const loot = useMemo(
    () => state.lootLog.map((id) => GEAR_BY_ID[id]).filter(Boolean),
    [state.lootLog],
  );

  return (
    <div className="mx-auto w-full max-w-lg px-3 pb-5 pt-4">
      <h2 className="font-display text-2xl text-ink">Treasure Vault</h2>
      <p className="mt-0.5 text-sm text-ink-soft">
        Open chests and browse your loot.
      </p>

      <div className="hide-scrollbar mt-4 flex gap-2 overflow-x-auto pb-1">
        {(["Chests", "Loot"] as VaultFilter[]).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`chip shrink-0 ${filter === f ? "chip-active" : ""}`}
          >
            {f}
            {f === "Chests" ? ` (${state.vaultChests.length})` : ""}
          </button>
        ))}
      </div>

      {filter === "Chests" && (
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {state.vaultChests.length === 0 && (
            <p className="text-sm text-ink-soft">
              No chests yet. Level up, visit the Store, or claim your daily
              chest!
            </p>
          )}
          {state.vaultChests.map((chest) => (
            <button
              key={chest.id}
              type="button"
              onClick={() => onOpenChest(chest)}
              className="surface-strong flex items-center gap-3 p-3 text-left transition hover:scale-[1.01]"
            >
              <ChestIcon
                variant={chest.type === "legendary" ? "golden" : "wooden"}
                size={64}
              />
              <div className="min-w-0 flex-1">
                <p className="font-display text-base text-ink">
                  {chest.type === "legendary" ? "Golden Chest" : "Wooden Chest"}
                </p>
                <p className="mt-0.5 truncate text-xs text-ink-soft">
                  {chest.reason}
                </p>
                <p className="mt-2 text-xs font-bold text-teal">Tap to open</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {filter === "Loot" && (
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {loot.length === 0 && (
            <p className="text-sm text-ink-soft">
              Open chests to fill your vault with gear!
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
