import {
  ALL_GEAR,
  DUPLICATE_COINS,
  GEAR_BY_ID,
  GEAR_SETS,
  RARITY_ORDER,
} from "./gear";
import type {
  EquippedMap,
  GameState,
  GearDef,
  GearId,
  LootEvent,
  PendingChest,
  Rarity,
} from "./types";

export function todayKey(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Progressive XP to go from `level` → `level + 1` */
export function xpToNextLevel(level: number): number {
  const curve = [100, 120, 150, 180, 220, 270, 330, 400, 480, 570];
  if (level <= curve.length) return curve[level - 1]!;
  const extra = level - curve.length;
  return Math.round(570 + extra * 100 + extra * extra * 8);
}

export function isLegendaryLevel(level: number): boolean {
  return level > 0 && level % 5 === 0;
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

export function createInitialState(): GameState {
  return {
    version: 1,
    hasSeenStory: false,
    hero: null,
    level: 1,
    xp: 0,
    gold: 0,
    ownedGear: [],
    equipped: emptyEquipped(),
    activeQuestIds: [],
    completedToday: [],
    completedDate: todayKey(),
    lootLog: [],
    pendingChest: null,
  };
}

export function normalizeState(raw: GameState): GameState {
  const next = { ...raw };
  if (next.completedDate !== todayKey()) {
    next.completedToday = [];
    next.completedDate = todayKey();
  }
  return next;
}

export function getEquippedGear(state: GameState): GearDef[] {
  return (Object.values(state.equipped) as Array<GearId | null>)
    .filter((id): id is GearId => Boolean(id))
    .map((id) => GEAR_BY_ID[id])
    .filter(Boolean);
}

export function computeBonuses(state: GameState): {
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

  return { xpPct, coins, activeSetId };
}

export function applyQuestRewards(
  state: GameState,
  baseXp: number,
  baseCoins: number,
): {
  state: GameState;
  gainedXp: number;
  gainedCoins: number;
  levelsGained: number[];
  chests: PendingChest[];
} {
  const bonuses = computeBonuses(state);
  const gainedXp = Math.max(
    1,
    Math.round(baseXp * (1 + bonuses.xpPct / 100)),
  );
  const gainedCoins = Math.max(0, baseCoins + bonuses.coins);

  let level = state.level;
  let xp = state.xp + gainedXp;
  const gold = state.gold + gainedCoins;
  const levelsGained: number[] = [];
  const chests: PendingChest[] = [];

  while (xp >= xpToNextLevel(level)) {
    xp -= xpToNextLevel(level);
    level += 1;
    levelsGained.push(level);
    chests.push({
      type: isLegendaryLevel(level) ? "legendary" : "normal",
      reason: isLegendaryLevel(level)
        ? `Legendary Level ${level} Chest!`
        : `Level ${level} Treasure Chest!`,
    });
  }

  return {
    state: { ...state, level, xp, gold },
    gainedXp,
    gainedCoins,
    levelsGained,
    chests,
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
  // legendary — tiny relic chance
  return pickWeighted([
    { rarity: "forged" as const, weight: 10 },
    { rarity: "enchanted" as const, weight: 40 },
    { rarity: "mythic" as const, weight: 47 },
    { rarity: "relic" as const, weight: 3 },
  ]).rarity;
}

export function rollChestLoot(
  owned: GearId[],
  chest: "normal" | "legendary",
): LootEvent {
  const rarity = rarityPool(chest);
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

export function rarityRank(r: Rarity): number {
  return RARITY_ORDER.indexOf(r);
}
