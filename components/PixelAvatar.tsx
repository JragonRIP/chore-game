"use client";

import type { AvatarId } from "@/lib/types";

const SKIN = "#f0c8a0";
const SKIN_SH = "#d4a574";
const SKIN_HI = "#ffe4c4";
const EYE = "#1a1a2e";
const BG = "#0b1220";

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
      viewBox="0 0 32 32"
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

function px(
  x: number,
  y: number,
  w: number,
  h: number,
  fill: string,
  key?: string,
) {
  return <rect key={key} x={x} y={y} width={w} height={h} fill={fill} />;
}

function KnightSprite() {
  return (
    <>
      {px(0, 0, 32, 32, BG)}
      {/* plumed helm */}
      {px(14, 1, 4, 2, "#f87171")}
      {px(15, 0, 2, 1, "#fb7185")}
      {px(10, 3, 12, 2, "#94a3b8")}
      {px(9, 5, 14, 3, "#cbd5e1")}
      {px(8, 8, 16, 4, "#e2e8f0")}
      {px(10, 9, 12, 2, "#64748b")}
      {/* visor slits */}
      {px(11, 9, 3, 2, "#22d3ee")}
      {px(18, 9, 3, 2, "#22d3ee")}
      {px(12, 9, 1, 2, "#67e8f9")}
      {px(19, 9, 1, 2, "#67e8f9")}
      {/* face under chin guard */}
      {px(13, 12, 6, 2, SKIN)}
      {px(14, 13, 4, 1, SKIN_SH)}
      {/* pauldrons */}
      {px(6, 14, 4, 3, "#94a3b8")}
      {px(22, 14, 4, 3, "#94a3b8")}
      {px(5, 15, 2, 2, "#64748b")}
      {px(25, 15, 2, 2, "#64748b")}
      {/* chestplate */}
      {px(10, 14, 12, 8, "#e2e8f0")}
      {px(11, 15, 10, 6, "#94a3b8")}
      {px(13, 16, 6, 4, "#cbd5e1")}
      {px(14, 17, 4, 2, "#fbbf24")}
      {px(15, 17, 2, 2, "#f59e0b")}
      {/* arms */}
      {px(7, 17, 3, 5, "#cbd5e1")}
      {px(22, 17, 3, 4, "#cbd5e1")}
      {/* kite shield */}
      {px(25, 16, 5, 8, "#fbbf24")}
      {px(26, 17, 3, 6, "#f59e0b")}
      {px(27, 18, 1, 4, "#fde68a")}
      {px(26, 19, 3, 1, "#b45309")}
      {/* sword hand */}
      {px(6, 16, 2, 2, SKIN)}
      {px(5, 12, 2, 5, "#94a3b8")}
      {px(4, 11, 4, 2, "#64748b")}
      {/* belt + skirt */}
      {px(11, 22, 10, 2, "#334155")}
      {px(12, 22, 8, 1, "#fbbf24")}
      {/* greaves */}
      {px(11, 24, 4, 5, "#94a3b8")}
      {px(17, 24, 4, 5, "#94a3b8")}
      {px(11, 28, 4, 2, "#475569")}
      {px(17, 28, 4, 2, "#475569")}
      {px(10, 30, 5, 1, "#1e293b")}
      {px(17, 30, 5, 1, "#1e293b")}
    </>
  );
}

function WizardSprite() {
  return (
    <>
      {px(0, 0, 32, 32, BG)}
      {/* tall pointed hat */}
      {px(15, 0, 2, 2, "#67e8f9")}
      {px(14, 2, 4, 2, "#22d3ee")}
      {px(13, 4, 6, 2, "#0891b2")}
      {px(11, 6, 10, 2, "#22d3ee")}
      {px(9, 8, 14, 2, "#67e8f9")}
      {px(8, 9, 16, 1, "#a5f3fc")}
      {px(14, 5, 2, 1, "#a3e635")}
      {/* face + beard */}
      {px(12, 10, 8, 5, SKIN)}
      {px(13, 11, 2, 2, EYE)}
      {px(17, 11, 2, 2, EYE)}
      {px(14, 11, 1, 1, "#fff")}
      {px(18, 11, 1, 1, "#fff")}
      {px(14, 14, 4, 1, SKIN_SH)}
      {px(11, 15, 10, 3, "#e0f2fe")}
      {px(12, 16, 8, 2, "#bae6fd")}
      {px(13, 18, 6, 1, "#7dd3fc")}
      {/* robe */}
      {px(10, 18, 12, 9, "#0e7490")}
      {px(11, 19, 10, 8, "#155e75")}
      {px(12, 20, 8, 6, "#083344")}
      {px(14, 20, 4, 5, "#a3e635")}
      {px(15, 21, 2, 3, "#d9f99d")}
      {/* sleeves */}
      {px(7, 19, 3, 6, "#0e7490")}
      {px(22, 19, 3, 5, "#0e7490")}
      {px(7, 24, 3, 2, SKIN)}
      {/* staff */}
      {px(26, 8, 2, 18, "#a16207")}
      {px(25, 7, 4, 1, "#854d0e")}
      {px(24, 4, 6, 3, "#fbbf24")}
      {px(25, 5, 4, 1, "#fde68a")}
      {px(26, 3, 2, 1, "#fef08a")}
      {px(27, 6, 1, 1, "#a3e635")}
      {/* boots */}
      {px(12, 27, 3, 3, "#083344")}
      {px(17, 27, 3, 3, "#083344")}
      {px(11, 30, 4, 1, "#164e63")}
      {px(17, 30, 4, 1, "#164e63")}
    </>
  );
}

