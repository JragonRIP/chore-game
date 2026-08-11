"use client";

import Image from "next/image";
import { GearIcon } from "@/components/PixelGearIcon";
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
  const badgeSize = Math.max(16, Math.round(size * 0.2));

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
        className="h-full w-full object-contain drop-shadow-md"
        unoptimized
        priority
      />
      {showGearBadges &&
        SLOTS.map((slot) => {
          const id = equipped?.[slot];
          const gear = id ? GEAR_BY_ID[id] : null;
          if (!gear) return null;
          const pos =
            slot === "helmet"
              ? "left-1/2 top-0 -translate-x-1/2"
              : slot === "weapon"
                ? "right-0 top-[30%]"
                : slot === "chestplate"
                  ? "left-0 top-[38%]"
                  : slot === "boots"
                    ? "bottom-0 left-1/2 -translate-x-1/2"
                    : "bottom-0 right-0";
          return (
            <div key={slot} className={`absolute ${pos}`}>
              <GearIcon gear={gear} size={badgeSize} />
            </div>
          );
        })}
    </div>
  );
}
