"use client";

import { useMemo, useState } from "react";
import { PetIcon, PetSprite } from "@/components/PetIcon";
import { GearIcon, RarityBadge } from "@/components/PixelGearIcon";
import {
  collectionCounts,
  collectionGearRows,
  collectionPetSpeciesRows,
} from "@/lib/collection";
import { PET_STAGE_LABELS, PET_SPECIES_LABELS } from "@/lib/pets";
import type { GameState, PetStage } from "@/lib/types";

type BookTab = "gear" | "pets";

export function CollectionBook({
  open,
  onClose,
  state,
}: {
  open: boolean;
  onClose: () => void;
  state: GameState;
}) {
  const [tab, setTab] = useState<BookTab>("gear");
  const counts = useMemo(() => collectionCounts(state), [state]);
  const gearRows = useMemo(() => collectionGearRows(state), [state]);
  const petRows = useMemo(() => collectionPetSpeciesRows(state), [state]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end sm:items-center sm:justify-center">
      <button
        type="button"
        aria-label="Close collection"
        className="absolute inset-0 bg-ink/40 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div className="relative z-10 mx-auto flex max-h-[92dvh] w-full max-w-lg flex-col overflow-hidden rounded-t-[1.75rem] bg-paper shadow-xl sm:rounded-[1.75rem]">
        <div className="mx-auto mt-3 h-1.5 w-12 rounded-full bg-ink/15 sm:hidden" />
        <div className="flex items-start justify-between gap-3 px-4 pb-2 pt-4">
          <div>
            <h2 className="font-display text-2xl text-ink">Collection</h2>
            <p className="mt-0.5 text-sm text-ink-soft">
              Gear {counts.gearOwned}/{counts.gearTotal} · Pets{" "}
              {counts.petSpeciesOwned}/{counts.petSpeciesTotal} · Stages{" "}
              {counts.stagesUnlocked}/{counts.stagesTotal}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-ghost min-h-9 px-3 text-xs"
          >
            Close
          </button>
        </div>

        <div className="flex gap-2 px-4 pb-2">
          {(
            [
              ["gear", "Gear"],
              ["pets", "Pets"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`chip ${tab === id ? "chip-active" : ""}`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          {tab === "gear" && (
            <div className="grid grid-cols-2 gap-2.5 pb-4 sm:grid-cols-3">
              {gearRows.map(({ gear, owned }) => (
                <article
                  key={gear.id}
                  className={`surface flex flex-col items-center gap-2 p-3 ${
                    owned ? "" : "opacity-70"
                  }`}
                >
                  {owned ? (
                    <GearIcon gear={gear} size={48} />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-dashed border-ink/25 bg-ink/5 font-display text-xl text-ink/35">
                      ?
                    </div>
                  )}
                  <p className="line-clamp-2 text-center font-display text-xs text-ink">
                    {owned ? gear.name : "Unknown gear"}
                  </p>
                  {owned ? (
                    <RarityBadge rarity={gear.rarity} />
                  ) : (
                    <span className="text-[10px] font-bold text-ink-soft">
                      Locked
                    </span>
                  )}
                </article>
              ))}
            </div>
          )}

          {tab === "pets" && (
            <div className="flex flex-col gap-3 pb-4">
              {petRows.map((row) => (
                <article key={row.species} className="surface p-3">
                  <div className="flex items-center gap-3">
                    {row.owned && row.sample ? (
                      <PetIcon pet={row.sample} stage={row.maxStage} size={56} />
                    ) : (
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-dashed border-ink/25 bg-ink/5 font-display text-2xl text-ink/35">
                        ?
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="font-display text-sm text-ink">
                        {row.owned
                          ? PET_SPECIES_LABELS[row.species]
                          : "Unknown companion"}
                      </p>
                      <p className="text-[10px] font-semibold text-ink-soft">
                        {row.owned
                          ? `Best form: ${PET_STAGE_LABELS[row.species][row.maxStage]}`
                          : "Find in chests or the Store"}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {([1, 2, 3] as PetStage[]).map((stage) => {
                      const unlocked = row.owned && row.maxStage >= stage;
                      return (
                        <div
                          key={stage}
                          className={`flex flex-col items-center rounded-2xl bg-sky-1/70 p-2 ${
                            unlocked ? "" : "opacity-60"
                          }`}
                        >
                          {unlocked && row.sample ? (
                            <PetSprite
                              species={row.species}
                              stage={stage}
                              size={40}
                            />
                          ) : (
                            <span className="flex h-10 w-10 items-center justify-center font-display text-lg text-ink/30">
                              ?
                            </span>
                          )}
                          <span className="mt-1 text-center text-[9px] font-bold text-ink-soft">
                            {unlocked
                              ? PET_STAGE_LABELS[row.species][stage]
                              : `Stage ${stage}`}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
