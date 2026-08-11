export type Rarity = "scrap" | "forged" | "enchanted" | "mythic" | "relic";
export type Slot = "helmet" | "chestplate" | "leggings" | "boots" | "weapon";
export type QuestCategory =
  | "Bedroom"
  | "Pets"
  | "School Prep"
  | "Kitchen"
  | "Outdoor";
export type Difficulty = "quick" | "epic";
export type TabId = "quest" | "vault" | "armory" | "store";
export type AvatarId =
  | "knight"
  | "wizard"
  | "archer"
  | "dragon-rider"
  | "berserker";
export type ChestType = "normal" | "legendary";

export type QuestId = string;
export type GearId = string;

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

export interface LootEvent {
  kind: "gear" | "duplicate";
  gearId: GearId;
  coinsAwarded?: number;
}

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
  version: 2;
  hasSeenStory: boolean;
  hero: HeroProfile | null;
  level: number;
  xp: number;
  gold: number;
  ownedGear: GearId[];
  equipped: EquippedMap;
  activeQuests: ActiveQuest[];
  completedToday: QuestId[];
  completedDate: string;
  lootLog: GearId[];
  vaultChests: VaultChest[];
  freeChestDate: string | null;
}

export type ScreenPhase = "story" | "create" | "play";
