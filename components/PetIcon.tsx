"use client";

import Image from "next/image";
import { RARITY_COLORS } from "@/lib/gear";
import { getFamiliarPetImage, getPetImage } from "@/lib/petImages";
import { gearPalette } from "@/lib/pixel";
import type { FamiliarId, PetDef, PetSpecies, PetStage } from "@/lib/types";

export function PetSprite({
  species,
  familiar = null,
  stage = 1,
  size = 64,
  className = "",
}: {
  species: PetSpecies;
  familiar?: FamiliarId | null;
  stage?: PetStage;
  size?: number;
  className?: string;
}) {
  const grounded =
    familiar === "caliper" ||
    familiar === "maple" ||
    stage >= 2;
  const src = familiar
    ? getFamiliarPetImage(familiar, stage)
    : getPetImage(species, stage);
  return (
    <Image
      src={src}
      alt=""
      width={size}
      height={size}
      className={`object-contain drop-shadow-md ${grounded ? "object-bottom" : ""} ${className}`}
      style={{ width: size, height: size }}
      unoptimized
    />
  );
}

export function PetIcon({
  pet,
  familiar = null,
  stage = 1,
  size = 48,
}: {
  pet: PetDef;
  familiar?: FamiliarId | null;
  stage?: PetStage;
  size?: number;
}) {
  const border = RARITY_COLORS[pet.rarity];
  const c = gearPalette(pet.hue, pet.rarity);
  const fx =
    pet.rarity === "enchanted"
      ? "rarity-enchanted"
      : pet.rarity === "mythic"
        ? "rarity-mythic"
        : pet.rarity === "relic"
          ? "rarity-relic"
          : "";
  const artSize = Math.round(size * 0.88);

  return (
    <div
      className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-2xl ${fx}`}
      style={{
        width: size,
        height: size,
        background: `linear-gradient(145deg, ${c.hi}, ${c.main} 45%, ${c.deep})`,
        boxShadow: `0 8px 16px -8px ${border}88, inset 0 1px 0 rgba(255,255,255,.35)`,
        border: `2px solid ${border}`,
      }}
      aria-hidden
    >
      <PetSprite
        species={pet.species}
        familiar={familiar}
        stage={stage}
        size={artSize}
      />
      {pet.rarity === "relic" && (
        <span className="absolute -right-1 -top-1 text-xs text-amber-500">★</span>
      )}
      {stage >= 3 && (
        <span className="absolute bottom-0.5 left-0.5 rounded bg-ink/70 px-1 text-[8px] font-bold text-amber-200">
          BTL
        </span>
      )}
      {stage === 2 && (
        <span className="absolute bottom-0.5 left-0.5 rounded bg-ink/70 px-1 text-[8px] font-bold text-sky-100">
          II
        </span>
      )}
    </div>
  );
}
