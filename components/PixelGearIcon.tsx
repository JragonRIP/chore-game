"use client";

import type { GearDef, Rarity } from "@/lib/types";
import { RARITY_COLORS } from "@/lib/gear";
import { GearIconArt } from "@/components/sprites/GearOverlays";
import { gearPalette } from "@/lib/pixel";

export function PixelGearIcon({
  gear,
  size = 48,
}: {
  gear: GearDef;
  size?: number;
}) {
  const border = RARITY_COLORS[gear.rarity];
  const c = gearPalette(gear.hue, gear.rarity);

  return (
    <div
      className="pixel-frame relative flex shrink-0 items-center justify-center"
      style={{
        width: size,
        height: size,
        borderColor: border,
        background: c.deep,
        boxShadow: `inset -2px -2px 0 rgba(0,0,0,.45), inset 2px 2px 0 ${c.hi}55`,
      }}
      aria-hidden
    >
      <svg
        width={size * 0.85}
        height={size * 0.85}
        viewBox="0 0 32 32"
        style={{ imageRendering: "pixelated" }}
      >
        <GearIconArt gear={gear} />
      </svg>
      {gear.rarity === "relic" && (
        <span className="absolute -right-1 -top-1 text-[8px] text-amber-300">
          ★
        </span>
      )}
    </div>
  );
}

export function RarityBadge({ rarity }: { rarity: Rarity }) {
  return (
    <span
      className="pixel-chip text-[9px] uppercase tracking-wide"
      style={{ color: RARITY_COLORS[rarity], borderColor: RARITY_COLORS[rarity] }}
    >
      {rarity}
    </span>
  );
}
