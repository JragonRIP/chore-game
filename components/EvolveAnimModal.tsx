"use client";

import { useEffect, useState } from "react";
import { PetSprite } from "@/components/PetIcon";
import {
  familiarFromName,
  PET_BY_ID,
  petDisplayCatalogName,
} from "@/lib/pets";
import { playClick, playEvolve } from "@/lib/sounds";
import type { PetId, PetStage } from "@/lib/types";

export function EvolveAnimModal({
  petId,
  fromStage,
  toStage,
  nickname,
  onDismiss,
}: {
  petId: PetId;
  fromStage: PetStage;
  toStage: PetStage;
  nickname?: string;
  onDismiss: () => void;
}) {
  const pet = PET_BY_ID[petId];
  const [flash, setFlash] = useState(false);
  const familiar = familiarFromName(nickname);

  useEffect(() => {
    playEvolve();
    const t1 = window.setTimeout(() => setFlash(true), 700);
    return () => window.clearTimeout(t1);
  }, []);

  if (!pet) return null;

  const fromName = petDisplayCatalogName(pet.species, fromStage);
  const toName = petDisplayCatalogName(pet.species, toStage);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/55 p-4 backdrop-blur-sm sm:items-center">
      <div className="surface-strong w-full max-w-sm overflow-hidden p-5 text-center rise-in">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-violet-700">
          Evolution
        </p>
        <h3 className="mt-1 font-display text-2xl text-ink">
          {flash ? toName : fromName}
        </h3>
        <div className="relative mx-auto mt-5 flex h-40 w-40 items-center justify-center">
          <div
            className={`absolute inset-0 rounded-full bg-violet-300/40 blur-xl transition duration-700 ${
              flash ? "scale-150 opacity-90" : "scale-75 opacity-40"
            }`}
          />
          <div
            className={`evolve-burst relative transition duration-700 ${
              flash ? "scale-110" : "scale-95"
            }`}
          >
            <PetSprite
              species={pet.species}
              familiar={familiar}
              stage={flash ? toStage : fromStage}
              size={120}
            />
          </div>
        </div>
        <p className="mt-4 text-sm text-ink-soft">
          {flash
            ? `${nickname?.trim() || fromName} evolved into ${toName}!`
            : "Power gathers…"}
        </p>
        <button
          type="button"
          disabled={!flash}
          onClick={() => {
            playClick();
            onDismiss();
          }}
          className="btn btn-primary mt-5 w-full disabled:opacity-40"
        >
          Amazing!
        </button>
      </div>
    </div>
  );
}
