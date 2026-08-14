"use client";

import { useEffect, useRef, useState } from "react";
import { ChestIcon, chestLabel, chestIconVariant } from "@/components/ChestIcon";
import { EncounterSprite } from "@/components/EncounterSprite";
import { GoldCoin } from "@/components/GoldCoin";
import { GearIcon } from "@/components/PixelGearIcon";
import { GEAR_BY_ID } from "@/lib/gear";
import type { EncounterDef, EncounterReward } from "@/lib/encounters";
import { playClick, playEncounter, playWin } from "@/lib/sounds";

export function EncounterModal({
  encounter,
  onResolve,
}: {
  encounter: EncounterDef;
  onResolve: (won: boolean) => void;
}) {
  const [taps, setTaps] = useState(0);
  const [left, setLeft] = useState(encounter.seconds);
  const [phase, setPhase] = useState<"fight" | "won" | "lost">("fight");
  const [claimReady, setClaimReady] = useState(false);
  const settled = useRef(false);

  useEffect(() => {
    playEncounter();
  }, []);

  useEffect(() => {
    if (phase !== "won") {
      setClaimReady(false);
      return;
    }
    const t = window.setTimeout(() => setClaimReady(true), 1500);
    return () => window.clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    if (phase !== "fight") return;
    const t = window.setInterval(() => {
      setLeft((s) => {
        if (s <= 1) {
          window.clearInterval(t);
          if (!settled.current) {
            settled.current = true;
            setPhase("lost");
          }
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => window.clearInterval(t);
  }, [phase]);

  const pct = Math.min(100, (taps / encounter.tapsNeeded) * 100);

  const mash = () => {
    if (phase !== "fight" || settled.current) return;
    playClick();
    setTaps((n) => {
      const next = n + 1;
      if (next >= encounter.tapsNeeded) {
        settled.current = true;
        playWin();
        setPhase("won");
      }
      return next;
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/50 p-4 backdrop-blur-sm sm:items-center">
      <div className="surface-strong w-full max-w-sm p-5 text-center rise-in">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-rose-600">
          Encounter!
        </p>
        <div className="mt-3 rounded-[1.75rem] bg-gradient-to-b from-sky-2/80 to-white py-3 ring-1 ring-ink/5">
          <EncounterSprite
            encounter={encounter}
            size={168}
            animate={phase === "fight"}
          />
        </div>
        <h3 className="mt-3 font-display text-2xl text-ink">{encounter.name}</h3>
        <p className="mt-1 text-sm text-ink-soft">{encounter.blurb}</p>

        {phase === "fight" && (
          <>
            <div className="mt-4">
              <div className="mb-1 flex justify-between text-[10px] font-bold text-ink-soft">
                <span>
                  {taps}/{encounter.tapsNeeded} taps
                </span>
                <span>{left}s</span>
              </div>
              <div className="progress-track h-3">
                <div
                  className="progress-fill h-3 transition-[width] duration-100"
                  style={{
                    width: `${pct}%`,
                    background: "linear-gradient(90deg, #f43f5e, #fb7185)",
                  }}
                />
              </div>
            </div>
            <button
              type="button"
              onClick={mash}
              className="btn btn-primary mt-5 min-h-16 w-full text-lg active:scale-95"
            >
              Tap to fight!
            </button>
          </>
        )}

        {phase === "won" && (
          <>
            <div className="mt-6 min-h-[4.5rem]">
              <p className="font-display text-2xl text-emerald-700 rise-in">
                Victory!
              </p>
              {!claimReady && (
                <p className="mt-2 text-sm text-ink-soft">Collecting spoils…</p>
              )}
            </div>
            {claimReady ? (
              <button
                type="button"
                onClick={() => {
                  playClick();
                  onResolve(true);
                }}
                className="btn btn-secondary mt-2 w-full rise-in"
              >
                Claim spoils
              </button>
            ) : (
              <div className="mt-2 min-h-12" aria-hidden />
            )}
          </>
        )}

        {phase === "lost" && (
          <>
            <p className="mt-4 text-sm font-semibold text-ink-soft">
              It got away — no worries, try next chore!
            </p>
            <button
              type="button"
              onClick={() => {
                playClick();
                onResolve(false);
              }}
              className="btn btn-ghost mt-6 w-full text-sm"
            >
              Continue
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export function EncounterRewardToast({
  reward,
  onDismiss,
}: {
  reward: EncounterReward;
  onDismiss: () => void;
}) {
  const gear =
    reward.kind === "gear" ? GEAR_BY_ID[reward.gearId] : null;

  useEffect(() => {
    const t = window.setTimeout(onDismiss, 2800);
    return () => window.clearTimeout(t);
  }, [onDismiss]);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-24 z-40 flex justify-center px-4">
      <div className="surface-strong flex max-w-sm items-center gap-3 px-4 py-3 rise-in">
        {reward.kind === "chest" && (
          <ChestIcon
            variant={chestIconVariant(reward.chest.type)}
            size={40}
          />
        )}
        {reward.kind === "gear" && gear && <GearIcon gear={gear} size={40} />}
        {reward.kind === "flat" && <GoldCoin size={28} />}
        <div className="min-w-0 text-left text-sm">
          <p className="font-bold text-ink">
            {reward.kind === "chest"
              ? `${chestLabel(reward.chest.type)} → Vault`
              : reward.kind === "gear"
                ? gear?.name ?? "Scrap drop"
                : "Bonus loot"}
          </p>
          <p className="text-ink-soft">
            +{reward.gold} gold · +{reward.xp} XP
          </p>
        </div>
      </div>
    </div>
  );
}
