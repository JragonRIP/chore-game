"use client";

import Image from "next/image";
import { PixelGearIcon } from "@/components/PixelGearIcon";
import { AVATAR_IMAGES } from "@/lib/avatars";
import { GEAR_BY_ID, SLOTS } from "@/lib/gear";
import type { AvatarId, EquippedMap } from "@/lib/types";

export function HeroSprite({
  avatar,
  equipped,
  size = 128,
  className = "",
  showGearBadges = true,
}: {
  avatar: AvatarId;
  equipped?: EquippedMap | null;
  size?: number;
  className?: string;
  showGearBadges?: boolean;
}) {
  const src = AVATAR_IMAGES[avatar];
  const equippedList = SLOTS.map((slot) => {
    const id = equipped?.[slot];
    return id ? GEAR_BY_ID[id] : null;
  }).filter(Boolean);

  const badgeSize = Math.max(14, Math.round(size * 0.22));

  return (
    <div
      className={`relative ${className}`}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <Image
        src={src}
        alt=""
        width={size}
        height={size}
        className="h-full w-full object-contain"
        style={{ imageRendering: "pixelated" }}
        unoptimized
        priority
      />
      {showGearBadges && equippedList.length > 0 && (
        <div className="pointer-events-none absolute inset-0">
          {equipped?.helmet && GEAR_BY_ID[equipped.helmet] && (
            <div className="absolute left-1/2 top-0 -translate-x-1/2">
              <PixelGearIcon
                gear={GEAR_BY_ID[equipped.helmet]!}
                size={badgeSize}
              />
            </div>
          )}
          {equipped?.weapon && GEAR_BY_ID[equipped.weapon] && (
            <div className="absolute right-0 top-1/3">
              <PixelGearIcon
                gear={GEAR_BY_ID[equipped.weapon]!}
                size={badgeSize}
              />
            </div>
          )}
          {equipped?.chestplate && GEAR_BY_ID[equipped.chestplate] && (
            <div className="absolute bottom-1/3 left-0">
              <PixelGearIcon
                gear={GEAR_BY_ID[equipped.chestplate]!}
                size={badgeSize}
              />
            </div>
          )}
          {equipped?.boots && GEAR_BY_ID[equipped.boots] && (
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
              <PixelGearIcon
                gear={GEAR_BY_ID[equipped.boots]!}
                size={badgeSize}
              />
            </div>
          )}
          {equipped?.leggings && GEAR_BY_ID[equipped.leggings] && (
            <div className="absolute bottom-0 right-0">
              <PixelGearIcon
                gear={GEAR_BY_ID[equipped.leggings]!}
                size={badgeSize}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
