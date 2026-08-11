"use client";

import { useMemo, useState } from "react";
import {
  ALL_GEAR,
  GEAR_BY_ID,
  GEAR_SETS,
  SLOT_LABELS,
  SLOTS,
  getSetPieces,
} from "@/lib/gear";
import { HeroSprite } from "@/components/HeroSprite";
import { GearIcon, RarityBadge } from "@/components/PixelGearIcon";
import type { GameState, GearId, Slot } from "@/lib/types";

export function Armory({
  state,
  activeSetId,
  onEquip,
  onUnequip,
}: {
  state: GameState;
  activeSetId: string | null;
  onEquip: (id: GearId) => void;
  onUnequip: (slot: Slot) => void;
}) {
  const [slotFilter, setSlotFilter] = useState<Slot | "all">("all");
  const hero = state.hero!;

  const owned = useMemo(
    () =>
      state.ownedGear
        .map((id) => GEAR_BY_ID[id])
        .filter(Boolean)
        .filter((g) => slotFilter === "all" || g.slot === slotFilter),
    [state.ownedGear, slotFilter],
  );

  return (
    <div className="mx-auto w-full max-w-lg px-3 pb-5 pt-4">
      <h2 className="font-display text-2xl text-ink">Armory</h2>
      <p className="mt-0.5 text-sm text-ink-soft">
        Equip gear for XP and coin bonuses.
      </p>

      <div className="surface-strong mt-4 flex items-center gap-4 p-4">
        <div className="flex h-32 w-32 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-sky-2 to-white ring-1 ring-ink/5">
          <HeroSprite
            avatar={hero.avatar}
            equipped={state.equipped}
            size={120}
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-display text-lg text-ink">{hero.name}</p>
          <p className="mt-1 text-sm text-ink-soft">
            Equip pieces below to power up your hero.
          </p>
          {activeSetId && (
            <p className="mt-2 rounded-xl bg-xp/10 px-2.5 py-1.5 text-xs font-bold text-emerald-700">
              Set bonus: {GEAR_SETS.find((s) => s.id === activeSetId)?.name}
            </p>
          )}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-5 gap-2">
        {SLOTS.map((slot) => {
          const id = state.equipped[slot];
          const gear = id ? GEAR_BY_ID[id] : null;
          return (
            <button
              key={slot}
              type="button"
              onClick={() => (gear ? onUnequip(slot) : setSlotFilter(slot))}
              className="surface flex flex-col items-center gap-1.5 p-2"
            >
              {gear ? (
                <GearIcon gear={gear} size={40} />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-dashed border-ink/20 text-ink/30">
                  +
                </div>
              )}
              <span className="text-[10px] font-semibold text-ink-soft">
                {SLOT_LABELS[slot].slice(0, 4)}
              </span>
            </button>
          );
        })}
      </div>

      <h3 className="mt-5 font-display text-lg text-ink">Set Hunt</h3>
      <div className="mt-2 flex flex-col gap-2.5">
        {GEAR_SETS.map((set) => {
          const pieces = getSetPieces(set.id);
          const ownedCount = pieces.filter((p) =>
            state.ownedGear.includes(p.id),
          ).length;
          return (
            <div key={set.id} className="surface p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="font-display text-sm text-ink">{set.name}</p>
                <p className="text-xs font-bold text-amber-700">
                  {ownedCount}/{pieces.length}
                </p>
              </div>
              <div className="progress-track mt-2">
                <div
                  className="progress-fill"
                  style={{
                    width: `${(ownedCount / pieces.length) * 100}%`,
                    background: `linear-gradient(90deg, hsl(${set.hue} 70% 55%), hsl(${set.hue} 65% 40%))`,
                  }}
                />
              </div>
              <p className="mt-1.5 text-xs text-ink-soft">
                Set bonus: +{set.bonusXpPct}% XP · +{set.bonusCoins} coins
              </p>
            </div>
          );
        })}
      </div>

      <div className="hide-scrollbar mt-4 flex gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setSlotFilter("all")}
          className={`chip shrink-0 ${slotFilter === "all" ? "chip-active" : ""}`}
        >
          All
        </button>
        {SLOTS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setSlotFilter(s)}
            className={`chip shrink-0 ${slotFilter === s ? "chip-active" : ""}`}
          >
            {SLOT_LABELS[s]}
          </button>
        ))}
      </div>

      <div className="mt-3 flex flex-col gap-2.5">
        {owned.length === 0 && (
          <p className="text-sm text-ink-soft">
            No gear yet — open chests from level-ups or the Store.
          </p>
        )}
        {owned.map((g) => {
          const equipped = state.equipped[g.slot] === g.id;
          return (
            <div key={g.id} className="surface flex items-center gap-3 p-3">
              <GearIcon gear={g} size={52} />
              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-sm text-ink">{g.name}</p>
                <div className="mt-1 flex flex-wrap items-center gap-1.5">
                  <RarityBadge rarity={g.rarity} />
                  <span className="text-xs font-semibold text-emerald-700">
                    +{g.xpBonusPct}% XP
                  </span>
                  <span className="text-xs font-semibold text-amber-700">
                    +{g.coinBonus} gold
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => (equipped ? onUnequip(g.slot) : onEquip(g.id))}
                className={`btn min-h-10 px-3 text-xs ${
                  equipped ? "btn-ghost" : "btn-primary"
                }`}
              >
                {equipped ? "Unequip" : "Equip"}
              </button>
            </div>
          );
        })}
      </div>

      <p className="mt-4 text-center text-xs text-ink-soft">
        Catalog: {ALL_GEAR.length} unique pieces in the realm.
      </p>
    </div>
  );
}
