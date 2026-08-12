"use client";

import { useMemo } from "react";
import { STORE_CHESTS, getDailyStoreGear } from "@/lib/gear";
import { getDailyStorePets } from "@/lib/pets";
import { STORE_PET_TREATS } from "@/lib/petTreats";
import { STORE_XP_BOTTLES } from "@/lib/xpBottles";
import { todayKey } from "@/lib/math";
import { ChestIcon } from "@/components/ChestIcon";
import { PetIcon } from "@/components/PetIcon";
import { PetTreatIcon } from "@/components/PetTreatIcon";
import { GearIcon, RarityBadge } from "@/components/PixelGearIcon";
import { GoldCoin } from "@/components/GoldCoin";
import { XpBottleIcon } from "@/components/XpBottleIcon";
import type { GameState, GearId, PetId, PetTreatId, XpBottleId } from "@/lib/types";

export function StoreScreen({
  state,
  onBuyChest,
  onBuyXpBottle,
  onBuyPetTreat,
  onBuyGear,
  onBuyPet,
}: {
  state: GameState;
  onBuyChest: (kind: "common" | "legendary") => void;
  onBuyXpBottle: (id: XpBottleId) => void;
  onBuyPetTreat: (id: PetTreatId) => void;
  onBuyGear: (id: GearId) => void;
  onBuyPet: (id: PetId) => void;
}) {
  const day = todayKey();
  const dailyPets = useMemo(
    () => (state.petsUnlocked ? getDailyStorePets(day) : []),
    [state.petsUnlocked, day],
  );
  const dailyGear = useMemo(() => getDailyStoreGear(day), [day]);

  return (
    <div className="mx-auto w-full max-w-lg px-3 pb-5 pt-4">
      <h2 className="font-display text-2xl text-ink">Hero Store</h2>
      <p className="mt-0.5 text-sm text-ink-soft">
        Buy chests and XP bottles — they go to your Vault.
      </p>
      <div className="mt-3 inline-flex items-center gap-1.5 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-200/80 px-3 py-2 text-sm font-bold text-amber-900">
        <GoldCoin size={20} />
        {state.gold}
      </div>

      <h3 className="mt-5 font-display text-lg text-ink">Chests</h3>
      <div className="mt-2.5 grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-3">
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

          {STORE_XP_BOTTLES.map((bottle) => (
            <article
              key={bottle.id}
              className="surface-strong flex flex-col items-center p-3 text-center"
            >
              <XpBottleIcon bottle={bottle} size={64} />
              <h4 className="mt-1 font-display text-sm text-ink">
                {bottle.name}
              </h4>
              <p className="text-[10px] font-semibold text-emerald-700">
                +{bottle.xp} XP · Vault
              </p>
              <button
                type="button"
                disabled={state.gold < bottle.price}
                onClick={() => onBuyXpBottle(bottle.id)}
                className="btn btn-secondary mt-2 min-h-10 w-full gap-1 text-xs"
              >
                <GoldCoin size={16} />
                {bottle.price}
              </button>
            </article>
          ))}
        </div>

        <div className="flex flex-col gap-3">
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

          {STORE_PET_TREATS.map((treat) => (
            <article
              key={treat.id}
              className="surface-strong flex flex-col items-center p-3 text-center"
            >
              <PetTreatIcon treat={treat} size={64} />
              <h4 className="mt-1 font-display text-sm text-ink">
                {treat.name}
              </h4>
              <p className="text-[10px] font-semibold text-teal-deep">
                +{treat.xp} Pet XP · Pets tab
              </p>
              <button
                type="button"
                disabled={state.gold < treat.price}
                onClick={() => onBuyPetTreat(treat.id)}
                className="btn btn-secondary mt-2 min-h-10 w-full gap-1 text-xs"
              >
                <GoldCoin size={16} />
                {treat.price}
              </button>
            </article>
          ))}
        </div>
      </div>

      {state.petsUnlocked && (
        <>
          <h3 className="mt-6 font-display text-lg text-ink">Companions</h3>
          <p className="mt-0.5 text-xs text-ink-soft">
            Today&apos;s visiting sidekicks — a new guest each day. Mythic &amp;
            Relic are chest-only.
          </p>
          <div className="mt-2.5 flex flex-col gap-2.5">
            {dailyPets.length === 0 ? (
              <p className="text-sm text-ink-soft">
                No visitors today — check back tomorrow.
              </p>
            ) : (
              dailyPets.map((pet) => {
                const owned = state.ownedPets.includes(pet.id);
                const canBuy =
                  !owned && state.gold >= (pet.storePrice ?? Infinity);
                return (
                  <div key={pet.id} className="surface flex items-center gap-3 p-3">
                    <PetIcon pet={pet} size={52} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-display text-sm text-ink">
                        {pet.name}
                      </p>
                      <div className="mt-1 flex flex-wrap gap-1.5">
                        <RarityBadge rarity={pet.rarity} />
                        <span className="text-xs font-semibold text-emerald-700">
                          +{pet.xpBonusPct}% XP
                        </span>
                      </div>
                      <p className="mt-1 text-[10px] font-semibold text-ink-soft">
                        {pet.traitLabel}
                      </p>
                    </div>
                    {owned ? (
                      <span className="text-xs font-bold text-emerald-700">
                        Owned
                      </span>
                    ) : (
                      <button
                        type="button"
                        disabled={!canBuy}
                        onClick={() => onBuyPet(pet.id)}
                        className="btn btn-primary min-h-10 gap-1 px-3 text-xs"
                      >
                        <GoldCoin size={14} />
                        {pet.storePrice}
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </>
      )}

      <h3 className="mt-6 font-display text-lg text-ink">Gear Shelf</h3>
      <p className="mt-0.5 text-xs text-ink-soft">
        Today&apos;s stock — shelves restock with new pieces each day.
      </p>
      <div className="mt-2.5 flex flex-col gap-2.5">
        {dailyGear.map((g) => {
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
