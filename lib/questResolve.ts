import { QUESTS } from "./quests";
import type { GameState, Quest, QuestId, QuestOverride } from "./types";

export function resolveQuest(
  base: Quest,
  override?: QuestOverride | null,
): Quest {
  if (!override) return base;
  return {
    ...base,
    name: override.name?.trim() ? override.name.trim() : base.name,
    xp:
      typeof override.xp === "number" && Number.isFinite(override.xp)
        ? Math.max(1, Math.floor(override.xp))
        : base.xp,
    coins:
      typeof override.coins === "number" && Number.isFinite(override.coins)
        ? Math.max(0, Math.floor(override.coins))
        : base.coins,
  };
}

export function getQuestById(
  state: GameState,
  id: QuestId,
): Quest | undefined {
  const base = QUESTS.find((q) => q.id === id);
  if (!base) return undefined;
  return resolveQuest(base, state.questOverrides[id]);
}

/** Catalog quests with parent overrides applied; skips disabled unless includeDisabled. */
export function getPlayableQuests(
  state: GameState,
  opts?: { includeDisabled?: boolean },
): Quest[] {
  return QUESTS.filter((q) => {
    if (opts?.includeDisabled) return true;
    return !state.questOverrides[q.id]?.disabled;
  }).map((q) => resolveQuest(q, state.questOverrides[q.id]));
}

export function isQuestDisabled(state: GameState, id: QuestId): boolean {
  return Boolean(state.questOverrides[id]?.disabled);
}
