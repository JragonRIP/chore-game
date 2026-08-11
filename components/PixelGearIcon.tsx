"use client";

import type { GearDef, Rarity } from "@/lib/types";
import { RARITY_COLORS, RARITY_LABELS } from "@/lib/gear";
import { gearPalette } from "@/lib/pixel";

export function GearIcon({
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
      className="relative flex shrink-0 items-center justify-center rounded-2xl"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(145deg, ${c.hi}, ${c.main} 45%, ${c.deep})`,
        boxShadow: `0 8px 16px -8px ${border}88, inset 0 1px 0 rgba(255,255,255,.35)`,
        border: `2px solid ${border}`,
      }}
      aria-hidden
    >
      <svg
        width={size * 0.55}
        height={size * 0.55}
        viewBox="0 0 24 24"
        fill="none"
      >
        {gear.slot === "helmet" && (
          <>
            <path
              d="M4 12c0-4.4 3.6-8 8-8s8 3.6 8 8v2H4v-2Z"
              fill="rgba(255,255,255,.9)"
            />
            <path d="M7 14h3v2H7v-2Zm7 0h3v2h-3v-2Z" fill={c.deep} />
            <path d="M6 16h12v2.5a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V16Z" fill={c.trim} />
          </>
        )}
        {gear.slot === "chestplate" && (
          <>
            <path
              d="M8 4 4 7v6l4 2 4-1 4 1 4-2V7l-4-3-4 2-4-2Z"
              fill="rgba(255,255,255,.92)"
            />
            <path d="M10 10h4v5h-4v-5Z" fill={c.trim} />
          </>
        )}
        {gear.slot === "leggings" && (
          <>
            <path d="M7 4h10v4H7V4Z" fill="rgba(255,255,255,.9)" />
            <path d="M7 8h4v12H7V8Zm6 0h4v12h-4V8Z" fill={c.hi} />
            <path d="M8 16h2v4H8v-4Zm6 0h2v4h-2v-4Z" fill={c.trim} />
          </>
        )}
        {gear.slot === "boots" && (
          <>
            <path d="M6 6h5v10H6V6Zm7 0h5v10h-5V6Z" fill="rgba(255,255,255,.88)" />
            <path d="M4 16h8v4H4v-4Zm8 0h8v4h-8v-4Z" fill={c.trim} />
          </>
        )}
        {gear.slot === "weapon" && (
          <>
            <path d="M13 2 11 4l7 7 2-2L13 2Z" fill={c.glow} />
            <path d="M10 5 5 10l7 7 5-5-7-7Z" fill="rgba(255,255,255,.92)" />
            <path d="M4 16l4 4-2 2-4-4 2-2Z" fill={c.trim} />
          </>
        )}
      </svg>
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

/** Back-compat alias while screens migrate */
export const PixelGearIcon = GearIcon;
