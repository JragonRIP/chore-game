"use client";

import { GEAR_BY_ID } from "@/lib/gear";
import { PixelGearIcon, RarityBadge } from "@/components/PixelGearIcon";
import type { Celebration } from "@/hooks/useGameState";
import type { LootEvent, PendingChest } from "@/lib/types";

function makeConfettiBits() {
  return Array.from({ length: 28 }, (_, i) => ({
    id: i,
    left: `${4 + ((i * 17) % 92)}%`,
    delay: `${(i % 8) * 0.05}s`,
    color: ["#fbbf24", "#22d3ee", "#a3e635", "#fb7185", "#fff"][i % 5]!,
  }));
}

export function CelebrationModal({
  data,
  onClose,
}: {
  data: Celebration;
  onClose: () => void;
}) {
  const bits = makeConfettiBits();

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/65 p-3 sm:items-center">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {bits.map((b) => (
          <span
            key={`${data.questName}-${b.id}`}
            className="confetti-bit absolute top-0 h-2 w-2"
            style={{
              left: b.left,
              background: b.color,
              animationDelay: b.delay,
            }}
          />
        ))}
      </div>
      <div className="pixel-panel relative w-full max-w-sm p-4">
        <h3 className="font-pixel text-sm text-gold">Quest Complete!</h3>
        <p className="mt-2 text-sm text-cyan-100">{data.questName}</p>
        <p className="mt-3 font-pixel text-[11px] text-lime-xp">
          +{data.xp} XP
        </p>
        <p className="mt-1 font-pixel text-[11px] text-gold">
          +{data.coins} Coins
        </p>
        {data.levels.length > 0 && (
          <p className="mt-3 font-pixel text-[11px] text-cyan-jewel">
            LEVEL UP → {data.levels.join(", ")}!
          </p>
        )}
        <button
          type="button"
          onClick={onClose}
          className="pixel-btn pixel-btn-primary mt-4 min-h-12 w-full font-pixel text-[10px]"
        >
          Awesome!
        </button>
      </div>
    </div>
  );
}

export function ChestModal({
  chest,
  loot,
  onOpen,
  onDismiss,
}: {
  chest: PendingChest;
  loot: LootEvent | null;
  onOpen: () => void;
  onDismiss: () => void;
}) {
  const gear = loot ? GEAR_BY_ID[loot.gearId] : null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-3 sm:items-center">
      <div className="pixel-panel w-full max-w-sm p-4 text-center">
        {!loot ? (
          <>
            <div
              className={`mx-auto text-6xl ${chest.type === "legendary" ? "chest-glow" : ""}`}
            >
              {chest.type === "legendary" ? "👑" : "📦"}
            </div>
            <h3 className="mt-3 font-pixel text-sm text-gold">{chest.reason}</h3>
            <p className="mt-2 text-sm text-cyan-100/80">
              {chest.type === "legendary"
                ? "A Legendary chest! Mythic gear awaits… maybe even a Relic."
                : "A treasure chest appears! Tap to open."}
            </p>
            <button
              type="button"
              onClick={onOpen}
              className="pixel-btn pixel-btn-primary mt-4 min-h-12 w-full font-pixel text-[10px]"
            >
              Open Chest
            </button>
          </>
        ) : (
          <>
            {loot.kind === "duplicate" ? (
              <>
                <p className="font-pixel text-xs text-amber-300">DUPLICATE!</p>
                <p className="mt-2 text-sm text-cyan-100">
                  You already own{" "}
                  <span className="text-gold">{gear?.name}</span>
                </p>
                <p className="mt-3 font-pixel text-[12px] text-gold">
                  Converted → +{loot.coinsAwarded} Coins
                </p>
              </>
            ) : (
              <>
                <p className="font-pixel text-xs text-lime-xp">NEW GEAR!</p>
                {gear && (
                  <div className="mt-3 flex flex-col items-center gap-2">
                    <PixelGearIcon gear={gear} size={72} />
                    <p className="font-pixel text-[11px] text-cyan-50">
                      {gear.name}
                    </p>
                    <RarityBadge rarity={gear.rarity} />
                    <p className="text-[11px] text-cyan-200/80">
                      +{gear.xpBonusPct}% XP · +{gear.coinBonus} coins/quest
                    </p>
                  </div>
                )}
              </>
            )}
            <button
              type="button"
              onClick={onDismiss}
              className="pixel-btn pixel-btn-primary mt-4 min-h-12 w-full font-pixel text-[10px]"
            >
              Claim
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export function ParentPlaceholder({
  onClose,
  onReset,
}: {
  onClose: () => void;
  onReset: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-3 sm:items-center">
      <div className="pixel-panel w-full max-w-sm p-4">
        <h3 className="font-pixel text-sm text-gold">Grown-Up Panel</h3>
        <p className="mt-3 text-sm text-cyan-100/85">
          Coming soon: edit quests, manage rewards, and parent controls.
        </p>
        <button
          type="button"
          onClick={onClose}
          className="pixel-btn pixel-btn-primary mt-4 min-h-11 w-full font-pixel text-[10px]"
        >
          Close
        </button>
        <button
          type="button"
          onClick={onReset}
          className="pixel-btn pixel-btn-ghost mt-2 min-h-11 w-full font-pixel text-[9px] text-rose-300"
        >
          Reset All Progress (dev)
        </button>
      </div>
    </div>
  );
}
