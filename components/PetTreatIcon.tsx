"use client";

import type { PetTreatDef } from "@/lib/types";

export function PetTreatIcon({
  treat,
  size = 72,
  className = "",
}: {
  treat: PetTreatDef;
  size?: number;
  className?: string;
}) {
  const icing = `hsl(${treat.hue} 72% 52%)`;
  const icingLite = `hsl(${treat.hue} 80% 68%)`;
  const crumb = `hsl(${treat.hue} 40% 32%)`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={className}
      aria-hidden
    >
      <ellipse cx="32" cy="56" rx="14" ry="3" fill="#152033" opacity="0.12" />
      <path
        d="M18 34c0-10 8-18 16-18s16 8 16 18-8 16-16 16-16-6-16-16Z"
        fill="#E8B86D"
        stroke="#C4893F"
        strokeWidth="1.5"
      />
      <path
        d="M22 33c1-8 7-14 12-14 6 0 12 6 13 14-2 1-8 2-13 2s-10-1-12-2Z"
        fill={icing}
      />
      <ellipse cx="30" cy="28" rx="5" ry="3" fill={icingLite} opacity="0.7" />
      <circle cx="26" cy="38" r="1.6" fill={crumb} />
      <circle cx="34" cy="41" r="1.3" fill={crumb} />
      <circle cx="40" cy="37" r="1.1" fill={crumb} />
      <path
        d="M28 22c2-4 8-5 11-2"
        fill="none"
        stroke={icingLite}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
