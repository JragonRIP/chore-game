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
export type ChestType = "normal" | "legendary";
export type PetSpecies = "lizard" | "wolf" | "lion" | "dragon";

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

export type LootEvent =
  | { kind: "gear"; gearId: GearId }
  | { kind: "duplicate"; gearId: GearId; coinsAwarded: number }
  | { kind: "pet"; petId: PetId }
  | {
      kind: "pet-duplicate";
      petId: PetId;
      coinsAwarded: number;
      xpAwarded: number;
    };

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

export interface GameState {
  version: 3;
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
  activeQuests: ActiveQuest[];
  completedToday: QuestId[];
  /** Last completion timestamp per quest (for cooldowns). */
  questLastCompleted: Record<string, number>;
  completedDate: string;
  lootLog: GearId[];
  vaultChests: VaultChest[];
  freeChestDate: string | null;
}

export type ScreenPhase = "story" | "create" | "play";
