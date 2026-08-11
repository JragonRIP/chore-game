"use client";

import type { XpBottleDef } from "@/lib/types";

export function XpBottleIcon({
  bottle,
  size = 72,
  className = "",
}: {
  bottle: XpBottleDef;
  size?: number;
  className?: string;
}) {
  const liquid = `hsl(${bottle.hue} 72% 48%)`;
  const liquidLite = `hsl(${bottle.hue} 80% 62%)`;
  const glow = `hsl(${bottle.hue} 85% 70%)`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={className}
      aria-hidden
    >
      <ellipse cx="32" cy="58" rx="12" ry="3" fill="#152033" opacity="0.12" />
      <path
        d="M24 14h16v6c0 2-1 4-3 6l-1 2c6 3 10 10 10 18 0 9-6 16-14 16s-14-7-14-16c0-8 4-15 10-18l-1-2c-2-2-3-4-3-6z"
        fill="#e8f6fa"
        stroke="#7ec8d8"
        strokeWidth="1.5"
      />
      <path
        d="M26 36c2 8 6 14 14 16 1-1 2-3 2-6 0-7-3-13-8-16-3 1-6 3-8 6z"
        fill={liquid}
      />
      <path
        d="M28 38c2 6 5 11 11 13-4-7-7-12-11-13z"
        fill={liquidLite}
        opacity="0.7"
      />
      <ellipse cx="30" cy="42" rx="3" ry="5" fill={glow} opacity="0.45" />
      <rect x="26" y="8" width="12" height="8" rx="2" fill="#C4893F" />
      <rect x="27" y="9" width="10" height="3" rx="1" fill="#E8A017" />
      <circle cx="44" cy="22" r="1.5" fill={glow} opacity="0.9" />
      <circle cx="48" cy="28" r="1" fill={glow} opacity="0.7" />
      <circle cx="18" cy="26" r="1.2" fill={glow} opacity="0.8" />
    </svg>
  );
}
