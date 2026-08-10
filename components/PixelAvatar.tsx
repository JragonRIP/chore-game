"use client";

import { HeroSprite } from "@/components/HeroSprite";
import type { AvatarId } from "@/lib/types";

/** Character-select / unequipped preview — 64×64 base body. */
export function PixelAvatar({
  id,
  size = 128,
  className = "",
}: {
  id: AvatarId;
  size?: number;
  className?: string;
}) {
  return <HeroSprite avatar={id} size={size} className={className} />;
}
