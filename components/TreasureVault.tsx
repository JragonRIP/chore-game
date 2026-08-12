"use client";

import { useMemo, useState } from "react";
import { GEAR_BY_ID } from "@/lib/gear";
import { STORE_XP_BOTTLES } from "@/lib/xpBottles";
import { ChestIcon, chestIconVariant, chestLabel } from "@/components/ChestIcon";
import { GearIcon, RarityBadge } from "@/components/PixelGearIcon";
import { XpBottleIcon } from "@/components/XpBottleIcon";
import type { GameState, VaultChest, XpBottleId } from "@/lib/types";

type VaultFilter = "Chests" | "Loot";

export function TreasureVault({
  state,
  onOpenChest,
  onUseXpBottle,
}: {
  state: GameState;
  onOpenChest: (chest: VaultChest) => void;
  onUseXpBottle: (id: XpBottleId) => void;
}) {
  const [filter, setFilter] = useState<VaultFilter>("Chests");

  const loot = useMemo(
    () => state.lootLog.map((id) => GEAR_BY_ID[id]).filter(Boolean),
    [state.lootLog],
  );

  const bottles = useMemo(
    () =>
      STORE_XP_BOTTLES.map((bottle) => ({
        bottle,
        count: state.xpBottles[bottle.id] ?? 0,
      })).filter((row) => row.count > 0),
    [state.xpBottles],
  );

  const stones = state.evolutionStones ?? 0;
  const storedCount =
    state.vaultChests.length +
    bottles.reduce((n, b) => n + b.count, 0) +
    (stones > 0 ? 1 : 0);

  return (
    <div className="mx-auto w-full max-w-lg px-3 pb-5 pt-4">
      <h2 className="font-display text-2xl text-ink">Treasure Vault</h2>
      <p className="mt-0.5 text-sm text-ink-soft">
        Open chests, drink XP bottles, and browse your loot.
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
            {f === "Chests" ? ` (${storedCount})` : ""}
          </button>
        ))}
      </div>

      {filter === "Chests" && (
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {storedCount === 0 && (
            <p className="text-sm text-ink-soft">
              No chests, bottles, or stones yet. Level up, visit the Store, or
              claim your daily chest!
            </p>
          )}
          {stones > 0 && (
            <div className="surface-strong flex items-center gap-3 p-3">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-100 to-amber-50 text-4xl">
                💎
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-display text-base text-ink">
                  Evolution Stone
                </p>
                <p className="mt-0.5 text-xs font-semibold text-violet-800">
                  ×{stones} · use on the Pets tab
                </p>
              </div>
            </div>
          )}
          {bottles.map(({ bottle, count }) => (
            <div
              key={bottle.id}
              className="surface-strong flex items-center gap-3 p-3"
            >
              <XpBottleIcon bottle={bottle} size={64} />
              <div className="min-w-0 flex-1">
                <p className="font-display text-base text-ink">{bottle.name}</p>
                <p className="mt-0.5 text-xs font-semibold text-emerald-700">
                  +{bottle.xp} XP · ×{count}
                </p>
                <button
                  type="button"
                  onClick={() => onUseXpBottle(bottle.id)}
                  className="btn btn-primary mt-2 min-h-9 px-3 text-xs"
                >
                  Drink
                </button>
              </div>
            </div>
          ))}
          {state.vaultChests.map((chest) => (
            <button
              key={chest.id}
              type="button"
              onClick={() => onOpenChest(chest)}
              className="surface-strong flex items-center gap-3 p-3 text-left transition hover:scale-[1.01]"
            >
              <ChestIcon
                variant={chestIconVariant(chest.type)}
                size={64}
              />
              <div className="min-w-0 flex-1">
                <p className="font-display text-base text-ink">
                  {chestLabel(chest.type)}
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
