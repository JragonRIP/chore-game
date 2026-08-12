"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GEAR_BY_ID, SALVAGE_GOLD, SALVAGE_XP, STORE_CHESTS } from "@/lib/gear";
import { XP_BOTTLE_BY_ID } from "@/lib/xpBottles";
import {
  canStartDungeon,
  DUNGEON_COST,
  makeCrystalChest,
  pickDungeonQuests,
} from "@/lib/dungeon";
import {
  ENCOUNTER_CHANCE,
  rollEncounter,
  rollEncounterReward,
  type EncounterDef,
  type EncounterReward,
} from "@/lib/encounters";
import {
  applyFlatRewards,
  applyQuestRewards,
  canCompleteQuest,
  canStartQuest,
  computeBonuses,
  createInitialState,
  emptyPetTreats,
  isQuestFullyDoneToday,
  makeChestId,
  normalizeState,
  questCooldownRemainingMs,
  rollChestLoot,
  todayKey,
  weekKey,
  xpToNextLevel,
} from "@/lib/math";
import {
  applyPetXpGain,
  canEvolvePet,
  defaultPetProgress,
  EVO_STONE_STORE_PRICE,
  evolveHintsFromLevels,
  familiarFromName,
  getPetProgress,
  MAX_PET_LEVEL,
  nextPetStage,
  PET_BY_ID,
} from "@/lib/pets";
import { PET_TREAT_BY_ID } from "@/lib/petTreats";
import { getQuestById } from "@/lib/questResolve";
import { playLevelUp } from "@/lib/sounds";
import { loadGame, saveGame } from "@/lib/storage";
import { nextStreakLegendaryAt, tickQuestStreak } from "@/lib/streaks";
import { ACHIEVEMENT_BY_ID } from "@/lib/achievements";
import type {
  AchievementId,
  AvatarId,
  FamiliarId,
  GameState,
  GearId,
  LootEvent,
  PetId,
  PetStage,
  PetTreatId,
  QuestId,
  QuestOverride,
  ScreenPhase,
  Slot,
  TabId,
  VaultChest,
  XpBottleId,
} from "@/lib/types";

export const PARENT_PIN = "5869";

export interface Celebration {
  xp: number;
  coins: number;
  questName: string;
  levels: number[];
  chestsEarned: number;
  equippedPetId: PetId | null;
  petXp: number;
  petLevels: number[];
}

export interface StreakPopup {
  days: number;
  awardedChest: boolean;
  nextAt: number;
}

export interface EvolveAnim {
  petId: PetId;
  fromStage: PetStage;
  toStage: PetStage;
  nickname?: string;
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
  const [petsUnlockOpen, setPetsUnlockOpen] = useState(false);
  const [familiarReveal, setFamiliarReveal] = useState<FamiliarId | null>(
    null,
  );
  const [evolveHint, setEvolveHint] = useState<"adult" | "battle" | null>(
    null,
  );
  const [streakPopup, setStreakPopup] = useState<StreakPopup | null>(null);
  const [encounter, setEncounter] = useState<EncounterDef | null>(null);
  const [encounterRewardFlash, setEncounterRewardFlash] =
    useState<EncounterReward | null>(null);
  const [evolveAnim, setEvolveAnim] = useState<EvolveAnim | null>(null);
  const [idleStartedAt, setIdleStartedAt] = useState(() => Date.now());
  const levelTaps = useRef(0);
  const saveReady = useRef(false);
  const dailyChecked = useRef(false);
  const pendingPetsUnlock = useRef(false);
  const pendingStreak = useRef<StreakPopup | null>(null);
  const pendingChestLoot = useRef<LootEvent | null>(null);
  const pendingEvolveHints = useRef<Array<"adult" | "battle">>([]);
  const pendingEncounter = useRef<EncounterDef | null>(null);

