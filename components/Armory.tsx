"use client";

import { useMemo, useState } from "react";
import {
  ALL_GEAR,
  GEAR_BY_ID,
  GEAR_SETS,
  SALVAGE_GOLD,
  SALVAGE_XP,
  SLOT_LABELS,
  SLOTS,
  getSetPieces,
} from "@/lib/gear";
import { GoldCoin } from "@/components/GoldCoin";
import { HeroSprite } from "@/components/HeroSprite";
import { PetIcon, PetSprite } from "@/components/PetIcon";
import { GearIcon, RarityBadge } from "@/components/PixelGearIcon";
import { familiarFromName, PET_BY_ID } from "@/lib/pets";
import type { GameState, GearDef, GearId, Slot } from "@/lib/types";

const LEFT_SLOTS: Slot[] = ["helmet", "chestplate", "leggings"];
const RIGHT_SLOTS: Array<Slot | "pet"> = ["boots", "weapon", "pet"];

export function Armory({
  state,
  activeSetId,
  xpPctBonus,
  coinBonus,
  onEquip,
  onUnequip,
  onSalvage,
}: {
  state: GameState;
  activeSetId: string | null;
  xpPctBonus: number;
  coinBonus: number;
  onEquip: (id: GearId) => void;
  onUnequip: (slot: Slot) => void;
  onSalvage: (id: GearId) => void;
}) {
  const [slotFilter, setSlotFilter] = useState<Slot | "all">("all");
  const [pendingSalvage, setPendingSalvage] = useState<GearDef | null>(null);
  const hero = state.hero!;

  const owned = useMemo(
    () =>
      state.ownedGear
        .map((id) => GEAR_BY_ID[id])
        .filter(Boolean)
        .filter((g) => slotFilter === "all" || g.slot === slotFilter),
    [state.ownedGear, slotFilter],
  );

  const equippedPet = state.equippedPet
    ? PET_BY_ID[state.equippedPet]
    : null;

  const slotButton = (slot: Slot | "pet") => {
    if (slot === "pet") {
      return (
        <div
          key="pet"
          className="surface flex h-[4.5rem] w-[4.5rem] flex-col items-center justify-center gap-1"
          title="Equip pets on the Pets tab"
        >
          {equippedPet ? (
            <PetIcon
              pet={equippedPet}
              familiar={familiarFromName(state.petNames?.[equippedPet.id])}
              size={40}
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-dashed border-ink/25 text-xs text-ink/40">
              {state.petsUnlocked ? "—" : "?"}
            </div>
          )}
          <span className="text-[9px] font-semibold text-ink-soft">Pet</span>
        </div>
      );
    }
    const id = state.equipped[slot];
    const gear = id ? GEAR_BY_ID[id] : null;
    return (
      <button
        key={slot}
        type="button"
        onClick={() => (gear ? onUnequip(slot) : setSlotFilter(slot))}
        className="surface flex h-[4.5rem] w-[4.5rem] flex-col items-center justify-center gap-1"
      >
        {gear ? (
          <GearIcon gear={gear} size={36} />
        ) : (
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-dashed border-ink/20 text-ink/30">
            +
          </div>
        )}
        <span className="text-[9px] font-semibold text-ink-soft">
          {SLOT_LABELS[slot].slice(0, 5)}
        </span>
      </button>
    );
  };

  return (
    <div className="mx-auto w-full max-w-lg px-3 pb-5 pt-4">
      <h2 className="font-display text-2xl text-ink">Armory</h2>
      <p className="mt-0.5 text-sm text-ink-soft">
        Equip gear for XP and coin bonuses.
      </p>

      <div className="surface-strong mt-4 flex items-center justify-between gap-2 px-2 py-4">
        <div className="flex flex-col gap-2">{LEFT_SLOTS.map(slotButton)}</div>
        <div className="flex flex-1 flex-col items-center">
          <div className="relative flex h-44 w-44 items-center justify-center rounded-[2rem] bg-gradient-to-br from-sky-2 to-white ring-1 ring-ink/5 sm:h-52 sm:w-52">
            <HeroSprite
              avatar={hero.avatar}
              equipped={state.equipped}
              size={180}
              showGearBadges={false}
            />
            {equippedPet && (
              <div className="absolute bottom-1 right-1">
                <PetSprite
                  species={equippedPet.species}
                  familiar={familiarFromName(state.petNames?.[equippedPet.id])}
                  size={56}
                />
              </div>
            )}
          </div>
          <p className="mt-2 font-display text-base text-ink">{hero.name}</p>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-1.5">
            <span className="rounded-full bg-xp/15 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
              Lv {state.level}
            </span>
            <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
              +{xpPctBonus}% XP
            </span>
            <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold text-amber-800">
              +{coinBonus} gold / quest
            </span>
          </div>
          {activeSetId && (
            <p className="mt-1.5 rounded-xl bg-xp/10 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
              Set: {GEAR_SETS.find((s) => s.id === activeSetId)?.name}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          {RIGHT_SLOTS.map(slotButton)}
        </div>
      </div>

      <h3 className="mt-5 font-display text-lg text-ink">Your Gear</h3>
      <p className="mt-0.5 text-xs text-ink-soft">
        Unequip a piece to salvage it into gold and XP. Relics can&apos;t be
        salvaged.
      </p>
      <div className="hide-scrollbar mt-2 flex gap-2 overflow-x-auto pb-1">
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
            No gear yet — open chests from the Vault.
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
                </div>
              </div>
              <div className="flex shrink-0 flex-col gap-1.5">
                <button
                  type="button"
                  onClick={() => (equipped ? onUnequip(g.slot) : onEquip(g.id))}
                  className={`btn min-h-10 px-3 text-xs ${
                    equipped ? "btn-ghost" : "btn-primary"
                  }`}
                >
                  {equipped ? "Unequip" : "Equip"}
                </button>
                {g.rarity === "relic" ? (
                  <p className="text-center text-[10px] font-semibold text-ink-soft">
                    Relic
                  </p>
                ) : equipped ? (
                  <p className="text-center text-[10px] font-semibold text-ink-soft">
                    Unequip to salvage
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={() => setPendingSalvage(g)}
                    className="btn btn-ghost min-h-10 px-3 text-xs text-amber-800"
                  >
                    Salvage
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <h3 className="mt-6 font-display text-lg text-ink">Set Hunt</h3>
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
            </div>
          );
        })}
      </div>

      <p className="mt-4 text-center text-xs text-ink-soft">
        Catalog: {ALL_GEAR.length} unique pieces
      </p>

      {pendingSalvage && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-4 backdrop-blur-sm sm:items-center">
          <div className="surface-strong w-full max-w-sm p-5 text-center rise-in">
            <GearIcon gear={pendingSalvage} size={64} />
            <h3 className="mt-3 font-display text-xl text-ink">
              Salvage {pendingSalvage.name}?
            </h3>
            <p className="mt-2 text-sm text-ink-soft">
              This piece is gone for good. You&apos;ll get gold and XP.
            </p>
            <p className="mt-3 inline-flex items-center justify-center gap-2 text-sm font-bold text-amber-800">
              <GoldCoin size={16} />
              {SALVAGE_GOLD[pendingSalvage.rarity]}
              <span className="text-emerald-700">
                +{SALVAGE_XP[pendingSalvage.rarity]} XP
              </span>
            </p>
            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={() => setPendingSalvage(null)}
                className="btn btn-ghost min-h-11 flex-1"
              >
                Keep it
              </button>
              <button
                type="button"
                onClick={() => {
                  onSalvage(pendingSalvage.id);
                  setPendingSalvage(null);
                }}
                className="btn btn-primary min-h-11 flex-1"
              >
                Salvage
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
