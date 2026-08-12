"use client";

import { useMemo, useState } from "react";
import { ActiveQuestSheet } from "@/components/ActiveQuestSheet";
import { Armory } from "@/components/Armory";
import { BottomNav } from "@/components/BottomNav";
import { CollectionBook } from "@/components/CollectionBook";
import { AchievementsPanel } from "@/components/AchievementsPanel";
import { FriendsPanel } from "@/components/FriendsPanel";
import { StreakModal } from "@/components/StreakModal";
import { HeroCreate } from "@/components/HeroCreate";
import { IntroStory } from "@/components/IntroStory";
import {
  CelebrationModal,
  ChestOpenModal,
  DailyChestGift,
  EvolveHintModal,
  FamiliarRevealModal,
  ParentPanel,
  PetsUnlockModal,
} from "@/components/Modals";
import {
  EncounterModal,
  EncounterRewardToast,
} from "@/components/EncounterModal";
import { EvolveAnimModal } from "@/components/EvolveAnimModal";
import { PetsScreen } from "@/components/PetsScreen";
import { PlayerHeader } from "@/components/PlayerHeader";
import { QuestBoard } from "@/components/QuestBoard";
import { StoreScreen } from "@/components/StoreScreen";
import { TreasureVault } from "@/components/TreasureVault";
import { useGameState } from "@/hooks/useGameState";
import { useOnline } from "@/hooks/useOnline";
import { unclaimedAchievementCount } from "@/lib/achievements";
import { playClick } from "@/lib/sounds";
import type { QuestId } from "@/lib/types";

