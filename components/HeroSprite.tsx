"use client";

import { BaseBody } from "@/components/sprites/BaseBodies";
import { EquippedGearLayers } from "@/components/sprites/GearOverlays";
import { GEAR_BY_ID } from "@/lib/gear";
import type { AvatarId, EquippedMap, GearDef } from "@/lib/types";

export function HeroSprite({
  avatar,
  equipped,
  size = 128,
  className = "",
}: {
  avatar: AvatarId;
  equipped?: EquippedMap | null;
  size?: number;
  className?: string;
}) {
  const pieces: GearDef[] = [];
  if (equipped) {
    for (const id of Object.values(equipped)) {
      if (!id) continue;
      const g = GEAR_BY_ID[id];
      if (g) pieces.push(g);
    }
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={className}
      style={{ imageRendering: "pixelated" }}
      aria-hidden
    >
      <BaseBody id={avatar} />
      {pieces.length > 0 && <EquippedGearLayers pieces={pieces} />}
    </svg>
  );
}