function ArcherSprite() {
  return (
    <>
      {px(0, 0, 32, 32, BG)}
      {/* hood */}
      {px(10, 2, 12, 2, "#14532d")}
      {px(8, 4, 16, 3, "#166534")}
      {px(7, 7, 18, 3, "#15803d")}
      {px(9, 5, 14, 2, "#22c55e")}
      {/* face in hood */}
      {px(12, 7, 8, 5, SKIN)}
      {px(13, 8, 2, 2, EYE)}
      {px(17, 8, 2, 2, EYE)}
      {px(14, 8, 1, 1, "#fff")}
      {px(18, 8, 1, 1, "#fff")}
      {px(14, 11, 4, 1, SKIN_SH)}
      {/* tunic */}
      {px(10, 12, 12, 9, "#22c55e")}
      {px(11, 13, 10, 7, "#16a34a")}
      {px(13, 14, 6, 4, "#15803d")}
      {px(14, 15, 4, 2, "#a3e635")}
      {/* belt pouch */}
      {px(11, 20, 10, 2, "#854d0e")}
      {px(18, 19, 3, 3, "#a16207")}
      {/* arms */}
      {px(7, 14, 3, 5, "#16a34a")}
      {px(22, 14, 3, 5, "#16a34a")}
      {px(7, 18, 3, 2, SKIN)}
      {px(22, 18, 3, 2, SKIN)}
      {/* longbow */}
      {px(3, 6, 2, 18, "#a16207")}
      {px(2, 6, 2, 2, "#d97706")}
      {px(2, 22, 2, 2, "#d97706")}
      {px(4, 7, 1, 16, "#fef3c7")}
      {px(5, 14, 3, 1, "#fde68a")}
      {/* quiver + arrows */}
      {px(24, 12, 4, 8, "#854d0e")}
      {px(25, 11, 1, 2, "#fbbf24")}
      {px(26, 10, 1, 2, "#f87171")}
      {px(27, 11, 1, 2, "#a3e635")}
      {/* pants + boots */}
      {px(11, 22, 4, 5, "#14532d")}
      {px(17, 22, 4, 5, "#14532d")}
      {px(10, 27, 5, 3, "#3f2e1a")}
      {px(17, 27, 5, 3, "#3f2e1a")}
      {px(10, 30, 5, 1, "#1c1917")}
      {px(17, 30, 5, 1, "#1c1917")}
    </>
  );
}

