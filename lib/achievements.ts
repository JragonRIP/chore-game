import { GEAR_BY_ID, GEAR_SETS, getSetPieces } from "@/lib/gear";
import { PET_BY_ID, PET_SPECIES } from "@/lib/pets";
import type { AchievementId, GameState } from "@/lib/types";

export interface AchievementDef {
  id: AchievementId;
  name: string;
  description: string;
  icon: string;
  gold: number;
  xp: number;
  unlocked: (state: GameState) => boolean;
}

function ownsFullSet(state: GameState): boolean {
  return GEAR_SETS.some((set) => {
    const pieces = getSetPieces(set.id);
    return (
      pieces.length > 0 &&
      pieces.every((p) => state.ownedGear.includes(p.id))
    );
  });
}

function ownsAllSpecies(state: GameState): boolean {
  const owned = new Set(
    state.ownedPets
      .map((id) => PET_BY_ID[id]?.species)
      .filter(Boolean),
  );
  return PET_SPECIES.every((s) => owned.has(s));
}

function anyPetStageAtLeast(state: GameState, stage: number): boolean {
  return Object.values(state.petProgress).some(
    (p) => (p?.stage ?? 1) >= stage,
  );
}

export const ACHIEVEMENTS: AchievementDef[] = [
  {
    id: "first-quest",
    name: "First Quest",
    description: "Complete a chore quest.",
    icon: "⚔️",
    gold: 15,
    xp: 20,
    unlocked: (s) => s.questsCompleted >= 1,
  },
  {
    id: "quests-10",
    name: "Busy Hero",
    description: "Complete 10 quests.",
    icon: "📋",
    gold: 30,
    xp: 40,
    unlocked: (s) => s.questsCompleted >= 10,
  },
  {
    id: "quests-50",
    name: "Quest Captain",
    description: "Complete 50 quests.",
    icon: "🛡️",
    gold: 80,
    xp: 100,
    unlocked: (s) => s.questsCompleted >= 50,
  },
  {
    id: "quests-100",
    name: "Legend of Chores",
    description: "Complete 100 quests.",
    icon: "👑",
    gold: 150,
    xp: 200,
    unlocked: (s) => s.questsCompleted >= 100,
  },
  {
    id: "streak-3",
    name: "Warm Streak",
    description: "Hit a 3-day quest streak.",
    icon: "🔥",
    gold: 25,
    xp: 30,
    unlocked: (s) => s.streakBest >= 3,
  },
  {
    id: "streak-7",
    name: "Week Warrior",
    description: "Hit a 7-day quest streak.",
    icon: "🌟",
    gold: 75,
    xp: 80,
    unlocked: (s) => s.streakBest >= 7,
  },
  {
    id: "streak-14",
    name: "Fortnight Flame",
    description: "Hit a 14-day quest streak.",
    icon: "💫",
    gold: 120,
    xp: 150,
    unlocked: (s) => s.streakBest >= 14,
  },
  {
    id: "first-chest",
    name: "Treasure Hunter",
    description: "Open a chest in the Vault.",
    icon: "📦",
    gold: 15,
    xp: 20,
    unlocked: (s) => s.chestsOpened >= 1,
  },
  {
    id: "chests-10",
    name: "Vault Raider",
    description: "Open 10 chests.",
    icon: "🗝️",
    gold: 50,
    xp: 60,
    unlocked: (s) => s.chestsOpened >= 10,
  },
  {
    id: "first-gear",
    name: "Armed",
    description: "Own a piece of gear.",
    icon: "🪖",
    gold: 20,
    xp: 25,
    unlocked: (s) => s.ownedGear.length >= 1,
  },
  {
    id: "full-set",
    name: "Set Complete",
    description: "Collect every piece of any armor set.",
    icon: "🧩",
    gold: 100,
    xp: 120,
    unlocked: ownsFullSet,
  },
  {
    id: "first-relic",
    name: "Relic Finder",
    description: "Own a Relic.",
    icon: "💎",
    gold: 150,
    xp: 180,
    unlocked: (s) =>
      s.ownedGear.some((id) => GEAR_BY_ID[id]?.rarity === "relic"),
  },
  {
    id: "first-pet",
    name: "Companion",
    description: "Own a pet.",
    icon: "🐾",
    gold: 40,
    xp: 50,
    unlocked: (s) => s.ownedPets.length >= 1,
  },
  {
    id: "pet-level-5",
    name: "Best Friends",
    description: "Get a pet to level 5.",
    icon: "❤️",
    gold: 80,
    xp: 100,
    unlocked: (s) =>
      Object.values(s.petProgress).some((p) => (p?.level ?? 0) >= 5),
  },
  {
    id: "pet-level-10",
    name: "Max Bond",
    description: "Get a pet to level 10.",
    icon: "💖",
    gold: 120,
    xp: 150,
    unlocked: (s) =>
      Object.values(s.petProgress).some((p) => (p?.level ?? 0) >= 10),
  },
  {
    id: "pet-evolve-adult",
    name: "Growing Up",
    description: "Evolve a pet to its adult form.",
    icon: "✨",
    gold: 90,
    xp: 110,
    unlocked: (s) => anyPetStageAtLeast(s, 2),
  },
  {
    id: "pet-evolve-battle",
    name: "Battle Ready",
    description: "Evolve a pet to its Battle form.",
    icon: "⚔️",
    gold: 150,
    xp: 180,
    unlocked: (s) => anyPetStageAtLeast(s, 3),
  },
  {
    id: "pets-all-species",
    name: "Full Party",
    description: "Own every pet species at least once.",
    icon: "🐉",
    gold: 120,
    xp: 140,
    unlocked: ownsAllSpecies,
  },
  {
    id: "familiar-maple",
    name: "Maple Found",
    description: "Rename a pet Maple and meet a familiar friend.",
    icon: "🐶",
    gold: 60,
    xp: 70,
    unlocked: (s) => Boolean(s.familiarRevealSeen?.maple),
  },
  {
    id: "familiar-caliper",
    name: "Caliper Found",
    description: "Rename a pet Caliper and meet a familiar friend.",
    icon: "🐕",
    gold: 60,
    xp: 70,
    unlocked: (s) => Boolean(s.familiarRevealSeen?.caliper),
  },
  {
    id: "salvage-1",
    name: "Recycle Hero",
    description: "Salvage a gear piece in the Armory.",
    icon: "♻️",
    gold: 20,
    xp: 25,
    unlocked: (s) => s.salvageCount >= 1,
  },
  {
    id: "level-5",
    name: "Rising Champion",
    description: "Reach hero level 5.",
    icon: "📈",
    gold: 40,
    xp: 50,
    unlocked: (s) => s.level >= 5,
  },
  {
    id: "level-10",
    name: "Seasoned Hero",
    description: "Reach hero level 10.",
    icon: "🏅",
    gold: 80,
    xp: 100,
    unlocked: (s) => s.level >= 10,
  },
  {
    id: "gold-500",
    name: "Deep Pockets",
    description: "Hold 500 gold at once.",
    icon: "💰",
    gold: 50,
    xp: 40,
    unlocked: (s) => s.goldPeak >= 500,
  },
  {
    id: "store-buy",
    name: "Shopper",
    description: "Buy something from the Hero Store.",
    icon: "🛒",
    gold: 25,
    xp: 30,
    unlocked: (s) => s.storePurchases >= 1,
  },
  {
    id: "evo-stone-buy",
    name: "Stone Shopper",
    description: "Buy an Evolution Stone from the store.",
    icon: "💎",
    gold: 40,
    xp: 50,
    unlocked: (s) => Boolean(s.evoStoneBuyDate),
  },
  {
    id: "gift-friend",
    name: "Generous",
    description: "Send a gift to a friend.",
    icon: "🎁",
    gold: 40,
    xp: 50,
    unlocked: (s) => s.giftsSent >= 1,
  },
];

export const ACHIEVEMENT_BY_ID: Record<AchievementId, AchievementDef> =
  Object.fromEntries(ACHIEVEMENTS.map((a) => [a.id, a])) as Record<
    AchievementId,
    AchievementDef
  >;

export type AchievementStatus = "locked" | "ready" | "claimed";

export function achievementStatus(
  def: AchievementDef,
  state: GameState,
): AchievementStatus {
  if (state.claimedAchievements.includes(def.id)) return "claimed";
  if (def.unlocked(state)) return "ready";
  return "locked";
}

export function unclaimedAchievementCount(state: GameState): number {
  return ACHIEVEMENTS.filter((a) => achievementStatus(a, state) === "ready")
    .length;
}
