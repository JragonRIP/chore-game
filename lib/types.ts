export type Rarity = "scrap" | "forged" | "enchanted" | "mythic" | "relic";
export type Slot = "helmet" | "chestplate" | "leggings" | "boots" | "weapon";
export type QuestCategory =
  | "Bedroom"
  | "Pets"
  | "School Prep"
  | "Kitchen"
  | "Laundry"
  | "Cleaning"
  | "Outdoor";
export type Difficulty = "quick" | "epic";
export type TabId = "quest" | "vault" | "armory" | "pets" | "store";
export type AvatarId =
  | "knight"
  | "wizard"
  | "archer"
  | "dragon-rider"
  | "berserker";
export type ChestType = "normal" | "legendary" | "crystal";
export type PetSpecies = "lizard" | "wolf" | "lion" | "dragon";
export type FamiliarId = "maple" | "caliper";
/** 1 = baby, 2 = adult, 3 = battle form */
export type PetStage = 1 | 2 | 3;
export type XpBottleId = "xp-sip" | "xp-flask";
export type PetTreatId = "treat-nibble" | "treat-feast";
export type AchievementId =
  | "first-quest"
  | "quests-10"
  | "quests-50"
  | "quests-100"
  | "streak-3"
  | "streak-7"
  | "streak-14"
  | "first-chest"
  | "chests-10"
  | "first-gear"
  | "full-set"
  | "first-relic"
  | "first-pet"
  | "pet-level-5"
  | "pet-level-10"
  | "pet-evolve-adult"
  | "pet-evolve-battle"
  | "pets-all-species"
  | "familiar-maple"
  | "familiar-caliper"
  | "salvage-1"
  | "level-5"
  | "level-10"
  | "gold-500"
  | "store-buy"
  | "gift-friend"
  | "evo-stone-buy";

export type QuestId = string;
export type GearId = string;
export type PetId = string;

export interface Quest {
  id: QuestId;
  name: string;
  category: QuestCategory;
  difficulty: Difficulty;
  minutes: number;
  xp: number;
  coins: number;
  goal: string;
  icon: string;
  /** How many times this quest can be completed per day. Default 1. */
  maxPerDay?: number;
  /** Hours to wait between completions. */
  cooldownHours?: number;
}

export interface GearDef {
  id: GearId;
  name: string;
  slot: Slot;
  setId: string | null;
  rarity: Rarity;
  xpBonusPct: number;
  coinBonus: number;
  hue: number;
  storePrice?: number;
}

export interface GearSetDef {
  id: string;
  name: string;
  bonusXpPct: number;
  bonusCoins: number;
  hue: number;
}

export interface PetDef {
  id: PetId;
  species: PetSpecies;
  name: string;
  rarity: Rarity;
  xpBonusPct: number;
  coinBonus: number;
  hue: number;
  traitLabel: string;
  storePrice?: number;
}

export interface PetProgress {
  level: number;
  xp: number;
  /** 1 baby → 2 adult → 3 battle. Defaults to 1. */
  stage: PetStage;
}

export interface QuestOverride {
  name?: string;
  xp?: number;
  coins?: number;
  disabled?: boolean;
}

export interface EquippedMap {
  helmet: GearId | null;
  chestplate: GearId | null;
  leggings: GearId | null;
  boots: GearId | null;
  weapon: GearId | null;
}

export interface HeroProfile {
  name: string;
  avatar: AvatarId;
}

export type ChestDrop =
  | { kind: "gear"; gearId: GearId }
  | { kind: "duplicate"; gearId: GearId; coinsAwarded: number }
  | { kind: "pet"; petId: PetId }
  | {
      kind: "pet-duplicate";
      petId: PetId;
      coinsAwarded: number;
      xpAwarded: number;
    }
  | { kind: "evo-stone" };

export type LootEvent = ChestDrop & { bonusCoins: number };

export interface ActiveQuest {
  questId: QuestId;
  startedAt: number;
}

export interface VaultChest {
  id: string;
  type: ChestType;
  reason: string;
  earnedAt: number;
}

export interface XpBottleDef {
  id: XpBottleId;
  name: string;
  xp: number;
  price: number;
  hue: number;
}

export interface PetTreatDef {
  id: PetTreatId;
  name: string;
  xp: number;
  price: number;
  hue: number;
}

export interface ActiveDungeon {
  /** Three quests that count as dungeon rooms. */
  questIds: QuestId[];
  /** Rooms already cleared. */
  clearedIds: QuestId[];
}

export interface GameState {
  version: 4;
  hasSeenStory: boolean;
  hero: HeroProfile | null;
  level: number;
  xp: number;
  gold: number;
  ownedGear: GearId[];
  equipped: EquippedMap;
  ownedPets: PetId[];
  equippedPet: PetId | null;
  petsUnlocked: boolean;
  /** Per owned pet level/xp. Missing entries default to level 1. */
  petProgress: Record<string, PetProgress>;
  /** Optional nicknames for owned pets. */
  petNames: Record<string, string>;
  /** Shown the familiar-friend popup once per nickname (Maple, Caliper). */
  familiarRevealSeen: Record<FamiliarId, boolean>;
  /** First-time evolve tutorials at pet Lv 5 and Lv 10. */
  evolveHintSeen: { adult: boolean; battle: boolean };
  /** Parent edits to catalog quests. */
  questOverrides: Record<string, QuestOverride>;
  activeQuests: ActiveQuest[];
  completedToday: QuestId[];
  /** Last completion timestamp per quest (for cooldowns). */
  questLastCompleted: Record<string, number>;
  completedDate: string;
  lootLog: GearId[];
  vaultChests: VaultChest[];
  freeChestDate: string | null;
  /** Owned XP bottles waiting to be used in the Vault. */
  xpBottles: Record<XpBottleId, number>;
  /** Owned pet treats waiting to be fed on the Pets tab. */
  petTreats: Record<PetTreatId, number>;
  /** Evolution stones for pet stage-ups. */
  evolutionStones: number;
  /** Calendar day an Evolution Stone was last bought from the store. */
  evoStoneBuyDate: string | null;
  /** Quests completed in the current weekly leaderboard window. */
  weeklyQuests: number;
  /** Monday date key (YYYY-MM-DD) for weeklyQuests. */
  weeklyQuestWeek: string | null;
  /** Calendar day a dungeon was started (1/day). */
  dungeonDate: string | null;
  /** Active daily dungeon run, if any. */
  activeDungeon: ActiveDungeon | null;
  /** Encounter chance after a real quest (0–100). Default 25. */
  encounterChancePct: number;
  /** Last time the app was active (for offline idle). */
  lastActiveAt: number;
  /** Unclaimed gold/XP earned while away. */
  idleClaim: { gold: number; xp: number } | null;
  /** Consecutive days with at least one completed quest. */
  streakDays: number;
  /** Calendar day the streak last incremented. */
  streakDate: string | null;
  streakBest: number;
  questsCompleted: number;
  chestsOpened: number;
  salvageCount: number;
  storePurchases: number;
  giftsSent: number;
  /** Highest gold ever held (for achievements). */
  goldPeak: number;
  claimedAchievements: AchievementId[];
}

export type ScreenPhase = "story" | "create" | "play";
