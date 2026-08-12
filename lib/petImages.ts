import type { FamiliarId, PetSpecies, PetStage } from "./types";

/** Species skins by evolution stage. Missing stages fall back to stage 1. */
export const PET_IMAGES: Record<
  PetSpecies,
  Partial<Record<PetStage, string>> & { 1: string }
> = {
  lizard: {
    1: "/pets/lizard.png",
    2: "/pets/lizard-adult.png",
    3: "/pets/lizard-battle.png",
  },
  wolf: {
    1: "/pets/wolf.png",
    2: "/pets/wolf-adult.png",
    3: "/pets/wolf-battle.png",
  },
  lion: {
    1: "/pets/lion.png",
    2: "/pets/lion-adult.png",
    3: "/pets/lion-battle.png",
  },
  dragon: {
    1: "/pets/dragon.png",
    2: "/pets/dragon-adult.png",
    3: "/pets/dragon-battle.png",
  },
};

/** Familiar skins by evolution stage. Missing stages fall back to stage 1. */
export const FAMILIAR_PET_IMAGES: Record<
  FamiliarId,
  Partial<Record<PetStage, string>> & { 1: string }
> = {
  maple: {
    1: "/pets/maple.png",
    2: "/pets/maple-adult.png",
    3: "/pets/maple-battle.png",
  },
  caliper: {
    1: "/pets/caliper.png",
    2: "/pets/caliper-adult.png",
    3: "/pets/caliper-battle.png",
  },
};

export function getPetImage(species: PetSpecies, stage: PetStage = 1): string {
  const images = PET_IMAGES[species];
  return images[stage] ?? images[1];
}

export function getFamiliarPetImage(
  familiar: FamiliarId,
  stage: PetStage = 1,
): string {
  const images = FAMILIAR_PET_IMAGES[familiar];
  return images[stage] ?? images[1];
}
