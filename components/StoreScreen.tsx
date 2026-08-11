"use client";

import { STORE_CHESTS, STORE_GEAR } from "@/lib/gear";
import { GearIcon, RarityBadge } from "@/components/PixelGearIcon";
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
        Spend gold on chests or save for a specific piece.
      </p>
      <div className="mt-3 inline-flex rounded-2xl bg-gradient-to-br from-gold-soft to-amber-200 px-4 py-2 text-sm font-bold text-amber-900">
        {state.gold} gold
      </div>

      <h3 className="mt-5 font-display text-lg text-ink">Chests</h3>
      <div className="mt-2.5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <article className="surface-strong p-4 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-2/70 text-3xl">
            📦
          </div>
          <h4 className="mt-3 font-display text-base text-ink">
            {STORE_CHESTS.common.label}
          </h4>
          <p className="mt-1 text-sm text-ink-soft">
            Scrap → Enchanted loot. Great for set hunting.
          </p>
          <button
            type="button"
            disabled={state.gold < STORE_CHESTS.common.price}
            onClick={() => onBuyChest("common")}
            className="btn btn-secondary mt-4 w-full text-sm"
          >
            Buy · {STORE_CHESTS.common.price} gold
          </button>
        </article>

        <article className="surface-strong p-4 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-gold-soft to-amber-100 text-3xl pulse-soft">
            👑
          </div>
          <h4 className="mt-3 font-display text-base shimmer-text">
            {STORE_CHESTS.legendary.label}
          </h4>
          <p className="mt-1 text-sm text-ink-soft">
            Enchanted → Mythic, tiny Relic chance!
          </p>
          <button
            type="button"
            disabled={state.gold < STORE_CHESTS.legendary.price}
            onClick={() => onBuyChest("legendary")}
            className="btn btn-primary mt-4 w-full text-sm"
          >
            Buy · {STORE_CHESTS.legendary.price} gold
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
                  className="btn btn-primary min-h-10 px-3 text-xs"
                >
                  {g.storePrice}g
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
