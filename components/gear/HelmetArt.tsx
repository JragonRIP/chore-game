"use client";

import { useId, type ReactNode } from "react";
import type { GearId } from "@/lib/types";

/** Detailed custom helmet art — one design per piece. */
export function HelmetArt({ id, size }: { id: GearId; size: number }) {
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
    case "frostbite-helmet":
      return (
        <>
          <defs>
            <linearGradient id={`${u}-fb`} x1="12" y1="8" x2="52" y2="52">
              <stop stopColor="#E0F7FA" />
              <stop offset="0.5" stopColor="#4DD0E1" />
              <stop offset="1" stopColor="#0277BD" />
            </linearGradient>
          </defs>
          <path
            d="M12 28c0-12 9-20 20-20s20 8 20 20v8H12v-8Z"
            fill={`url(#${u}-fb)`}
          />
          <path d="M16 36h32v8c0 2-2 4-4 4H20c-2 0-4-2-4-4v-8Z" fill="#01579B" />
          <rect x="18" y="30" width="10" height="6" rx="1" fill="#0277BD" />
          <rect x="36" y="30" width="10" height="6" rx="1" fill="#0277BD" />
          <path d="M28 18h8v4h-8v-4Z" fill="#B2EBF2" />
          <path
            d="M32 8l2 6h6l-5 4 2 6-5-3-5 3 2-6-5-4h6l2-6Z"
            fill="#FFFFFF"
            opacity="0.95"
          />
          <path d="M22 24h4M38 24h4" stroke="#E0F7FA" strokeWidth="1.5" />
        </>
      );

    case "starlight-helmet":
      return (
        <>
          <defs>
            <linearGradient id={`${u}-sl`} x1="14" y1="4" x2="50" y2="56">
              <stop stopColor="#B39DDB" />
              <stop offset="0.45" stopColor="#5C6BC0" />
              <stop offset="1" stopColor="#1A237E" />
            </linearGradient>
          </defs>
          <path
            d="M18 20c0-10 6-16 14-16s14 6 14 16c6 2 10 8 10 16v8c0 2-2 4-6 4H14c-4 0-6-2-6-4v-8c0-8 4-14 10-16Z"
            fill={`url(#${u}-sl)`}
          />
          <ellipse cx="32" cy="14" rx="10" ry="6" fill="#7E57C2" />
          <path d="M14 36h36v8H14v-8Z" fill="#283593" opacity="0.7" />
          <circle cx="24" cy="28" r="1.2" fill="#FFF59D" />
          <circle cx="40" cy="26" r="1" fill="#FFFFFF" />
          <circle cx="32" cy="32" r="1.3" fill="#FFE082" />
          <path
            d="M32 18l1 2.2 2.4.3-1.7 1.7.4 2.4L32 23.4l-2.1 1.2.4-2.4-1.7-1.7 2.4-.3L32 18Z"
            fill="#FFF59D"
          />
          <path
            d="M20 44c4 4 8 6 12 6s8-2 12-6"
            stroke="#9FA8DA"
            strokeWidth="2"
            fill="none"
          />
        </>
      );

    case "sunfire-helmet":
      return (
        <>
          <defs>
            <linearGradient id={`${u}-sf`} x1="12" y1="6" x2="52" y2="54">
              <stop stopColor="#FFE082" />
              <stop offset="0.4" stopColor="#FFB300" />
              <stop offset="1" stopColor="#E65100" />
            </linearGradient>
          </defs>
          <path
            d="M14 26c0-12 8-20 18-20s18 8 18 20v10H14V26Z"
            fill={`url(#${u}-sf)`}
          />
          <path d="M14 36h36v10c0 2-2 4-4 4H18c-2 0-4-2-4-4V36Z" fill="#BF360C" />
          <path d="M28 6l4-4 4 4v6H28V6Z" fill="#FFECB3" />
          <circle cx="32" cy="8" r="3" fill="#FF6F00" />
          <rect x="18" y="28" width="10" height="5" rx="1" fill="#FF6F00" />
          <rect x="36" y="28" width="10" height="5" rx="1" fill="#FF6F00" />
          <path
            d="M32 14v3M24 18l2 2M40 18l-2 2"
            stroke="#FFF8E1"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path d="M20 42h24" stroke="#FFCC80" strokeWidth="1.5" opacity="0.6" />
        </>
      );

    case "dragonguard-helmet":
      return (
        <>
          <defs>
            <linearGradient id={`${u}-dg`} x1="10" y1="6" x2="54" y2="54">
              <stop stopColor="#EF5350" />
              <stop offset="0.5" stopColor="#C62828" />
              <stop offset="1" stopColor="#3E2723" />
            </linearGradient>
          </defs>
          <path
            d="M10 30c2-14 10-22 22-22s20 8 22 22v8H10v-8Z"
            fill={`url(#${u}-dg)`}
          />
          <path d="M12 38h40v10c0 2-3 4-6 4H18c-3 0-6-2-6-4V38Z" fill="#4E342E" />
          {/* Horns */}
          <path d="M16 18 8 6l6 4 4 10-2-2Z" fill="#FFD54F" />
          <path d="M48 18l8-12-6 4-4 10 2-2Z" fill="#FFD54F" />
          <path d="M16 18l-2-6" stroke="#FF8A65" strokeWidth="1.5" />
          <path d="M48 18l2-6" stroke="#FF8A65" strokeWidth="1.5" />
          {/* Eyes */}
          <path d="M18 28h10v5H18v-5Z" fill="#1A0000" />
          <path d="M36 28h10v5H36v-5Z" fill="#1A0000" />
          <path d="M20 29h6" stroke="#FF8A65" strokeWidth="1.5" />
          <path d="M38 29h6" stroke="#FF8A65" strokeWidth="1.5" />
          {/* Snout ridge */}
          <path d="M28 34h8v4c-1 2-3 3-4 3s-3-1-4-3v-4Z" fill="#8D6E63" />
        </>
      );

    case "mech-helmet":
      return (
        <>
          <defs>
            <linearGradient id={`${u}-mc`} x1="10" y1="8" x2="54" y2="52">
              <stop stopColor="#B2DFDB" />
              <stop offset="0.4" stopColor="#26A69A" />
              <stop offset="1" stopColor="#004D40" />
            </linearGradient>
          </defs>
          <rect
            x="12"
            y="14"
            width="40"
            height="34"
            rx="6"
            fill={`url(#${u}-mc)`}
          />
          <rect x="16" y="18" width="32" height="20" rx="3" fill="#004D40" />
          {/* Visor */}
          <rect x="18" y="22" width="28" height="10" rx="2" fill="#1DE9B6" />
          <rect x="20" y="24" width="10" height="6" rx="1" fill="#A7FFEB" />
          <rect x="34" y="24" width="10" height="6" rx="1" fill="#A7FFEB" />
          <circle cx="32" cy="42" r="3" fill="#1DE9B6" />
          <rect x="14" y="16" width="4" height="4" rx="0.5" fill="#80CBC4" />
          <rect x="46" y="16" width="4" height="4" rx="0.5" fill="#80CBC4" />
          <path d="M22 40h20" stroke="#80CBC4" strokeWidth="2" />
        </>
      );

    case "shadow-helmet":
      return (
        <>
          <defs>
            <linearGradient id={`${u}-sh`} x1="14" y1="4" x2="50" y2="54">
              <stop stopColor="#5C6BC0" />
              <stop offset="0.4" stopColor="#283593" />
              <stop offset="1" stopColor="#0D0D1A" />
            </linearGradient>
          </defs>
          {/* Crown points */}
          <path
            d="M16 28 12 12l8 8 6-12 6 12 6-12 6 12 8-8-4 16H16Z"
            fill={`url(#${u}-sh)`}
          />
          <path d="M14 28h36v16c0 3-3 6-8 6H22c-5 0-8-3-8-6V28Z" fill="#1A237E" />
          <ellipse cx="32" cy="36" rx="8" ry="5" fill="#7C4DFF" />
          <ellipse cx="32" cy="36" rx="3" ry="4" fill="#E1BEE7" />
          <circle cx="20" cy="20" r="1" fill="#B39DDB" />
          <circle cx="32" cy="14" r="1.2" fill="#CE93D8" />
          <circle cx="44" cy="20" r="1" fill="#B39DDB" />
          <path d="M18 48h28" stroke="#4527A0" strokeWidth="2" opacity="0.6" />
        </>
      );

    case "phantom-helmet":
      return (
        <>
          <defs>
            <linearGradient id={`${u}-ph`} x1="12" y1="6" x2="52" y2="54">
              <stop stopColor="#F8BBD0" />
              <stop offset="0.4" stopColor="#EC407A" />
              <stop offset="1" stopColor="#4A148C" />
            </linearGradient>
          </defs>
          {/* Mask shape */}
          <path
            d="M14 22c0-10 8-16 18-16s18 6 18 16v18c0 6-6 12-18 14-12-2-18-8-18-14V22Z"
            fill={`url(#${u}-ph)`}
          />
          <path
            d="M20 20c2-4 6-6 12-6s10 2 12 6"
            stroke="#FCE4EC"
            strokeWidth="2"
            fill="none"
          />
          {/* Eye slits */}
          <ellipse cx="24" cy="30" rx="5" ry="3.5" fill="#2D0A1F" />
          <ellipse cx="40" cy="30" rx="5" ry="3.5" fill="#2D0A1F" />
          <ellipse cx="24" cy="30" rx="2" ry="2" fill="#FFF59D" />
          <ellipse cx="40" cy="30" rx="2" ry="2" fill="#FFF59D" />
          {/* Ghost flame crest */}
          <path
            d="M32 6c-2 4-3 6-2 10 1-1 1.5-2 2-2s1 1 2 2c1-4 0-6-2-10Z"
            fill="#FFF59D"
          />
          <path d="M28 42h8c0 3-2 5-4 5s-4-2-4-5Z" fill="#4A148C" opacity="0.5" />
        </>
      );

    case "wild-courier-cap":
      return (
        <>
          <defs>
            <linearGradient id={`${u}-cc`} x1="14" y1="10" x2="50" y2="48">
              <stop stopColor="#AED581" />
              <stop offset="0.5" stopColor="#7CB342" />
              <stop offset="1" stopColor="#33691E" />
            </linearGradient>
          </defs>
          {/* Cap crown */}
          <ellipse cx="32" cy="28" rx="18" ry="14" fill={`url(#${u}-cc)`} />
          <ellipse cx="32" cy="24" rx="14" ry="8" fill="#9CCC65" />
          {/* Brim */}
          <ellipse cx="32" cy="40" rx="22" ry="6" fill="#558B2F" />
          <ellipse cx="32" cy="38" rx="18" ry="3" fill="#7CB342" />
          {/* Button */}
          <circle cx="32" cy="18" r="2.5" fill="#FFF9C4" />
          {/* Lucky clover */}
          <circle cx="26" cy="28" r="2.5" fill="#C5E1A5" />
          <circle cx="32" cy="26" r="2.5" fill="#C5E1A5" />
          <circle cx="38" cy="28" r="2.5" fill="#C5E1A5" />
          <circle cx="32" cy="32" r="2.5" fill="#C5E1A5" />
        </>
      );

    case "wild-focus-band":
      return (
        <>
          <defs>
            <linearGradient id={`${u}-hf`} x1="10" y1="20" x2="54" y2="40">
              <stop stopColor="#80CBC4" />
              <stop offset="0.5" stopColor="#26A69A" />
              <stop offset="1" stopColor="#00695C" />
            </linearGradient>
          </defs>
          {/* Headband */}
          <path
            d="M8 28c0-4 6-8 24-8s24 4 24 8-6 8-24 8-24-4-24-8Z"
            fill={`url(#${u}-hf)`}
          />
          <path
            d="M10 28c2-2 8-4 22-4s20 2 22 4"
            stroke="#B2DFDB"
            strokeWidth="2"
            fill="none"
          />
          {/* Focus gem */}
          <circle cx="32" cy="28" r="7" fill="#E0F2F1" />
          <circle cx="32" cy="28" r="4.5" fill="#00BFA5" />
          <circle cx="30" cy="26" r="1.5" fill="#FFFFFF" opacity="0.8" />
          {/* Side tabs */}
          <rect x="6" y="26" width="6" height="4" rx="1" fill="#004D40" />
          <rect x="52" y="26" width="6" height="4" rx="1" fill="#004D40" />
          {/* Sparkles */}
          <path d="M22 20l1 2 2 .3-1.5 1.3.4 2L22 24.4l-1.9 1.2.4-2L19 22.3l2-.3 1-2Z" fill="#FFF59D" />
          <path d="M42 20l1 2 2 .3-1.5 1.3.4 2L42 24.4l-1.9 1.2.4-2L39 22.3l2-.3 1-2Z" fill="#FFF59D" />
        </>
      );

    case "relic-crown-first-chore":
      return (
        <>
          <defs>
            <linearGradient id={`${u}-rl`} x1="10" y1="8" x2="54" y2="48">
              <stop stopColor="#FFF8E1" />
              <stop offset="0.35" stopColor="#FFD54F" />
              <stop offset="0.7" stopColor="#FF8F00" />
              <stop offset="1" stopColor="#E91E63" />
            </linearGradient>
          </defs>
          {/* Crown band */}
          <path
            d="M10 36h44v10c0 2-2 4-6 4H16c-4 0-6-2-6-4V36Z"
            fill={`url(#${u}-rl)`}
          />
          {/* Points */}
          <path d="M12 36 16 14l6 14 4-18 6 18 4-14 6 14 4-18 6 14 4-22 4 22H12Z" fill={`url(#${u}-rl)`} />
          <path
            d="M16 36 18 22l4 10 3-14 4 14 3-10 4 10 3-14 4 10 2-12 3 16H16Z"
            fill="#FFF3E0"
            opacity="0.35"
          />
          {/* Jewels */}
          <circle cx="32" cy="28" r="4" fill="#E91E63" />
          <circle cx="32" cy="28" r="2" fill="#F8BBD0" />
          <circle cx="20" cy="34" r="2.5" fill="#7C4DFF" />
          <circle cx="44" cy="34" r="2.5" fill="#00BCD4" />
          <circle cx="32" cy="40" r="2" fill="#FFD54F" />
          <path
            d="M32 10l1 2 2 .3-1.5 1.4.4 2L32 14.5l-1.9 1.2.4-2L29 12.3l2-.3 1-2Z"
            fill="#FFFFFF"
          />
        </>
      );

    case "scrap-helmet":
    default:
      return (
        <>
          {/* Rusty bucket helm */}
          <path
            d="M14 26c0-10 8-18 18-18s18 8 18 18v12H14V26Z"
            fill="#8B9BB4"
          />
          <path d="M14 26c2-8 8-14 18-14s16 6 18 14" fill="#A8B8CC" />
          <path d="M14 38h36v10c0 2-2 4-4 4H18c-2 0-4-2-4-4V38Z" fill="#6B7A8C" />
          {/* Handle */}
          <path
            d="M22 12c0-6 4-10 10-10s10 4 10 10"
            stroke="#5C6B7A"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
          {/* Eye slits */}
          <rect x="18" y="30" width="10" height="5" rx="1" fill="#3D4A56" />
          <rect x="36" y="30" width="10" height="5" rx="1" fill="#3D4A56" />
          {/* Rust patches / rivets */}
          <rect x="26" y="42" width="12" height="4" rx="1" fill="#A67C52" />
          <circle cx="20" cy="24" r="1.3" fill="#4A5568" />
          <circle cx="44" cy="24" r="1.3" fill="#4A5568" />
          <circle cx="32" cy="44" r="1.2" fill="#4A5568" />
        </>
      );
  }
}
