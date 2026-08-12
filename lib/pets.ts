import type {
  FamiliarId,
  PetDef,
  PetProgress,
  PetSpecies,
  PetStage,
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

export const PET_STAGE_LABELS: Record<PetSpecies, Record<PetStage, string>> = {
  lizard: { 1: "Baby Lizard", 2: "Lizard", 3: "Battle Lizard" },
  wolf: { 1: "Wolf Pup", 2: "Wolf", 3: "Battle Wolf" },
  lion: { 1: "Lion Cub", 2: "Lion", 3: "Battle Lion" },
  dragon: { 1: "Dragon Hatchling", 2: "Dragon", 3: "Battle Dragon" },
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

/** Level required to evolve into the next stage. */
export const EVOLVE_LEVEL: Record<1 | 2, number> = {
  1: 5,
  2: 10,
};

/** Chance an Evolution Stone replaces other chest loot. */
export const EVO_STONE_CHANCE_NORMAL = 0.02;
export const EVO_STONE_CHANCE_LEGENDARY = 0.09;

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

function shuffleWith<T>(items: T[], rand: () => number): T[] {
  const pool = [...items];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    const tmp = pool[i]!;
    pool[i] = pool[j]!;
    pool[j] = tmp;
  }
  return pool;
}

/**
 * Daily rotating companion shelf — always at least one new visitor.
 * Deterministic for a given date so the shelf stays stable all day.
 */
export function getDailyStorePets(dateKey: string): PetDef[] {
  const rand = mulberry32(hashSeed(`pets-store-v2-${dateKey}`));
  const pool = shuffleWith(STORE_PETS, rand);
  const count = rand() < 0.4 ? 2 : 1;
  return pool.slice(0, Math.min(count, pool.length));
}

export function computePetQuestExtras(
  pet: PetDef | null | undefined,
  category: QuestCategory | undefined,
  petLevel = 1,
  petStage: PetStage = 1,
): { xpPct: number; coins: number } {
  if (!pet) return { xpPct: 0, coins: 0 };
  const trait = TRAIT_BY_RARITY[pet.rarity];
  const mult = petLevelMultiplier(petLevel) * petStageMultiplier(petStage);
  let xpPct = 0;
  let coins = 0;
  if (pet.species === "lizard" && category === "Cleaning") {
    coins += Math.round(trait.cleaningCoins * mult);
  }
  if (pet.species === "wolf" && category === "Outdoor") {
    xpPct += Math.round(trait.outdoorXpPct * mult);
  }
  // Battle form: small always-on trait bump
  if (petStage >= 3) {
    xpPct += Math.round(2 * mult);
    coins += Math.round(1 * mult);
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

/** Bonus multiplier from evolution stage. */
export function petStageMultiplier(stage: PetStage): number {
  if (stage >= 3) return 1.85;
  if (stage >= 2) return 1.35;
  return 1;
}

export function clampPetStage(raw: unknown): PetStage {
  const n = typeof raw === "number" ? Math.floor(raw) : 1;
  if (n >= 3) return 3;
  if (n >= 2) return 2;
  return 1;
}

export function defaultPetProgress(): PetProgress {
  return { level: 1, xp: 0, stage: 1 };
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
    stage: clampPetStage(p.stage),
  };
}

export function canEvolvePet(
  progress: PetProgress,
  evolutionStones: number,
): boolean {
  if (progress.stage >= 3) return false;
  if (evolutionStones < 1) return false;
  const need = EVOLVE_LEVEL[progress.stage as 1 | 2];
  return progress.level >= need;
}

export function nextPetStage(stage: PetStage): PetStage | null {
  if (stage >= 3) return null;
  return (stage + 1) as PetStage;
}

/**
 * Equipped pets always earn XP from chores.
 * Category still matters for trait bonuses (see computePetQuestExtras).
 */
export function petGainsXpFromQuest(
  _species: PetSpecies,
  _category: QuestCategory,
): boolean {
  return true;
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
    progress: { level, xp, stage: progress.stage },
    levelsGained,
    xpGained: gain,
  };
}

export const FAMILIAR_LABELS: Record<FamiliarId, string> = {
  maple: "Maple",
  caliper: "Caliper",
};

export function emptyFamiliarRevealSeen(): Record<FamiliarId, boolean> {
  return { maple: false, caliper: false };
}

export function familiarFromName(
  name: string | null | undefined,
): FamiliarId | null {
  const n = (name ?? "").trim().toLowerCase();
  if (n === "maple") return "maple";
  if (n === "caliper") return "caliper";
  return null;
}

export function displayPetName(
  catalogName: string,
  nickname?: string | null,
): string {
  const n = nickname?.trim();
  return n ? n : catalogName;
}

export function petDisplayCatalogName(
  species: PetSpecies,
  stage: PetStage = 1,
): string {
  return PET_STAGE_LABELS[species][stage];
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
