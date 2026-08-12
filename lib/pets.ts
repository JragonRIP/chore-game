import type {
  PetDef,
  PetProgress,
  PetSpecies,
  QuestCategory,
  PetId,
  Rarity,
} from "./types";
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

/** Chance a chest drop is a pet (when unlocked). Keep uncommon — gear is the default. */
export const PET_CHEST_CHANCE_NORMAL = 0.06;
export const PET_CHEST_CHANCE_LEGENDARY = 0.1;

/** @deprecated use per-chest chances */
export const PET_CHEST_CHANCE = PET_CHEST_CHANCE_NORMAL;

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
  petLevel = 1,
): { xpPct: number; coins: number } {
  if (!pet) return { xpPct: 0, coins: 0 };
  const trait = TRAIT_BY_RARITY[pet.rarity];
  const mult = petLevelMultiplier(petLevel);
  let xpPct = 0;
  let coins = 0;
  if (pet.species === "lizard" && category === "Cleaning") {
    coins += Math.round(trait.cleaningCoins * mult);
  }
  if (pet.species === "wolf" && category === "Outdoor") {
    xpPct += Math.round(trait.outdoorXpPct * mult);
  }
  return { xpPct, coins };
}

export const MAX_PET_LEVEL = 10;

/** XP needed to go from `level` → `level + 1`. */
export function petXpToNextLevel(level: number): number {
  if (level >= MAX_PET_LEVEL) return Infinity;
  return 20 + (level - 1) * 20; // 20, 40, 60 … 200
}

/** Bonus multiplier from pet level (level 1 = 1.0, +8% per level). */
export function petLevelMultiplier(level: number): number {
  const lv = Math.max(1, Math.min(MAX_PET_LEVEL, Math.floor(level) || 1));
  return 1 + (lv - 1) * 0.08;
}

export function defaultPetProgress(): PetProgress {
  return { level: 1, xp: 0 };
}

export function getPetProgress(
  progress: Record<string, PetProgress> | undefined,
  petId: PetId,
): PetProgress {
  const p = progress?.[petId];
  if (!p) return defaultPetProgress();
  return {
    level: Math.max(1, Math.min(MAX_PET_LEVEL, Math.floor(p.level) || 1)),
    xp: Math.max(0, Math.floor(p.xp) || 0),
  };
}

/** Whether this quest can grant XP to the equipped pet species. */
export function petGainsXpFromQuest(
  species: PetSpecies,
  category: QuestCategory,
): boolean {
  if (species === "lizard") return category === "Cleaning";
  if (species === "wolf") return category === "Outdoor";
  // Lion & dragon: Pets chores only
  return category === "Pets";
}

export function applyPetXpGain(
  progress: PetProgress,
  xpGain: number,
): { progress: PetProgress; levelsGained: number[]; xpGained: number } {
  const gain = Math.max(0, Math.floor(xpGain));
  if (gain <= 0 || progress.level >= MAX_PET_LEVEL) {
    return { progress, levelsGained: [], xpGained: 0 };
  }

  let level = progress.level;
  let xp = progress.xp + gain;
  const levelsGained: number[] = [];

  while (level < MAX_PET_LEVEL && xp >= petXpToNextLevel(level)) {
    xp -= petXpToNextLevel(level);
    level += 1;
    levelsGained.push(level);
  }

  if (level >= MAX_PET_LEVEL) {
    level = MAX_PET_LEVEL;
    xp = 0;
  }

  return {
    progress: { level, xp },
    levelsGained,
    xpGained: gain,
  };
}

export function isMapleName(name: string | null | undefined): boolean {
  return (name ?? "").trim().toLowerCase() === "maple";
}

export function displayPetName(
  catalogName: string,
  nickname?: string | null,
): string {
  const n = nickname?.trim();
  return n ? n : catalogName;
}

export function normalizePetNames(
  raw: unknown,
  ownedPets: PetId[],
): Record<string, string> {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  const rec = raw as Record<string, unknown>;
  const next: Record<string, string> = {};
  for (const id of ownedPets) {
    const n = rec[id];
    if (typeof n === "string" && n.trim()) {
      next[id] = n.trim().slice(0, 16);
    }
  }
  return next;
}
