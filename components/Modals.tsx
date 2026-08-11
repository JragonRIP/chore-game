"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { GEAR_BY_ID } from "@/lib/gear";
import { ChestIcon } from "@/components/ChestIcon";
import { GearIcon, RarityBadge } from "@/components/PixelGearIcon";
import { GoldCoin } from "@/components/GoldCoin";
import type { Celebration } from "@/hooks/useGameState";
import type { LootEvent, VaultChest } from "@/lib/types";

export function CelebrationModal({
  data,
  onClose,
}: {
  data: Celebration;
  onClose: () => void;
}) {
  const [phase, setPhase] = useState<"burst" | "fly" | "done">("burst");

  useEffect(() => {
    const t1 = window.setTimeout(() => setPhase("fly"), 450);
    const t2 = window.setTimeout(() => setPhase("done"), 1400);
    const t3 = window.setTimeout(onClose, 1750);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
    };
  }, [onClose, data]);

  const bits = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    kind: i % 2 === 0 ? "xp" : "gold",
    angle: (i / 18) * Math.PI * 2,
  }));

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-ink/25 backdrop-blur-[1px]" />
      <div className="absolute left-1/2 top-1/2 w-[min(90vw,22rem)] -translate-x-1/2 -translate-y-1/2">
        <div
          className={`surface-strong p-5 text-center transition duration-500 ${
            phase === "burst"
              ? "scale-100 opacity-100"
              : "scale-150 opacity-0"
          }`}
        >
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal">
            Victory
          </p>
          <h3 className="mt-1 font-display text-2xl text-ink">Quest Complete!</h3>
          <p className="mt-1 text-sm text-ink-soft">{data.questName}</p>
        </div>
      </div>

      {bits.map((b) => (
        <span
          key={b.id}
          className={`reward-fly absolute left-1/2 top-1/2 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full font-bold shadow-md ${
            b.kind === "xp"
              ? "bg-emerald-400 text-[10px] text-white"
              : "bg-amber-300"
          } ${phase === "fly" || phase === "done" ? (b.kind === "xp" ? "fly-to-xp" : "fly-to-gold") : "burst-out"}`}
          style={
            {
              "--tx": `${Math.cos(b.angle) * 90}px`,
              "--ty": `${Math.sin(b.angle) * 70}px`,
              animationDelay: `${(b.id % 6) * 0.03}s`,
            } as CSSProperties
          }
        >
          {b.kind === "xp" ? `+${Math.max(1, Math.round(data.xp / 6))}` : <GoldCoin size={18} />}
        </span>
      ))}

      {phase === "done" && data.chestsEarned > 0 && (
        <p className="absolute bottom-28 left-1/2 -translate-x-1/2 rounded-full bg-white/90 px-4 py-2 text-sm font-bold text-teal-deep shadow rise-in">
          +{data.chestsEarned} chest{data.chestsEarned > 1 ? "s" : ""} → Vault
        </p>
      )}
    </div>
  );
}

