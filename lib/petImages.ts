import type { FamiliarId, PetSpecies } from "./types";

export const PET_IMAGES: Record<PetSpecies, string> = {
  lizard: "/pets/lizard.png",
  wolf: "/pets/wolf.png",
  lion: "/pets/lion.png",
  dragon: "/pets/dragon.png",
};

export const FAMILIAR_PET_IMAGES: Record<FamiliarId, string> = {
  maple: "/pets/maple.png",
  caliper: "/pets/caliper.png",
};
