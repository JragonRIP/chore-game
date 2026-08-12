import {
  ALL_GEAR,
  DUPLICATE_COINS,
  GEAR_BY_ID,
  GEAR_SETS,
  RARITY_ORDER,
} from "./gear";
import {
  ALL_PETS,
  PET_BY_ID,
  PET_CHEST_CHANCE_LEGENDARY,
  PET_CHEST_CHANCE_NORMAL,
  PET_DUPLICATE_COINS,
  PET_DUPLICATE_XP,
  applyPetXpGain,
  computePetQuestExtras,
  emptyFamiliarRevealSeen,
  getPetProgress,
  normalizePetNames,
  petGainsXpFromQuest,
  petLevelMultiplier,
  petStageMultiplier,
  EVO_STONE_CHANCE_LEGENDARY,
  EVO_STONE_CHANCE_NORMAL,
} from "./pets";
import type {
  ActiveQuest,
  EquippedMap,
  GameState,
  GearDef,
  GearId,
  ChestDrop,
  LootEvent,
  PetDef,
  PetId,
  PetProgress,
  QuestCategory,
  QuestId,
  QuestOverride,
  PetTreatId,
  Rarity,
  VaultChest,
  XpBottleId,
  AchievementId,
} from "./types";

export function todayKey(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function xpToNextLevel(level: number): number {
  const curve = [100, 120, 150, 180, 220, 270, 330, 400, 480, 570];
  if (level <= curve.length) return curve[level - 1]!;
  const extra = level - curve.length;
  return Math.round(570 + extra * 100 + extra * extra * 8);
}

export function isLegendaryLevel(level: number): boolean {
  return level > 0 && level % 5 === 0;
}

export function emptyXpBottles(): Record<XpBottleId, number> {
  return { "xp-sip": 0, "xp-flask": 0 };
}

function normalizeXpBottles(raw: unknown): Record<XpBottleId, number> {
  const next = emptyXpBottles();
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return next;
  const rec = raw as Record<string, unknown>;
  for (const id of Object.keys(next) as XpBottleId[]) {
    const n = rec[id];
    next[id] = typeof n === "number" && n > 0 ? Math.floor(n) : 0;
  }
  return next;
}

export function emptyPetTreats(): Record<PetTreatId, number> {
  return { "treat-nibble": 0, "treat-feast": 0 };
}

function normalizePetTreats(raw: unknown): Record<PetTreatId, number> {
  const next = emptyPetTreats();
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return next;
  const rec = raw as Record<string, unknown>;
  for (const id of Object.keys(next) as PetTreatId[]) {
    const n = rec[id];
    next[id] = typeof n === "number" && n > 0 ? Math.floor(n) : 0;
  }
  return next;
}

function asCount(n: unknown): number {
  return typeof n === "number" && n > 0 ? Math.floor(n) : 0;
}

export function emptyEquipped(): EquippedMap {
  return {
    helmet: null,
    chestplate: null,
    leggings: null,
    boots: null,
    weapon: null,
  };
}

export function makeChestId(): string {
  return `chest-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function createInitialState(): GameState {
  return {
    version: 4,
    hasSeenStory: false,
    hero: null,
    level: 1,
    xp: 0,
    gold: 0,
    ownedGear: [],
    equipped: emptyEquipped(),
    ownedPets: [],
    equippedPet: null,
    petsUnlocked: false,
    petProgress: {},
    petNames: {},
    familiarRevealSeen: emptyFamiliarRevealSeen(),
    questOverrides: {},
    activeQuests: [],
    completedToday: [],
    questLastCompleted: {},
    completedDate: todayKey(),
    lootLog: [],
    vaultChests: [],
    freeChestDate: null,
    xpBottles: emptyXpBottles(),
    petTreats: emptyPetTreats(),
    evolutionStones: 0,
    streakDays: 0,
    streakDate: null,
    streakBest: 0,
    questsCompleted: 0,
    chestsOpened: 0,
    salvageCount: 0,
    storePurchases: 0,
    giftsSent: 0,
    goldPeak: 0,
    claimedAchievements: [],
  };
}

/** Migrate older saves and roll daily resets. */
export function normalizeState(raw: unknown): GameState {
  const base = createInitialState();
  if (!raw || typeof raw !== "object") return base;
  const r = raw as Record<string, unknown>;

  const activeQuests: ActiveQuest[] = Array.isArray(r.activeQuests)
    ? (r.activeQuests as ActiveQuest[])
    : Array.isArray(r.activeQuestIds)
      ? (r.activeQuestIds as string[]).map((questId) => ({
          questId,
          startedAt: Date.now() - 60_000,
        }))
      : [];

  const ownedPets = Array.isArray(r.ownedPets)
    ? (r.ownedPets as string[]).filter((id) => PET_BY_ID[id])
    : [];
  const equippedPetRaw =
    typeof r.equippedPet === "string" ? r.equippedPet : null;
  const equippedPet =
    equippedPetRaw && ownedPets.includes(equippedPetRaw)
      ? equippedPetRaw
      : null;

  const rawProgress =
    r.petProgress &&
    typeof r.petProgress === "object" &&
    !Array.isArray(r.petProgress)
      ? (r.petProgress as Record<string, PetProgress>)
      : {};
  const petProgress: Record<string, PetProgress> = {};
  for (const id of ownedPets) {
    petProgress[id] = getPetProgress(rawProgress, id);
  }

  const questOverrides =
    r.questOverrides &&
    typeof r.questOverrides === "object" &&
    !Array.isArray(r.questOverrides)
      ? (r.questOverrides as Record<string, QuestOverride>)
      : {};

  let next: GameState = {
    ...base,
    hasSeenStory: Boolean(r.hasSeenStory),
    hero: (r.hero as GameState["hero"]) ?? null,
    level: typeof r.level === "number" ? r.level : 1,
    xp: typeof r.xp === "number" ? r.xp : 0,
    gold: typeof r.gold === "number" ? r.gold : 0,
    ownedGear: Array.isArray(r.ownedGear) ? (r.ownedGear as string[]) : [],
    equipped: {
      ...emptyEquipped(),
      ...((r.equipped as EquippedMap) ?? {}),
    },
    ownedPets,
    equippedPet,
    petsUnlocked: Boolean(r.petsUnlocked) || ownedPets.length > 0,
    petProgress,
    petNames: normalizePetNames(r.petNames, ownedPets),
    familiarRevealSeen: {
      maple:
        Boolean(r.mapleRevealSeen) ||
        Boolean(
          r.familiarRevealSeen &&
            typeof r.familiarRevealSeen === "object" &&
            (r.familiarRevealSeen as Record<string, unknown>).maple,
        ),
      caliper: Boolean(
        r.familiarRevealSeen &&
          typeof r.familiarRevealSeen === "object" &&
          (r.familiarRevealSeen as Record<string, unknown>).caliper,
      ),
    },
    questOverrides,
    activeQuests,
    completedToday: Array.isArray(r.completedToday)
      ? (r.completedToday as string[])
      : [],
    questLastCompleted:
      r.questLastCompleted &&
      typeof r.questLastCompleted === "object" &&
      !Array.isArray(r.questLastCompleted)
        ? (r.questLastCompleted as Record<string, number>)
        : {},
    completedDate:
      typeof r.completedDate === "string" ? r.completedDate : todayKey(),
    lootLog: Array.isArray(r.lootLog) ? (r.lootLog as string[]) : [],
    vaultChests: Array.isArray(r.vaultChests)
      ? (r.vaultChests as VaultChest[])
      : [],
    freeChestDate:
      typeof r.freeChestDate === "string" || r.freeChestDate === null
        ? (r.freeChestDate as string | null)
        : null,
    xpBottles: normalizeXpBottles(r.xpBottles),
    petTreats: normalizePetTreats(r.petTreats),
    evolutionStones:
      typeof r.evolutionStones === "number" && r.evolutionStones > 0
        ? Math.floor(r.evolutionStones)
        : 0,
    streakDays: asCount(r.streakDays),
    streakDate: typeof r.streakDate === "string" ? r.streakDate : null,
    streakBest: asCount(r.streakBest),
    questsCompleted: asCount(r.questsCompleted),
    chestsOpened: asCount(r.chestsOpened),
    salvageCount: asCount(r.salvageCount),
    storePurchases: asCount(r.storePurchases),
    giftsSent: asCount(r.giftsSent),
    goldPeak: Math.max(asCount(r.goldPeak), typeof r.gold === "number" ? r.gold : 0),
    claimedAchievements: Array.isArray(r.claimedAchievements)
      ? (r.claimedAchievements as string[]).filter(
          (id): id is AchievementId => typeof id === "string",
        )
      : [],
  };

  const today = todayKey();
  if (next.completedDate !== today) {
    next = {
      ...next,
      completedToday: [],
      completedDate: today,
      activeQuests: [],
    };
  }

  return next;
}

export function getEquippedGear(state: GameState): GearDef[] {
  return (Object.values(state.equipped) as Array<GearId | null>)
    .filter((id): id is GearId => Boolean(id))
    .map((id) => GEAR_BY_ID[id])
    .filter(Boolean);
}

export function getEquippedPet(state: GameState): PetDef | null {
  if (!state.equippedPet) return null;
  return PET_BY_ID[state.equippedPet] ?? null;
}

export function computeBonuses(
  state: GameState,
  questCategory?: QuestCategory,
): {
  xpPct: number;
  coins: number;
  activeSetId: string | null;
} {
  const pieces = getEquippedGear(state);
  let xpPct = pieces.reduce((sum, g) => sum + g.xpBonusPct, 0);
  let coins = pieces.reduce((sum, g) => sum + g.coinBonus, 0);

  let activeSetId: string | null = null;
  for (const set of GEAR_SETS) {
    const ids = ALL_GEAR.filter((g) => g.setId === set.id).map((g) => g.id);
    const complete = ids.every((id) =>
      (Object.values(state.equipped) as Array<GearId | null>).includes(id),
    );
    if (complete) {
      activeSetId = set.id;
      xpPct += set.bonusXpPct;
      coins += set.bonusCoins;
      break;
    }
  }

  const pet = getEquippedPet(state);
  if (pet) {
    const progress = getPetProgress(state.petProgress, pet.id);
    const mult =
      petLevelMultiplier(progress.level) * petStageMultiplier(progress.stage);
    xpPct += Math.round(pet.xpBonusPct * mult);
    coins += Math.round(pet.coinBonus * mult);
    const extras = computePetQuestExtras(
      pet,
      questCategory,
      progress.level,
      progress.stage,
    );
    xpPct += extras.xpPct;
    coins += extras.coins;
  }

  return { xpPct, coins, activeSetId };
}

export function questRemainingMs(
  active: ActiveQuest,
  minutes: number,
  now = Date.now(),
): number {
  const total = minutes * 60 * 1000;
  const elapsed = now - active.startedAt;
  return Math.max(0, total - elapsed);
}

export function canCompleteQuest(
  active: ActiveQuest | undefined,
  minutes: number,
  now = Date.now(),
): boolean {
  if (!active) return false;
  return questRemainingMs(active, minutes, now) <= 0;
}

export function applyQuestRewards(
  state: GameState,
  baseXp: number,
  baseCoins: number,
  questCategory?: QuestCategory,
): {
  state: GameState;
  gainedXp: number;
  gainedCoins: number;
  levelsGained: number[];
  chests: VaultChest[];
  petXpGained: number;
  petLevelsGained: number[];
} {
  const bonuses = computeBonuses(state, questCategory);
  const gainedXp = Math.max(
    1,
    Math.round(baseXp * (1 + bonuses.xpPct / 100)),
  );
  const gainedCoins = Math.max(0, baseCoins + bonuses.coins);

  let level = state.level;
  let xp = state.xp + gainedXp;
  const gold = state.gold + gainedCoins;
  const levelsGained: number[] = [];
  const chests: VaultChest[] = [];

  while (xp >= xpToNextLevel(level)) {
    xp -= xpToNextLevel(level);
    level += 1;
    levelsGained.push(level);
    const legendary = isLegendaryLevel(level);
    chests.push({
      id: makeChestId(),
      type: legendary ? "legendary" : "normal",
      reason: legendary
        ? `Level ${level} Golden Chest`
        : `Level ${level} Wooden Chest`,
      earnedAt: Date.now(),
    });
  }

  let petProgress = { ...state.petProgress };
  let petXpGained = 0;
  let petLevelsGained: number[] = [];

  const pet = getEquippedPet(state);
  if (
    pet &&
    questCategory &&
    petGainsXpFromQuest(pet.species, questCategory)
  ) {
    const current = getPetProgress(petProgress, pet.id);
    const petXp = Math.max(1, Math.round(gainedXp * 0.5));
    const applied = applyPetXpGain(current, petXp);
    petProgress = { ...petProgress, [pet.id]: applied.progress };
    petXpGained = applied.xpGained;
    petLevelsGained = applied.levelsGained;
  }

  return {
    state: {
      ...state,
      level,
      xp,
      gold,
      petProgress,
      goldPeak: Math.max(state.goldPeak, gold),
    },
    gainedXp,
    gainedCoins,
    levelsGained,
    chests,
    petXpGained,
    petLevelsGained,
  };
}

/** Parent / admin grant: exact XP and gold, no gear multipliers. */
export function applyFlatRewards(
  state: GameState,
  xpAdd: number,
  goldAdd: number,
): {
  level: number;
  xp: number;
  gold: number;
  goldPeak: number;
  chests: VaultChest[];
  levelsGained: number[];
} {
  const gainedXp = Math.max(0, Math.floor(xpAdd));
  const gainedCoins = Math.max(0, Math.floor(goldAdd));

  let level = state.level;
  let xp = state.xp + gainedXp;
  const gold = state.gold + gainedCoins;
  const levelsGained: number[] = [];
  const chests: VaultChest[] = [];

  while (xp >= xpToNextLevel(level)) {
    xp -= xpToNextLevel(level);
    level += 1;
    levelsGained.push(level);
    const legendary = isLegendaryLevel(level);
    chests.push({
      id: makeChestId(),
      type: legendary ? "legendary" : "normal",
      reason: legendary
        ? `Level ${level} Golden Chest`
        : `Level ${level} Wooden Chest`,
      earnedAt: Date.now(),
    });
  }

  return {
    level,
    xp,
    gold,
    goldPeak: Math.max(state.goldPeak, gold),
    chests,
    levelsGained,
  };
}

function pickWeighted<T extends { weight: number }>(items: T[]): T {
  const total = items.reduce((s, i) => s + i.weight, 0);
  let roll = Math.random() * total;
  for (const item of items) {
    roll -= item.weight;
    if (roll <= 0) return item;
  }
  return items[items.length - 1]!;
}

function rarityPool(chest: "normal" | "legendary"): Rarity {
  if (chest === "normal") {
    return pickWeighted([
      { rarity: "scrap" as const, weight: 45 },
      { rarity: "forged" as const, weight: 35 },
      { rarity: "enchanted" as const, weight: 18 },
      { rarity: "mythic" as const, weight: 2 },
    ]).rarity;
  }
  return pickWeighted([
    { rarity: "forged" as const, weight: 10 },
    { rarity: "enchanted" as const, weight: 40 },
    { rarity: "mythic" as const, weight: 47 },
    { rarity: "relic" as const, weight: 3 },
  ]).rarity;
}

export function chestBonusCoins(
  chest: "normal" | "legendary",
  rarity: Rarity,
): number {
  const base = chest === "legendary" ? 50 : 15;
  if (rarity === "relic") return base + 20;
  if (rarity === "mythic") return base + 10;
  return base;
}

function rollGearLoot(owned: GearId[], rarity: Rarity): ChestDrop {
  const candidates = ALL_GEAR.filter((g) => g.rarity === rarity);
  const pool = candidates.length
    ? candidates
    : ALL_GEAR.filter((g) => g.rarity === "forged");
  const gear = pool[Math.floor(Math.random() * pool.length)]!;

  if (owned.includes(gear.id)) {
    return {
      kind: "duplicate",
      gearId: gear.id,
      coinsAwarded: DUPLICATE_COINS[gear.rarity],
    };
  }
  return { kind: "gear", gearId: gear.id };
}

function rollPetLoot(ownedPets: PetId[], rarity: Rarity): ChestDrop {
  const candidates = ALL_PETS.filter((p) => p.rarity === rarity);
  const pool = candidates.length
    ? candidates
    : ALL_PETS.filter((p) => p.rarity === "forged");
  const pet = pool[Math.floor(Math.random() * pool.length)]!;

  if (ownedPets.includes(pet.id)) {
    return {
      kind: "pet-duplicate",
      petId: pet.id,
      coinsAwarded: PET_DUPLICATE_COINS[pet.rarity],
      xpAwarded: PET_DUPLICATE_XP[pet.rarity],
    };
  }
  return { kind: "pet", petId: pet.id };
}

function dropRarity(drop: ChestDrop): Rarity {
  if (drop.kind === "evo-stone") return "enchanted";
  if (drop.kind === "gear" || drop.kind === "duplicate") {
    return GEAR_BY_ID[drop.gearId]?.rarity ?? "forged";
  }
  return PET_BY_ID[drop.petId]?.rarity ?? "forged";
}

export function rollChestLoot(
  ownedGear: GearId[],
  chest: "normal" | "legendary",
  opts?: { petsUnlocked?: boolean; ownedPets?: PetId[] },
): LootEvent {
  const stoneChance =
    chest === "legendary"
      ? EVO_STONE_CHANCE_LEGENDARY
      : EVO_STONE_CHANCE_NORMAL;

  // Rare replacement drop — Evolution Stone instead of gear/pet.
  if (Math.random() < stoneChance) {
    return {
      kind: "evo-stone",
      bonusCoins: chestBonusCoins(chest, "enchanted"),
    };
  }

  const rarity = rarityPool(chest);
  const petsUnlocked = Boolean(opts?.petsUnlocked);
  const ownedPets = opts?.ownedPets ?? [];
  const petChance =
    chest === "legendary"
      ? PET_CHEST_CHANCE_LEGENDARY
      : PET_CHEST_CHANCE_NORMAL;

  // Gear is the default. Pets are an uncommon bonus roll only.
  const drop =
    petsUnlocked && Math.random() < petChance
      ? rollPetLoot(ownedPets, rarity)
      : rollGearLoot(ownedGear, rarity);
  return {
    ...drop,
    bonusCoins: chestBonusCoins(chest, dropRarity(drop)),
  } as LootEvent;
}

export function rarityRank(r: Rarity): number {
  return RARITY_ORDER.indexOf(r);
}

export function formatCountdown(ms: number): string {
  const totalSec = Math.ceil(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function formatLongCountdown(ms: number): string {
  const totalMin = Math.ceil(ms / 60_000);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  if (h <= 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

export function questMaxPerDay(quest: { maxPerDay?: number }): number {
  return quest.maxPerDay ?? 1;
}

export function questCompletionsToday(
  state: GameState,
  questId: QuestId,
): number {
  return state.completedToday.filter((id) => id === questId).length;
}

export function questCooldownRemainingMs(
  state: GameState,
  quest: { id: QuestId; cooldownHours?: number },
  now = Date.now(),
): number {
  if (!quest.cooldownHours) return 0;
  const last = state.questLastCompleted[quest.id];
  if (!last) return 0;
  return Math.max(0, last + quest.cooldownHours * 3_600_000 - now);
}

export function isQuestFullyDoneToday(
  state: GameState,
  quest: { id: QuestId; maxPerDay?: number },
): boolean {
  return questCompletionsToday(state, quest.id) >= questMaxPerDay(quest);
}

export function canStartQuest(
  state: GameState,
  quest: { id: QuestId; maxPerDay?: number; cooldownHours?: number },
  now = Date.now(),
): boolean {
  if (state.activeQuests.some((q) => q.questId === quest.id)) return false;
  if (isQuestFullyDoneToday(state, quest)) return false;
  if (questCooldownRemainingMs(state, quest, now) > 0) return false;
  return true;
}
