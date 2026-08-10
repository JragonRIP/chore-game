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
import { PixelGearIcon, RarityBadge } from "@/components/PixelGearIcon";
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

  const owned = useMemo(
    () =>
      state.ownedGear
        .map((id) => GEAR_BY_ID[id])
        .filter(Boolean)
        .filter((g) => slotFilter === "all" || g.slot === slotFilter),
    [state.ownedGear, slotFilter],
  );

  return (
    <div className="mx-auto w-full max-w-lg px-2 pb-4 pt-3">
      <h2 className="font-pixel text-xs text-gold sm:text-sm">Armory</h2>
      <p className="mt-1 text-sm text-cyan-100/75">
        Equip gear for XP & coin bonuses. Complete sets for extra power.
      </p>

      <div className="mt-3 grid grid-cols-5 gap-1.5">
        {SLOTS.map((slot) => {
          const id = state.equipped[slot];
          const gear = id ? GEAR_BY_ID[id] : null;
          return (
            <button
              key={slot}
              type="button"
              onClick={() => (gear ? onUnequip(slot) : setSlotFilter(slot))}
              className="pixel-panel flex flex-col items-center gap-1 p-1.5"
            >
              {gear ? (
                <PixelGearIcon gear={gear} size={40} />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center border border-dashed border-cyan-800 text-[9px] text-cyan-700">
                  +
                </div>
              )}
              <span className="font-pixel text-[7px] text-cyan-300">
                {SLOT_LABELS[slot].slice(0, 4)}
              </span>
            </button>
          );
        })}
      </div>

      {activeSetId && (
        <p className="mt-2 font-pixel text-[9px] text-lime-xp">
          Set bonus active:{" "}
          {GEAR_SETS.find((s) => s.id === activeSetId)?.name}
        </p>
      )}

      <h3 className="mt-4 font-pixel text-[10px] text-cyan-300">Set Hunt</h3>
      <div className="mt-2 flex flex-col gap-2">
        {GEAR_SETS.map((set) => {
          const pieces = getSetPieces(set.id);
          const ownedCount = pieces.filter((p) =>
            state.ownedGear.includes(p.id),
          ).length;
          return (
            <div key={set.id} className="pixel-panel p-2">
              <div className="flex items-center justify-between gap-2">
                <p className="font-pixel text-[9px] text-cyan-50">{set.name}</p>
                <p className="text-[10px] text-gold">
                  {ownedCount}/{pieces.length}
                </p>
              </div>
              <div className="mt-1 h-2 border border-cyan-900 bg-navy">
                <div
                  className="h-full bg-cyan-jewel"
                  style={{
                    width: `${(ownedCount / pieces.length) * 100}%`,
                  }}
                />
              </div>
              <p className="mt-1 text-[10px] text-cyan-200/60">
                Set bonus: +{set.bonusXpPct}% XP · +{set.bonusCoins} coins
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setSlotFilter("all")}
          className={`pixel-chip min-h-9 shrink-0 text-[10px] ${
            slotFilter === "all" ? "border-gold text-gold" : "border-cyan-700"
          }`}
        >
          All
        </button>
        {SLOTS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setSlotFilter(s)}
            className={`pixel-chip min-h-9 shrink-0 text-[10px] ${
              slotFilter === s ? "border-gold text-gold" : "border-cyan-700"
            }`}
          >
            {SLOT_LABELS[s]}
          </button>
        ))}
      </div>

      <div className="mt-3 flex flex-col gap-2">
        {owned.length === 0 && (
          <p className="text-sm text-cyan-200/70">
            No gear yet — open chests from level-ups or the Store.
          </p>
        )}
        {owned.map((g) => {
          const equipped = state.equipped[g.slot] === g.id;
          return (
            <div
              key={g.id}
              className="pixel-panel flex items-center gap-2 p-2"
            >
              <PixelGearIcon gear={g} size={48} />
              <div className="min-w-0 flex-1">
                <p className="truncate font-pixel text-[9px] text-cyan-50">
                  {g.name}
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-1">
                  <RarityBadge rarity={g.rarity} />
                  <span className="text-[10px] text-lime-xp">
                    +{g.xpBonusPct}% XP
                  </span>
                  <span className="text-[10px] text-gold">
                    +{g.coinBonus}🪙
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  equipped ? onUnequip(g.slot) : onEquip(g.id)
                }
                className={`pixel-btn min-h-10 px-2 font-pixel text-[8px] ${
                  equipped ? "pixel-btn-ghost" : "pixel-btn-primary"
                }`}
              >
                {equipped ? "Unequip" : "Equip"}
              </button>
            </div>
          );
        })}
      </div>

      <p className="mt-4 text-[10px] text-cyan-200/50">
        Catalog: {ALL_GEAR.length} unique pieces in the realm.
      </p>
    </div>
  );
}
