"use client";

import type { GearDef, Rarity } from "@/lib/types";
import { RARITY_COLORS, RARITY_LABELS } from "@/lib/gear";
import { gearPalette } from "@/lib/pixel";
import { BootsArt } from "@/components/gear/BootsArt";
import { ChestplateArt } from "@/components/gear/ChestplateArt";
import { HelmetArt } from "@/components/gear/HelmetArt";
import { LeggingsArt } from "@/components/gear/LeggingsArt";
import { WeaponArt } from "@/components/gear/WeaponArt";

export function GearIcon({
  gear,
  size = 48,
}: {
  gear: GearDef;
  size?: number;
}) {
  const border = RARITY_COLORS[gear.rarity];
  const c = gearPalette(gear.hue, gear.rarity);
  const fx =
    gear.rarity === "enchanted"
      ? "rarity-enchanted"
      : gear.rarity === "mythic"
        ? "rarity-mythic"
        : gear.rarity === "relic"
          ? "rarity-relic"
          : "";

  const artSize = Math.round(size * 0.82);

  const art =
    gear.slot === "chestplate" ? (
      <ChestplateArt id={gear.id} size={artSize} />
    ) : gear.slot === "helmet" ? (
      <HelmetArt id={gear.id} size={artSize} />
    ) : gear.slot === "leggings" ? (
      <LeggingsArt id={gear.id} size={artSize} />
    ) : gear.slot === "boots" ? (
      <BootsArt id={gear.id} size={artSize} />
    ) : (
      <WeaponArt id={gear.id} size={artSize} />
    );

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
      {art}
      {gear.rarity === "relic" && (
        <span className="absolute -right-1 -top-1 text-xs text-amber-500">★</span>
      )}
    </div>
  );
}

export function RarityBadge({ rarity }: { rarity: Rarity }) {
  return (
    <span
      className="inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide"
      style={{
        color: RARITY_COLORS[rarity],
        background: `${RARITY_COLORS[rarity]}22`,
        border: `1px solid ${RARITY_COLORS[rarity]}55`,
      }}
    >
      {RARITY_LABELS[rarity]}
    </span>
  );
}

export const PixelGearIcon = GearIcon;
