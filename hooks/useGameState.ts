"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GEAR_BY_ID, SALVAGE_GOLD, SALVAGE_XP, STORE_CHESTS } from "@/lib/gear";
import { XP_BOTTLE_BY_ID } from "@/lib/xpBottles";
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
  xpToNextLevel,
} from "@/lib/math";
import {
  applyPetXpGain,
  defaultPetProgress,
  getPetProgress,
  isMapleName,
  MAX_PET_LEVEL,
  PET_BY_ID,
} from "@/lib/pets";
import { PET_TREAT_BY_ID } from "@/lib/petTreats";
import { getQuestById } from "@/lib/questResolve";
import { loadGame, saveGame } from "@/lib/storage";
import type {
  AvatarId,
  GameState,
  GearId,
  LootEvent,
  PetId,
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
  const [mapleRevealOpen, setMapleRevealOpen] = useState(false);
  const levelTaps = useRef(0);
  const saveReady = useRef(false);
  const dailyChecked = useRef(false);
  const pendingPetsUnlock = useRef(false);
  const pendingChestLoot = useRef<LootEvent | null>(null);

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
      queueMicrotask(() => {
        setCelebration({
          xp: rewarded.gainedXp,
          coins: rewarded.gainedCoins,
          questName: quest.name,
          levels: rewarded.levelsGained,
          chestsEarned: rewarded.chests.length,
          equippedPetId: s.equippedPet,
          petXp: rewarded.petXpGained,
          petLevels: rewarded.petLevelsGained,
        });
        if (unlockingPets) pendingPetsUnlock.current = true;
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
        vaultChests: [...rewarded.chests, ...s.vaultChests],
      };
    });
    return ok;
  }, []);

  const dismissCelebration = useCallback(() => {
    setCelebration(null);
    if (pendingPetsUnlock.current) {
      pendingPetsUnlock.current = false;
      setPetsUnlockOpen(true);
    }
  }, []);

  const dismissPetsUnlock = useCallback(() => {
    setPetsUnlockOpen(false);
    setTab("pets");
  }, []);

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

      if (event.kind === "duplicate") {
        return {
          ...s,
          gold: s.gold + event.coinsAwarded,
          vaultChests: withoutChest,
        };
      }
      if (event.kind === "pet-duplicate") {
        const flat = applyFlatRewards(s, event.xpAwarded, event.coinsAwarded);
        return {
          ...s,
          level: flat.level,
          xp: flat.xp,
          gold: flat.gold,
          vaultChests: [...flat.chests, ...withoutChest],
        };
      }
      if (event.kind === "pet") {
        return {
          ...s,
          ownedPets: [...s.ownedPets, event.petId],
          petProgress: {
            ...s.petProgress,
            [event.petId]:
              s.petProgress[event.petId] ?? defaultPetProgress(),
          },
          vaultChests: withoutChest,
        };
      }
      return {
        ...s,
        ownedGear: [...s.ownedGear, event.gearId],
        lootLog: [event.gearId, ...s.lootLog].slice(0, 40),
        vaultChests: withoutChest,
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
      };
    });
  }, []);

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
        vaultChests: [...flat.chests, ...s.vaultChests],
        ownedGear: s.ownedGear.filter((id) => id !== gearId),
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
      const revealing = isMapleName(trimmed) && !s.mapleRevealSeen;
      if (revealing) {
        queueMicrotask(() => setMapleRevealOpen(true));
      }
      return {
        ...s,
        petNames: names,
        mapleRevealSeen: s.mapleRevealSeen || revealing,
      };
    });
  }, []);

  const dismissMapleReveal = useCallback(() => {
    setMapleRevealOpen(false);
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
    setMapleRevealOpen(false);
    pendingPetsUnlock.current = false;
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
    finishStory,
    createHero,
    startQuest,
    completeQuest,
    buyChest,
    buyXpBottle,
    useXpBottle,
    buyPetTreat,
    feedPetTreat,
    buyGear,
    buyPet,
    equipGear,
    unequipSlot,
    salvageGear,
    equipPet,
    unequipPet,
    renamePet,
    mapleRevealOpen,
    dismissMapleReveal,
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
