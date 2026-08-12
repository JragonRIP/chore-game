"use client";

import { useMemo, useState } from "react";
import { HeroSprite } from "@/components/HeroSprite";
import { PetIcon, PetSprite } from "@/components/PetIcon";
import { PetTreatIcon } from "@/components/PetTreatIcon";
import { RarityBadge } from "@/components/PixelGearIcon";
import {
  displayPetName,
  getPetProgress,
  isMapleName,
  MAX_PET_LEVEL,
  PET_BY_ID,
  PET_TRAIT_LABELS,
  petLevelMultiplier,
  petXpToNextLevel,
} from "@/lib/pets";
import { STORE_PET_TREATS } from "@/lib/petTreats";
import type { GameState, PetId, PetTreatId } from "@/lib/types";

export function PetsScreen({
  state,
  onEquip,
  onUnequip,
  onFeedTreat,
  onRename,
}: {
  state: GameState;
  onEquip: (id: PetId) => void;
  onUnequip: () => void;
  onFeedTreat: (treatId: PetTreatId, petId: PetId) => void;
  onRename: (id: PetId, name: string) => void;
}) {
  const hero = state.hero!;
  const equipped = state.equippedPet
    ? PET_BY_ID[state.equippedPet]
    : null;
  const equippedProgress = equipped
    ? getPetProgress(state.petProgress, equipped.id)
    : null;

  const owned = useMemo(
    () =>
      state.ownedPets
        .map((id) => PET_BY_ID[id])
        .filter(Boolean)
        .sort((a, b) => a.species.localeCompare(b.species)),
    [state.ownedPets],
  );
  const treatBag = state.petTreats ?? {
    "treat-nibble": 0,
    "treat-feast": 0,
  };
  const ownedTreats = STORE_PET_TREATS.filter(
    (t) => (treatBag[t.id] ?? 0) > 0,
  );
  const [selectedTreat, setSelectedTreat] = useState<PetTreatId>(
    ownedTreats[0]?.id ?? "treat-nibble",
  );
  const [renamingId, setRenamingId] = useState<PetId | null>(null);
  const [renameDraft, setRenameDraft] = useState("");
  const selectedDef =
    STORE_PET_TREATS.find((t) => t.id === selectedTreat) ??
    ownedTreats[0] ??
    null;
  const selectedCount = selectedDef
    ? (treatBag[selectedDef.id] ?? 0)
    : 0;

  if (!state.petsUnlocked) {
    return (
      <div className="mx-auto flex w-full max-w-lg flex-col items-center px-3 pb-8 pt-10 text-center">
        <div className="flex h-36 w-36 items-center justify-center rounded-[2.5rem] bg-gradient-to-br from-sky-2 to-white ring-1 ring-ink/10">
          <span className="font-display text-7xl text-ink/25">?</span>
        </div>
        <h2 className="mt-6 font-display text-2xl text-ink">Companions</h2>
        <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink-soft">
          Continue your journey to find out what this is…
        </p>
        <p className="mt-4 rounded-2xl bg-teal/10 px-4 py-2 text-xs font-semibold text-teal-deep">
          Hint: finish a Pets chore on the Quest board
        </p>
      </div>
    );
  }

  const equippedMult = equippedProgress
    ? petLevelMultiplier(equippedProgress.level)
    : 1;
  const equippedXpBonus = equipped
    ? Math.round(equipped.xpBonusPct * equippedMult)
    : 0;
  const equippedCoinBonus = equipped
    ? Math.round(equipped.coinBonus * equippedMult)
    : 0;
  const equippedXpNeeded =
    equippedProgress && equippedProgress.level < MAX_PET_LEVEL
      ? petXpToNextLevel(equippedProgress.level)
      : 0;
  const equippedXpPct =
    equippedProgress && equippedXpNeeded > 0
      ? Math.min(100, (equippedProgress.xp / equippedXpNeeded) * 100)
      : 100;

  return (
    <div className="mx-auto w-full max-w-lg px-3 pb-5 pt-4">
      <h2 className="font-display text-2xl text-ink">Companions</h2>
      <p className="mt-0.5 text-sm text-ink-soft">
        Equip one loyal sidekick. Matching chores raise its level.
      </p>

      <div className="surface-strong mt-4 flex flex-col items-center px-3 py-5">
        <div className="relative flex h-44 w-full max-w-xs items-end justify-center rounded-[2rem] bg-gradient-to-br from-sky-2 to-white ring-1 ring-ink/5 sm:h-52">
          <HeroSprite
            avatar={hero.avatar}
            equipped={state.equipped}
            size={160}
            showGearBadges={false}
          />
          {equipped && (
            <div className="absolute bottom-2 right-[12%] loot-pop">
              <PetSprite
                species={equipped.species}
                maple={isMapleName(state.petNames?.[equipped.id])}
                size={72}
              />
            </div>
          )}
        </div>
        <p className="mt-3 font-display text-base text-ink">{hero.name}</p>
        {equipped && equippedProgress ? (
          <div className="mt-2 w-full max-w-xs text-center">
            <p className="font-display text-sm text-teal-deep">
              {displayPetName(equipped.name, state.petNames?.[equipped.id])}
            </p>
            <div className="mt-1.5 flex flex-wrap items-center justify-center gap-1.5">
              <RarityBadge rarity={equipped.rarity} />
              <span className="rounded-full bg-teal/15 px-2.5 py-0.5 text-[10px] font-bold text-teal-deep">
                Pet Lv {equippedProgress.level}
              </span>
              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
                +{equippedXpBonus}% XP
              </span>
              <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold text-amber-800">
                +{equippedCoinBonus} gold
              </span>
            </div>
            <p className="mt-2 text-xs font-semibold text-ink-soft">
              {PET_TRAIT_LABELS[equipped.species]}
            </p>
            <div className="mt-3 text-left">
              <div className="mb-1 flex items-center justify-between text-[10px] font-bold text-ink-soft">
                <span>Pet XP</span>
                <span>
                  {equippedProgress.level >= MAX_PET_LEVEL
                    ? "MAX"
                    : `${equippedProgress.xp}/${equippedXpNeeded}`}
                </span>
              </div>
              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{
                    width: `${equippedXpPct}%`,
                    background:
                      "linear-gradient(90deg, #14b8a6, #0d9488)",
                  }}
                />
              </div>
            </div>
            {selectedDef && selectedCount > 0 && equippedProgress.level < MAX_PET_LEVEL && (
              <button
                type="button"
                onClick={() => onFeedTreat(selectedDef.id, equipped.id)}
                className="btn btn-primary mt-3 min-h-10 w-full text-xs"
              >
                Feed {selectedDef.name} (+{selectedDef.xp} XP)
              </button>
            )}
          </div>
        ) : (
          <p className="mt-2 text-sm text-ink-soft">No companion equipped</p>
        )}
      </div>

      {ownedTreats.length > 0 && (
        <>
          <h3 className="mt-5 font-display text-lg text-ink">Treat Pouch</h3>
          <p className="mt-0.5 text-xs text-ink-soft">
            Pick a treat, then feed any pet below.
          </p>
          <div className="mt-2.5 flex flex-col gap-2.5">
            {ownedTreats.map((treat) => {
              const count = treatBag[treat.id] ?? 0;
              const active = selectedDef?.id === treat.id;
              return (
                <button
                  key={treat.id}
                  type="button"
                  onClick={() => setSelectedTreat(treat.id)}
                  className={`surface flex items-center gap-3 p-3 text-left ${
                    active ? "ring-2 ring-teal" : ""
                  }`}
                >
                  <PetTreatIcon treat={treat} size={48} />
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-sm text-ink">{treat.name}</p>
                    <p className="text-xs font-semibold text-teal-deep">
                      +{treat.xp} Pet XP · ×{count}
                    </p>
                  </div>
                  <span className="text-[10px] font-bold text-ink-soft">
                    {active ? "Selected" : "Select"}
                  </span>
                </button>
              );
            })}
          </div>
        </>
      )}

      <h3 className="mt-5 font-display text-lg text-ink">Your Pets</h3>
      <div className="mt-2.5 flex flex-col gap-2.5">
        {owned.length === 0 && (
          <p className="text-sm text-ink-soft">
            No pets yet — open chests or visit the Store companions shelf.
          </p>
        )}
        {owned.map((pet) => {
          const isEquipped = state.equippedPet === pet.id;
          const progress = getPetProgress(state.petProgress, pet.id);
          const needed =
            progress.level < MAX_PET_LEVEL
              ? petXpToNextLevel(progress.level)
              : 0;
          const pct =
            needed > 0 ? Math.min(100, (progress.xp / needed) * 100) : 100;
          const mult = petLevelMultiplier(progress.level);
          return (
            <div key={pet.id} className="surface flex items-center gap-3 p-3">
              <PetIcon
                pet={pet}
                maple={isMapleName(state.petNames?.[pet.id])}
                size={52}
              />
              <div className="min-w-0 flex-1">
                {renamingId === pet.id ? (
                  <form
                    className="flex gap-1"
                    onSubmit={(e) => {
                      e.preventDefault();
                      onRename(pet.id, renameDraft);
                      setRenamingId(null);
                    }}
                  >
                    <input
                      className="field min-h-9 flex-1 px-2 text-xs"
                      maxLength={16}
                      autoFocus
                      value={renameDraft}
                      onChange={(e) => setRenameDraft(e.target.value)}
                      placeholder={pet.name}
                    />
                    <button
                      type="submit"
                      className="btn btn-primary min-h-9 px-2 text-[10px]"
                    >
                      Save
                    </button>
                  </form>
                ) : (
                  <p className="truncate font-display text-sm text-ink">
                    {displayPetName(pet.name, state.petNames?.[pet.id])}
                  </p>
                )}
                <div className="mt-1 flex flex-wrap items-center gap-1.5">
                  <RarityBadge rarity={pet.rarity} />
                  <span className="text-[10px] font-bold text-teal-deep">
                    Lv {progress.level}
                  </span>
                  <span className="text-xs font-semibold text-emerald-700">
                    +{Math.round(pet.xpBonusPct * mult)}% XP
                  </span>
                </div>
                <div className="progress-track mt-1.5 h-1.5">
                  <div
                    className="progress-fill h-1.5"
                    style={{
                      width: `${pct}%`,
                      background:
                        "linear-gradient(90deg, #14b8a6, #0d9488)",
                    }}
                  />
                </div>
                <p className="mt-1 text-[10px] font-semibold text-ink-soft">
                  {pet.traitLabel}
                </p>
              </div>
              <div className="flex shrink-0 flex-col gap-1.5">
                <button
                  type="button"
                  onClick={() =>
                    isEquipped ? onUnequip() : onEquip(pet.id)
                  }
                  className={`btn min-h-10 px-3 text-xs ${
                    isEquipped ? "btn-ghost" : "btn-primary"
                  }`}
                >
                  {isEquipped ? "Unequip" : "Equip"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (renamingId === pet.id) {
                      setRenamingId(null);
                      return;
                    }
                    setRenamingId(pet.id);
                    setRenameDraft(state.petNames?.[pet.id] ?? "");
                  }}
                  className="btn btn-ghost min-h-8 px-3 text-[10px]"
                >
                  {renamingId === pet.id ? "Cancel" : "Rename"}
                </button>
                {selectedDef &&
                  selectedCount > 0 &&
                  progress.level < MAX_PET_LEVEL && (
                    <button
                      type="button"
                      onClick={() => onFeedTreat(selectedDef.id, pet.id)}
                      className="btn btn-secondary min-h-9 px-3 text-[10px]"
                    >
                      Feed
                    </button>
                  )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