function DragonRiderSprite() {
  return (
    <>
      {px(0, 0, 32, 32, BG)}
      {/* dragon head / wing behind rider */}
      {px(20, 2, 8, 4, "#f97316")}
      {px(22, 1, 4, 2, "#fb923c")}
      {px(26, 3, 3, 2, "#ea580c")}
      {px(28, 4, 2, 2, "#fbbf24")}
      {px(21, 6, 6, 3, "#c2410c")}
      {px(22, 5, 2, 1, EYE)}
      {px(23, 5, 1, 1, "#fef08a")}
      {/* wing */}
      {px(24, 8, 6, 2, "#fb923c")}
      {px(25, 10, 5, 2, "#ea580c")}
      {px(26, 12, 4, 2, "#c2410c")}
      {px(27, 14, 2, 3, "#9a3412")}
      {/* rider helm crest */}
      {px(10, 3, 8, 2, "#dc2626")}
      {px(11, 2, 6, 1, "#f87171")}
      {px(12, 1, 2, 1, "#fbbf24")}
      {px(9, 5, 10, 3, "#b91c1c")}
      {/* face */}
      {px(11, 7, 8, 4, SKIN)}
      {px(12, 8, 2, 2, EYE)}
      {px(16, 8, 2, 2, EYE)}
      {px(13, 8, 1, 1, "#fff")}
      {px(17, 8, 1, 1, "#fff")}
      {px(13, 10, 4, 1, SKIN_SH)}
      {/* scale armor */}
      {px(9, 11, 12, 9, "#b91c1c")}
      {px(10, 12, 10, 7, "#991b1b")}
      {px(12, 13, 6, 5, "#7f1d1d")}
      {px(13, 14, 4, 3, "#fbbf24")}
      {px(14, 15, 2, 1, "#fde68a")}
      {/* scale pattern dots */}
      {px(11, 13, 1, 1, "#dc2626")}
      {px(18, 13, 1, 1, "#dc2626")}
      {px(11, 16, 1, 1, "#dc2626")}
      {px(18, 16, 1, 1, "#dc2626")}
      {/* cape */}
      {px(7, 12, 2, 10, "#f97316")}
      {px(6, 14, 1, 8, "#ea580c")}
      {/* arms */}
      {px(7, 14, 2, 5, "#991b1b")}
      {px(21, 14, 2, 5, "#991b1b")}
      {px(7, 18, 2, 2, SKIN)}
      {px(21, 18, 2, 2, SKIN)}
      {/* reins / gauntlet accent */}
      {px(20, 17, 3, 1, "#fbbf24")}
      {/* legs */}
      {px(11, 20, 4, 6, "#7f1d1d")}
      {px(17, 20, 4, 6, "#7f1d1d")}
      {px(10, 26, 5, 4, "#450a0a")}
      {px(17, 26, 5, 4, "#450a0a")}
      {px(10, 30, 5, 1, "#1c1917")}
      {px(17, 30, 5, 1, "#1c1917")}
    </>
  );
}

function BerserkerSprite() {
  return (
    <>
      {px(0, 0, 32, 32, BG)}
      {/* wild spiky hair */}
      {px(8, 1, 16, 2, "#a16207")}
      {px(6, 2, 3, 3, "#ca8a04")}
      {px(23, 2, 3, 3, "#ca8a04")}
      {px(10, 0, 2, 2, "#eab308")}
      {px(15, 0, 2, 1, "#eab308")}
      {px(20, 0, 2, 2, "#eab308")}
      {px(9, 3, 14, 2, "#854d0e")}
      {/* thick brow / fierce face */}
      {px(10, 5, 12, 7, SKIN)}
      {px(11, 6, 10, 5, SKIN_HI)}
      {px(12, 7, 3, 2, EYE)}
      {px(17, 7, 3, 2, EYE)}
      {px(13, 7, 1, 1, "#f87171")}
      {px(18, 7, 1, 1, "#f87171")}
      {px(14, 10, 4, 1, SKIN_SH)}
      {px(13, 11, 6, 1, "#b45309")}
      {/* neck + shoulders */}
      {px(12, 12, 8, 2, SKIN)}
      {px(8, 13, 16, 3, SKIN_SH)}
      {/* fur pauldrons */}
      {px(6, 13, 4, 4, "#92400e")}
      {px(22, 13, 4, 4, "#92400e")}
      {px(5, 14, 2, 2, "#a16207")}
      {px(25, 14, 2, 2, "#a16207")}
      {/* bare muscular torso */}
      {px(10, 16, 12, 7, SKIN)}
      {px(11, 17, 10, 5, SKIN_HI)}
      {px(14, 18, 4, 3, SKIN_SH)}
      {px(12, 19, 2, 1, SKIN_SH)}
      {px(18, 19, 2, 1, SKIN_SH)}
      {/* fur belt */}
      {px(9, 22, 14, 3, "#78350f")}
      {px(11, 23, 10, 1, "#a16207")}
      {px(14, 22, 4, 3, "#fbbf24")}
      {/* huge greataxe */}
      {px(27, 6, 2, 16, "#78716c")}
      {px(26, 5, 4, 1, "#57534e")}
      {px(24, 3, 7, 4, "#a3e635")}
      {px(25, 4, 5, 2, "#65a30d")}
      {px(26, 2, 3, 1, "#d9f99d")}
      {px(23, 5, 2, 2, "#4d7c0f")}
      {px(28, 21, 2, 2, SKIN)}
      {/* arms */}
      {px(7, 17, 3, 6, SKIN)}
      {px(22, 17, 3, 4, SKIN)}
      {/* legs + boots */}
      {px(11, 25, 4, 4, "#44403c")}
      {px(17, 25, 4, 4, "#44403c")}
      {px(10, 28, 5, 3, "#1c1917")}
      {px(17, 28, 5, 3, "#1c1917")}
      {px(10, 30, 5, 1, "#0a0a0a")}
      {px(17, 30, 5, 1, "#0a0a0a")}
    </>
  );
}
