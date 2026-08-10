"use client";

import { STORE_CHESTS, STORE_GEAR } from "@/lib/gear";
import { PixelGearIcon, RarityBadge } from "@/components/PixelGearIcon";
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
    <div className="mx-auto w-full max-w-lg px-2 pb-4 pt-3">
      <h2 className="font-pixel text-xs text-gold sm:text-sm">Hero Store</h2>
      <p className="mt-1 text-sm text-cyan-100/75">
        Spend gold on chests or save up for a specific piece.
      </p>
      <p className="mt-2 font-pixel text-[10px] text-gold">🪙 {state.gold} gold</p>

      <h3 className="mt-4 font-pixel text-[10px] text-cyan-300">Chests</h3>
      <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
        <article className="pixel-panel p-3">
          <div className="text-center text-4xl">📦</div>
          <h4 className="mt-2 text-center font-pixel text-[10px] text-cyan-50">
            {STORE_CHESTS.common.label}
          </h4>
          <p className="mt-1 text-center text-[11px] text-cyan-200/70">
            Scrap → Enchanted loot. Great for set hunting.
          </p>
          <button
            type="button"
            disabled={state.gold < STORE_CHESTS.common.price}
            onClick={() => onBuyChest("common")}
            className="pixel-btn pixel-btn-primary mt-3 min-h-11 w-full font-pixel text-[9px] disabled:opacity-40"
          >
            Buy · 🪙 {STORE_CHESTS.common.price}
          </button>
        </article>

        <article className="pixel-panel p-3">
          <div className="text-center text-4xl">👑</div>
          <h4 className="mt-2 text-center font-pixel text-[10px] text-gold">
            {STORE_CHESTS.legendary.label}
          </h4>
          <p className="mt-1 text-center text-[11px] text-cyan-200/70">
            Enchanted → Mythic, tiny Relic chance!
          </p>
          <button
            type="button"
            disabled={state.gold < STORE_CHESTS.legendary.price}
            onClick={() => onBuyChest("legendary")}
            className="pixel-btn pixel-btn-primary mt-3 min-h-11 w-full font-pixel text-[9px] disabled:opacity-40"
          >
            Buy · 🪙 {STORE_CHESTS.legendary.price}
          </button>
        </article>
      </div>

      <h3 className="mt-5 font-pixel text-[10px] text-cyan-300">
        Gear Shelf
      </h3>
      <div className="mt-2 flex flex-col gap-2">
        {STORE_GEAR.map((g) => {
          const owned = state.ownedGear.includes(g.id);
          const canBuy =
            !owned && state.gold >= (g.storePrice ?? Infinity);
          return (
            <div key={g.id} className="pixel-panel flex items-center gap-2 p-2">
              <PixelGearIcon gear={g} size={48} />
              <div className="min-w-0 flex-1">
                <p className="truncate font-pixel text-[9px] text-cyan-50">
                  {g.name}
                </p>
                <div className="mt-1 flex flex-wrap gap-1">
                  <RarityBadge rarity={g.rarity} />
                  <span className="text-[10px] text-lime-xp">
                    +{g.xpBonusPct}% XP
                  </span>
                </div>
              </div>
              {owned ? (
                <span className="font-pixel text-[8px] text-lime-xp">Owned</span>
              ) : (
                <button
                  type="button"
                  disabled={!canBuy}
                  onClick={() => onBuyGear(g.id)}
                  className="pixel-btn pixel-btn-primary min-h-10 px-2 font-pixel text-[8px] disabled:opacity-40"
                >
                  🪙 {g.storePrice}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
