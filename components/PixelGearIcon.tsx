"use client";

import type { GearDef, Rarity, Slot } from "@/lib/types";
import { RARITY_COLORS } from "@/lib/gear";

const SLOT_GLYPH: Record<Slot, string> = {
  helmet: "H",
  chestplate: "C",
  leggings: "L",
  boots: "B",
  weapon: "W",
};

export function PixelGearIcon({
  gear,
  size = 48,
}: {
  gear: GearDef;
  size?: number;
}) {
  const border = RARITY_COLORS[gear.rarity];
  const bg = `hsl(${gear.hue} 55% 18%)`;
  const mid = `hsl(${gear.hue} 70% 42%)`;
  const hi = `hsl(${gear.hue} 80% 62%)`;

  return (
    <div
      className="pixel-frame relative flex shrink-0 items-center justify-center"
      style={{
        width: size,
        height: size,
        borderColor: border,
        background: bg,
        boxShadow: `inset -2px -2px 0 rgba(0,0,0,.45), inset 2px 2px 0 ${hi}55`,
      }}
      aria-hidden
    >
      <svg width={size * 0.72} height={size * 0.72} viewBox="0 0 16 16">
        {gear.slot === "helmet" && (
          <>
            <rect x="3" y="4" width="10" height="7" fill={mid} />
            <rect x="4" y="3" width="8" height="2" fill={hi} />
            <rect x="5" y="7" width="2" height="2" fill="#0b1220" />
            <rect x="9" y="7" width="2" height="2" fill="#0b1220" />
            <rect x="6" y="10" width="4" height="2" fill={border} />
          </>
        )}
        {gear.slot === "chestplate" && (
          <>
            <rect x="4" y="3" width="8" height="10" fill={mid} />
            <rect x="3" y="4" width="2" height="6" fill={hi} />
            <rect x="11" y="4" width="2" height="6" fill={hi} />
            <rect x="6" y="5" width="4" height="3" fill={border} />
            <rect x="5" y="11" width="6" height="2" fill="#0b1220" />
          </>
        )}
        {gear.slot === "leggings" && (
          <>
            <rect x="4" y="3" width="8" height="3" fill={mid} />
            <rect x="4" y="6" width="3" height="7" fill={mid} />
            <rect x="9" y="6" width="3" height="7" fill={mid} />
            <rect x="4" y="11" width="3" height="2" fill={hi} />
            <rect x="9" y="11" width="3" height="2" fill={hi} />
          </>
        )}
        {gear.slot === "boots" && (
          <>
            <rect x="3" y="6" width="4" height="6" fill={mid} />
            <rect x="9" y="6" width="4" height="6" fill={mid} />
            <rect x="2" y="11" width="5" height="3" fill={hi} />
            <rect x="9" y="11" width="5" height="3" fill={hi} />
            <rect x="3" y="7" width="4" height="1" fill={border} />
            <rect x="9" y="7" width="4" height="1" fill={border} />
          </>
        )}
        {gear.slot === "weapon" && (
          <>
            <rect x="7" y="1" width="2" height="10" fill={hi} />
            <rect x="5" y="10" width="6" height="2" fill={mid} />
            <rect x="7" y="12" width="2" height="3" fill={border} />
            <rect x="6" y="2" width="4" height="2" fill={border} />
          </>
        )}
      </svg>
      {gear.rarity === "relic" && (
        <span className="absolute -right-1 -top-1 text-[8px] text-amber-300">
          ★
        </span>
      )}
      <span className="sr-only">{SLOT_GLYPH[gear.slot]}</span>
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
