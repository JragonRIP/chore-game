"use client";

import { useId, type ReactNode } from "react";
import type { GearId } from "@/lib/types";

/** Detailed custom weapon art — one design per piece. */
export function WeaponArt({ id, size }: { id: GearId; size: number }) {
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
    case "frostbite-weapon":
      // Frostfang Spear — icy tip, crystal crossguard
      return (
        <>
          <defs>
            <linearGradient id={`${u}-fb`} x1="8" y1="8" x2="56" y2="56">
              <stop stopColor="#E0F7FA" />
              <stop offset="0.45" stopColor="#4DD0E1" />
              <stop offset="1" stopColor="#01579B" />
            </linearGradient>
            <linearGradient id={`${u}-fb2`} x1="40" y1="4" x2="56" y2="24">
              <stop stopColor="#FFFFFF" />
              <stop offset="1" stopColor="#81D4FA" />
            </linearGradient>
          </defs>
          {/* Shaft */}
          <path
            d="M18 50 46 18"
            stroke="#0277BD"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M18 50 46 18"
            stroke="#4DD0E1"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Crystal spearhead */}
          <path d="M42 8 56 14 48 28 42 22 36 26Z" fill={`url(#${u}-fb2)`} />
          <path d="M42 8 48 18 36 26 42 16Z" fill="#E1F5FE" />
          <path d="M48 14l4 4-6 8" stroke="#FFFFFF" strokeWidth="1.2" fill="none" />
          {/* Ice crossguard */}
          <path d="M34 28l8-8 4 4-8 8-4-4Z" fill="#81D4FA" />
          <path d="M30 32l4-4 3 3-4 4-3-3Z" fill="#E0F7FA" />
          {/* Pommel crystal */}
          <circle cx="16" cy="52" r="4" fill={`url(#${u}-fb)`} />
          <circle cx="16" cy="52" r="2" fill="#FFFFFF" />
          <path
            d="M50 6l1 2 2 .2-1.4 1.3.3 2L50 10.4l-1.9 1 .3-2L47 8.2l2-.2 1-2Z"
            fill="#FFFFFF"
          />
        </>
      );

    case "starlight-weapon":
      // Astral Staff — orb top, star accents
      return (
        <>
          <defs>
            <linearGradient id={`${u}-sl`} x1="20" y1="4" x2="44" y2="60">
              <stop stopColor="#E1BEE7" />
              <stop offset="0.4" stopColor="#7C4DFF" />
              <stop offset="1" stopColor="#1A237E" />
            </linearGradient>
            <radialGradient id={`${u}-orb`} cx="50%" cy="40%" r="50%">
              <stop stopColor="#FFF59D" />
              <stop offset="0.4" stopColor="#CE93D8" />
              <stop offset="1" stopColor="#4527A0" />
            </radialGradient>
          </defs>
          {/* Staff shaft */}
          <path
            d="M30 58V22"
            stroke={`url(#${u}-sl)`}
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path
            d="M30 58V22"
            stroke="#B39DDB"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.6"
          />
          {/* Orb */}
          <circle cx="30" cy="14" r="10" fill={`url(#${u}-orb)`} />
          <circle cx="27" cy="11" r="3" fill="#FFFFFF" opacity="0.85" />
          {/* Crescent wrap */}
          <path
            d="M20 16c2-8 10-12 18-8"
            stroke="#FFF59D"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          {/* Stars */}
          <path
            d="M14 10l1 2 2.2.3-1.6 1.5.4 2.2L14 14.7l-1.9 1.1.4-2.2-1.6-1.5 2.2-.3L14 10Z"
            fill="#FFF59D"
          />
          <path
            d="M46 12l.8 1.6 1.8.2-1.3 1.2.3 1.7L46 15.8l-1.6.9.3-1.7-1.3-1.2 1.8-.2.8-1.6Z"
            fill="#FFFFFF"
          />
          <circle cx="30" cy="48" r="3" fill="#7C4DFF" />
          <circle cx="30" cy="48" r="1.5" fill="#FFF59D" />
          <circle cx="22" cy="28" r="1" fill="#FFE082" />
          <circle cx="38" cy="36" r="0.9" fill="#FFFFFF" />
        </>
      );

    case "sunfire-weapon":
      // Flarebrand Sword — flaming gold blade
      return (
        <>
          <defs>
            <linearGradient id={`${u}-sf`} x1="12" y1="48" x2="52" y2="8">
              <stop stopColor="#FFF8E1" />
              <stop offset="0.35" stopColor="#FFB300" />
              <stop offset="1" stopColor="#E65100" />
            </linearGradient>
            <linearGradient id={`${u}-flame`} x1="40" y1="4" x2="56" y2="20">
              <stop stopColor="#FFF59D" />
              <stop offset="0.5" stopColor="#FF6F00" />
              <stop offset="1" stopColor="#BF360C" />
            </linearGradient>
          </defs>
          {/* Blade */}
          <path
            d="M26 42 48 12l6 4-18 34-8 2 2-10Z"
            fill={`url(#${u}-sf)`}
          />
          <path d="M30 40 48 14l2 2-16 28-4-4Z" fill="#FFF8E1" opacity="0.7" />
          {/* Flame tip */}
          <path
            d="M50 6c-2 4-3 7-1 12 1-2 2-3 3-3s2 1 3 3c2-5 1-8-1-12l-2 3-2-3Z"
            fill={`url(#${u}-flame)`}
          />
          {/* Crossguard */}
          <path d="M20 40l12-8 6 6-12 8-6-6Z" fill="#FF6F00" />
          <path d="M18 42l4-4 3 3-4 4-3-3Z" fill="#FFECB3" />
          {/* Hilt */}
          <path
            d="M18 50 28 40"
            stroke="#BF360C"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <circle cx="16" cy="52" r="4.5" fill="#FFB300" />
          <circle cx="16" cy="52" r="2.5" fill="#FF6F00" />
          <path
            d="M54 4l.9 1.8 2 .2-1.4 1.4.3 1.9L54 8.4l-1.8 1 .3-1.9-1.4-1.4 2-.2.9-1.8Z"
            fill="#FFF59D"
          />
        </>
      );

    case "dragonguard-weapon":
      // Ember Drake Axe — double-bit dragon axe
      return (
        <>
          <defs>
            <linearGradient id={`${u}-dg`} x1="10" y1="10" x2="54" y2="54">
              <stop stopColor="#EF5350" />
              <stop offset="0.45" stopColor="#C62828" />
              <stop offset="1" stopColor="#3E2723" />
            </linearGradient>
            <linearGradient id={`${u}-gold`} x1="28" y1="8" x2="44" y2="40">
              <stop stopColor="#FFE082" />
              <stop offset="1" stopColor="#FF8F00" />
            </linearGradient>
          </defs>
          {/* Haft */}
          <path
            d="M20 56 40 20"
            stroke="#5D4037"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path
            d="M20 56 40 20"
            stroke="#8D6E63"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Axe head — crescent blade */}
          <path
            d="M36 12c8-2 16 2 18 10 2 8-2 14-10 16-2-4-4-8-6-12 4-2 6-6 4-10-2-2-4-3-6-4Z"
            fill={`url(#${u}-dg)`}
          />
          <path
            d="M40 14c5-1 10 2 11 7 1 5-1 9-6 11"
            stroke="#FFCDD2"
            strokeWidth="1.5"
            fill="none"
          />
          {/* Spike / dragon fang top */}
          <path d="M38 10 44 2l2 10-8-2Z" fill={`url(#${u}-gold)`} />
          {/* Ember accents */}
          <path d="M48 18c1 3 0 6-2 8" stroke="#FFD54F" strokeWidth="1.5" fill="none" />
          <circle cx="18" cy="58" r="3.5" fill="#FFD54F" />
          <circle cx="18" cy="58" r="1.8" fill="#FF6F00" />
          {/* Scale notch */}
          <path d="M42 22c2 2 5 2 7 0" stroke="#FF8A65" strokeWidth="1.3" fill="none" />
        </>
      );

    case "mech-weapon":
      // Plasma Cleaver — energy blade cleaver
      return (
        <>
          <defs>
            <linearGradient id={`${u}-mc`} x1="10" y1="48" x2="54" y2="8">
              <stop stopColor="#B2DFDB" />
              <stop offset="0.4" stopColor="#26A69A" />
              <stop offset="1" stopColor="#004D40" />
            </linearGradient>
            <linearGradient id={`${u}-plasma`} x1="28" y1="40" x2="56" y2="6">
              <stop stopColor="#A7FFEB" />
              <stop offset="0.5" stopColor="#1DE9B6" />
              <stop offset="1" stopColor="#00BFA5" />
            </linearGradient>
          </defs>
          {/* Cleaver body */}
          <path
            d="M22 44 50 8h8v8L34 52l-8-2 2-6Z"
            fill={`url(#${u}-mc)`}
          />
          {/* Plasma edge */}
          <path
            d="M28 42 52 10l4 2-20 36-8-2 4-4Z"
            fill={`url(#${u}-plasma)`}
          />
          <path d="M34 38 52 14" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.7" />
          {/* Tech guard */}
          <rect
            x="18"
            y="40"
            width="14"
            height="8"
            rx="1.5"
            transform="rotate(-40 25 44)"
            fill="#004D40"
          />
          <circle cx="26" cy="42" r="2.5" fill="#1DE9B6" />
          {/* Handle */}
          <path
            d="M14 56 24 46"
            stroke="#00897B"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <rect
            x="10"
            y="54"
            width="10"
            height="6"
            rx="1"
            transform="rotate(-40 15 57)"
            fill="#80CBC4"
          />
          {/* Energy dots */}
          <circle cx="40" cy="24" r="1.5" fill="#FFFFFF" />
          <circle cx="46" cy="16" r="1.2" fill="#A7FFEB" />
        </>
      );

    case "shadow-weapon":
      // Eclipse Scepter — dark staff with eclipse orb
      return (
        <>
          <defs>
            <linearGradient id={`${u}-sh`} x1="24" y1="4" x2="40" y2="60">
              <stop stopColor="#7986CB" />
              <stop offset="0.4" stopColor="#283593" />
              <stop offset="1" stopColor="#0D0D1A" />
            </linearGradient>
            <radialGradient id={`${u}-ecl`} cx="40%" cy="40%" r="60%">
              <stop stopColor="#E1BEE7" />
              <stop offset="0.35" stopColor="#7C4DFF" />
              <stop offset="0.7" stopColor="#1A237E" />
              <stop offset="1" stopColor="#000000" />
            </radialGradient>
          </defs>
          <path
            d="M32 58V24"
            stroke={`url(#${u}-sh)`}
            strokeWidth="5"
            strokeLinecap="round"
          />
          {/* Crown prongs */}
          <path d="M22 22 32 8l10 14-4 4H26l-4-4Z" fill="#4527A0" />
          <path d="M26 18l6-8 6 8" stroke="#B39DDB" strokeWidth="1.5" fill="none" />
          {/* Eclipse orb */}
          <circle cx="32" cy="16" r="9" fill={`url(#${u}-ecl)`} />
          <circle cx="36" cy="14" r="6" fill="#0D0D1A" />
          <circle cx="28" cy="13" r="2" fill="#E1BEE7" opacity="0.7" />
          {/* Ring */}
          <circle
            cx="32"
            cy="16"
            r="11"
            stroke="#7C4DFF"
            strokeWidth="1.5"
            fill="none"
            opacity="0.6"
          />
          <circle cx="32" cy="50" r="3.5" fill="#7C4DFF" />
          <circle cx="32" cy="50" r="1.5" fill="#E1BEE7" />
          <circle cx="24" cy="34" r="1" fill="#B39DDB" />
          <circle cx="40" cy="40" r="0.9" fill="#CE93D8" />
        </>
      );

    case "phantom-weapon":
      // Soulrend Greatsword — huge pink ghost blade
      return (
        <>
          <defs>
            <linearGradient id={`${u}-ph`} x1="10" y1="52" x2="56" y2="6">
              <stop stopColor="#F8BBD0" />
              <stop offset="0.35" stopColor="#EC407A" />
              <stop offset="1" stopColor="#4A148C" />
            </linearGradient>
          </defs>
          {/* Wide blade */}
          <path
            d="M22 46 50 6l10 6-22 40-12 4 4-10Z"
            fill={`url(#${u}-ph)`}
          />
          <path
            d="M28 44 52 10l4 3-20 36-8-2 4-3Z"
            fill="#FCE4EC"
            opacity="0.55"
          />
          {/* Ghost flame along edge */}
          <path
            d="M52 8c-1 4-2 7 0 11 1-2 1.5-3 2-3s1.2 1 2 3c1.5-4 .5-7-1-11l-1.5 2.5L52 8Z"
            fill="#FFF59D"
          />
          {/* Crossguard wings */}
          <path d="M16 42l14-8 5 5-14 8-5-5Z" fill="#AD1457" />
          <path d="M14 38l6-4 3 3-6 4-3-3Z" fill="#F48FB1" />
          <path d="M34 48l6-4 3 3-6 4-3-3Z" fill="#F48FB1" />
          {/* Hilt */}
          <path
            d="M14 56 24 46"
            stroke="#4A148C"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <circle cx="12" cy="58" r="4" fill="#EC407A" />
          <circle cx="12" cy="58" r="2" fill="#FFF59D" />
          <circle cx="40" cy="24" r="1.2" fill="#F8BBD0" />
          <circle cx="46" cy="16" r="1" fill="#FFFFFF" />
        </>
      );

    case "wild-broom-lance":
      // Broomhandle Lance — wooden broom as lance
      return (
        <>
          <defs>
            <linearGradient id={`${u}-wood`} x1="12" y1="52" x2="52" y2="8">
              <stop stopColor="#D7CCC8" />
              <stop offset="0.5" stopColor="#8D6E63" />
              <stop offset="1" stopColor="#4E342E" />
            </linearGradient>
            <linearGradient id={`${u}-br`} x1="40" y1="4" x2="58" y2="24">
              <stop stopColor="#FFE082" />
              <stop offset="0.5" stopColor="#FFB300" />
              <stop offset="1" stopColor="#F57F17" />
            </linearGradient>
          </defs>
          {/* Handle */}
          <path
            d="M14 54 44 16"
            stroke={`url(#${u}-wood)`}
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path
            d="M14 54 44 16"
            stroke="#BCAAA4"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.5"
          />
          {/* Binding */}
          <path d="M36 22l6-5" stroke="#5D4037" strokeWidth="3" strokeLinecap="round" />
          <path d="M34 24l6-5" stroke="#795548" strokeWidth="2" strokeLinecap="round" />
          {/* Bristles */}
          <path
            d="M42 8c4-2 10 0 14 6 2 4 2 8 0 10-4 2-10 2-14-2-2-2-2-6 0-10 1-2 2-3 0-4Z"
            fill={`url(#${u}-br)`}
          />
          <path
            d="M44 10c2 2 4 6 4 10M48 8c2 3 3 7 3 11M52 10c1 3 2 6 2 9"
            stroke="#FFF8E1"
            strokeWidth="1.2"
            opacity="0.7"
          />
          <circle cx="12" cy="56" r="3" fill="#6D4C41" />
        </>
      );

    case "wild-choresmith-hammer":
      // Choresmith Hammer — chunky forge hammer
      return (
        <>
          <defs>
            <linearGradient id={`${u}-hm`} x1="16" y1="8" x2="52" y2="40">
              <stop stopColor="#ECEFF1" />
              <stop offset="0.4" stopColor="#90A4AE" />
              <stop offset="1" stopColor="#37474F" />
            </linearGradient>
            <linearGradient id={`${u}-hw`} x1="12" y1="56" x2="36" y2="24">
              <stop stopColor="#D7CCC8" />
              <stop offset="1" stopColor="#5D4037" />
            </linearGradient>
          </defs>
          {/* Handle */}
          <path
            d="M16 56 34 28"
            stroke={`url(#${u}-hw)`}
            strokeWidth="6"
            strokeLinecap="round"
          />
          {/* Hammer head */}
          <rect
            x="28"
            y="12"
            width="28"
            height="16"
            rx="2"
            transform="rotate(-35 42 20)"
            fill={`url(#${u}-hm)`}
          />
          {/* Face & peen */}
          <rect
            x="48"
            y="10"
            width="8"
            height="14"
            rx="1"
            transform="rotate(-35 52 17)"
            fill="#546E7A"
          />
          <path
            d="M26 22l6-8 4 3-6 8-4-3Z"
            fill="#FFB300"
          />
          {/* Shine */}
          <path
            d="M36 16l10-4"
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.7"
          />
          {/* Rivet */}
          <circle cx="34" cy="28" r="2.5" fill="#FF8F00" />
          <circle cx="14" cy="58" r="3.5" fill="#8D6E63" />
          <path
            d="M50 6l.8 1.5 1.6.2-1.2 1.1.3 1.6L50 9.5l-1.5.9.3-1.6-1.2-1.1 1.6-.2.8-1.5Z"
            fill="#FFF59D"
          />
        </>
      );

    case "relic-blade-of-order":
      // Blade of Household Order — legendary golden checklist sword
      return (
        <>
          <defs>
            <linearGradient id={`${u}-rl`} x1="10" y1="54" x2="56" y2="6">
              <stop stopColor="#FFF8E1" />
              <stop offset="0.3" stopColor="#FFD54F" />
              <stop offset="0.65" stopColor="#FF8F00" />
              <stop offset="1" stopColor="#E91E63" />
            </linearGradient>
          </defs>
          {/* Blade */}
          <path
            d="M24 46 50 8l8 5-20 40-10 3 2-10Z"
            fill={`url(#${u}-rl)`}
          />
          <path
            d="M30 44 52 12l3 2-18 34-7-2 4-2Z"
            fill="#FFFDE7"
            opacity="0.5"
          />
          {/* Checklist marks on blade */}
          <path
            d="M36 28l2 2 4-5"
            stroke="#AD1457"
            strokeWidth="1.8"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M40 22l2 2 4-5"
            stroke="#AD1457"
            strokeWidth="1.8"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Ornate guard */}
          <path d="M18 42l14-8 6 6-14 8-6-6Z" fill="#E91E63" />
          <path d="M16 40l5-4 3 3-5 4-3-3Z" fill="#FFD54F" />
          <path d="M32 50l5-4 3 3-5 4-3-3Z" fill="#FFD54F" />
          {/* Hilt */}
          <path
            d="M12 56 24 44"
            stroke="#FF8F00"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <circle cx="10" cy="58" r="5" fill={`url(#${u}-rl)`} />
          <circle cx="10" cy="58" r="2.5" fill="#E91E63" />
          {/* Sparkles */}
          <path
            d="M54 4l1 2 2 .3-1.5 1.4.4 2L54 8.5l-1.9 1.2.4-2L51 6.3l2-.3 1-2Z"
            fill="#FFFFFF"
          />
          <path
            d="M44 10l.8 1.5 1.6.2-1.2 1.1.3 1.6L44 13.5l-1.5.9.3-1.6-1.2-1.1 1.6-.2.8-1.5Z"
            fill="#FFF59D"
          />
        </>
      );

    case "scrap-weapon":
    default:
      // Bent Nail Sword — crooked scrap blade
      return (
        <>
          <defs>
            <linearGradient id={`${u}-sc`} x1="14" y1="50" x2="52" y2="10">
              <stop stopColor="#CFD8DC" />
              <stop offset="0.5" stopColor="#78909C" />
              <stop offset="1" stopColor="#455A64" />
            </linearGradient>
          </defs>
          {/* Bent blade */}
          <path
            d="M24 44 40 24l6-2 2 4-4 6-12 16-6 2 2-8Z"
            fill={`url(#${u}-sc)`}
          />
          <path
            d="M28 42 42 24l2 1-12 18-4-1Z"
            fill="#ECEFF1"
            opacity="0.5"
          />
          {/* Nail head tip */}
          <circle cx="48" cy="18" r="4" fill="#90A4AE" />
          <circle cx="48" cy="18" r="2" fill="#546E7A" />
          {/* Wrap hilt */}
          <path
            d="M16 54 28 42"
            stroke="#8D6E63"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path
            d="M18 52 26 44"
            stroke="#A67C52"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Rust blotches */}
          <circle cx="36" cy="30" r="2" fill="#A67C52" opacity="0.8" />
          <circle cx="32" cy="38" r="1.5" fill="#8D6E63" opacity="0.7" />
          <path d="M20 48l4-4" stroke="#5C6B7A" strokeWidth="1.5" />
          <circle cx="14" cy="56" r="3.5" fill="#6B7A8C" />
        </>
      );
  }
}
