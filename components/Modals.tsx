"use client";

import { GEAR_BY_ID } from "@/lib/gear";
import { GearIcon, RarityBadge } from "@/components/PixelGearIcon";
import type { Celebration } from "@/hooks/useGameState";
import type { LootEvent, PendingChest } from "@/lib/types";

function makeConfettiBits() {
  return Array.from({ length: 36 }, (_, i) => ({
    id: i,
    left: `${3 + ((i * 13) % 94)}%`,
    delay: `${(i % 10) * 0.04}s`,
    color: ["#ff6b4a", "#0d9488", "#e8a017", "#10b981", "#38bdf8", "#f6d28a"][
      i % 6
    ]!,
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
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-4 backdrop-blur-sm sm:items-center">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {bits.map((b) => (
          <span
            key={`${data.questName}-${b.id}`}
            className="confetti-bit absolute top-0 h-2.5 w-2.5 rounded-sm"
            style={{
              left: b.left,
              background: b.color,
              animationDelay: b.delay,
            }}
          />
        ))}
      </div>
      <div className="surface-strong relative w-full max-w-sm p-5 rise-in">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal">
          Victory
        </p>
        <h3 className="mt-1 font-display text-2xl text-ink">Quest Complete!</h3>
        <p className="mt-2 text-ink-soft">{data.questName}</p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="rounded-2xl bg-emerald-50 px-3 py-3 text-center">
            <p className="font-display text-xl text-emerald-700">+{data.xp}</p>
            <p className="text-xs font-semibold text-emerald-700/70">XP</p>
          </div>
          <div className="rounded-2xl bg-amber-50 px-3 py-3 text-center">
            <p className="font-display text-xl text-amber-800">+{data.coins}</p>
            <p className="text-xs font-semibold text-amber-800/70">Gold</p>
          </div>
        </div>
        {data.levels.length > 0 && (
          <p className="mt-4 rounded-2xl bg-teal/10 px-3 py-2 text-center font-display text-teal-deep">
            Level up → {data.levels.join(", ")}!
          </p>
        )}
        <button type="button" onClick={onClose} className="btn btn-primary mt-5 w-full">
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
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-4 backdrop-blur-sm sm:items-center">
      <div className="surface-strong w-full max-w-sm p-5 text-center rise-in">
        {!loot ? (
          <>
            <div
              className={`mx-auto flex h-24 w-24 items-center justify-center rounded-3xl text-5xl ${
                chest.type === "legendary"
                  ? "bg-gradient-to-br from-gold-soft to-amber-200 pulse-soft"
                  : "bg-sky-2/80"
              }`}
            >
              {chest.type === "legendary" ? "👑" : "📦"}
            </div>
            <h3 className="mt-4 font-display text-xl text-ink">{chest.reason}</h3>
            <p className="mt-2 text-sm text-ink-soft">
              {chest.type === "legendary"
                ? "A Legendary chest! Mythic gear awaits… maybe even a Relic."
                : "A treasure chest appears! Tap to open."}
            </p>
            <button type="button" onClick={onOpen} className="btn btn-primary mt-5 w-full">
              Open Chest
            </button>
          </>
        ) : (
          <>
            {loot.kind === "duplicate" ? (
              <>
                <p className="text-xs font-bold uppercase tracking-wide text-amber-700">
                  Duplicate
                </p>
                <p className="mt-2 text-ink-soft">
                  You already own{" "}
                  <span className="font-semibold text-ink">{gear?.name}</span>
                </p>
                <p className="mt-4 font-display text-2xl text-amber-700">
                  +{loot.coinsAwarded} Gold
                </p>
              </>
            ) : (
              <>
                <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">
                  New Gear
                </p>
                {gear && (
                  <div className="mt-4 flex flex-col items-center gap-2">
                    <GearIcon gear={gear} size={80} />
                    <p className="font-display text-lg text-ink">{gear.name}</p>
                    <RarityBadge rarity={gear.rarity} />
                    <p className="text-sm text-ink-soft">
                      +{gear.xpBonusPct}% XP · +{gear.coinBonus} gold / quest
                    </p>
                  </div>
                )}
              </>
            )}
            <button
              type="button"
              onClick={onDismiss}
              className="btn btn-primary mt-5 w-full"
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
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-4 backdrop-blur-sm sm:items-center">
      <div className="surface-strong w-full max-w-sm p-5 rise-in">
        <h3 className="font-display text-xl text-ink">Grown-Up Panel</h3>
        <p className="mt-3 text-sm text-ink-soft">
          Coming soon: edit quests, manage rewards, and parent controls.
        </p>
        <button type="button" onClick={onClose} className="btn btn-primary mt-5 w-full">
          Close
        </button>
        <button
          type="button"
          onClick={onReset}
          className="btn btn-ghost mt-2 w-full text-rose-600"
        >
          Reset All Progress (dev)
        </button>
      </div>
    </div>
  );
}
