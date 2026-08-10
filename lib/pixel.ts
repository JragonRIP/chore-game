import type { Rarity } from "@/lib/types";

export function hsl(
  hue: number,
  sat: number,
  light: number,
  alpha = 1,
): string {
  if (alpha >= 1) return `hsl(${hue} ${sat}% ${light}%)`;
  return `hsl(${hue} ${sat}% ${light}% / ${alpha})`;
}

export function gearPalette(hue: number, rarity: Rarity) {
  const boost =
    rarity === "relic"
      ? 8
      : rarity === "mythic"
        ? 5
        : rarity === "enchanted"
          ? 2
          : 0;
  return {
    deep: hsl(hue, 55, 14 + boost),
    mid: hsl(hue, 62, 32 + boost),
    main: hsl(hue, 70, 44 + boost),
    hi: hsl(hue, 78, 62 + boost),
    glow: hsl(hue, 90, 72 + boost),
    metal: rarity === "scrap" ? hsl(hue, 20, 40) : hsl(hue, 45, 55),
    trim:
      rarity === "relic"
        ? "#fbbf24"
        : rarity === "mythic"
          ? "#fde68a"
          : hsl(hue, 80, 70),
  };
}

export const SKIN = "#f0c8a0";
export const SKIN_SH = "#d4a574";
export const SKIN_HI = "#ffe4c4";
export const EYE = "#1a1a2e";
export const BG = "#0b1220";
