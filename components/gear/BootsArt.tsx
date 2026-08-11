"use client";

import { useId, type ReactNode } from "react";
import type { GearId } from "@/lib/types";

/** Detailed custom boots art — one design per piece. */
export function BootsArt({ id, size }: { id: GearId; size: number }) {
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
    case "frostbite-boots":
      return (
        <>
          <defs>
            <linearGradient id={`${u}-fb`} x1="10" y1="8" x2="54" y2="56">
              <stop stopColor="#E0F7FA" />
              <stop offset="0.5" stopColor="#4DD0E1" />
              <stop offset="1" stopColor="#0277BD" />
            </linearGradient>
          </defs>
          <path
            d="M14 12h12v28H8c0-8 2-18 6-28Z"
            fill={`url(#${u}-fb)`}
          />
          <path
            d="M38 12h12c4 10 6 20 6 28H38V12Z"
            fill={`url(#${u}-fb)`}
          />
          <path d="M8 40h18v12H6c0-4 1-8 2-12Z" fill="#01579B" />
          <path d="M38 40h18c1 4 2 8 2 12H38V40Z" fill="#01579B" />
          <path d="M12 20h8M40 20h8" stroke="#E0F7FA" strokeWidth="1.5" />
          <path
            d="M18 8l1 2 2 .3-1.5 1.3.4 2L18 12.4l-1.9 1.2.4-2L15 10.3l2-.3 1-2Z"
            fill="#FFFFFF"
          />
          <path
            d="M46 8l1 2 2 .3-1.5 1.3.4 2L46 12.4l-1.9 1.2.4-2L43 10.3l2-.3 1-2Z"
            fill="#FFFFFF"
          />
          <path d="M10 48h14M40 48h14" stroke="#B2EBF2" strokeWidth="2" />
        </>
      );

    case "starlight-boots":
      return (
        <>
          <defs>
            <linearGradient id={`${u}-sl`} x1="10" y1="6" x2="54" y2="56">
              <stop stopColor="#B39DDB" />
              <stop offset="0.45" stopColor="#5C6BC0" />
              <stop offset="1" stopColor="#1A237E" />
            </linearGradient>
          </defs>
          <path
            d="M16 10c0-4 2-6 6-6h4c2 8 2 20 0 28H14c1-8 2-16 2-22Z"
            fill={`url(#${u}-sl)`}
          />
          <path
            d="M38 4h4c4 0 6 2 6 6 0 6 1 14 2 22H38c-2-8-2-20 0-28Z"
            fill={`url(#${u}-sl)`}
          />
          <ellipse cx="20" cy="44" rx="12" ry="8" fill={`url(#${u}-sl)`} />
          <ellipse cx="44" cy="44" rx="12" ry="8" fill={`url(#${u}-sl)`} />
          <circle cx="18" cy="22" r="1.1" fill="#FFF59D" />
          <circle cx="46" cy="18" r="1" fill="#FFFFFF" />
          <circle cx="22" cy="42" r="1.2" fill="#FFE082" />
          <circle cx="42" cy="40" r="1" fill="#FFFFFF" />
          <path
            d="M32 28l1 2 2.2.3-1.6 1.5.4 2.2L32 32.7l-1.9 1.1.4-2.2-1.6-1.5 2.2-.3L32 28Z"
            fill="#FFF59D"
          />
        </>
      );

    case "sunfire-boots":
      return (
        <>
          <defs>
            <linearGradient id={`${u}-sf`} x1="8" y1="6" x2="56" y2="56">
              <stop stopColor="#FFE082" />
              <stop offset="0.4" stopColor="#FFB300" />
              <stop offset="1" stopColor="#E65100" />
            </linearGradient>
          </defs>
          <path d="M14 8h12v30H10l4-30Z" fill={`url(#${u}-sf)`} />
          <path d="M38 8h12l4 30H38V8Z" fill={`url(#${u}-sf)`} />
          <path d="M8 38h20v14H6c0-4 1-9 2-14Z" fill="#BF360C" />
          <path d="M36 38h20c1 5 2 10 2 14H36V38Z" fill="#BF360C" />
          <circle cx="20" cy="24" r="4" fill="#FFECB3" />
          <circle cx="44" cy="24" r="4" fill="#FFECB3" />
          <circle cx="20" cy="24" r="2" fill="#FF6F00" />
          <circle cx="44" cy="24" r="2" fill="#FF6F00" />
          <path d="M10 48h16M38 48h16" stroke="#FFCC80" strokeWidth="2" />
        </>
      );

    case "dragonguard-boots":
      return (
        <>
          <defs>
            <linearGradient id={`${u}-dg`} x1="8" y1="6" x2="56" y2="56">
              <stop stopColor="#EF5350" />
              <stop offset="0.5" stopColor="#C62828" />
              <stop offset="1" stopColor="#3E2723" />
            </linearGradient>
          </defs>
          <path d="M14 8h12v28H10l4-28Z" fill={`url(#${u}-dg)`} />
          <path d="M38 8h12l4 28H38V8Z" fill={`url(#${u}-dg)`} />
          <path d="M8 36h20v16H4c2-6 3-12 4-16Z" fill="#4E342E" />
          <path d="M36 36h20c1 4 2 10 4 16H36V36Z" fill="#4E342E" />
          {/* Claw tips */}
          <path d="M10 50l3-6 3 6-3 4-3-4Z" fill="#FFD54F" />
          <path d="M18 50l3-6 3 6-3 4-3-4Z" fill="#FFD54F" />
          <path d="M40 50l3-6 3 6-3 4-3-4Z" fill="#FFD54F" />
          <path d="M48 50l3-6 3 6-3 4-3-4Z" fill="#FFD54F" />
          {/* Scale marks */}
          <path
            d="M16 16c2 2 6 2 8 0M16 24c2 2 6 2 8 0"
            stroke="#FFCDD2"
            strokeWidth="1.3"
            fill="none"
          />
          <path
            d="M40 16c2 2 6 2 8 0M40 24c2 2 6 2 8 0"
            stroke="#FFCDD2"
            strokeWidth="1.3"
            fill="none"
          />
        </>
      );

    case "mech-boots":
      return (
        <>
          <defs>
            <linearGradient id={`${u}-mc`} x1="8" y1="6" x2="56" y2="56">
              <stop stopColor="#B2DFDB" />
              <stop offset="0.4" stopColor="#26A69A" />
              <stop offset="1" stopColor="#004D40" />
            </linearGradient>
          </defs>
          <rect x="12" y="8" width="14" height="26" rx="2" fill={`url(#${u}-mc)`} />
          <rect x="38" y="8" width="14" height="26" rx="2" fill={`url(#${u}-mc)`} />
          <rect x="8" y="34" width="20" height="16" rx="2" fill="#004D40" />
          <rect x="36" y="34" width="20" height="16" rx="2" fill="#004D40" />
          {/* Thruster flames */}
          <path d="M14 50c2 6 4 8 4 8s2-2 4-8H14Z" fill="#1DE9B6" />
          <path d="M42 50c2 6 4 8 4 8s2-2 4-8H42Z" fill="#1DE9B6" />
          <path d="M16 50c1 4 2 5 2 5s1-1 2-5h-4Z" fill="#A7FFEB" />
          <path d="M44 50c1 4 2 5 2 5s1-1 2-5h-4Z" fill="#A7FFEB" />
          <rect x="15" y="18" width="8" height="4" rx="1" fill="#1DE9B6" />
          <rect x="41" y="18" width="8" height="4" rx="1" fill="#1DE9B6" />
          <circle cx="19" cy="40" r="2.5" fill="#1DE9B6" />
          <circle cx="45" cy="40" r="2.5" fill="#1DE9B6" />
        </>
      );

    case "shadow-boots":
      return (
        <>
          <defs>
            <linearGradient id={`${u}-sh`} x1="8" y1="6" x2="56" y2="56">
              <stop stopColor="#5C6BC0" />
              <stop offset="0.4" stopColor="#283593" />
              <stop offset="1" stopColor="#0D0D1A" />
            </linearGradient>
          </defs>
          <path
            d="M14 8h12c2 8 2 18 0 28H10c2-10 3-20 4-28Z"
            fill={`url(#${u}-sh)`}
          />
          <path
            d="M38 8h12c1 8 2 18 4 28H38c-2-10-2-20 0-28Z"
            fill={`url(#${u}-sh)`}
          />
          <path d="M8 36h20v14c-6 0-12-2-16-6-2-2-3-5-4-8Z" fill="#1A237E" />
          <path d="M36 36h20c-1 3-2 6-4 8-4 4-10 6-16 6V36Z" fill="#1A237E" />
          <ellipse cx="18" cy="28" rx="3" ry="2" fill="#7C4DFF" />
          <ellipse cx="46" cy="28" rx="3" ry="2" fill="#7C4DFF" />
          <circle cx="18" cy="28" r="1" fill="#E1BEE7" />
          <circle cx="46" cy="28" r="1" fill="#E1BEE7" />
          <circle cx="22" cy="16" r="0.8" fill="#B39DDB" />
          <circle cx="42" cy="42" r="0.8" fill="#B39DDB" />
        </>
      );

    case "phantom-boots":
      return (
        <>
          <defs>
            <linearGradient id={`${u}-ph`} x1="8" y1="6" x2="56" y2="56">
              <stop stopColor="#F8BBD0" />
              <stop offset="0.4" stopColor="#EC407A" />
              <stop offset="1" stopColor="#4A148C" />
            </linearGradient>
          </defs>
          <path
            d="M14 8h12v26c-2 2-6 2-8 0-2-6-3-16-4-26Z"
            fill={`url(#${u}-ph)`}
          />
          <path
            d="M38 8h12c-1 10-2 20-4 26-2 2-6 2-8 0V8Z"
            fill={`url(#${u}-ph)`}
          />
          <path
            d="M10 34h18v12c-2 4-6 6-10 4-4-4-6-10-8-16Z"
            fill={`url(#${u}-ph)`}
          />
          <path
            d="M36 34h18c-2 6-4 12-8 16-4 2-8 0-10-4V34Z"
            fill={`url(#${u}-ph)`}
          />
          <path
            d="M18 14c-1 3-2 5-1 8 .5-1 1-1.5 1-1.5s.5.5 1 1.5c1-3 0-5-1-8Z"
            fill="#FFF59D"
          />
          <path
            d="M46 14c-1 3-2 5-1 8 .5-1 1-1.5 1-1.5s.5.5 1 1.5c1-3 0-5-1-8Z"
            fill="#FFF59D"
          />
          <path d="M14 44h10M40 44h10" stroke="#FCE4EC" strokeWidth="2" />
        </>
      );

    case "wild-sock-slippers":
      return (
        <>
          <defs>
            <linearGradient id={`${u}-ss`} x1="8" y1="10" x2="56" y2="52">
              <stop stopColor="#F8BBD0" />
              <stop offset="0.5" stopColor="#F48FB1" />
              <stop offset="1" stopColor="#AD1457" />
            </linearGradient>
          </defs>
          {/* Soft sock shapes */}
          <path
            d="M12 16c0-6 4-10 10-10s10 4 10 10v18c0 6-4 12-10 14-6-2-10-8-10-14V16Z"
            fill={`url(#${u}-ss)`}
          />
          <path
            d="M32 16c0-6 4-10 10-10s10 4 10 10v18c0 6-4 12-10 14-6-2-10-8-10-14V16Z"
            fill={`url(#${u}-ss)`}
          />
          {/* Cuffs */}
          <path d="M12 14h20v6H12v-6Z" fill="#FCE4EC" />
          <path d="M32 14h20v6H32v-6Z" fill="#FCE4EC" />
          {/* Heel pom-poms */}
          <circle cx="16" cy="48" r="4" fill="#FCE4EC" />
          <circle cx="36" cy="48" r="4" fill="#FCE4EC" />
          {/* Stripes */}
          <path d="M14 28h16M34 28h16" stroke="#FCE4EC" strokeWidth="2" opacity="0.7" />
          <path d="M14 36h16M34 36h16" stroke="#FCE4EC" strokeWidth="2" opacity="0.5" />
        </>
      );

    case "relic-boots-of-dawn":
      return (
        <>
          <defs>
            <linearGradient id={`${u}-rl`} x1="8" y1="4" x2="56" y2="56">
              <stop stopColor="#FFF8E1" />
              <stop offset="0.35" stopColor="#FFD54F" />
              <stop offset="0.7" stopColor="#FF8F00" />
              <stop offset="1" stopColor="#E91E63" />
            </linearGradient>
          </defs>
          <path d="M14 6h12v30H10l4-30Z" fill={`url(#${u}-rl)`} />
          <path d="M38 6h12l4 30H38V6Z" fill={`url(#${u}-rl)`} />
          <path d="M8 36h20v16H6c0-5 1-11 2-16Z" fill={`url(#${u}-rl)`} />
          <path d="M36 36h20c1 5 2 11 2 16H36V36Z" fill={`url(#${u}-rl)`} />
          <path
            d="M14 6h12v8H14V6Zm24 0h12v8H38V6Z"
            fill="#FFF3E0"
            opacity="0.45"
          />
          {/* Dawn suns */}
          <circle cx="20" cy="24" r="5" fill="#FCE4EC" />
          <circle cx="44" cy="24" r="5" fill="#FCE4EC" />
          <circle cx="20" cy="24" r="2.5" fill="#E91E63" />
          <circle cx="44" cy="24" r="2.5" fill="#E91E63" />
          <path
            d="M20 12l.8 1.6 1.7.2-1.2 1.2.3 1.7L20 15.8l-1.6.9.3-1.7-1.2-1.2 1.7-.2.8-1.6Z"
            fill="#FFFFFF"
          />
          <path
            d="M44 12l.8 1.6 1.7.2-1.2 1.2.3 1.7L44 15.8l-1.6.9.3-1.7-1.2-1.2 1.7-.2.8-1.6Z"
            fill="#FFFFFF"
          />
          <path d="M10 48h16M38 48h16" stroke="#AD1457" strokeWidth="2" />
        </>
      );

    case "scrap-boots":
    default:
      return (
        <>
          <path d="M14 8h12v28H10l4-28Z" fill="#8B9BB4" />
          <path d="M38 8h12l4 28H38V8Z" fill="#9AABBE" />
          <path d="M8 36h20v16H4c2-6 3-12 4-16Z" fill="#6B7A8C" />
          <path d="M36 36h20c1 4 2 10 4 16H36V36Z" fill="#748496" />
          <path d="M14 8h12v5H14V8Zm24 0h12v5H38V8Z" fill="#A8B8CC" />
          {/* Mud / dents */}
          <rect x="16" y="20" width="6" height="4" rx="1" fill="#A67C52" />
          <rect x="42" y="26" width="5" height="4" rx="1" fill="#8D6E63" />
          <circle cx="18" cy="14" r="1.2" fill="#4A5568" />
          <circle cx="44" cy="14" r="1.2" fill="#4A5568" />
          <circle cx="22" cy="44" r="1.2" fill="#4A5568" />
          <circle cx="42" cy="44" r="1.2" fill="#4A5568" />
          <path d="M10 48h14M40 48h14" stroke="#5C6B7A" strokeWidth="2" />
        </>
      );
  }
}
