"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GEAR_BY_ID, STORE_CHESTS } from "@/lib/gear";
import {
  applyQuestRewards,
  computeBonuses,
  createInitialState,
  normalizeState,
  rollChestLoot,
  xpToNextLevel,
} from "@/lib/math";
import { QUESTS } from "@/lib/quests";
import { loadGame, saveGame } from "@/lib/storage";
import type {
  AvatarId,
  GameState,
  GearId,
  LootEvent,
  PendingChest,
  QuestId,
  ScreenPhase,
  Slot,
  TabId,
} from "@/lib/types";

export interface Celebration {
  xp: number;
  coins: number;
  questName: string;
  levels: number[];
}

export function useGameState() {
  const [state, setState] = useState<GameState | null>(null);
  const [tab, setTab] = useState<TabId>("quest");
  const [celebration, setCelebration] = useState<Celebration | null>(null);
  const chestQueueRef = useRef<PendingChest[]>([]);
  const [activeChest, setActiveChest] = useState<PendingChest | null>(null);
  const [lootResult, setLootResult] = useState<LootEvent | null>(null);
  const [parentOpen, setParentOpen] = useState(false);
  const levelTaps = useRef(0);
  const saveReady = useRef(false);

  useEffect(() => {
    // Client-only restore from LocalStorage
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional hydrate
    setState(normalizeState(loadGame()));
    saveReady.current = true;
  }, []);

  useEffect(() => {
    if (!state || !saveReady.current) return;
    saveGame(state);
  }, [state]);

  const phase: ScreenPhase = !state
    ? "story"
    : !state.hasSeenStory
      ? "story"
      : !state.hero
        ? "create"
        : "play";

  const bonuses = useMemo(
    () =>
      state
        ? computeBonuses(state)
        : { xpPct: 0, coins: 0, activeSetId: null },
    [state],
  );
  const xpNeeded = state ? xpToNextLevel(state.level) : 100;

  const finishStory = useCallback(() => {
    setState((s) => (s ? { ...s, hasSeenStory: true } : s));
  }, []);

  const createHero = useCallback((name: string, avatar: AvatarId) => {
    setState((s) =>
      s
        ? {
            ...s,
            hero: { name: name.trim().slice(0, 16) || "Hero", avatar },
          }
        : s,
    );
  }, []);

  const pushChest = useCallback((chest: PendingChest) => {
    setActiveChest((current) => {
      if (current) {
        chestQueueRef.current = [...chestQueueRef.current, chest];
        return current;
      }
      return chest;
    });
  }, []);

  const enqueueChests = useCallback(
    (chests: PendingChest[]) => {
      chests.forEach((c) => pushChest(c));
    },
    [pushChest],
  );

  const startQuest = useCallback((id: QuestId) => {
    setState((s) => {
      if (!s) return s;
      if (s.completedToday.includes(id) || s.activeQuestIds.includes(id)) {
        return s;
      }
      return { ...s, activeQuestIds: [...s.activeQuestIds, id] };
    });
  }, []);

  const completeQuest = useCallback(
    (id: QuestId) => {
      const quest = QUESTS.find((q) => q.id === id);
      if (!quest) return;

      setState((s) => {
        if (!s || s.completedToday.includes(id)) return s;
        const rewarded = applyQuestRewards(s, quest.xp, quest.coins);
        queueMicrotask(() => {
          enqueueChests(rewarded.chests);
          setCelebration({
            xp: rewarded.gainedXp,
            coins: rewarded.gainedCoins,
            questName: quest.name,
            levels: rewarded.levelsGained,
          });
        });
        return {
          ...rewarded.state,
          activeQuestIds: s.activeQuestIds.filter((q) => q !== id),
          completedToday: [...s.completedToday, id],
        };
      });
    },
    [enqueueChests],
  );

  const openChest = useCallback(() => {
    if (!activeChest) return;
    setState((s) => {
      if (!s) return s;
      const event = rollChestLoot(s.ownedGear, activeChest.type);
      queueMicrotask(() => setLootResult(event));
      if (event.kind === "duplicate") {
        return { ...s, gold: s.gold + (event.coinsAwarded ?? 0) };
      }
      return {
        ...s,
        ownedGear: [...s.ownedGear, event.gearId],
        lootLog: [event.gearId, ...s.lootLog].slice(0, 40),
      };
    });
  }, [activeChest]);

  const dismissLoot = useCallback(() => {
    setLootResult(null);
    const next = chestQueueRef.current[0];
    chestQueueRef.current = chestQueueRef.current.slice(1);
    setActiveChest(next ?? null);
  }, []);

  const buyChest = useCallback(
    (kind: "common" | "legendary") => {
      const def = STORE_CHESTS[kind];
      setState((s) => {
        if (!s || s.gold < def.price) return s;
        queueMicrotask(() =>
          pushChest({
            type: def.type,
            reason: `Store: ${def.label}`,
          }),
        );
        return { ...s, gold: s.gold - def.price };
      });
    },
    [pushChest],
  );

  const buyGear = useCallback((gearId: GearId) => {
    const gear = GEAR_BY_ID[gearId];
    if (!gear?.storePrice) return;
    setState((s) => {
      if (!s) return s;
      if (s.ownedGear.includes(gearId)) return s;
      if (s.gold < gear.storePrice!) return s;
      return {
        ...s,
        gold: s.gold - gear.storePrice!,
        ownedGear: [...s.ownedGear, gearId],
        lootLog: [gearId, ...s.lootLog].slice(0, 40),
      };
    });
  }, []);

  const equipGear = useCallback((gearId: GearId) => {
    const gear = GEAR_BY_ID[gearId];
    if (!gear) return;
    setState((s) => {
      if (!s || !s.ownedGear.includes(gearId)) return s;
      return {
        ...s,
        equipped: { ...s.equipped, [gear.slot]: gearId },
      };
    });
  }, []);

  const unequipSlot = useCallback((slot: Slot) => {
    setState((s) =>
      s ? { ...s, equipped: { ...s.equipped, [slot]: null } } : s,
    );
  }, []);

  const onLevelBadgeTap = useCallback(() => {
    levelTaps.current += 1;
    if (levelTaps.current >= 5) {
      levelTaps.current = 0;
      setParentOpen(true);
    }
  }, []);

  const resetProgressSoft = useCallback(() => {
    const fresh = createInitialState();
    setState(fresh);
    setTab("quest");
    setCelebration(null);
    chestQueueRef.current = [];
    setActiveChest(null);
    setLootResult(null);
    setParentOpen(false);
    saveGame(fresh);
  }, []);

  return {
    state,
    phase,
    tab,
    setTab,
    bonuses,
    xpNeeded,
    celebration,
    setCelebration,
    activeChest,
    lootResult,
    openChest,
    dismissLoot,
    finishStory,
    createHero,
    startQuest,
    completeQuest,
    buyChest,
    buyGear,
    equipGear,
    unequipSlot,
    parentOpen,
    setParentOpen,
    onLevelBadgeTap,
    resetProgressSoft,
  };
}
