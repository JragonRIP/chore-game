"use client";

import { useState } from "react";
import { ActiveQuestSheet } from "@/components/ActiveQuestSheet";
import { Armory } from "@/components/Armory";
import { BottomNav } from "@/components/BottomNav";
import { HeroCreate } from "@/components/HeroCreate";
import { IntroStory } from "@/components/IntroStory";
import {
  CelebrationModal,
  ChestOpenModal,
  DailyChestGift,
  ParentPlaceholder,
} from "@/components/Modals";
import { PlayerHeader } from "@/components/PlayerHeader";
import { QuestBoard } from "@/components/QuestBoard";
import { StoreScreen } from "@/components/StoreScreen";
import { TreasureVault } from "@/components/TreasureVault";
import { useGameState } from "@/hooks/useGameState";
import type { QuestId } from "@/lib/types";

export function GameApp() {
  const g = useGameState();
  const [openQuestId, setOpenQuestId] = useState<QuestId | null>(null);

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

  const handleStart = (id: QuestId) => {
    g.startQuest(id);
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
        onLevelTap={g.onLevelBadgeTap}
      />

      <main className="min-h-0 flex-1 overflow-y-auto">
        {g.tab === "quest" && (
          <QuestBoard
            state={g.state}
            onStart={handleStart}
            onOpenActive={setOpenQuestId}
          />
        )}
        {g.tab === "vault" && (
          <TreasureVault
            state={g.state}
            onOpenChest={g.beginOpenChest}
          />
        )}
        {g.tab === "armory" && (
          <Armory
            state={g.state}
            activeSetId={g.bonuses.activeSetId}
            onEquip={g.equipGear}
            onUnequip={g.unequipSlot}
          />
        )}
        {g.tab === "store" && (
          <StoreScreen
            state={g.state}
            onBuyChest={g.buyChest}
            onBuyGear={g.buyGear}
          />
        )}
      </main>

      <BottomNav tab={g.tab} onChange={g.setTab} />

      {openQuestId && activeForSheet && (
        <ActiveQuestSheet
          questId={openQuestId}
          active={activeForSheet}
          onClose={() => setOpenQuestId(null)}
          onComplete={handleComplete}
        />
      )}

      {g.celebration && (
        <CelebrationModal
          data={g.celebration}
          onClose={() => g.setCelebration(null)}
        />
      )}

      {g.openingChest &&
        (g.chestPhase === "opening" || g.chestPhase === "reveal") &&
        !g.celebration && (
          <ChestOpenModal
            chest={g.openingChest}
            phase={g.chestPhase}
            loot={g.lootResult}
            onFinishOpen={g.finishOpenChest}
            onDismiss={g.dismissChest}
          />
        )}

      {g.dailyGift && !g.celebration && !g.openingChest && (
        <DailyChestGift onDismiss={g.dismissDailyGift} />
      )}

      {g.parentOpen && (
        <ParentPlaceholder
          onClose={() => g.setParentOpen(false)}
          onReset={g.resetProgressSoft}
        />
      )}
    </div>
  );
}