export function GameApp() {
  const g = useGameState();
  const [openQuestId, setOpenQuestId] = useState<QuestId | null>(null);
  const [friendsOpen, setFriendsOpen] = useState(false);
  const [achievementsOpen, setAchievementsOpen] = useState(false);
  const [collectionOpen, setCollectionOpen] = useState(false);

  const online = useOnline({
    state: g.state,
    replaceState: g.replaceState,
  });

  const friendsBadge = useMemo(() => {
    const pending = online.friends.filter((f) => f.incoming).length;
    return pending + online.gifts.length;
  }, [online.friends, online.gifts]);

  if (!g.state) {
    return (
      <div className="realm-bg flex h-dvh items-center justify-center">
        <p className="font-display text-lg text-teal-deep">Loading realm…</p>
      </div>
    );
  }

  if (g.phase === "story") {
    return <IntroStory onDone={g.finishStory} />;
  }

  if (g.phase === "create") {
    return <HeroCreate onCreate={g.createHero} />;
  }

  const handleOpen = (id: QuestId) => {
    setOpenQuestId(id);
  };

  const handleComplete = (id: QuestId) => {
    setOpenQuestId(null);
    g.completeQuest(id);
  };

  const activeForSheet = openQuestId
    ? g.state.activeQuests.find((q) => q.questId === openQuestId)
    : undefined;

  return (
    <div className="realm-bg relative flex h-dvh flex-col overflow-hidden text-ink">
      <PlayerHeader
        state={g.state}
        xpNeeded={g.xpNeeded}
        xpPctBonus={g.bonuses.xpPct}
        coinBonus={g.bonuses.coins}
        onLevelTap={g.onLevelBadgeTap}
        onFriends={() => setFriendsOpen(true)}
        friendsBadge={friendsBadge}
        onAchievements={() => setAchievementsOpen(true)}
        achievementsBadge={unclaimedAchievementCount(g.state)}
        onCollection={() => setCollectionOpen(true)}
        onlineActive={Boolean(online.player)}
      />

      <main className="min-h-0 flex-1 overflow-y-auto">
        {g.tab === "quest" && (
          <QuestBoard
            state={g.state}
            onOpen={handleOpen}
            onStartDungeon={g.startDungeon}
            onClaimIdle={g.claimIdle}
          />
        )}
        {g.tab === "vault" && (
          <TreasureVault
            state={g.state}
            onOpenChest={(chest) => {
              playClick();
              g.beginOpenChest(chest);
            }}
            onUseXpBottle={g.useXpBottle}
          />
        )}
        {g.tab === "armory" && (
          <Armory
            state={g.state}
            activeSetId={g.bonuses.activeSetId}
            xpPctBonus={g.bonuses.xpPct}
            coinBonus={g.bonuses.coins}
            onEquip={g.equipGear}
            onUnequip={g.unequipSlot}
            onSalvage={g.salvageGear}
          />
        )}
        {g.tab === "pets" && (
          <PetsScreen
            state={g.state}
            onEquip={g.equipPet}
            onUnequip={g.unequipPet}
            onFeedTreat={g.feedPetTreat}
            onRename={g.renamePet}
            onEvolve={g.evolvePet}
          />
        )}
        {g.tab === "store" && (
          <StoreScreen
            state={g.state}
            onBuyChest={g.buyChest}
            onBuyXpBottle={g.buyXpBottle}
            onBuyPetTreat={g.buyPetTreat}
            onBuyEvoStone={g.buyEvoStone}
            onBuyGear={g.buyGear}
            onBuyPet={g.buyPet}
          />
        )}
      </main>

      <BottomNav
        tab={g.tab}
        onChange={(t) => {
          playClick();
          g.setTab(t);
        }}
      />

      {openQuestId && (
        <ActiveQuestSheet
          questId={openQuestId}
          active={activeForSheet}
          state={g.state}
          onClose={() => setOpenQuestId(null)}
          onStart={g.startQuest}
          onComplete={handleComplete}
        />
      )}

      {g.celebration && (
        <CelebrationModal
          data={g.celebration}
          onClose={g.dismissCelebration}
        />
      )}

      {g.encounter && !g.celebration && (
        <EncounterModal
          encounter={g.encounter}
          onResolve={g.resolveEncounter}
        />
      )}

      {g.encounterRewardFlash && !g.encounter && (
        <EncounterRewardToast
          reward={g.encounterRewardFlash}
          onDismiss={g.dismissEncounterReward}
        />
      )}

      {g.evolveAnim && !g.celebration && !g.encounter && (
        <EvolveAnimModal
          petId={g.evolveAnim.petId}
          fromStage={g.evolveAnim.fromStage}
          toStage={g.evolveAnim.toStage}
          nickname={g.evolveAnim.nickname}
          onDismiss={g.dismissEvolveAnim}
        />
      )}

      {g.openingChest &&
        (g.chestPhase === "opening" || g.chestPhase === "reveal") &&
        !g.celebration &&
        !g.encounter &&
        !g.evolveAnim && (
          <ChestOpenModal
            chest={g.openingChest}
            phase={g.chestPhase}
            loot={g.lootResult}
            onFinishOpen={g.finishOpenChest}
            onDismiss={g.dismissChest}
          />
        )}

      {g.streakPopup &&
        !g.celebration &&
        !g.encounter &&
        !g.openingChest &&
        !g.evolveAnim && (
        <StreakModal data={g.streakPopup} onDismiss={g.dismissStreakPopup} />
      )}

      {g.petsUnlockOpen &&
        !g.celebration &&
        !g.encounter &&
        !g.openingChest &&
        !g.streakPopup &&
        !g.evolveAnim && (
        <PetsUnlockModal onDismiss={g.dismissPetsUnlock} />
      )}

      {g.familiarReveal &&
        !g.celebration &&
        !g.encounter &&
        !g.openingChest &&
        !g.streakPopup &&
        !g.petsUnlockOpen &&
        !g.evolveAnim && (
          <FamiliarRevealModal
            familiar={g.familiarReveal}
            onDismiss={g.dismissFamiliarReveal}
          />
        )}

      {g.evolveHint &&
        !g.celebration &&
        !g.encounter &&
        !g.openingChest &&
        !g.streakPopup &&
        !g.petsUnlockOpen &&
        !g.familiarReveal &&
        !g.evolveAnim && (
          <EvolveHintModal
            kind={g.evolveHint}
            onDismiss={g.dismissEvolveHint}
          />
        )}

      {g.dailyGift &&
        !g.celebration &&
        !g.encounter &&
        !g.openingChest &&
        !g.streakPopup &&
        !g.petsUnlockOpen &&
        !g.familiarReveal &&
        !g.evolveHint &&
        !g.evolveAnim && (
          <DailyChestGift onDismiss={g.dismissDailyGift} />
        )}

      {g.parentOpen && (
        <ParentPanel
          state={g.state}
          onGrant={g.parentGrant}
          onClose={() => g.setParentOpen(false)}
          onReset={g.resetProgressSoft}
          onForceUnlockPets={g.parentForceUnlockPets}
          onUpdateQuest={g.parentUpdateQuest}
        />
      )}

      <FriendsPanel
        open={friendsOpen}
        onClose={() => setFriendsOpen(false)}
        state={g.state}
        online={online}
        onGiftSent={g.recordGiftSent}
      />

      <AchievementsPanel
        open={achievementsOpen}
        onClose={() => setAchievementsOpen(false)}
        state={g.state}
        onClaim={g.claimAchievement}
      />

      <CollectionBook
        open={collectionOpen}
        onClose={() => setCollectionOpen(false)}
        state={g.state}
      />
    </div>
  );
}
