"use client";

import { HeroSprite } from "@/components/HeroSprite";
import type { AvatarId } from "@/lib/types";

/** Character-select preview using the real avatar art. */
export function PixelAvatar({
  id,
  size = 128,
  className = "",
}: {
  id: AvatarId;
  size?: number;
  className?: string;
}) {
  return (
    <HeroSprite
      avatar={id}
      size={size}
      className={className}
      showGearBadges={false}
    />
  );
}