export function ChestOpenModal({
  chest,
  phase,
  loot,
  onFinishOpen,
  onDismiss,
}: {
  chest: VaultChest;
  phase: "opening" | "reveal";
  loot: LootEvent | null;
  onFinishOpen: () => void;
  onDismiss: () => void;
}) {
  const gear = loot ? GEAR_BY_ID[loot.gearId] : null;
  const legendary = chest.type === "legendary";

  useEffect(() => {
    if (phase !== "opening") return;
    const t = window.setTimeout(onFinishOpen, legendary ? 1600 : 900);
    return () => window.clearTimeout(t);
  }, [phase, onFinishOpen, legendary]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/45 p-4 backdrop-blur-sm sm:items-center">
      <div className="surface-strong w-full max-w-sm p-5 text-center rise-in">
        {phase === "opening" && (
          <>
            <div
              className={`mx-auto flex h-32 w-32 items-center justify-center rounded-3xl ${
                legendary
                  ? "bg-gradient-to-br from-amber-200 to-yellow-100 chest-open-legendary"
                  : "bg-amber-50 chest-open-wooden"
              }`}
            >
              <ChestIcon
                variant={legendary ? "golden" : "wooden"}
                size={110}
              />
            </div>
            <h3 className="mt-4 font-display text-xl text-ink">
              {legendary ? "Opening Golden Chest…" : "Opening Wooden Chest…"}
            </h3>
            <p className="mt-2 text-sm text-ink-soft">{chest.reason}</p>
          </>
        )}

        {phase === "reveal" && loot && (
          <>
            {loot.kind === "duplicate" ? (
              <>
                <p className="text-xs font-bold uppercase tracking-wide text-amber-700">
                  Duplicate
                </p>
                <p className="mt-2 text-ink-soft">
                  Already owned{" "}
                  <span className="font-semibold text-ink">{gear?.name}</span>
                </p>
                <div className="mt-4 flex items-center justify-center gap-2 font-display text-2xl text-amber-800">
                  <GoldCoin size={28} />+{loot.coinsAwarded}
                </div>
              </>
            ) : (
              <>
                <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">
                  New Gear!
                </p>
                {gear && (
                  <div className="mt-4 flex flex-col items-center gap-2 loot-pop">
                    <GearIcon gear={gear} size={88} />
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
              className="btn btn-primary pointer-events-auto mt-5 w-full"
            >
              Claim
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export function DailyChestGift({
  onDismiss,
}: {
  onDismiss: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-4 backdrop-blur-sm sm:items-center">
      <div className="surface-strong w-full max-w-sm p-5 text-center rise-in">
        <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-3xl bg-amber-50 loot-pop">
          <ChestIcon variant="wooden" size={100} />
        </div>
        <h3 className="mt-4 font-display text-2xl text-ink">Daily Gift!</h3>
        <p className="mt-2 text-sm text-ink-soft">
          A free Wooden Chest was added to your Vault. Open it whenever
          you&apos;re ready!
        </p>
        <button type="button" onClick={onDismiss} className="btn btn-primary mt-5 w-full">
          Awesome!
        </button>
      </div>
    </div>
  );
}

export function ParentPanel({
  gold,
  xp,
  level,
  onGrant,
  onClose,
  onReset,
}: {
  gold: number;
  xp: number;
  level: number;
  onGrant: (xp: number, gold: number) => void;
  onClose: () => void;
  onReset: () => void;
}) {
  const [xpInput, setXpInput] = useState("50");
  const [goldInput, setGoldInput] = useState("25");

  const grantXp = () => {
    const n = Number(xpInput);
    if (!Number.isFinite(n) || n <= 0) return;
    onGrant(n, 0);
  };

  const grantGold = () => {
    const n = Number(goldInput);
    if (!Number.isFinite(n) || n <= 0) return;
    onGrant(0, n);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-4 backdrop-blur-sm sm:items-center">
      <div className="surface-strong max-h-[90dvh] w-full max-w-sm overflow-y-auto p-5 rise-in">
        <h3 className="font-display text-xl text-ink">Grown-Up Panel</h3>
        <p className="mt-1 text-sm text-ink-soft">
          Level {level} · {xp} XP · {gold} gold
        </p>

        <div className="mt-4 rounded-2xl bg-sky-1/80 p-3">
          <p className="text-xs font-bold uppercase tracking-wide text-ink-soft">
            Add XP
          </p>
          <div className="mt-2 flex gap-2">
            <input
              type="number"
              min={1}
              inputMode="numeric"
              value={xpInput}
              onChange={(e) => setXpInput(e.target.value)}
              className="field min-h-11 flex-1"
            />
            <button
              type="button"
              onClick={grantXp}
              className="btn btn-secondary min-h-11 shrink-0 px-4 text-sm"
            >
              Add XP
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {[25, 50, 100, 250].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => onGrant(n, 0)}
                className="chip border-emerald-200 bg-emerald-50 text-emerald-700"
              >
                +{n} XP
              </button>
            ))}
          </div>
        </div>

        <div className="mt-3 rounded-2xl bg-amber-50/90 p-3">
          <p className="text-xs font-bold uppercase tracking-wide text-ink-soft">
            Add Gold
          </p>
          <div className="mt-2 flex gap-2">
            <input
              type="number"
              min={1}
              inputMode="numeric"
              value={goldInput}
              onChange={(e) => setGoldInput(e.target.value)}
              className="field min-h-11 flex-1"
            />
            <button
              type="button"
              onClick={grantGold}
              className="btn btn-primary min-h-11 shrink-0 gap-1 px-4 text-sm"
            >
              <GoldCoin size={16} />
              Add
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {[10, 25, 50, 100].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => onGrant(0, n)}
                className="chip border-amber-200 bg-amber-100 text-amber-800"
              >
                +{n}
              </button>
            ))}
          </div>
        </div>

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

/** @deprecated use ParentPanel */
export const ParentPlaceholder = ParentPanel;
