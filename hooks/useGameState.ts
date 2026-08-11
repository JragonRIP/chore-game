"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GEAR_BY_ID, STORE_CHESTS } from "@/lib/gear";
import {
  applyFlatRewards,
  applyQuestRewards,
  canCompleteQuest,
  computeBonuses,
  createInitialState,
  makeChestId,
  normalizeState,
  rollChestLoot,
  todayKey,
  xpToNextLevel,
} from "@/lib/math";
import { QUESTS } from "@/lib/quests";
import { loadGame, saveGame } from "@/lib/storage";
import type {
  AvatarId,
  GameState,
  GearId,
  LootEvent,
  QuestId,
  ScreenPhase,
  Slot,
  TabId,
  VaultChest,
} from "@/lib/types";

export interface Celebration {
  xp: number;
  coins: number;
  questName: string;
  levels: number[];
  chestsEarned: number;
}

export function useGameState() {
  const [state, setState] = useState<GameState | null>(null);
  const [tab, setTab] = useState<TabId>("quest");
  const [celebration, setCelebration] = useState<Celebration | null>(null);
  const [openingChest, setOpeningChest] = useState<VaultChest | null>(null);
  const [lootResult, setLootResult] = useState<LootEvent | null>(null);
  const [chestPhase, setChestPhase] = useState<"idle" | "opening" | "reveal">(
    "idle",
  );
  const [dailyGift, setDailyGift] = useState<VaultChest | null>(null);
  const [parentOpen, setParentOpen] = useState(false);
  const levelTaps = useRef(0);
  const saveReady = useRef(false);
  const dailyChecked = useRef(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional hydrate
    setState(normalizeState(loadGame()));
    saveReady.current = true;
  }, []);

  useEffect(() => {
    if (!state || !saveReady.current) return;
    saveGame(state);
  }, [state]);

  useEffect(() => {
    if (!state?.hero || dailyChecked.current) return;
    dailyChecked.current = true;
    const today = todayKey();
    if (state.freeChestDate === today) return;
    const gift: VaultChest = {
      id: makeChestId(),
      type: "normal",
      reason: "Daily Wooden Chest",
      earnedAt: Date.now(),
    };
    setState((s) =>
      s
        ? {
            ...s,
            freeChestDate: today,
            vaultChests: [gift, ...s.vaultChests],
          }
        : s,
    );
    setDailyGift(gift);
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

  const startQuest = useCallback((id: QuestId) => {
    setState((s) => {
      if (!s) return s;
      if (
        s.completedToday.includes(id) ||
        s.activeQuests.some((q) => q.questId === id)
      ) {
        return s;
      }
      return {
        ...s,
        activeQuests: [
          ...s.activeQuests,
          { questId: id, startedAt: Date.now() },
        ],
      };
    });
  }, []);

  const completeQuest = useCallback((id: QuestId) => {
    const quest = QUESTS.find((q) => q.id === id);
    if (!quest) return false;

    let ok = false;
    setState((s) => {
      if (!s || s.completedToday.includes(id)) return s;
      const active = s.activeQuests.find((q) => q.questId === id);
      if (!canCompleteQuest(active, quest.minutes)) return s;
      ok = true;
      const rewarded = applyQuestRewards(s, quest.xp, quest.coins);
      queueMicrotask(() => {
        setCelebration({
          xp: rewarded.gainedXp,
          coins: rewarded.gainedCoins,
          questName: quest.name,
          levels: rewarded.levelsGained,
          chestsEarned: rewarded.chests.length,
        });
      });
      return {
        ...rewarded.state,
        activeQuests: s.activeQuests.filter((q) => q.questId !== id),
        completedToday: [...s.completedToday, id],
        vaultChests: [...rewarded.chests, ...s.vaultChests],
      };
    });
    return ok;
  }, []);

  const beginOpenChest = useCallback((chest: VaultChest) => {
    setOpeningChest(chest);
    setLootResult(null);
    setChestPhase("opening");
  }, []);

  const finishOpenChest = useCallback(() => {
    if (!openingChest) return;
    setState((s) => {
      if (!s) return s;
      if (!s.vaultChests.some((c) => c.id === openingChest.id)) return s;
      const event = rollChestLoot(s.ownedGear, openingChest.type);
      queueMicrotask(() => {
        setLootResult(event);
        setChestPhase("reveal");
      });
      if (event.kind === "duplicate") {
        return {
          ...s,
          gold: s.gold + (event.coinsAwarded ?? 0),
          vaultChests: s.vaultChests.filter((c) => c.id !== openingChest.id),
        };
      }
      return {
        ...s,
        ownedGear: [...s.ownedGear, event.gearId],
        lootLog: [event.gearId, ...s.lootLog].slice(0, 40),
        vaultChests: s.vaultChests.filter((c) => c.id !== openingChest.id),
      };
    });
  }, [openingChest]);

  const dismissChest = useCallback(() => {
    setOpeningChest(null);
    setLootResult(null);
    setChestPhase("idle");
  }, []);

  const buyChest = useCallback((kind: "common" | "legendary") => {
    const def = STORE_CHESTS[kind];
    setState((s) => {
      if (!s || s.gold < def.price) return s;
      const chest: VaultChest = {
        id: makeChestId(),
        type: def.type,
        reason: `Store: ${def.label}`,
        earnedAt: Date.now(),
      };
      return {
        ...s,
        gold: s.gold - def.price,
        vaultChests: [chest, ...s.vaultChests],
      };
    });
  }, []);

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

  const parentGrant = useCallback((xpAmount: number, goldAmount: number) => {
    const xpAdd = Math.max(0, Math.floor(xpAmount));
    const goldAdd = Math.max(0, Math.floor(goldAmount));
    if (xpAdd <= 0 && goldAdd <= 0) return;
    setState((s) => {
      if (!s) return s;
      const flat = applyFlatRewards(s, xpAdd, goldAdd);
      return {
        ...s,
        level: flat.level,
        xp: flat.xp,
        gold: flat.gold,
        vaultChests: [...flat.chests, ...s.vaultChests],
      };
    });
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
    setOpeningChest(null);
    setLootResult(null);
    setChestPhase("idle");
    setDailyGift(null);
    setParentOpen(false);
    dailyChecked.current = false;
    saveGame(fresh);
  }, []);

  const dismissDailyGift = useCallback(() => setDailyGift(null), []);

  return {
    state,
    phase,
    tab,
    setTab,
    bonuses,
    xpNeeded,
    celebration,
    setCelebration,
    openingChest,
    lootResult,
    chestPhase,
    beginOpenChest,
    finishOpenChest,
    dismissChest,
    dailyGift,
    dismissDailyGift,
    finishStory,
    createHero,
    startQuest,
    completeQuest,
    buyChest,
    buyGear,
    equipGear,
    unequipSlot,
    parentGrant,
    parentOpen,
    setParentOpen,
    onLevelBadgeTap,
    resetProgressSoft,
  };
}
