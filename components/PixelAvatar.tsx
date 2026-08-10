"use client";

import type { AvatarId } from "@/lib/types";

/** Shared 16×16 pixel palette helpers */
const SKIN = "#f0c8a0";
const SKIN_SH = "#d4a574";
const EYE = "#1a1a2e";

type Props = {
  id: AvatarId;
  size?: number;
  className?: string;
};

export function PixelAvatar({ id, size = 96, className = "" }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      className={className}
      style={{ imageRendering: "pixelated" }}
      aria-hidden
    >
      {id === "knight" && <KnightSprite />}
      {id === "wizard" && <WizardSprite />}
      {id === "archer" && <ArcherSprite />}
      {id === "dragon-rider" && <DragonRiderSprite />}
      {id === "berserker" && <BerserkerSprite />}
    </svg>
  );
}

function KnightSprite() {
  return (
    <>
      <rect width="16" height="16" fill="#0b1220" />
      {/* helmet */}
      <rect x="4" y="1" width="8" height="2" fill="#94a3b8" />
      <rect x="3" y="3" width="10" height="4" fill="#cbd5e1" />
      <rect x="4" y="4" width="8" height="2" fill="#64748b" />
      <rect x="5" y="4" width="2" height="2" fill="#22d3ee" />
      <rect x="9" y="4" width="2" height="2" fill="#22d3ee" />
      {/* face peek */}
      <rect x="6" y="6" width="4" height="1" fill={SKIN} />
      {/* armor body */}
      <rect x="4" y="7" width="8" height="5" fill="#e2e8f0" />
      <rect x="5" y="8" width="6" height="3" fill="#94a3b8" />
      <rect x="7" y="8" width="2" height="2" fill="#fbbf24" />
      {/* arms + shield */}
      <rect x="2" y="8" width="2" height="3" fill="#cbd5e1" />
      <rect x="12" y="7" width="3" height="4" fill="#fbbf24" />
      <rect x="13" y="8" width="1" height="2" fill="#f59e0b" />
      {/* legs */}
      <rect x="5" y="12" width="2" height="3" fill="#64748b" />
      <rect x="9" y="12" width="2" height="3" fill="#64748b" />
      <rect x="5" y="14" width="2" height="1" fill="#334155" />
      <rect x="9" y="14" width="2" height="1" fill="#334155" />
    </>
  );
}

function WizardSprite() {
  return (
    <>
      <rect width="16" height="16" fill="#0b1220" />
      {/* hat */}
      <rect x="7" y="0" width="2" height="2" fill="#22d3ee" />
      <rect x="6" y="2" width="4" height="1" fill="#0891b2" />
      <rect x="4" y="3" width="8" height="2" fill="#22d3ee" />
      <rect x="3" y="4" width="10" height="1" fill="#67e8f9" />
      {/* face */}
      <rect x="5" y="5" width="6" height="3" fill={SKIN} />
      <rect x="6" y="6" width="1" height="1" fill={EYE} />
      <rect x="9" y="6" width="1" height="1" fill={EYE} />
      <rect x="5" y="7" width="6" height="1" fill="#e0f2fe" />
      {/* robe */}
      <rect x="4" y="8" width="8" height="5" fill="#0e7490" />
      <rect x="5" y="9" width="6" height="4" fill="#155e75" />
      <rect x="7" y="9" width="2" height="3" fill="#a3e635" />
      {/* staff */}
      <rect x="13" y="4" width="1" height="9" fill="#a16207" />
      <rect x="12" y="3" width="3" height="2" fill="#fbbf24" />
      {/* feet */}
      <rect x="5" y="13" width="2" height="2" fill="#083344" />
      <rect x="9" y="13" width="2" height="2" fill="#083344" />
    </>
  );
}

