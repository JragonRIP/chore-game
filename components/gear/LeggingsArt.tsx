"use client";

import { useId, type ReactNode } from "react";
import type { GearId } from "@/lib/types";

/** Detailed custom leggings art — one design per piece. */
export function LeggingsArt({ id, size }: { id: GearId; size: number }) {
  const uid = useId().replace(/:/g, "");
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden
    >
      {renderArt(id, uid)}
    </svg>
  );
}

function renderArt(id: GearId, u: string): ReactNode {
  switch (id) {
    case "frostbite-leggings":
      return (
        <>
          <defs>
            <linearGradient id={`${u}-fb`} x1="16" y1="6" x2="48" y2="58">
              <stop stopColor="#E0F7FA" />
              <stop offset="0.5" stopColor="#4DD0E1" />
              <stop offset="1" stopColor="#0277BD" />
            </linearGradient>
          </defs>
          <path d="M20 6h24v10H20V6Z" fill={`url(#${u}-fb)`} />
          <path d="M20 16h10v38H16c0-8 2-20 4-38Z" fill={`url(#${u}-fb)`} />
          <path d="M34 16h10v38h-4c2-18 4-30 4-38Z" fill={`url(#${u}-fb)`} />
          <path d="M22 28h6v4h-6v-4Zm14 0h6v4h-6v-4Z" fill="#E1F5FE" />
          <path d="M22 40h6v3h-6v-3Zm14 0h6v3h-6v-3Z" fill="#B2EBF2" />
          <path
            d="M32 8l1.2 2.5 2.6.4-1.9 1.8.5 2.6L32 14.2l-2.4 1.1.5-2.6-1.9-1.8 2.6-.4L32 8Z"
            fill="#FFFFFF"
          />
          <path d="M18 52h8M38 52h8" stroke="#01579B" strokeWidth="2" />
        </>
      );

    case "starlight-leggings":
      return (
        <>
          <defs>
            <linearGradient id={`${u}-sl`} x1="16" y1="4" x2="48" y2="58">
              <stop stopColor="#B39DDB" />
              <stop offset="0.45" stopColor="#5C6BC0" />
              <stop offset="1" stopColor="#1A237E" />
            </linearGradient>
          </defs>
          <path
            d="M22 6h20c2 4 4 8 4 12H18c0-4 2-8 4-12Z"
            fill={`url(#${u}-sl)`}
          />
          <path
            d="M18 18h12v36c-4 0-8-4-10-12-1-6-2-16-2-24Z"
            fill={`url(#${u}-sl)`}
          />
          <path
            d="M34 18h12c0 8-1 18-2 24-2 8-6 12-10 12V18Z"
            fill={`url(#${u}-sl)`}
          />
          <circle cx="24" cy="28" r="1.2" fill="#FFF59D" />
          <circle cx="40" cy="34" r="1" fill="#FFFFFF" />
          <circle cx="26" cy="44" r="1.1" fill="#FFE082" />
          <circle cx="38" cy="24" r="0.9" fill="#FFFFFF" />
          <path
            d="M32 10l1 2 2.2.3-1.6 1.5.4 2.2L32 14.7l-1.9 1.1.4-2.2-1.6-1.5 2.2-.3L32 10Z"
            fill="#FFF59D"
          />
          <path
            d="M20 50c3 3 6 4 10 4h4c4 0 7-1 10-4"
            stroke="#9FA8DA"
            strokeWidth="1.5"
            fill="none"
          />
        </>
      );

    case "sunfire-leggings":
      return (
        <>
          <defs>
            <linearGradient id={`${u}-sf`} x1="14" y1="4" x2="50" y2="58">
              <stop stopColor="#FFE082" />
              <stop offset="0.4" stopColor="#FFB300" />
              <stop offset="1" stopColor="#E65100" />
            </linearGradient>
          </defs>
          <path d="M18 6h28v12H18V6Z" fill={`url(#${u}-sf)`} />
          <path d="M18 18h12v36H14l4-36Z" fill={`url(#${u}-sf)`} />
          <path d="M34 18h12l4 36H34V18Z" fill={`url(#${u}-sf)`} />
          {/* Knee plates (poleyns) */}
          <ellipse cx="24" cy="36" rx="7" ry="6" fill="#FFECB3" />
          <ellipse cx="40" cy="36" rx="7" ry="6" fill="#FFECB3" />
          <circle cx="24" cy="36" r="3" fill="#FF6F00" />
          <circle cx="40" cy="36" r="3" fill="#FF6F00" />
          <path d="M28 10h8" stroke="#FFF8E1" strokeWidth="2" />
          <path d="M16 50h12M36 50h12" stroke="#BF360C" strokeWidth="2" />
        </>
      );

    case "dragonguard-leggings":
      return (
        <>
          <defs>
            <linearGradient id={`${u}-dg`} x1="14" y1="4" x2="50" y2="58">
              <stop stopColor="#EF5350" />
              <stop offset="0.5" stopColor="#C62828" />
              <stop offset="1" stopColor="#3E2723" />
            </linearGradient>
          </defs>
          <path d="M18 6h28v10H18V6Z" fill={`url(#${u}-dg)`} />
          <path d="M18 16h12v40H14l4-40Z" fill={`url(#${u}-dg)`} />
          <path d="M34 16h12l4 40H34V16Z" fill={`url(#${u}-dg)`} />
          {/* Scale rows */}
          <path
            d="M20 22c2 2 6 2 8 0M20 30c2 2 6 2 8 0M20 38c2 2 6 2 8 0"
            stroke="#FFCDD2"
            strokeWidth="1.4"
            fill="none"
          />
          <path
            d="M36 22c2 2 6 2 8 0M36 30c2 2 6 2 8 0M36 38c2 2 6 2 8 0"
            stroke="#FFCDD2"
            strokeWidth="1.4"
            fill="none"
          />
          {/* Talon tips at bottom */}
          <path d="M16 54l4-4 4 4-4 4-4-4Z" fill="#FFD54F" />
          <path d="M40 54l4-4 4 4-4 4-4-4Z" fill="#FFD54F" />
          <path d="M28 10h8" stroke="#8D6E63" strokeWidth="2" />
        </>
      );

    case "mech-leggings":
      return (
        <>
          <defs>
            <linearGradient id={`${u}-mc`} x1="12" y1="4" x2="52" y2="58">
              <stop stopColor="#B2DFDB" />
              <stop offset="0.4" stopColor="#26A69A" />
              <stop offset="1" stopColor="#004D40" />
            </linearGradient>
          </defs>
          <rect x="18" y="6" width="28" height="10" rx="2" fill={`url(#${u}-mc)`} />
          <rect x="16" y="16" width="14" height="38" rx="2" fill={`url(#${u}-mc)`} />
          <rect x="34" y="16" width="14" height="38" rx="2" fill={`url(#${u}-mc)`} />
          {/* Hydraulic pistons */}
          <rect x="19" y="22" width="8" height="14" rx="1" fill="#004D40" />
          <rect x="37" y="22" width="8" height="14" rx="1" fill="#004D40" />
          <rect x="20" y="24" width="6" height="4" fill="#1DE9B6" />
          <rect x="38" y="24" width="6" height="4" fill="#1DE9B6" />
          <circle cx="23" cy="40" r="3" fill="#1DE9B6" />
          <circle cx="41" cy="40" r="3" fill="#1DE9B6" />
          <rect x="18" y="48" width="10" height="4" rx="1" fill="#80CBC4" />
          <rect x="36" y="48" width="10" height="4" rx="1" fill="#80CBC4" />
          <path d="M14 28h3M47 28h3" stroke="#B2DFDB" strokeWidth="2" />
        </>
      );

    case "shadow-leggings":
      return (
        <>
          <defs>
            <linearGradient id={`${u}-sh`} x1="14" y1="4" x2="50" y2="58">
              <stop stopColor="#5C6BC0" />
              <stop offset="0.4" stopColor="#283593" />
              <stop offset="1" stopColor="#0D0D1A" />
            </linearGradient>
          </defs>
          <path
            d="M20 6h24c2 2 4 6 4 10H16c0-4 2-8 4-10Z"
            fill={`url(#${u}-sh)`}
          />
          <path
            d="M16 16h14v38c-5-2-8-10-10-20-1-6-2-12-4-18Z"
            fill={`url(#${u}-sh)`}
          />
          <path
            d="M34 16h14c-2 6-3 12-4 18-2 10-5 18-10 20V16Z"
            fill={`url(#${u}-sh)`}
          />
          <ellipse cx="23" cy="32" rx="4" ry="3" fill="#7C4DFF" opacity="0.8" />
          <ellipse cx="41" cy="32" rx="4" ry="3" fill="#7C4DFF" opacity="0.8" />
          <circle cx="23" cy="32" r="1.5" fill="#E1BEE7" />
          <circle cx="41" cy="32" r="1.5" fill="#E1BEE7" />
          <circle cx="26" cy="20" r="0.9" fill="#B39DDB" />
          <circle cx="38" cy="44" r="0.9" fill="#B39DDB" />
          <path d="M18 52h10M36 52h10" stroke="#4527A0" strokeWidth="2" />
        </>
      );

    case "phantom-leggings":
      return (
        <>
          <defs>
            <linearGradient id={`${u}-ph`} x1="14" y1="4" x2="50" y2="58">
              <stop stopColor="#F8BBD0" />
              <stop offset="0.4" stopColor="#EC407A" />
              <stop offset="1" stopColor="#4A148C" />
            </linearGradient>
          </defs>
          <path d="M20 6h24v10H20V6Z" fill={`url(#${u}-ph)`} />
          <path
            d="M20 16h10v34c-2 4-6 6-8 4-2-4-2-18 0-28l-2-10Z"
            fill={`url(#${u}-ph)`}
          />
          <path
            d="M34 16h10l-2 10c2 10 2 24 0 28-2 2-6 0-8-4V16Z"
            fill={`url(#${u}-ph)`}
          />
          {/* Bone ridges */}
          <path d="M22 24h6M22 34h6M22 44h6" stroke="#FCE4EC" strokeWidth="2" />
          <path d="M36 24h6M36 34h6M36 44h6" stroke="#FCE4EC" strokeWidth="2" />
          <path
            d="M32 8c-1 3-2 5-1 8 .5-1 1-1.5 1-1.5s.5.5 1 1.5c1-3 0-5-1-8Z"
            fill="#FFF59D"
          />
          <path
            d="M18 52c3 2 6 3 10 3h8c4 0 7-1 10-3"
            stroke="#CE93D8"
            strokeWidth="1.5"
            fill="none"
          />
        </>
      );

    case "wild-garden-knees":
      return (
        <>
          <defs>
            <linearGradient id={`${u}-gk`} x1="14" y1="8" x2="50" y2="56">
              <stop stopColor="#A5D6A7" />
              <stop offset="0.5" stopColor="#66BB6A" />
              <stop offset="1" stopColor="#2E7D32" />
            </linearGradient>
          </defs>
          {/* Pants base */}
          <path d="M22 8h20v12H22V8Z" fill="#8D6E63" />
          <path d="M20 20h12v28H18l2-28Z" fill="#6D4C41" />
          <path d="M32 20h12l2 28H32V20Z" fill="#6D4C41" />
          {/* Knee guards */}
          <ellipse cx="24" cy="36" rx="8" ry="7" fill={`url(#${u}-gk)`} />
          <ellipse cx="40" cy="36" rx="8" ry="7" fill={`url(#${u}-gk)`} />
          <ellipse cx="24" cy="36" rx="4" ry="3.5" fill="#C8E6C9" />
          <ellipse cx="40" cy="36" rx="4" ry="3.5" fill="#C8E6C9" />
          {/* Leaf sprout */}
          <path d="M30 12c-2-4 0-6 2-6 2 0 4 2 2 6h-4Z" fill="#81C784" />
          <path d="M32 12v4" stroke="#2E7D32" strokeWidth="1.5" />
          <circle cx="24" cy="36" r="1.5" fill="#FFF59D" />
          <circle cx="40" cy="36" r="1.5" fill="#FFF59D" />
        </>
      );

    case "relic-legends-stride":
      return (
        <>
          <defs>
            <linearGradient id={`${u}-rl`} x1="12" y1="4" x2="52" y2="58">
              <stop stopColor="#FFF8E1" />
              <stop offset="0.35" stopColor="#FFD54F" />
              <stop offset="0.7" stopColor="#FF8F00" />
              <stop offset="1" stopColor="#E91E63" />
            </linearGradient>
          </defs>
          <path d="M18 6h28v12H18V6Z" fill={`url(#${u}-rl)`} />
          <path d="M18 18h12v38H14l4-38Z" fill={`url(#${u}-rl)`} />
          <path d="M34 18h12l4 38H34V18Z" fill={`url(#${u}-rl)`} />
          <path
            d="M20 18h24v8H20v-8Z"
            fill="#FFF3E0"
            opacity="0.4"
          />
          {/* Crest gems on knees */}
          <circle cx="24" cy="36" r="6" fill="#FCE4EC" />
          <circle cx="40" cy="36" r="6" fill="#FCE4EC" />
          <circle cx="24" cy="36" r="3" fill="#E91E63" />
          <circle cx="40" cy="36" r="3" fill="#E91E63" />
          <path
            d="M32 8l1 2 2 .3-1.5 1.4.4 2L32 12.5l-1.9 1.2.4-2L29 10.3l2-.3 1-2Z"
            fill="#FFFFFF"
          />
          <path d="M16 52h12M36 52h12" stroke="#AD1457" strokeWidth="2" />
          <circle cx="24" cy="48" r="1.5" fill="#7C4DFF" />
          <circle cx="40" cy="48" r="1.5" fill="#00BCD4" />
        </>
      );

    case "scrap-leggings":
    default:
      return (
        <>
          <path d="M20 6h24v10H20V6Z" fill="#8B9BB4" />
          <path d="M20 16h10v40H16l4-40Z" fill="#8B9BB4" />
          <path d="M34 16h10l4 40H34V16Z" fill="#9AABBE" />
          <path d="M20 6h24v4H20V6Z" fill="#A8B8CC" />
          {/* Dents / patches */}
          <rect x="22" y="24" width="6" height="5" rx="1" fill="#6B7A8C" />
          <rect x="36" y="32" width="6" height="5" rx="1" fill="#6B7A8C" />
          <rect x="22" y="40" width="5" height="4" rx="1" fill="#A67C52" />
          <circle cx="24" cy="14" r="1.2" fill="#4A5568" />
          <circle cx="40" cy="14" r="1.2" fill="#4A5568" />
          <circle cx="26" cy="34" r="1.2" fill="#4A5568" />
          <circle cx="38" cy="44" r="1.2" fill="#4A5568" />
          <path d="M18 52h8M38 52h8" stroke="#5C6B7A" strokeWidth="2" />
        </>
      );
  }
}
