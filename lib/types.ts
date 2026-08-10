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

export interface PendingChest {
  type: "normal" | "legendary";
  reason: string;
}

export interface GameState {
  version: 1;
  hasSeenStory: boolean;
  hero: HeroProfile | null;
  level: number;
  xp: number;
  gold: number;
  ownedGear: GearId[];
  equipped: EquippedMap;
  activeQuestIds: QuestId[];
  completedToday: QuestId[];
  completedDate: string; // YYYY-MM-DD local
  lootLog: GearId[];
  pendingChest: PendingChest | null;
}

export type ScreenPhase = "story" | "create" | "play";