function ArcherSprite() {
  return (
    <>
      <rect width="16" height="16" fill="#0b1220" />
      {/* hood */}
      <rect x="4" y="1" width="8" height="2" fill="#166534" />
      <rect x="3" y="3" width="10" height="3" fill="#15803d" />
      {/* face */}
      <rect x="5" y="4" width="6" height="3" fill={SKIN} />
      <rect x="6" y="5" width="1" height="1" fill={EYE} />
      <rect x="9" y="5" width="1" height="1" fill={EYE} />
      {/* tunic */}
      <rect x="4" y="7" width="8" height="5" fill="#22c55e" />
      <rect x="5" y="8" width="6" height="3" fill="#16a34a" />
      <rect x="7" y="8" width="2" height="2" fill="#a3e635" />
      {/* bow */}
      <rect x="1" y="5" width="1" height="7" fill="#a16207" />
      <rect x="2" y="5" width="1" height="1" fill="#d97706" />
      <rect x="2" y="11" width="1" height="1" fill="#d97706" />
      <rect x="2" y="8" width="2" height="1" fill="#fef3c7" />
      {/* quiver */}
      <rect x="12" y="7" width="2" height="4" fill="#854d0e" />
      <rect x="12" y="6" width="1" height="1" fill="#fbbf24" />
      <rect x="13" y="6" width="1" height="1" fill="#f87171" />
      {/* boots */}
      <rect x="5" y="12" width="2" height="3" fill="#14532d" />
      <rect x="9" y="12" width="2" height="3" fill="#14532d" />
    </>
  );
}

function DragonRiderSprite() {
  return (
    <>
      <rect width="16" height="16" fill="#0b1220" />
      {/* tiny dragon behind */}
      <rect x="10" y="1" width="5" height="3" fill="#f97316" />
      <rect x="11" y="0" width="2" height="1" fill="#fb923c" />
      <rect x="14" y="2" width="1" height="1" fill="#fbbf24" />
      <rect x="12" y="3" width="2" height="2" fill="#ea580c" />
      <rect x="14" y="4" width="1" height="3" fill="#c2410c" />
      {/* rider helm */}
      <rect x="3" y="2" width="7" height="2" fill="#dc2626" />
      <rect x="4" y="4" width="5" height="3" fill={SKIN} />
      <rect x="5" y="5" width="1" height="1" fill={EYE} />
      <rect x="7" y="5" width="1" height="1" fill={EYE} />
      {/* armor */}
      <rect x="3" y="7" width="7" height="5" fill="#b91c1c" />
      <rect x="4" y="8" width="5" height="3" fill="#991b1b" />
      <rect x="5" y="8" width="3" height="2" fill="#fbbf24" />
      {/* cape */}
      <rect x="2" y="7" width="1" height="5" fill="#f97316" />
      {/* legs */}
      <rect x="4" y="12" width="2" height="3" fill="#7f1d1d" />
      <rect x="7" y="12" width="2" height="3" fill="#7f1d1d" />
    </>
  );
}

function BerserkerSprite() {
  return (
    <>
      <rect width="16" height="16" fill="#0b1220" />
      {/* wild hair */}
      <rect x="3" y="1" width="10" height="2" fill="#a16207" />
      <rect x="2" y="2" width="2" height="2" fill="#ca8a04" />
      <rect x="12" y="2" width="2" height="2" fill="#ca8a04" />
      <rect x="4" y="3" width="8" height="1" fill="#854d0e" />
      {/* face — bigger/stronger */}
      <rect x="4" y="4" width="8" height="4" fill={SKIN} />
      <rect x="5" y="5" width="2" height="1" fill={EYE} />
      <rect x="9" y="5" width="2" height="1" fill={EYE} />
      <rect x="6" y="7" width="4" height="1" fill={SKIN_SH} />
      {/* bare chest / fur */}
      <rect x="3" y="8" width="10" height="4" fill="#b45309" />
      <rect x="4" y="9" width="8" height="3" fill="#92400e" />
      <rect x="6" y="9" width="4" height="2" fill={SKIN} />
      {/* huge axe */}
      <rect x="13" y="3" width="2" height="9" fill="#78716c" />
      <rect x="11" y="3" width="4" height="3" fill="#a3e635" />
      <rect x="12" y="2" width="2" height="1" fill="#65a30d" />
      {/* boots */}
      <rect x="4" y="12" width="3" height="3" fill="#44403c" />
      <rect x="9" y="12" width="3" height="3" fill="#44403c" />
    </>
  );
}
