import type { PetDef, PetSpecies, QuestCategory, Rarity } from "./types";
import { RARITY_ORDER } from "./gear";

export const PET_SPECIES: PetSpecies[] = [
  "lizard",
  "wolf",
  "lion",
  "dragon",
];

export const PET_SPECIES_LABELS: Record<PetSpecies, string> = {
  lizard: "Baby Lizard",
  wolf: "Wolf Pup",
  lion: "Lion Cub",
  dragon: "Dragon Hatchling",
};

export const PET_SPECIES_HUE: Record<PetSpecies, number> = {
  lizard: 142,
  wolf: 215,
  lion: 38,
  dragon: 12,
};

export const PET_TRAIT_LABELS: Record<PetSpecies, string> = {
  lizard: "+coins on Cleaning quests",
  wolf: "+XP on Outdoor quests",
  lion: "Flat gold every quest",
  dragon: "Stronger always-on XP%",
};

/** Base always-on bonuses by rarity (premium spike vs a single gear piece). */
const BASE_BY_RARITY: Record<
  Rarity,
  { xpBonusPct: number; coinBonus: number }
> = {
  scrap: { xpBonusPct: 5, coinBonus: 3 },
  forged: { xpBonusPct: 8, coinBonus: 5 },
  enchanted: { xpBonusPct: 12, coinBonus: 8 },
  mythic: { xpBonusPct: 18, coinBonus: 12 },
  relic: { xpBonusPct: 25, coinBonus: 18 },
};

/** Dragon trait: extra always-on XP%. */
const DRAGON_EXTRA_XP: Record<Rarity, number> = {
  scrap: 3,
  forged: 5,
  enchanted: 8,
  mythic: 12,
  relic: 15,
};

/** Conditional trait strength by rarity. */
export const TRAIT_BY_RARITY: Record<
  Rarity,
  { cleaningCoins: number; outdoorXpPct: number; lionFlatGold: number }
> = {
  scrap: { cleaningCoins: 4, outdoorXpPct: 4, lionFlatGold: 3 },
  forged: { cleaningCoins: 6, outdoorXpPct: 6, lionFlatGold: 5 },
  enchanted: { cleaningCoins: 10, outdoorXpPct: 10, lionFlatGold: 8 },
  mythic: { cleaningCoins: 14, outdoorXpPct: 14, lionFlatGold: 12 },
  relic: { cleaningCoins: 20, outdoorXpPct: 20, lionFlatGold: 18 },
};

export const PET_STORE_PRICES: Partial<Record<Rarity, number>> = {
  scrap: 120,
  forged: 280,
  enchanted: 900,
};

export const PET_DUPLICATE_COINS: Record<Rarity, number> = {
  scrap: 12,
  forged: 28,
  enchanted: 60,
  mythic: 130,
  relic: 280,
};

export const PET_DUPLICATE_XP: Record<Rarity, number> = {
  scrap: 15,
  forged: 35,
  enchanted: 70,
  mythic: 140,
  relic: 280,
};

/** Chance a chest drop is a pet (when unlocked). */
export const PET_CHEST_CHANCE = 0.22;

function makePet(species: PetSpecies, rarity: Rarity): PetDef {
  const base = BASE_BY_RARITY[rarity];
  const trait = TRAIT_BY_RARITY[rarity];
  let xpBonusPct = base.xpBonusPct;
  let coinBonus = base.coinBonus;

  if (species === "dragon") {
    xpBonusPct += DRAGON_EXTRA_XP[rarity];
  }
  if (species === "lion") {
    coinBonus += trait.lionFlatGold;
  }

  return {
    id: `pet-${species}-${rarity}`,
    species,
    name: PET_SPECIES_LABELS[species],
    rarity,
    xpBonusPct,
    coinBonus,
    hue: PET_SPECIES_HUE[species],
    traitLabel: PET_TRAIT_LABELS[species],
    storePrice: PET_STORE_PRICES[rarity],
  };
}

export const ALL_PETS: PetDef[] = PET_SPECIES.flatMap((species) =>
  RARITY_ORDER.map((rarity) => makePet(species, rarity)),
);

export const PET_BY_ID: Record<string, PetDef> = Object.fromEntries(
  ALL_PETS.map((p) => [p.id, p]),
);

/** Store: scrap, forged, and expensive enchanted — no mythic/relic. */
export const STORE_PETS = ALL_PETS.filter(
  (p) =>
    p.storePrice != null &&
    (p.rarity === "scrap" ||
      p.rarity === "forged" ||
      p.rarity === "enchanted"),
);

/** ~40% of days have no companion offers. */
const STORE_PET_APPEAR_CHANCE = 0.6;

function hashSeed(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number): () => number {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Daily rotating companion shelf. Some days empty; otherwise 1–2 offers.
 * Deterministic for a given date so the shelf stays stable all day.
 */
export function getDailyStorePets(dateKey: string): PetDef[] {
  const rand = mulberry32(hashSeed(`pets-store-${dateKey}`));
  if (rand() >= STORE_PET_APPEAR_CHANCE) return [];

  const pool = [...STORE_PETS];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    const tmp = pool[i]!;
    pool[i] = pool[j]!;
    pool[j] = tmp;
  }

  const count = rand() < 0.55 ? 1 : 2;
  return pool.slice(0, count);
}

export function computePetQuestExtras(
  pet: PetDef | null | undefined,
  category: QuestCategory | undefined,
): { xpPct: number; coins: number } {
  if (!pet) return { xpPct: 0, coins: 0 };
  const trait = TRAIT_BY_RARITY[pet.rarity];
  let xpPct = 0;
  let coins = 0;
  if (pet.species === "lizard" && category === "Cleaning") {
    coins += trait.cleaningCoins;
  }
  if (pet.species === "wolf" && category === "Outdoor") {
    xpPct += trait.outdoorXpPct;
  }
  return { xpPct, coins };
}
