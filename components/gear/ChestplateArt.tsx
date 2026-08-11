"use client";

import { useId, type ReactNode } from "react";
import type { GearId } from "@/lib/types";

/** Detailed custom chestplate art — one design per piece. */
export function ChestplateArt({
  id,
  size,
}: {
  id: GearId;
  size: number;
}) {
  const uid = useId().replace(/:/g, "");
  const art = renderArt(id, uid);
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden
    >
      {art}
    </svg>
  );
}

function renderArt(id: GearId, u: string): ReactNode {
  switch (id) {
    case "frostbite-chestplate":
      return (
        <>
          <defs>
            <linearGradient id={`${u}-fb`} x1="20" y1="8" x2="48" y2="56">
              <stop stopColor="#E0F7FA" />
              <stop offset="0.45" stopColor="#4DD0E1" />
              <stop offset="1" stopColor="#0277BD" />
            </linearGradient>
          </defs>
          <path
            d="M22 8 10 18v20l12 12 10-5 10 5 12-12V18L42 8l-10 7-10-7Z"
            fill={`url(#${u}-fb)`}
          />
          <path d="M22 8 10 18l12 5 10-5-10-10Z" fill="#B2EBF2" />
          <path d="M42 8 32 18l10 5 12-5-12-10Z" fill="#80DEEA" />
          <path d="M32 22 26 32l6 14 6-14-6-10Z" fill="#E1F5FE" />
          <path d="M32 22 26 32h12L32 22Z" fill="#FFFFFF" opacity="0.9" />
          <path
            d="M20 28l-4 4 4 4"
            stroke="#E0F7FA"
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M44 28l4 4-4 4"
            stroke="#E0F7FA"
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M28 18h8M32 14v8"
            stroke="#FFFFFF"
            strokeWidth="1.2"
            opacity="0.8"
          />
        </>
      );

    case "starlight-chestplate":
      return (
        <>
          <defs>
            <linearGradient id={`${u}-sl`} x1="16" y1="6" x2="48" y2="58">
              <stop stopColor="#7C4DFF" />
              <stop offset="0.5" stopColor="#3F51B5" />
              <stop offset="1" stopColor="#1A237E" />
            </linearGradient>
          </defs>
          <path
            d="M24 6c-2 0-8 4-12 10v28c4 6 10 10 20 10s16-4 20-10V16C48 10 42 6 40 6c-2 2-6 4-8 4s-6-2-8-4Z"
            fill={`url(#${u}-sl)`}
          />
          <path
            d="M24 6c2 2 6 4 8 4s6-2 8-4c-1 0-3 1-4 2-2 1-4 1-4 1s-2 0-4-1c-1-1-3-2-4-2Z"
            fill="#B39DDB"
          />
          <ellipse cx="32" cy="30" rx="8" ry="10" fill="#5C6BC0" opacity="0.7" />
          <circle cx="22" cy="22" r="1.2" fill="#FFF59D" />
          <circle cx="42" cy="26" r="1" fill="#FFFFFF" />
          <circle cx="28" cy="40" r="1.1" fill="#FFE082" />
          <circle cx="38" cy="36" r="0.9" fill="#FFFFFF" />
          <path
            d="M32 20l1.2 2.6 2.8.4-2 2 .5 2.8L32 26.4l-2.5 1.4.5-2.8-2-2 2.8-.4L32 20Z"
            fill="#FFF59D"
          />
          <path
            d="M18 48c4 4 10 6 14 6s10-2 14-6"
            stroke="#9FA8DA"
            strokeWidth="2"
            fill="none"
          />
        </>
      );

    case "sunfire-chestplate":
      return (
        <>
          <defs>
            <linearGradient id={`${u}-sf`} x1="14" y1="6" x2="50" y2="56">
              <stop stopColor="#FFE082" />
              <stop offset="0.4" stopColor="#FFB300" />
              <stop offset="1" stopColor="#E65100" />
            </linearGradient>
          </defs>
          <path
            d="M22 8 10 16v22l10 12h24l10-12V16L42 8l-10 5-10-5Z"
            fill={`url(#${u}-sf)`}
          />
          <path d="M22 8 10 16l12 4 10-4-10-8Z" fill="#FFECB3" />
          <path d="M42 8 32 16l10 4 12-4-12-8Z" fill="#FFD54F" />
          <circle cx="32" cy="30" r="8" fill="#FFF8E1" />
          <circle cx="32" cy="30" r="5" fill="#FF6F00" />
          <path
            d="M32 18v3M32 39v3M20 30h3M41 30h3M23 21l2 2M39 37l2 2M39 21l-2 2M23 37l-2 2"
            stroke="#FFECB3"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path d="M18 44h28" stroke="#BF360C" strokeWidth="2" opacity="0.5" />
        </>
      );

    case "dragonguard-chestplate":
      return (
        <>
          <defs>
            <linearGradient id={`${u}-dg`} x1="12" y1="8" x2="52" y2="56">
              <stop stopColor="#EF5350" />
              <stop offset="0.5" stopColor="#C62828" />
              <stop offset="1" stopColor="#4E342E" />
            </linearGradient>
          </defs>
          <path
            d="M22 8 8 18v18l14 16 10-6 10 6 14-16V18L42 8l-10 6-10-6Z"
            fill={`url(#${u}-dg)`}
          />
          <path
            d="M20 22c2 3 6 3 8 0"
            stroke="#FFCDD2"
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M28 22c2 3 6 3 8 0"
            stroke="#FFCDD2"
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M36 22c2 3 6 3 8 0"
            stroke="#FFCDD2"
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M18 30c2 3 6 3 8 0"
            stroke="#E57373"
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M26 30c2 3 6 3 8 0"
            stroke="#E57373"
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M34 30c2 3 6 3 8 0"
            stroke="#E57373"
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M22 38c2 3 6 3 8 0"
            stroke="#B71C1C"
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M30 38c2 3 6 3 8 0"
            stroke="#B71C1C"
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M32 16c-4 4-5 10-2 14 1-3 3-4 4-4s3 1 4 4c3-4 2-10-2-14l-2 3-2-3Z"
            fill="#FFD54F"
          />
          <path d="M30 14l2-4 2 4" fill="#FF8A65" />
        </>
      );

    case "mech-chestplate":
      return (
        <>
          <defs>
            <linearGradient id={`${u}-mc`} x1="10" y1="6" x2="54" y2="56">
              <stop stopColor="#B2DFDB" />
              <stop offset="0.4" stopColor="#26A69A" />
              <stop offset="1" stopColor="#004D40" />
            </linearGradient>
          </defs>
          <path
            d="M20 10 8 20v18l8 14h32l8-14V20L44 10H20Z"
            fill={`url(#${u}-mc)`}
          />
          <rect x="14" y="18" width="36" height="28" rx="3" fill="#00897B" />
          <rect x="18" y="22" width="28" height="20" rx="2" fill="#004D40" />
          <circle cx="32" cy="32" r="8" fill="#1DE9B6" />
          <circle cx="32" cy="32" r="5" fill="#A7FFEB" />
          <circle cx="32" cy="32" r="2.5" fill="#FFFFFF" />
          <rect x="20" y="24" width="4" height="4" rx="0.5" fill="#80CBC4" />
          <rect x="40" y="24" width="4" height="4" rx="0.5" fill="#80CBC4" />
          <rect x="20" y="36" width="4" height="4" rx="0.5" fill="#80CBC4" />
          <rect x="40" y="36" width="4" height="4" rx="0.5" fill="#80CBC4" />
          <path
            d="M12 28h4M48 28h4M12 36h4M48 36h4"
            stroke="#B2DFDB"
            strokeWidth="2"
          />
        </>
      );

    case "shadow-chestplate":
      return (
        <>
          <defs>
            <linearGradient id={`${u}-sh`} x1="16" y1="4" x2="48" y2="58">
              <stop stopColor="#5C6BC0" />
              <stop offset="0.4" stopColor="#283593" />
              <stop offset="1" stopColor="#0D0D1A" />
            </linearGradient>
          </defs>
          <path
            d="M24 6 10 16v10c0 14 8 24 22 28 14-4 22-14 22-28V16L40 6c-2 4-6 6-8 6s-6-2-8-6Z"
            fill={`url(#${u}-sh)`}
          />
          <path
            d="M24 6c2 4 6 6 8 6s6-2 8-6l-4 2c-1.5 1-3 1.5-4 1.5s-2.5-.5-4-1.5L24 6Z"
            fill="#7986CB"
          />
          <ellipse cx="32" cy="30" rx="9" ry="7" fill="#1A237E" />
          <ellipse cx="32" cy="30" rx="5" ry="4" fill="#7C4DFF" />
          <ellipse cx="32" cy="30" rx="2" ry="3.5" fill="#E1BEE7" />
          <path
            d="M16 40c6 8 12 12 16 12s10-4 16-12"
            stroke="#4527A0"
            strokeWidth="2"
            fill="none"
          />
          <circle cx="20" cy="22" r="1" fill="#B39DDB" opacity="0.7" />
          <circle cx="44" cy="24" r="0.8" fill="#B39DDB" opacity="0.7" />
        </>
      );

    case "phantom-chestplate":
      return (
        <>
          <defs>
            <linearGradient id={`${u}-ph`} x1="14" y1="6" x2="50" y2="58">
              <stop stopColor="#F8BBD0" />
              <stop offset="0.35" stopColor="#EC407A" />
              <stop offset="1" stopColor="#4A148C" />
            </linearGradient>
          </defs>
          <path
            d="M22 8 10 18v16c2 12 10 20 22 22 12-2 20-10 22-22V18L42 8l-10 8-10-8Z"
            fill={`url(#${u}-ph)`}
          />
          <path
            d="M22 8 10 18l12 6 10-6-10-10Z"
            fill="#FCE4EC"
            opacity="0.85"
          />
          <path
            d="M42 8 32 18l10 6 12-6-12-10Z"
            fill="#F48FB1"
            opacity="0.9"
          />
          <path
            d="M32 20c-4 6-6 10-4 16 1-2 2-3 4-3s3 1 4 3c2-6 0-10-4-16Z"
            fill="#FFF59D"
          />
          <path
            d="M32 24c-2 4-3 7-2 11 1-1.5 1.5-2 2-2s1 .5 2 2c1-4 0-7-2-11Z"
            fill="#FFFFFF"
          />
          <path
            d="M18 44c5 6 10 8 14 8s9-2 14-8"
            stroke="#CE93D8"
            strokeWidth="1.5"
            fill="none"
          />
          <circle cx="24" cy="36" r="1.2" fill="#F8BBD0" />
          <circle cx="40" cy="38" r="1" fill="#F8BBD0" />
        </>
      );

    case "wild-kitchen-apron":
      return (
        <>
          <path d="M26 8h12v6H26V8Z" fill="#5D4037" />
          <path
            d="M18 14h28v36c0 2-2 4-4 4H22c-2 0-4-2-4-4V14Z"
            fill="#EF6C00"
          />
          <path d="M18 14h28v8H18v-8Z" fill="#FF9800" />
          <path d="M28 14h8v40h-8V14Z" fill="#E65100" opacity="0.5" />
          <rect x="26" y="30" width="12" height="10" rx="1" fill="#BF360C" />
          <path d="M26 34h12" stroke="#FFCC80" strokeWidth="1" />
          <path
            d="M26 8c-6 2-10 6-12 10"
            stroke="#5D4037"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M38 8c6 2 10 6 12 10"
            stroke="#5D4037"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
          <circle cx="32" cy="22" r="4" fill="#FFF3E0" />
          <path d="M31 20h2v5h-2v-5Zm-1 5h4" stroke="#5D4037" strokeWidth="1" />
        </>
      );

    case "wild-raincloak":
      return (
        <>
          <defs>
            <linearGradient id={`${u}-rc`} x1="16" y1="4" x2="48" y2="58">
              <stop stopColor="#4FC3F7" />
              <stop offset="0.5" stopColor="#0288D1" />
              <stop offset="1" stopColor="#01579B" />
            </linearGradient>
          </defs>
          <path
            d="M20 10c0-4 5-8 12-8s12 4 12 8c8 2 14 8 14 16v20c0 4-4 8-10 8H16c-6 0-10-4-10-8V26c0-8 6-14 14-16Z"
            fill={`url(#${u}-rc)`}
          />
          <path d="M20 10c2 2 6 4 12 4s10-2 12-4" fill="#81D4FA" />
          <ellipse cx="32" cy="8" rx="10" ry="4" fill="#29B6F6" />
          <ellipse cx="32" cy="14" rx="8" ry="5" fill="#0277BD" opacity="0.4" />
          <path
            d="M22 28v4M28 34v5M36 30v4M42 36v4"
            stroke="#E1F5FE"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path d="M18 48h28" stroke="#01579B" strokeWidth="2" opacity="0.5" />
          <circle cx="32" cy="28" r="2" fill="#E1F5FE" />
        </>
      );

    case "relic-aegis-tidy":
      return (
        <>
          <defs>
            <linearGradient id={`${u}-rl`} x1="12" y1="4" x2="52" y2="60">
              <stop stopColor="#FFF8E1" />
              <stop offset="0.35" stopColor="#FFD54F" />
              <stop offset="0.7" stopColor="#FF8F00" />
              <stop offset="1" stopColor="#E91E63" />
            </linearGradient>
          </defs>
          <path
            d="M32 4 12 12v20c0 14 8 22 20 26 12-4 20-12 20-26V12L32 4Z"
            fill={`url(#${u}-rl)`}
          />
          <path
            d="M32 10 18 16v16c0 10 6 16 14 20 8-4 14-10 14-20V16L32 10Z"
            fill="#FFF3E0"
            opacity="0.35"
          />
          <circle cx="32" cy="30" r="10" fill="#FCE4EC" />
          <path
            d="M32 22v12M28 26h8"
            stroke="#AD1457"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M28 34c2 3 6 3 8 0"
            stroke="#C62828"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M32 18l1 2 2 .3-1.5 1.4.4 2L32 22.5 29.9 23.7l.4-2L28.8 20.3 31 20l1-2Z"
            fill="#FFD54F"
          />
          <path
            d="M42 24l.8 1.5 1.6.2-1.2 1.1.3 1.6L42 27.5l-1.5.9.3-1.6-1.2-1.1 1.6-.2.8-1.5Z"
            fill="#FFFFFF"
          />
          <path
            d="M22 26l.8 1.5 1.6.2-1.2 1.1.3 1.6L22 29.5l-1.5.9.3-1.6-1.2-1.1 1.6-.2.8-1.5Z"
            fill="#FFFFFF"
          />
        </>
      );

    case "scrap-chestplate":
    default:
      return (
        <>
          <path
            d="M22 10 12 18v22l10 8 10-4 10 4 10-8V18L42 10l-10 6-10-6Z"
            fill="#8B9BB4"
          />
          <path d="M22 10 12 18l10 4 10-4-10-8Z" fill="#A8B8CC" />
          <path d="M42 10 32 18l10 4 10-4-10-8Z" fill="#9AABBE" />
          <path d="M18 28h12v14H18V28Z" fill="#6B7A8C" />
          <path d="M34 28h12v14H34V28Z" fill="#748496" />
          <path d="M28 24h8v20h-8V24Z" fill="#5C6B7A" opacity="0.85" />
          <rect x="20" y="32" width="6" height="5" rx="1" fill="#C4A574" />
          <rect x="38" y="34" width="5" height="4" rx="1" fill="#A67C52" />
          <circle cx="24" cy="22" r="1.4" fill="#4A5568" />
          <circle cx="40" cy="22" r="1.4" fill="#4A5568" />
          <circle cx="32" cy="36" r="1.4" fill="#4A5568" />
          <path
            d="M26 42h12"
            stroke="#4A5568"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </>
      );
  }
}
