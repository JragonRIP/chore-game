import { ALL_GEAR, GEAR_SETS, getSetPieces } from "@/lib/gear";
import { ALL_PETS, PET_BY_ID, PET_SPECIES } from "@/lib/pets";
import type {
  GameState,
  GearDef,
  PetDef,
  PetSpecies,
  PetStage,
} from "@/lib/types";

export function maxStageForSpecies(
  state: GameState,
  species: PetSpecies,
): PetStage {
  let max: PetStage = 1;
  for (const id of state.ownedPets) {
    const pet = PET_BY_ID[id];
    if (!pet || pet.species !== species) continue;
    const stage = state.petProgress[id]?.stage ?? 1;
    if (stage > max) max = stage as PetStage;
  }
  return max;
}

export function collectionGearRows(state: GameState): Array<{
  gear: GearDef;
  owned: boolean;
}> {
  return ALL_GEAR.map((gear) => ({
    gear,
    owned: state.ownedGear.includes(gear.id),
  }));
}

export function collectionPetSpeciesRows(state: GameState): Array<{
  species: PetSpecies;
  owned: boolean;
  maxStage: PetStage;
  sample: PetDef | null;
}> {
  return PET_SPECIES.map((species) => {
    const owned = state.ownedPets
      .map((id) => PET_BY_ID[id])
      .filter((p): p is PetDef => Boolean(p && p.species === species));
    const sample =
      owned.sort(
        (a, b) =>
          ALL_PETS.findIndex((p) => p.id === b.id) -
          ALL_PETS.findIndex((p) => p.id === a.id),
      )[0] ?? null;
    return {
      species,
      owned: owned.length > 0,
      maxStage: maxStageForSpecies(state, species),
      sample,
    };
  });
}

export function collectionCounts(state: GameState): {
  gearOwned: number;
  gearTotal: number;
  petSpeciesOwned: number;
  petSpeciesTotal: number;
  stagesUnlocked: number;
  stagesTotal: number;
} {
  const gearOwned = state.ownedGear.filter((id) =>
    ALL_GEAR.some((g) => g.id === id),
  ).length;
  const rows = collectionPetSpeciesRows(state);
  const petSpeciesOwned = rows.filter((r) => r.owned).length;
  const stagesUnlocked = rows.reduce(
    (n, r) => n + (r.owned ? r.maxStage : 0),
    0,
  );
  return {
    gearOwned,
    gearTotal: ALL_GEAR.length,
    petSpeciesOwned,
    petSpeciesTotal: PET_SPECIES.length,
    stagesUnlocked,
    stagesTotal: PET_SPECIES.length * 3,
  };
}

export function setCompletionCount(state: GameState): number {
  return GEAR_SETS.filter((set) => {
    const pieces = getSetPieces(set.id);
    return (
      pieces.length > 0 &&
      pieces.every((p) => state.ownedGear.includes(p.id))
    );
  }).length;
}
