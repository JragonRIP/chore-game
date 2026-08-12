import { makeChestId, todayKey } from "@/lib/math";
import { getPlayableQuests } from "@/lib/questResolve";
import type { ActiveDungeon, GameState, QuestId, VaultChest } from "@/lib/types";

export const DUNGEON_COST = 100;
export const DUNGEON_ROOMS = 3;

export function canStartDungeon(state: GameState, now = Date.now()): boolean {
  if (state.activeDungeon) return false;
  if (state.dungeonDate === todayKey(new Date(now))) return false;
  if (state.gold < DUNGEON_COST) return false;
  const playable = getPlayableQuests(state).filter((q) => {
    const done = state.completedToday.filter((id) => id === q.id).length;
    const max = q.maxPerDay ?? 1;
    return done < max;
  });
  return playable.length >= DUNGEON_ROOMS;
}

export function pickDungeonQuests(state: GameState): QuestId[] {
  const pool = getPlayableQuests(state)
    .filter((q) => {
      const done = state.completedToday.filter((id) => id === q.id).length;
      const max = q.maxPerDay ?? 1;
      return done < max;
    })
    .map((q) => q.id);
  const shuffled = [...pool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = shuffled[i]!;
    shuffled[i] = shuffled[j]!;
    shuffled[j] = tmp;
  }
  return shuffled.slice(0, DUNGEON_ROOMS);
}

export function makeCrystalChest(reason: string): VaultChest {
  return {
    id: makeChestId(),
    type: "crystal",
    reason,
    earnedAt: Date.now(),
  };
}

export function dungeonProgress(d: ActiveDungeon | null): {
  cleared: number;
  total: number;
} {
  if (!d) return { cleared: 0, total: DUNGEON_ROOMS };
  return { cleared: d.clearedIds.length, total: d.questIds.length };
}
