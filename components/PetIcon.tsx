"use client";

import Image from "next/image";
import { RARITY_COLORS } from "@/lib/gear";
import { PET_IMAGES } from "@/lib/petImages";
import { gearPalette } from "@/lib/pixel";
import type { PetDef, PetSpecies } from "@/lib/types";

export function PetSprite({
  species,
  size = 64,
  className = "",
}: {
  species: PetSpecies;
  size?: number;
  className?: string;
}) {
  return (
    <Image
      src={PET_IMAGES[species]}
      alt=""
      width={size}
      height={size}
      className={`object-contain drop-shadow-md ${className}`}
      style={{ width: size, height: size }}
      unoptimized
    />
  );
}

export function PetIcon({
  pet,
  size = 48,
}: {
  pet: PetDef;
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
      <PetSprite species={pet.species} size={artSize} />
      {pet.rarity === "relic" && (
        <span className="absolute -right-1 -top-1 text-xs text-amber-500">★</span>
      )}
    </div>
  );
}
