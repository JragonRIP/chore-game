"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { GEAR_BY_ID } from "@/lib/gear";
import { FAMILIAR_LABELS, PET_BY_ID } from "@/lib/pets";
import { ChestIcon, chestIconVariant, chestLabel } from "@/components/ChestIcon";
import { PetIcon, PetSprite } from "@/components/PetIcon";
import { GearIcon, RarityBadge } from "@/components/PixelGearIcon";
import { GoldCoin } from "@/components/GoldCoin";
import type { Celebration } from "@/hooks/useGameState";
import { PARENT_PIN } from "@/hooks/useGameState";
import {
  playChestOpen,
  playClick,
  playFanfare,
  playLevelUp,
  playQuestComplete,
} from "@/lib/sounds";
import type {
  FamiliarId,
  GameState,
  LootEvent,
  QuestId,
  QuestOverride,
  VaultChest,
} from "@/lib/types";
import { QUESTS } from "@/lib/quests";
import { getQuestById } from "@/lib/questResolve";

export function CelebrationModal({
  data,
  onClose,
}: {
  data: Celebration;
  onClose: () => void;
}) {
  const [phase, setPhase] = useState<"burst" | "fly" | "done">("burst");
  const pet = data.equippedPetId
    ? PET_BY_ID[data.equippedPetId]
    : null;

  useEffect(() => {
    playQuestComplete();
    if (data.levels.length > 0) playLevelUp();
    const hold = data.petXp > 0 ? 2100 : 1750;
    const t1 = window.setTimeout(() => setPhase("fly"), 450);
    const t2 = window.setTimeout(() => setPhase("done"), 1400);
    const t3 = window.setTimeout(onClose, hold);
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
          {pet && (
            <div className="mt-3 flex flex-col items-center gap-2">
              <PetIcon pet={pet} size={48} />
              {data.petXp > 0 && (
                <span className="rounded-full bg-teal/15 px-3 py-1 text-[11px] font-bold text-teal-deep">
                  +{data.petXp} Pet XP
                  {data.petLevels.length > 0
                    ? ` · Pet Lv ${data.petLevels[data.petLevels.length - 1]}!`
                    : ""}
                </span>
              )}
            </div>
          )}
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
  const gear =
    loot && (loot.kind === "gear" || loot.kind === "duplicate")
      ? GEAR_BY_ID[loot.gearId]
      : null;
  const pet =
    loot && (loot.kind === "pet" || loot.kind === "pet-duplicate")
      ? PET_BY_ID[loot.petId]
      : null;
  const crystal = chest.type === "crystal";
  const legendary = chest.type === "legendary";
  const openMs = crystal ? 2000 : legendary ? 1600 : 900;
  const [cardFlipped, setCardFlipped] = useState(false);

  useEffect(() => {
    if (phase !== "opening") return;
    playChestOpen();
    const t = window.setTimeout(onFinishOpen, openMs);
    return () => window.clearTimeout(t);
  }, [phase, onFinishOpen, openMs]);

  useEffect(() => {
    if (phase !== "reveal" || !loot) return;
    setCardFlipped(false);
    const t = window.setTimeout(() => {
      setCardFlipped(true);
      playFanfare();
    }, 450);
    return () => window.clearTimeout(t);
  }, [phase, loot]);

  const openClass = crystal
    ? "bg-gradient-to-br from-pink-100 via-rose-50 to-white chest-open-crystal"
    : legendary
      ? "bg-gradient-to-br from-amber-200 to-yellow-100 chest-open-legendary"
      : "bg-amber-50 chest-open-wooden";

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/45 p-4 backdrop-blur-sm sm:items-center">
      <div className="surface-strong w-full max-w-sm p-5 text-center rise-in">
        {phase === "opening" && (
          <>
            <div
              className={`mx-auto flex h-32 w-32 items-center justify-center rounded-3xl ${openClass}`}
            >
              <ChestIcon variant={chestIconVariant(chest.type)} size={110} />
            </div>
            <h3 className="mt-4 font-display text-xl text-ink">
              Opening {chestLabel(chest.type)}…
            </h3>
            <p className="mt-2 text-sm text-ink-soft">{chest.reason}</p>
          </>
        )}

        {phase === "reveal" && loot && (
          <>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-deep">
              Loot Card
            </p>
            <button
              type="button"
              onClick={() => {
                if (!cardFlipped) {
                  setCardFlipped(true);
                  playFanfare();
                }
              }}
              className="loot-card-scene mx-auto mt-4"
              aria-label="Reveal loot card"
            >
              <div
                className={`loot-card ${cardFlipped ? "loot-card-flipped" : ""}`}
              >
                <div className="loot-card-face loot-card-back">
                  <ChestIcon
                    variant={chestIconVariant(chest.type)}
                    size={72}
                  />
                  <p className="mt-2 text-xs font-bold text-white/90">Tap</p>
                </div>
                <div className="loot-card-face loot-card-front">
                  {loot.kind === "duplicate" && (
                    <>
                      <p className="text-[10px] font-bold uppercase tracking-wide text-amber-700">
                        Duplicate
                      </p>
                      {gear && <GearIcon gear={gear} size={64} />}
                      <p className="mt-1 text-sm font-semibold text-ink">
                        {gear?.name}
                      </p>
                      <div className="mt-1 flex items-center justify-center gap-1 font-display text-lg text-amber-800">
                        <GoldCoin size={18} />+{loot.coinsAwarded}
                      </div>
                    </>
                  )}
                  {loot.kind === "gear" && gear && (
                    <>
                      <p className="text-[10px] font-bold uppercase tracking-wide text-emerald-700">
                        New Gear!
                      </p>
                      <GearIcon gear={gear} size={72} />
                      <p className="mt-1 font-display text-base text-ink">
                        {gear.name}
                      </p>
                      <RarityBadge rarity={gear.rarity} />
                    </>
                  )}
                  {loot.kind === "pet" && pet && (
                    <>
                      <p className="text-[10px] font-bold uppercase tracking-wide text-teal-deep">
                        New Companion!
                      </p>
                      <PetIcon pet={pet} size={72} />
                      <p className="mt-1 font-display text-base text-ink">
                        {pet.name}
                      </p>
                      <RarityBadge rarity={pet.rarity} />
                    </>
                  )}
                  {loot.kind === "pet-duplicate" && (
                    <>
                      <p className="text-[10px] font-bold uppercase tracking-wide text-amber-700">
                        Duplicate Pet
                      </p>
                      {pet && <PetIcon pet={pet} size={64} />}
                      <div className="mt-1 flex flex-col items-center gap-0.5 font-display text-base text-amber-800">
                        <span className="inline-flex items-center gap-1">
                          <GoldCoin size={16} />+{loot.coinsAwarded}
                        </span>
                        <span className="text-sm text-emerald-700">
                          +{loot.xpAwarded} XP
                        </span>
                      </div>
                    </>
                  )}
                  {loot.kind === "evo-stone" && (
                    <>
                      <p className="text-[10px] font-bold uppercase tracking-wide text-violet-700">
                        Rare Find!
                      </p>
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-100 to-amber-50 text-4xl">
                        💎
                      </div>
                      <p className="mt-1 font-display text-base text-ink">
                        Evolution Stone
                      </p>
                    </>
                  )}
                </div>
              </div>
            </button>
            {cardFlipped && loot.bonusCoins > 0 && (
              <div className="mt-3 flex items-center justify-center gap-1.5 text-sm font-bold text-amber-800">
                <GoldCoin size={16} />+{loot.bonusCoins} chest gold
              </div>
            )}
            <button
              type="button"
              disabled={!cardFlipped}
              onClick={() => {
                playClick();
                onDismiss();
              }}
              className="btn btn-primary pointer-events-auto mt-5 w-full disabled:opacity-40"
            >
              Claim
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export function FamiliarRevealModal({
  familiar,
  onDismiss,
}: {
  familiar: FamiliarId;
  onDismiss: () => void;
}) {
  const name = FAMILIAR_LABELS[familiar];
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/45 p-4 backdrop-blur-sm sm:items-center">
      <div className="surface-strong w-full max-w-sm p-5 text-center rise-in">
        <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-3xl bg-gradient-to-br from-amber-50 to-sky-2 loot-pop">
          <PetSprite species="wolf" familiar={familiar} size={96} />
        </div>
        <h3 className="mt-4 font-display text-2xl text-ink">{name}?</h3>
        <p className="mt-2 text-sm text-ink-soft">
          Oh — you found a familiar friend.
        </p>
        <button
          type="button"
          onClick={onDismiss}
          className="btn btn-primary mt-5 w-full"
        >
          Hi {name}
        </button>
      </div>
    </div>
  );
}

export function EvolveHintModal({
  kind,
  onDismiss,
}: {
  kind: "adult" | "battle";
  onDismiss: () => void;
}) {
  const adult = kind === "adult";
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/45 p-4 backdrop-blur-sm sm:items-center">
      <div className="surface-strong w-full max-w-sm p-5 text-center rise-in">
        <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-100 to-amber-50 loot-pop text-5xl">
          {adult ? "✨" : "⚔️"}
        </div>
        <h3 className="mt-4 font-display text-2xl text-ink">
          {adult ? "Ready to Evolve!" : "Battle Form Ready!"}
        </h3>
        <p className="mt-2 text-sm text-ink-soft">
          {adult
            ? "Your companion reached level 5 and can evolve into its adult form. You’ll need an Evolution Stone — look for them in chests — then tap Evolve on the Pets tab."
            : "Your companion reached level 10 and can evolve into its Battle form. Use an Evolution Stone on the Pets tab to transform them."}
        </p>
        <button
          type="button"
          onClick={onDismiss}
          className="btn btn-primary mt-5 w-full"
        >
          Got it
        </button>
      </div>
    </div>
  );
}

export function PetsUnlockModal({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/45 p-4 backdrop-blur-sm sm:items-center">
      <div className="surface-strong w-full max-w-sm p-5 text-center rise-in">
        <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-3xl bg-gradient-to-br from-teal/20 to-sky-2 loot-pop">
          <span className="font-display text-5xl text-teal-deep">?</span>
        </div>
        <h3 className="mt-4 font-display text-2xl text-ink">Pets Unlocked!</h3>
        <p className="mt-2 text-sm text-ink-soft">
          Loyal companions can now join your quests. Find them in chests and on
          the Store shelf — then equip one on the Pets tab.
        </p>
        <button
          type="button"
          onClick={onDismiss}
          className="btn btn-primary mt-5 w-full"
        >
          Meet Companions
        </button>
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
        <button
          type="button"
          onClick={() => {
            playClick();
            onDismiss();
          }}
          className="btn btn-primary mt-5 w-full"
        >
          Awesome!
        </button>
      </div>
    </div>
  );
}

export function ParentPanel({
  state,
  onGrant,
  onClose,
  onReset,
  onForceUnlockPets,
  onUpdateQuest,
  onSetEncounterChancePct,
  onStartTestChore,
}: {
  state: GameState;
  onGrant: (xp: number, gold: number) => void;
  onClose: () => void;
  onReset: () => void;
  onForceUnlockPets: () => void;
  onUpdateQuest: (questId: QuestId, patch: QuestOverride) => void;
  onSetEncounterChancePct: (pct: number) => void;
  onStartTestChore: () => void;
}) {
  const [unlocked, setUnlocked] = useState(false);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState(false);
  const [xpInput, setXpInput] = useState("50");
  const [goldInput, setGoldInput] = useState("25");
  const [confirmReset, setConfirmReset] = useState(false);
  const [editId, setEditId] = useState<QuestId | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [tab, setTab] = useState<"home" | "testing">("home");
  const chancePct = state.encounterChancePct ?? 25;

  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2200);
  };

  const tryPin = () => {
    if (pin === PARENT_PIN) {
      setUnlocked(true);
      setPinError(false);
      setPin("");
      return;
    }
    setPinError(true);
    setPin("");
  };

  const grantXp = () => {
    const n = Number(xpInput);
    if (!Number.isFinite(n) || n <= 0) return;
    onGrant(n, 0);
    showToast(`Added ${Math.floor(n)} XP`);
  };

  const grantGold = () => {
    const n = Number(goldInput);
    if (!Number.isFinite(n) || n <= 0) return;
    onGrant(0, n);
    showToast(`Added ${Math.floor(n)} gold`);
  };

  const editing = editId ? QUESTS.find((q) => q.id === editId) : null;
  const editingResolved = editId ? getQuestById(state, editId) : null;

  if (!unlocked) {
    return (
      <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-4 backdrop-blur-sm sm:items-center">
        <div className="surface-strong w-full max-w-sm p-5 rise-in">
          <h3 className="font-display text-xl text-ink">Grown-Up Lock</h3>
          <p className="mt-1 text-sm text-ink-soft">
            Enter the parent PIN to continue.
          </p>
          <input
            type="password"
            inputMode="numeric"
            autoComplete="off"
            maxLength={8}
            value={pin}
            onChange={(e) => {
              setPin(e.target.value.replace(/\D/g, "").slice(0, 8));
              setPinError(false);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") tryPin();
            }}
            className={`field mt-4 min-h-12 w-full text-center text-lg tracking-[0.35em] ${
              pinError ? "ring-2 ring-rose-400" : ""
            }`}
            placeholder="••••"
            aria-label="Parent PIN"
          />
          {pinError && (
            <p className="mt-2 text-center text-sm font-semibold text-rose-600">
              Try again
            </p>
          )}
          <button
            type="button"
            onClick={tryPin}
            className="btn btn-primary mt-4 w-full"
          >
            Unlock
          </button>
          <button type="button" onClick={onClose} className="btn btn-ghost mt-2 w-full">
            Cancel
          </button>
        </div>
      </div>
    );
  }

  if (confirmReset) {
    return (
      <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/50 p-4 backdrop-blur-sm sm:items-center">
        <div className="surface-strong w-full max-w-sm p-5 text-center rise-in">
          <h3 className="font-display text-xl text-ink">Reset everything?</h3>
          <p className="mt-2 text-sm text-ink-soft">
            This clears hero progress, gear, pets, and quest edits. It cannot be
            undone.
          </p>
          <button
            type="button"
            onClick={() => {
              setConfirmReset(false);
              onReset();
            }}
            className="btn mt-5 w-full bg-rose-600 text-white hover:bg-rose-700"
          >
            Yes, reset all progress
          </button>
          <button
            type="button"
            onClick={() => setConfirmReset(false)}
            className="btn btn-ghost mt-2 w-full"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  if (editing && editingResolved) {
    return (
      <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-4 backdrop-blur-sm sm:items-center">
        <div className="surface-strong max-h-[90dvh] w-full max-w-sm overflow-y-auto p-5 rise-in">
          <h3 className="font-display text-xl text-ink">Edit Quest</h3>
          <p className="mt-1 text-xs text-ink-soft">{editing.category}</p>

          <label className="mt-4 block text-xs font-bold uppercase tracking-wide text-ink-soft">
            Name
          </label>
          <input
            className="field mt-1 min-h-11 w-full"
            value={editingResolved.name}
            onChange={(e) =>
              onUpdateQuest(editing.id, { name: e.target.value })
            }
          />

          <label className="mt-3 block text-xs font-bold uppercase tracking-wide text-ink-soft">
            XP
          </label>
          <input
            type="number"
            min={1}
            inputMode="numeric"
            className="field mt-1 min-h-11 w-full"
            value={editingResolved.xp}
            onChange={(e) =>
              onUpdateQuest(editing.id, { xp: Number(e.target.value) || 1 })
            }
          />

          <label className="mt-3 block text-xs font-bold uppercase tracking-wide text-ink-soft">
            Coins
          </label>
          <input
            type="number"
            min={0}
            inputMode="numeric"
            className="field mt-1 min-h-11 w-full"
            value={editingResolved.coins}
            onChange={(e) =>
              onUpdateQuest(editing.id, {
                coins: Number(e.target.value) || 0,
              })
            }
          />

          <button
            type="button"
            onClick={() => setEditId(null)}
            className="btn btn-primary mt-5 w-full"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-4 backdrop-blur-sm sm:items-center">
      <div className="surface-strong max-h-[90dvh] w-full max-w-sm overflow-y-auto p-5 rise-in">
        <h3 className="font-display text-xl text-ink">Grown-Up Panel</h3>
        <p className="mt-1 text-sm text-ink-soft">
          Level {state.level} · {state.xp} XP · {state.gold} gold
        </p>

        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={() => setTab("home")}
            className={`chip flex-1 justify-center ${tab === "home" ? "chip-active" : ""}`}
          >
            Home
          </button>
          <button
            type="button"
            onClick={() => setTab("testing")}
            className={`chip flex-1 justify-center ${tab === "testing" ? "chip-active" : ""}`}
          >
            Testing
          </button>
        </div>

        {toast && (
          <p className="mt-3 rounded-xl bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">
            {toast}
          </p>
        )}

        {tab === "testing" ? (
          <>
            <div className="mt-4 rounded-2xl bg-rose-50 p-3">
              <p className="text-xs font-bold uppercase tracking-wide text-ink-soft">
                Encounter chance
              </p>
              <p className="mt-1 text-sm text-ink-soft">
                After a chore completes, roll for a monster fight.
              </p>
              <div className="mt-3 flex items-center gap-3">
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  value={chancePct}
                  onChange={(e) =>
                    onSetEncounterChancePct(Number(e.target.value))
                  }
                  className="w-full accent-rose-500"
                  aria-label="Encounter chance percent"
                />
                <span className="w-12 shrink-0 text-right font-display text-lg text-ink">
                  {chancePct}%
                </span>
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {[0, 25, 50, 75, 100].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => onSetEncounterChancePct(n)}
                    className={`chip ${
                      chancePct === n
                        ? "border-rose-300 bg-rose-100 text-rose-800"
                        : "border-ink/10 bg-white text-ink-soft"
                    }`}
                  >
                    {n}%
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-3 rounded-2xl bg-amber-50/90 p-3">
              <p className="text-xs font-bold uppercase tracking-wide text-ink-soft">
                Test chore
              </p>
              <p className="mt-1 text-sm text-ink-soft">
                Fake 3-second chore with no gold or XP. Uses the encounter
                chance above — set to 100% to always fight.
              </p>
              <button
                type="button"
                onClick={() => {
                  onStartTestChore();
                }}
                className="btn btn-secondary mt-3 min-h-11 w-full text-sm"
              >
                Start test chore
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="btn btn-primary mt-5 w-full"
            >
              Close
            </button>
          </>
        ) : (
          <>
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
                onClick={() => {
                  onGrant(n, 0);
                  showToast(`Added ${n} XP`);
                }}
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
                onClick={() => {
                  onGrant(0, n);
                  showToast(`Added ${n} gold`);
                }}
                className="chip border-amber-200 bg-amber-100 text-amber-800"
              >
                +{n}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-3 rounded-2xl bg-teal/10 p-3">
          <p className="text-xs font-bold uppercase tracking-wide text-ink-soft">
            Companions
          </p>
          <p className="mt-1 text-xs text-ink-soft">
            {state.petsUnlocked ? "Pets are unlocked." : "Pets are still locked."}
          </p>
          <button
            type="button"
            disabled={state.petsUnlocked}
            onClick={onForceUnlockPets}
            className="btn btn-secondary mt-2 min-h-10 w-full text-xs"
          >
            {state.petsUnlocked ? "Already unlocked" : "Force unlock pets"}
          </button>
        </div>

        <h4 className="mt-5 font-display text-base text-ink">Quests</h4>
        <p className="text-xs text-ink-soft">Toggle off or edit name / XP / coins.</p>
        <div className="mt-2 flex max-h-56 flex-col gap-2 overflow-y-auto">
          {QUESTS.map((q) => {
            const resolved = getQuestById(state, q.id)!;
            const disabled = Boolean(state.questOverrides[q.id]?.disabled);
            return (
              <div
                key={q.id}
                className={`surface flex items-center gap-2 p-2.5 ${
                  disabled ? "opacity-55" : ""
                }`}
              >
                <button
                  type="button"
                  onClick={() =>
                    onUpdateQuest(q.id, { disabled: !disabled })
                  }
                  className={`min-h-9 shrink-0 rounded-xl px-2.5 text-[10px] font-bold ${
                    disabled
                      ? "bg-ink/10 text-ink-soft"
                      : "bg-emerald-100 text-emerald-800"
                  }`}
                >
                  {disabled ? "Off" : "On"}
                </button>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-ink">
                    {resolved.name}
                  </p>
                  <p className="text-[10px] text-ink-soft">
                    {resolved.xp} XP · {resolved.coins} gold
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setEditId(q.id)}
                  className="btn btn-ghost min-h-9 px-2 text-[10px]"
                >
                  Edit
                </button>
              </div>
            );
          })}
        </div>

        <button type="button" onClick={onClose} className="btn btn-primary mt-5 w-full">
          Close
        </button>
        <button
          type="button"
          onClick={() => setConfirmReset(true)}
          className="btn btn-ghost mt-2 w-full text-rose-600"
        >
          Reset All Progress
        </button>
          </>
        )}
      </div>
    </div>
  );
}

/** @deprecated use ParentPanel */
export const ParentPlaceholder = ParentPanel;
