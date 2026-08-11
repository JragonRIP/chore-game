import type { PetTreatDef, PetTreatId } from "@/lib/types";

export const STORE_PET_TREATS: PetTreatDef[] = [
  {
    id: "treat-nibble",
    name: "Snack Nibble",
    xp: 20,
    price: 30,
    hue: 28,
  },
  {
    id: "treat-feast",
    name: "Feast Biscuit",
    xp: 50,
    price: 75,
    hue: 12,
  },
];

export const PET_TREAT_BY_ID: Record<PetTreatId, PetTreatDef> =
  Object.fromEntries(STORE_PET_TREATS.map((t) => [t.id, t])) as Record<
    PetTreatId,
    PetTreatDef
  >;