  const flushPendingModals = useCallback(() => {
    if (pendingEncounter.current) {
      setEncounter(pendingEncounter.current);
      pendingEncounter.current = null;
      return;
    }
    if (pendingStreak.current) {
      setStreakPopup(pendingStreak.current);
      pendingStreak.current = null;
      return;
    }
    if (pendingPetsUnlock.current) {
      pendingPetsUnlock.current = false;
      setPetsUnlockOpen(true);
      return;
    }
    const nextHint = pendingEvolveHints.current.shift();
    if (nextHint) setEvolveHint(nextHint);
  }, []);

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
    // Prefer disk — covers Strict Mode remounts and in-flight cloud sync.
    const disk = loadGame();
    if (state.freeChestDate === today || disk.freeChestDate === today) {
      if (state.freeChestDate !== today && disk.freeChestDate === today) {
        setState((s) =>
          s ? { ...s, freeChestDate: today } : s,
        );
      }
      return;
    }

    const gift: VaultChest = {
      id: makeChestId(),
      type: "normal",
      reason: "Daily Wooden Chest",
      earnedAt: Date.now(),
    };
    let granted = false;
    setState((s) => {
      if (!s || s.freeChestDate === today) return s;
      granted = true;
      const next = {
        ...s,
        freeChestDate: today,
        vaultChests: [gift, ...s.vaultChests],
      };
      // Persist immediately so cloud sync can't miss today's claim.
      saveGame(next);
      return next;
    });
    queueMicrotask(() => {
      if (granted) setDailyGift(gift);
    });
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
      const quest = getQuestById(s, id);
      if (!quest || s.questOverrides[id]?.disabled) return s;
      if (!canStartQuest(s, quest)) return s;
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
    let ok = false;
    setState((s) => {
      if (!s) return s;
      const quest = getQuestById(s, id);
      if (!quest || s.questOverrides[id]?.disabled) return s;
      if (isQuestFullyDoneToday(s, quest)) return s;
      if (questCooldownRemainingMs(s, quest) > 0) return s;
      const active = s.activeQuests.find((q) => q.questId === id);
      if (!canCompleteQuest(active, quest.minutes)) return s;
      ok = true;
      const unlockingPets = !s.petsUnlocked && quest.category === "Pets";
      const rewarded = applyQuestRewards(
        s,
        quest.xp,
        quest.coins,
        quest.category,
      );
      const streak = tickQuestStreak(rewarded.state);
      const extraChests = streak.chest ? [streak.chest] : [];
      const evolveHints = evolveHintsFromLevels(
        rewarded.petLevelsGained,
        s.evolveHintSeen,
      );

      let activeDungeon = s.activeDungeon;
      let dungeonChests: VaultChest[] = [];
      if (
        activeDungeon &&
        activeDungeon.questIds.includes(id) &&
        !activeDungeon.clearedIds.includes(id)
      ) {
        const clearedIds = [...activeDungeon.clearedIds, id];
        if (clearedIds.length >= activeDungeon.questIds.length) {
          dungeonChests = [
            makeCrystalChest("Crystal Dungeon clear"),
          ];
          activeDungeon = null;
        } else {
          activeDungeon = { ...activeDungeon, clearedIds };
        }
      }

      queueMicrotask(() => {
        setCelebration({
          xp: rewarded.gainedXp,
          coins: rewarded.gainedCoins,
          questName: quest.name,
          levels: rewarded.levelsGained,
          chestsEarned:
            rewarded.chests.length +
            extraChests.length +
            dungeonChests.length,
          equippedPetId: s.equippedPet,
          petXp: rewarded.petXpGained,
          petLevels: rewarded.petLevelsGained,
        });
        if (streak.firstOfDay) {
          pendingStreak.current = {
            days: streak.streakDays,
            awardedChest: Boolean(streak.chest),
            nextAt: nextStreakLegendaryAt(streak.streakDays),
          };
        }
        if (unlockingPets) pendingPetsUnlock.current = true;
        if (evolveHints.length) {
          pendingEvolveHints.current = [
            ...pendingEvolveHints.current,
            ...evolveHints,
          ];
        }
        if (Math.random() < ENCOUNTER_CHANCE) {
          pendingEncounter.current = rollEncounter();
        }
      });
      return {
        ...rewarded.state,
        petsUnlocked: s.petsUnlocked || unlockingPets,
        activeQuests: s.activeQuests.filter((q) => q.questId !== id),
        completedToday: [...s.completedToday, id],
        questLastCompleted: {
          ...s.questLastCompleted,
          [id]: Date.now(),
        },
        vaultChests: [
          ...dungeonChests,
          ...extraChests,
          ...rewarded.chests,
          ...s.vaultChests,
        ],
        activeDungeon,
        streakDays: streak.streakDays,
        streakDate: streak.streakDate,
        streakBest: streak.streakBest,
        questsCompleted: s.questsCompleted + 1,
        weeklyQuests: (s.weeklyQuestWeek === weekKey() ? s.weeklyQuests : 0) + 1,
        weeklyQuestWeek: weekKey(),
        evolveHintSeen: {
          adult:
            Boolean(s.evolveHintSeen?.adult) ||
            evolveHints.includes("adult"),
          battle:
            Boolean(s.evolveHintSeen?.battle) ||
            evolveHints.includes("battle"),
        },
      };
    });
    return ok;
  }, []);

  const startDungeon = useCallback(() => {
    setState((s) => {
      if (!s || !canStartDungeon(s)) return s;
      const questIds = pickDungeonQuests(s);
      if (questIds.length < 3) return s;
      return {
        ...s,
        gold: s.gold - DUNGEON_COST,
        dungeonDate: todayKey(),
        activeDungeon: { questIds, clearedIds: [] },
      };
    });
  }, []);

  const resolveEncounter = useCallback(
    (won: boolean) => {
      const enc = encounter;
      setEncounter(null);
      if (!won || !enc) {
        flushPendingModals();
        return;
      }
      const reward = rollEncounterReward(enc.id);
      setState((s) => {
        if (!s) return s;
        const flat = applyFlatRewards(s, reward.xp, reward.gold);
        let ownedGear = s.ownedGear;
        let lootLog = s.lootLog;
        let vaultChests = [...flat.chests, ...s.vaultChests];
        if (reward.kind === "gear" && !ownedGear.includes(reward.gearId)) {
          ownedGear = [...ownedGear, reward.gearId];
          lootLog = [reward.gearId, ...lootLog].slice(0, 40);
        }
        if (reward.kind === "chest") {
          vaultChests = [reward.chest, ...vaultChests];
        }
        return {
          ...s,
          level: flat.level,
          xp: flat.xp,
          gold: flat.gold,
          goldPeak: flat.goldPeak,
          ownedGear,
          lootLog,
          vaultChests,
        };
      });
      setEncounterRewardFlash(reward);
      flushPendingModals();
    },
    [encounter, flushPendingModals],
  );

  const dismissEncounterReward = useCallback(() => {
    setEncounterRewardFlash(null);
  }, []);

  const claimIdle = useCallback((gold: number, xp: number) => {
    if (gold <= 0 && xp <= 0) return;
    setState((s) => {
      if (!s) return s;
      const flat = applyFlatRewards(s, xp, gold);
      if (flat.levelsGained.length) playLevelUp();
      return {
        ...s,
        level: flat.level,
        xp: flat.xp,
        gold: flat.gold,
        goldPeak: flat.goldPeak,
        vaultChests: [...flat.chests, ...s.vaultChests],
      };
    });
    setIdleStartedAt(Date.now());
  }, []);

  const dismissCelebration = useCallback(() => {
    setCelebration(null);
    flushPendingModals();
  }, [flushPendingModals]);

  const dismissStreakPopup = useCallback(() => {
    setStreakPopup(null);
    flushPendingModals();
  }, [flushPendingModals]);

  const dismissPetsUnlock = useCallback(() => {
    setPetsUnlockOpen(false);
    setTab("pets");
    flushPendingModals();
  }, [flushPendingModals]);

  const replaceState = useCallback((next: GameState) => {
    setState(normalizeState(next));
  }, []);

  const patchGold = useCallback((delta: number) => {
    setState((s) =>
      s ? { ...s, gold: Math.max(0, s.gold + delta) } : s,
    );
  }, []);

  const beginOpenChest = useCallback((chest: VaultChest) => {
    pendingChestLoot.current = null;
    setOpeningChest(chest);
    setLootResult(null);
    setChestPhase("opening");
  }, []);

  const finishOpenChest = useCallback(() => {
    if (!openingChest) return;

    setState((s) => {
      if (!s) return s;
      const chest = s.vaultChests.find((c) => c.id === openingChest.id);
      if (!chest) return s;

      // Cache the roll so React Strict Mode updater replays don't re-roll RNG.
      let event = pendingChestLoot.current;
      if (!event) {
        event = rollChestLoot(s.ownedGear, chest.type, {
          petsUnlocked: s.petsUnlocked,
          ownedPets: s.ownedPets,
        });
        pendingChestLoot.current = event;
      }

      queueMicrotask(() => {
        setLootResult(event);
        setChestPhase("reveal");
      });

      const withoutChest = s.vaultChests.filter((c) => c.id !== chest.id);
      const bonusGold = event.bonusCoins;

      if (event.kind === "duplicate") {
        const gold = s.gold + event.coinsAwarded + bonusGold;
        return {
          ...s,
          gold,
          goldPeak: Math.max(s.goldPeak, gold),
          vaultChests: withoutChest,
          chestsOpened: s.chestsOpened + 1,
        };
      }
      if (event.kind === "pet-duplicate") {
        const flat = applyFlatRewards(
          s,
          event.xpAwarded,
          event.coinsAwarded + bonusGold,
        );
        return {
          ...s,
          level: flat.level,
          xp: flat.xp,
          gold: flat.gold,
          goldPeak: flat.goldPeak,
          vaultChests: [...flat.chests, ...withoutChest],
          chestsOpened: s.chestsOpened + 1,
        };
      }
      if (event.kind === "pet") {
        const gold = s.gold + bonusGold;
        return {
          ...s,
          gold,
          goldPeak: Math.max(s.goldPeak, gold),
          ownedPets: [...s.ownedPets, event.petId],
          petProgress: {
            ...s.petProgress,
            [event.petId]:
              s.petProgress[event.petId] ?? defaultPetProgress(),
          },
          vaultChests: withoutChest,
          chestsOpened: s.chestsOpened + 1,
        };
      }
      if (event.kind === "evo-stone") {
        const gold = s.gold + bonusGold;
        return {
          ...s,
          gold,
          goldPeak: Math.max(s.goldPeak, gold),
          evolutionStones: (s.evolutionStones ?? 0) + 1,
          vaultChests: withoutChest,
          chestsOpened: s.chestsOpened + 1,
        };
      }
      const gold = s.gold + bonusGold;
      return {
        ...s,
        gold,
        goldPeak: Math.max(s.goldPeak, gold),
        ownedGear: [...s.ownedGear, event.gearId],
        lootLog: [event.gearId, ...s.lootLog].slice(0, 40),
        vaultChests: withoutChest,
        chestsOpened: s.chestsOpened + 1,
      };
    });
  }, [openingChest]);

  const dismissChest = useCallback(() => {
    pendingChestLoot.current = null;
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
        storePurchases: s.storePurchases + 1,
      };
    });
  }, []);

  const buyPetTreat = useCallback((treatId: PetTreatId) => {
    const def = PET_TREAT_BY_ID[treatId];
    if (!def) return;
    setState((s) => {
      if (!s || s.gold < def.price) return s;
      const bag = s.petTreats ?? emptyPetTreats();
      return {
        ...s,
        gold: s.gold - def.price,
        petTreats: {
          ...bag,
          [treatId]: (bag[treatId] ?? 0) + 1,
        },
        storePurchases: s.storePurchases + 1,
      };
    });
  }, []);

  const buyEvoStone = useCallback(() => {
    setState((s) => {
      if (!s) return s;
      const today = todayKey();
      if (s.evoStoneBuyDate === today) return s;
      if (s.gold < EVO_STONE_STORE_PRICE) return s;
      return {
        ...s,
        gold: s.gold - EVO_STONE_STORE_PRICE,
        evolutionStones: (s.evolutionStones ?? 0) + 1,
        evoStoneBuyDate: today,
        storePurchases: s.storePurchases + 1,
      };
    });
  }, []);

  const feedPetTreat = useCallback((treatId: PetTreatId, petId: PetId) => {
    const def = PET_TREAT_BY_ID[treatId];
    if (!def) return;
    setState((s) => {
      if (!s) return s;
      const bag = s.petTreats ?? emptyPetTreats();
      if ((bag[treatId] ?? 0) < 1) return s;
      if (!s.ownedPets.includes(petId)) return s;
      const current = getPetProgress(s.petProgress, petId);
      if (current.level >= MAX_PET_LEVEL) return s;
      const applied = applyPetXpGain(current, def.xp);
      const evolveHints = evolveHintsFromLevels(
        applied.levelsGained,
        s.evolveHintSeen,
      );
      if (evolveHints.length) {
        queueMicrotask(() => {
          pendingEvolveHints.current = [
            ...pendingEvolveHints.current,
            ...evolveHints,
          ];
          if (!celebration) {
            const next = pendingEvolveHints.current.shift();
            if (next) setEvolveHint(next);
          }
        });
      }
      return {
        ...s,
        petProgress: {
          ...s.petProgress,
          [petId]: applied.progress,
        },
        petTreats: {
          ...bag,
          [treatId]: bag[treatId] - 1,
        },
        evolveHintSeen: {
          adult:
            Boolean(s.evolveHintSeen?.adult) ||
            evolveHints.includes("adult"),
          battle:
            Boolean(s.evolveHintSeen?.battle) ||
            evolveHints.includes("battle"),
        },
      };
    });
  }, [celebration]);

  const buyXpBottle = useCallback((bottleId: XpBottleId) => {
    const def = XP_BOTTLE_BY_ID[bottleId];
    if (!def) return;
    setState((s) => {
      if (!s || s.gold < def.price) return s;
      return {
        ...s,
        gold: s.gold - def.price,
        xpBottles: {
          ...s.xpBottles,
          [bottleId]: (s.xpBottles[bottleId] ?? 0) + 1,
        },
        storePurchases: s.storePurchases + 1,
      };
    });
  }, []);

  const useXpBottle = useCallback((bottleId: XpBottleId) => {
    const def = XP_BOTTLE_BY_ID[bottleId];
    if (!def) return;
    setState((s) => {
      if (!s || (s.xpBottles[bottleId] ?? 0) < 1) return s;
      const flat = applyFlatRewards(s, def.xp, 0);
      queueMicrotask(() => {
        setCelebration({
          xp: def.xp,
          coins: 0,
          questName: def.name,
          levels: flat.levelsGained,
          chestsEarned: flat.chests.length,
          equippedPetId: s.equippedPet,
          petXp: 0,
          petLevels: [],
        });
      });
      return {
        ...s,
        level: flat.level,
        xp: flat.xp,
        gold: flat.gold,
        goldPeak: flat.goldPeak,
        vaultChests: [...flat.chests, ...s.vaultChests],
        xpBottles: {
          ...s.xpBottles,
          [bottleId]: s.xpBottles[bottleId] - 1,
        },
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
        storePurchases: s.storePurchases + 1,
      };
    });
  }, []);

  const buyPet = useCallback((petId: PetId) => {
    const pet = PET_BY_ID[petId];
    if (!pet?.storePrice) return;
    setState((s) => {
      if (!s || !s.petsUnlocked) return s;
      if (s.ownedPets.includes(petId)) return s;
      if (s.gold < pet.storePrice!) return s;
      return {
        ...s,
        gold: s.gold - pet.storePrice!,
        ownedPets: [...s.ownedPets, petId],
        petProgress: {
          ...s.petProgress,
          [petId]: s.petProgress[petId] ?? defaultPetProgress(),
        },
        storePurchases: s.storePurchases + 1,
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

  const salvageGear = useCallback((gearId: GearId) => {
    const gear = GEAR_BY_ID[gearId];
    if (!gear || gear.rarity === "relic") return;
    const goldAdd = SALVAGE_GOLD[gear.rarity];
    const xpAdd = SALVAGE_XP[gear.rarity];
    if (goldAdd <= 0 && xpAdd <= 0) return;
    setState((s) => {
      if (!s || !s.ownedGear.includes(gearId)) return s;
      if (s.equipped[gear.slot] === gearId) return s;
      const flat = applyFlatRewards(s, xpAdd, goldAdd);
      queueMicrotask(() => {
        setCelebration({
          xp: xpAdd,
          coins: goldAdd,
          questName: `Salvaged ${gear.name}`,
          levels: flat.levelsGained,
          chestsEarned: flat.chests.length,
          equippedPetId: s.equippedPet,
          petXp: 0,
          petLevels: [],
        });
      });
      return {
        ...s,
        level: flat.level,
        xp: flat.xp,
        gold: flat.gold,
        goldPeak: flat.goldPeak,
        vaultChests: [...flat.chests, ...s.vaultChests],
        ownedGear: s.ownedGear.filter((id) => id !== gearId),
        salvageCount: s.salvageCount + 1,
      };
    });
  }, []);

  const equipPet = useCallback((petId: PetId) => {
    setState((s) => {
      if (!s || !s.petsUnlocked || !s.ownedPets.includes(petId)) return s;
      return {
        ...s,
        equippedPet: petId,
        petProgress: {
          ...s.petProgress,
          [petId]: getPetProgress(s.petProgress, petId),
        },
      };
    });
  }, []);

  const unequipPet = useCallback(() => {
    setState((s) => (s ? { ...s, equippedPet: null } : s));
  }, []);

  const renamePet = useCallback((petId: PetId, rawName: string) => {
    setState((s) => {
      if (!s || !s.ownedPets.includes(petId)) return s;
      const trimmed = rawName.trim().slice(0, 16);
      const names = { ...(s.petNames ?? {}) };
      if (!trimmed) {
        delete names[petId];
      } else {
        names[petId] = trimmed;
      }
      const familiar = familiarFromName(trimmed);
      const revealing = Boolean(
        familiar && !s.familiarRevealSeen?.[familiar],
      );
      if (revealing && familiar) {
        queueMicrotask(() => setFamiliarReveal(familiar));
      }
      return {
        ...s,
        petNames: names,
        familiarRevealSeen: revealing && familiar
          ? { ...s.familiarRevealSeen, [familiar]: true }
          : s.familiarRevealSeen,
      };
    });
  }, []);

  const dismissFamiliarReveal = useCallback(() => {
    setFamiliarReveal(null);
  }, []);

  const dismissEvolveHint = useCallback(() => {
    setEvolveHint(null);
    flushPendingModals();
  }, [flushPendingModals]);

  const evolvePet = useCallback((petId: PetId) => {
    setState((s) => {
      if (!s || !s.ownedPets.includes(petId)) return s;
      const current = getPetProgress(s.petProgress, petId);
      const stones = s.evolutionStones ?? 0;
      if (!canEvolvePet(current, stones)) return s;
      const next = nextPetStage(current.stage);
      if (!next) return s;
      queueMicrotask(() => {
        setEvolveAnim({
          petId,
          fromStage: current.stage,
          toStage: next,
          nickname: s.petNames?.[petId],
        });
      });
      return {
        ...s,
        evolutionStones: stones - 1,
        petProgress: {
          ...s.petProgress,
          [petId]: { ...current, stage: next },
        },
      };
    });
  }, []);

  const dismissEvolveAnim = useCallback(() => {
    setEvolveAnim(null);
  }, []);

  const claimAchievement = useCallback((id: AchievementId) => {
    const def = ACHIEVEMENT_BY_ID[id];
    if (!def) return;
    setState((s) => {
      if (!s) return s;
      if (s.claimedAchievements.includes(id)) return s;
      if (!def.unlocked(s)) return s;
      const flat = applyFlatRewards(s, def.xp, def.gold);
      return {
        ...s,
        level: flat.level,
        xp: flat.xp,
        gold: flat.gold,
        goldPeak: flat.goldPeak,
        vaultChests: [...flat.chests, ...s.vaultChests],
        claimedAchievements: [...s.claimedAchievements, id],
      };
    });
  }, []);

  const recordGiftSent = useCallback(() => {
    setState((s) => (s ? { ...s, giftsSent: s.giftsSent + 1 } : s));
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
        goldPeak: flat.goldPeak,
        vaultChests: [...flat.chests, ...s.vaultChests],
      };
    });
  }, []);

  const parentForceUnlockPets = useCallback(() => {
    setState((s) => (s ? { ...s, petsUnlocked: true } : s));
  }, []);

  const parentUpdateQuest = useCallback(
    (questId: QuestId, patch: QuestOverride) => {
      setState((s) => {
        if (!s) return s;
        const prev = s.questOverrides[questId] ?? {};
        const next: QuestOverride = { ...prev, ...patch };
        if (typeof next.name === "string" && !next.name.trim()) {
          delete next.name;
        }
        if (next.disabled === false) delete next.disabled;
        const cleaned: QuestOverride = {};
        if (next.name) cleaned.name = next.name.trim().slice(0, 40);
        if (typeof next.xp === "number") cleaned.xp = Math.max(1, Math.floor(next.xp));
        if (typeof next.coins === "number")
          cleaned.coins = Math.max(0, Math.floor(next.coins));
        if (next.disabled) cleaned.disabled = true;

        const questOverrides = { ...s.questOverrides };
        if (Object.keys(cleaned).length === 0) {
          delete questOverrides[questId];
        } else {
          questOverrides[questId] = cleaned;
        }
        return { ...s, questOverrides };
      });
    },
    [],
  );

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
    setPetsUnlockOpen(false);
    setFamiliarReveal(null);
    setEvolveHint(null);
    setStreakPopup(null);
    setEncounter(null);
    setEncounterRewardFlash(null);
    setEvolveAnim(null);
    setIdleStartedAt(Date.now());
    pendingPetsUnlock.current = false;
    pendingStreak.current = null;
    pendingEvolveHints.current = [];
    pendingEncounter.current = null;
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
    dismissCelebration,
    openingChest,
    lootResult,
    chestPhase,
    beginOpenChest,
    finishOpenChest,
    dismissChest,
    dailyGift,
    dismissDailyGift,
    streakPopup,
    dismissStreakPopup,
    finishStory,
    createHero,
    startQuest,
    completeQuest,
    startDungeon,
    encounter,
    resolveEncounter,
    encounterRewardFlash,
    dismissEncounterReward,
    idleStartedAt,
    claimIdle,
    buyChest,
    buyXpBottle,
    useXpBottle,
    buyPetTreat,
    buyEvoStone,
    feedPetTreat,
    buyGear,
    buyPet,
    equipGear,
    unequipSlot,
    salvageGear,
    claimAchievement,
    recordGiftSent,
    equipPet,
    unequipPet,
    renamePet,
    evolvePet,
    evolveAnim,
    dismissEvolveAnim,
    familiarReveal,
    dismissFamiliarReveal,
    evolveHint,
    dismissEvolveHint,
    parentGrant,
    parentForceUnlockPets,
    parentUpdateQuest,
    parentOpen,
    setParentOpen,
    onLevelBadgeTap,
    resetProgressSoft,
    petsUnlockOpen,
    dismissPetsUnlock,
    replaceState,
    patchGold,
  };
}
