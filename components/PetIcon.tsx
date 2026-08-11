"use client";

import { RARITY_COLORS } from "@/lib/gear";
import { gearPalette } from "@/lib/pixel";
import type { PetDef, PetSpecies } from "@/lib/types";

function PetSilhouette({
  species,
  color,
  size,
}: {
  species: PetSpecies;
  color: string;
  size: number;
}) {
  if (species === "lizard") {
    return (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
        <ellipse cx="16" cy="18" rx="9" ry="5" fill={color} />
        <circle cx="24" cy="14" r="4" fill={color} />
        <circle cx="25.5" cy="13" r="1" fill="#0f172a" />
        <path
          d="M8 18 Q4 12 6 8"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        <path d="M12 22 L10 27 M16 23 L16 28 M20 22 L22 27" stroke={color} strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }
  if (species === "wolf") {
    return (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
        <ellipse cx="15" cy="20" rx="8" ry="6" fill={color} />
        <path d="M10 12 L12 18 L8 17 Z" fill={color} />
        <path d="M20 12 L18 18 L22 17 Z" fill={color} />
        <circle cx="15" cy="15" r="5.5" fill={color} />
        <circle cx="13" cy="14" r="1" fill="#0f172a" />
        <circle cx="17" cy="14" r="1" fill="#0f172a" />
        <path d="M23 20 Q28 18 27 14" stroke={color} strokeWidth="2.5" strokeLinecap="round" fill="none" />
      </svg>
    );
  }
  if (species === "lion") {
    return (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="9" fill={`${color}88`} />
        <circle cx="16" cy="16" r="6" fill={color} />
        <circle cx="13.5" cy="15" r="1.1" fill="#0f172a" />
        <circle cx="18.5" cy="15" r="1.1" fill="#0f172a" />
        <path d="M14 19 Q16 21 18 19" stroke="#0f172a" strokeWidth="1.2" fill="none" strokeLinecap="round" />
        <ellipse cx="16" cy="25" rx="5" ry="3" fill={color} />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <ellipse cx="16" cy="20" rx="8" ry="5.5" fill={color} />
      <circle cx="22" cy="14" r="5" fill={color} />
      <path d="M18 10 L16 4 L20 8 Z" fill={color} />
      <path d="M24 10 L26 4 L22 8 Z" fill={color} />
      <circle cx="23.5" cy="13" r="1" fill="#0f172a" />
      <path
        d="M8 18 Q3 14 5 9"
        stroke="#f97316"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <path d="M10 24 L8 28 M16 25 L16 29 M22 24 L24 28" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
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
  const artSize = Math.round(size * 0.72);

  return (
    <div
      className={`relative flex shrink-0 items-center justify-center rounded-2xl ${fx}`}
      style={{
        width: size,
        height: size,
        background: `linear-gradient(145deg, ${c.hi}, ${c.main} 45%, ${c.deep})`,
        boxShadow: `0 8px 16px -8px ${border}88, inset 0 1px 0 rgba(255,255,255,.35)`,
        border: `2px solid ${border}`,
      }}
      aria-hidden
    >
      <PetSilhouette species={pet.species} color="rgba(255,255,255,.92)" size={artSize} />
      {pet.rarity === "relic" && (
        <span className="absolute -right-1 -top-1 text-xs text-amber-500">★</span>
      )}
    </div>
  );
}
