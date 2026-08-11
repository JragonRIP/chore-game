"use client";

import { STORE_CHESTS, STORE_GEAR } from "@/lib/gear";
import { ChestIcon } from "@/components/ChestIcon";
import { GearIcon, RarityBadge } from "@/components/PixelGearIcon";
import { GoldCoin } from "@/components/GoldCoin";
import type { GameState, GearId } from "@/lib/types";

export function StoreScreen({
  state,
  onBuyChest,
  onBuyGear,
}: {
  state: GameState;
  onBuyChest: (kind: "common" | "legendary") => void;
  onBuyGear: (id: GearId) => void;
}) {
  return (
    <div className="mx-auto w-full max-w-lg px-3 pb-5 pt-4">
      <h2 className="font-display text-2xl text-ink">Hero Store</h2>
      <p className="mt-0.5 text-sm text-ink-soft">
        Buy chests — they go to your Vault to open.
      </p>
      <div className="mt-3 inline-flex items-center gap-1.5 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-200/80 px-3 py-2 text-sm font-bold text-amber-900">
        <GoldCoin size={20} />
        {state.gold}
      </div>

      <h3 className="mt-5 font-display text-lg text-ink">Chests</h3>
      <div className="mt-2.5 grid grid-cols-2 gap-3">
        <article className="surface-strong flex flex-col items-center p-3 text-center">
          <ChestIcon variant="wooden" size={72} />
          <h4 className="mt-2 font-display text-sm text-ink">
            {STORE_CHESTS.common.label}
          </h4>
          <button
            type="button"
            disabled={state.gold < STORE_CHESTS.common.price}
            onClick={() => onBuyChest("common")}
            className="btn btn-secondary mt-3 min-h-10 w-full gap-1 text-xs"
          >
            <GoldCoin size={16} />
            {STORE_CHESTS.common.price}
          </button>
        </article>

        <article className="surface-strong flex flex-col items-center p-3 text-center">
          <div className="pulse-soft">
            <ChestIcon variant="golden" size={72} />
          </div>
          <h4 className="mt-2 font-display text-sm shimmer-text">
            {STORE_CHESTS.legendary.label}
          </h4>
          <button
            type="button"
            disabled={state.gold < STORE_CHESTS.legendary.price}
            onClick={() => onBuyChest("legendary")}
            className="btn btn-primary mt-3 min-h-10 w-full gap-1 text-xs"
          >
            <GoldCoin size={16} />
            {STORE_CHESTS.legendary.price}
          </button>
        </article>
      </div>

      <h3 className="mt-6 font-display text-lg text-ink">Gear Shelf</h3>
      <div className="mt-2.5 flex flex-col gap-2.5">
        {STORE_GEAR.map((g) => {
          const owned = state.ownedGear.includes(g.id);
          const canBuy = !owned && state.gold >= (g.storePrice ?? Infinity);
          return (
            <div key={g.id} className="surface flex items-center gap-3 p-3">
              <GearIcon gear={g} size={52} />
              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-sm text-ink">{g.name}</p>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  <RarityBadge rarity={g.rarity} />
                  <span className="text-xs font-semibold text-emerald-700">
                    +{g.xpBonusPct}% XP
                  </span>
                </div>
              </div>
              {owned ? (
                <span className="text-xs font-bold text-emerald-700">Owned</span>
              ) : (
                <button
                  type="button"
                  disabled={!canBuy}
                  onClick={() => onBuyGear(g.id)}
                  className="btn btn-primary min-h-10 gap-1 px-3 text-xs"
                >
                  <GoldCoin size={14} />
                  {g.storePrice}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
