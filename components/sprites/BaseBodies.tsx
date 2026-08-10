import type { ReactNode } from "react";
import type { AvatarId } from "@/lib/types";

export function R({
  x,
  y,
  w,
  h,
  f,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  f: string;
}) {
  return <rect x={x} y={y} width={w} height={h} fill={f} />;
}

const BG = "#0b1220";

/** High-detail chibi 64×64 starters (reference-quality shading). */
export function BaseBody({ id }: { id: AvatarId }): ReactNode {
  switch (id) {
    case "knight":
      return <KnightBody />;
    case "wizard":
      return <WizardBody />;
    case "archer":
      return <ArcherBody />;
    case "dragon-rider":
      return <DragonRiderBody />;
    case "berserker":
      return <BerserkerBody />;
  }
}

/* ---- shared face under helmets / hoods ---- */
function Face({
  x = 22,
  y = 14,
  skin = "#f0c8a0",
  skinHi = "#ffe4c4",
  skinSh = "#d4a574",
}: {
  x?: number;
  y?: number;
  skin?: string;
  skinHi?: string;
  skinSh?: string;
}) {
  return (
    <>
      <R x={x} y={y} w={20} h={14} f={skin} />
      <R x={x + 2} y={y + 2} w={16} h={10} f={skinHi} />
      <R x={x + 4} y={y + 4} w={3} h={4} f="#1a1a2e" />
      <R x={x + 13} y={y + 4} w={3} h={4} f="#1a1a2e" />
      <R x={x + 5} y={y + 5} w={1} h={1} f="#fff" />
      <R x={x + 14} y={y + 5} w={1} h={1} f="#fff" />
      <R x={x + 7} y={y + 10} w={6} h={2} f={skinSh} />
    </>
  );
}

function KnightBody() {
  // Palette matching the reference knight
  const M1 = "#f8fafc"; // bright highlight
  const M2 = "#cbd5e1"; // light metal
  const M3 = "#94a3b8"; // mid
  const M4 = "#64748b"; // shadow metal
  const M5 = "#334155"; // deep shadow
  const R1 = "#ef4444";
  const R2 = "#b91c1c";
  const R3 = "#7f1d1d";

  return (
    <>
      <R x={0} y={0} w={64} h={64} f={BG} />

      {/* cape (behind) */}
      <R x={12} y={28} w={8} h={26} f={R2} />
      <R x={10} y={32} w={6} h={24} f={R3} />
      <R x={14} y={30} w={4} h={8} f={R1} />
      <R x={12} y={54} w={10} h={4} f={R3} />

      {/* helmet */}
      <R x={20} y={6} w={24} h={4} f={M3} />
      <R x={18} y={10} w={28} h={18} f={M2} />
      <R x={20} y={12} w={24} h={14} f={M3} />
      <R x={22} y={8} w={20} h={4} f={M1} />
      <R x={24} y={6} w={16} h={2} f={M1} />
      {/* plume */}
      <R x={30} y={2} w={4} h={6} f={R1} />
      <R x={34} y={1} w={6} h={4} f={R2} />
      <R x={38} y={2} w={4} h={3} f={R3} />
      {/* visor */}
      <R x={22} y={16} w={20} h={6} f={M5} />
      <R x={24} y={17} w={3} h={4} f="#0a0a0a" />
      <R x={37} y={17} w={3} h={4} f="#0a0a0a" />
      <R x={28} y={18} w={8} h={2} f={M4} />
      {/* chin / jaw */}
      <R x={24} y={26} w={16} h={4} f={M2} />
      <R x={26} y={28} w={12} h={2} f={M4} />

      {/* pauldrons */}
      <R x={12} y={28} w={10} h={8} f={M2} />
      <R x={42} y={28} w={10} h={8} f={M2} />
      <R x={14} y={30} w={6} h={4} f={M1} />
      <R x={44} y={30} w={6} h={4} f={M1} />
      <R x={12} y={34} w={8} h={2} f={M4} />
      <R x={44} y={34} w={8} h={2} f={M4} />

      {/* chest plates */}
      <R x={20} y={30} w={24} h={16} f={M2} />
      <R x={22} y={32} w={20} h={12} f={M3} />
      <R x={24} y={34} w={16} h={4} f={M1} />
      <R x={24} y={38} w={16} h={2} f={M4} />
      <R x={24} y={40} w={16} h={2} f={M2} />
      {/* red sash */}
      <R x={20} y={42} w={24} h={4} f={R1} />
      <R x={22} y={43} w={20} h={2} f={R2} />

      {/* arms + gauntlets */}
      <R x={10} y={36} w={8} h={10} f={M3} />
      <R x={46} y={36} w={6} h={8} f={M3} />
      <R x={10} y={44} w={8} h={6} f={M2} />
      <R x={46} y={42} w={6} h={4} f={M2} />
      <R x={12} y={46} w={4} h={2} f={M1} />

      {/* shield (viewer right) */}
      <R x={48} y={30} w={12} h={20} f={M1} />
      <R x={50} y={32} w={8} h={16} f={M3} />
      <R x={52} y={34} w={4} h={12} f={M4} />
      <R x={51} y={36} w={6} h={2} f={M2} />
      <R x={53} y={34} w={2} h={12} f={M2} />
      <R x={50} y={40} w={8} h={2} f={M2} />

      {/* legs / sabatons */}
      <R x={22} y={46} w={8} h={10} f={M3} />
      <R x={34} y={46} w={8} h={10} f={M3} />
      <R x={24} y={48} w={4} h={6} f={M2} />
      <R x={36} y={48} w={4} h={6} f={M2} />
      <R x={20} y={54} w={12} h={6} f={M4} />
      <R x={34} y={54} w={12} h={6} f={M4} />
      <R x={22} y={56} w={8} h={2} f={M2} />
      <R x={36} y={56} w={8} h={2} f={M2} />
      <R x={20} y={60} w={12} h={2} f={M5} />
      <R x={34} y={60} w={12} h={2} f={M5} />
    </>
  );
}

function WizardBody() {
  const C1 = "#67e8f9";
  const C2 = "#22d3ee";
  const C3 = "#0891b2";
  const C4 = "#0e7490";
  const C5 = "#164e63";
  const G1 = "#a3e635";
  const G2 = "#65a30d";
  const skin = "#f0c8a0";

  return (
    <>
      <R x={0} y={0} w={64} h={64} f={BG} />
      {/* hat */}
      <R x={30} y={0} w={4} h={4} f={C1} />
      <R x={28} y={4} w={8} h={4} f={C2} />
      <R x={24} y={8} w={16} h={4} f={C3} />
      <R x={18} y={12} w={28} h={4} f={C2} />
      <R x={16} y={14} w={32} h={4} f={C1} />
      <R x={28} y={8} w={4} h={2} f={G1} />
      {/* face + beard */}
      <Face y={16} />
      <R x={20} y={28} w={24} h={6} f="#e0f2fe" />
      <R x={22} y={30} w={20} h={4} f="#bae6fd" />
      <R x={24} y={32} w={16} h={3} f="#7dd3fc" />
      {/* robe */}
      <R x={14} y={34} w={36} h={20} f={C4} />
      <R x={16} y={36} w={32} h={16} f={C3} />
      <R x={20} y={38} w={24} h={12} f={C5} />
      <R x={26} y={40} w={12} h={10} f={G2} />
      <R x={28} y={42} w={8} h={6} f={G1} />
      {/* sleeves */}
      <R x={10} y={36} w={8} h={12} f={C3} />
      <R x={46} y={36} w={8} h={10} f={C3} />
      <R x={10} y={46} w={8} h={4} f={skin} />
      {/* staff */}
      <R x={52} y={12} w={4} h={36} f="#a16207" />
      <R x={50} y={10} w={8} h={2} f="#854d0e" />
      <R x={48} y={4} w={12} h={8} f="#fbbf24" />
      <R x={50} y={6} w={8} h={4} f="#fde68a" />
      <R x={52} y={2} w={4} h={4} f="#fef08a" />
      <R x={54} y={8} w={2} h={2} f={G1} />
      {/* boots */}
      <R x={20} y={52} w={10} h={8} f={C5} />
      <R x={34} y={52} w={10} h={8} f={C5} />
      <R x={18} y={58} w={14} h={4} f="#083344" />
      <R x={34} y={58} w={14} h={4} f="#083344" />
    </>
  );
}

function ArcherBody() {
  const G1 = "#4ade80";
  const G2 = "#22c55e";
  const G3 = "#16a34a";
  const G4 = "#14532d";
  const G5 = "#052e16";
  const Br = "#a16207";
  const Br2 = "#854d0e";

  return (
    <>
      <R x={0} y={0} w={64} h={64} f={BG} />
      {/* hood */}
      <R x={18} y={6} w={28} h={6} f={G4} />
      <R x={16} y={12} w={32} h={10} f={G3} />
      <R x={18} y={14} w={28} h={6} f={G2} />
      <R x={20} y={8} w={24} h={4} f={G2} />
      {/* face in hood */}
      <Face y={14} />
      <R x={18} y={14} w={4} h={12} f={G3} />
      <R x={42} y={14} w={4} h={12} f={G3} />
      {/* tunic */}
      <R x={18} y={30} w={28} h={16} f={G2} />
      <R x={20} y={32} w={24} h={12} f={G3} />
      <R x={24} y={34} w={16} h={6} f={G4} />
      <R x={26} y={36} w={12} h={4} f={G1} />
      <R x={18} y={44} w={28} h={4} f={Br} />
      <R x={36} y={42} w={8} h={6} f={Br2} />
      {/* arms */}
      <R x={12} y={32} w={6} h={12} f={G3} />
      <R x={46} y={32} w={6} h={12} f={G3} />
      <R x={12} y={42} w={6} h={4} f="#f0c8a0" />
      <R x={46} y={42} w={6} h={4} f="#f0c8a0" />
      {/* bow */}
      <R x={6} y={14} w={4} h={36} f={Br} />
      <R x={4} y={14} w={4} h={4} f="#d97706" />
      <R x={4} y={46} w={4} h={4} f="#d97706" />
      <R x={8} y={16} w={2} h={32} f="#fef3c7" />
      <R x={10} y={30} w={4} h={2} f="#fde68a" />
      {/* quiver */}
      <R x={48} y={28} w={8} h={16} f={Br2} />
      <R x={50} y={24} w={2} h={6} f="#fbbf24" />
      <R x={52} y={22} w={2} h={6} f="#f87171" />
      <R x={54} y={24} w={2} h={6} f={G1} />
      {/* legs */}
      <R x={22} y={48} w={8} h={8} f={G4} />
      <R x={34} y={48} w={8} h={8} f={G4} />
      <R x={20} y={54} w={12} h={6} f="#3f2e1a" />
      <R x={34} y={54} w={12} h={6} f="#3f2e1a" />
      <R x={20} y={60} w={12} h={2} f={G5} />
      <R x={34} y={60} w={12} h={2} f={G5} />
    </>
  );
}

function DragonRiderBody() {
  const R1 = "#f87171";
  const R2 = "#ef4444";
  const R3 = "#b91c1c";
  const R4 = "#7f1d1d";
  const R5 = "#450a0a";
  const O1 = "#fb923c";
  const O2 = "#ea580c";
  const O3 = "#c2410c";
  const Gold = "#fbbf24";

  return (
    <>
      <R x={0} y={0} w={64} h={64} f={BG} />
      {/* dragon companion */}
      <R x={42} y={4} w={18} h={10} f={O2} />
      <R x={46} y={2} w={10} h={4} f={O1} />
      <R x={56} y={6} w={6} h={4} f={Gold} />
      <R x={44} y={10} w={4} h={3} f="#1a1a2e" />
      <R x={45} y={11} w={1} h={1} f="#fef08a" />
      <R x={48} y={14} w={14} h={6} f={O3} />
      <R x={52} y={20} w={10} h={4} f={O2} />
      <R x={54} y={24} w={6} h={10} f={O3} />
      <R x={56} y={28} w={4} h={2} f={R1} />

      {/* crest helm */}
      <R x={28} y={2} w={6} h={4} f={Gold} />
      <R x={20} y={6} w={24} h={4} f={R2} />
      <R x={18} y={10} w={28} h={16} f={R3} />
      <R x={20} y={12} w={24} h={12} f={R2} />
      <R x={22} y={8} w={20} h={4} f={R1} />
      <R x={24} y={16} w={4} h={5} f="#0a0a0a" />
      <R x={36} y={16} w={4} h={5} f="#0a0a0a" />
      <R x={28} y={18} w={8} h={2} f={R4} />
      <R x={24} y={24} w={16} h={4} f={R3} />

      {/* cape */}
      <R x={10} y={28} w={8} h={28} f={O2} />
      <R x={8} y={32} w={6} h={26} f={O3} />
      <R x={12} y={30} w={4} h={8} f={O1} />

      {/* scale armor */}
      <R x={16} y={28} w={12} h={8} f={R2} />
      <R x={36} y={28} w={10} h={8} f={R2} />
      <R x={20} y={30} w={24} h={16} f={R3} />
      <R x={22} y={32} w={20} h={12} f={R4} />
      <R x={26} y={34} w={12} h={6} f={Gold} />
      <R x={28} y={36} w={8} h={3} f="#fde68a" />
      {/* scale dots */}
      <R x={22} y={34} w={2} h={2} f={R1} />
      <R x={40} y={34} w={2} h={2} f={R1} />
      <R x={24} y={40} w={2} h={2} f={R1} />
      <R x={38} y={40} w={2} h={2} f={R1} />
      <R x={20} y={44} w={24} h={3} f={Gold} />

      <R x={12} y={36} w={6} h={10} f={R3} />
      <R x={12} y={44} w={6} h={4} f="#f0c8a0" />

      <R x={22} y={47} w={8} h={8} f={R4} />
      <R x={34} y={47} w={8} h={8} f={R4} />
      <R x={20} y={54} w={12} h={6} f={R5} />
      <R x={34} y={54} w={12} h={6} f={R5} />
      <R x={20} y={60} w={12} h={2} f="#1c1917" />
      <R x={34} y={60} w={12} h={2} f="#1c1917" />
    </>
  );
}

function BerserkerBody() {
  const H1 = "#fbbf24";
  const H2 = "#ca8a04";
  const H3 = "#a16207";
  const H4 = "#854d0e";
  const skin = "#f0c8a0";
  const skinHi = "#ffe4c4";
  const skinSh = "#d4a574";
  const L1 = "#bef264";
  const L2 = "#a3e635";
  const L3 = "#65a30d";

  return (
    <>
      <R x={0} y={0} w={64} h={64} f={BG} />
      {/* wild hair */}
      <R x={16} y={2} w={32} h={6} f={H2} />
      <R x={12} y={4} w={8} h={8} f={H1} />
      <R x={44} y={4} w={8} h={8} f={H1} />
      <R x={18} y={0} w={4} h={4} f={H1} />
      <R x={30} y={0} w={4} h={3} f={H1} />
      <R x={42} y={0} w={4} h={4} f={H1} />
      <R x={20} y={8} w={24} h={4} f={H3} />
      {/* fierce face */}
      <R x={18} y={10} w={28} h={16} f={skin} />
      <R x={20} y={12} w={24} h={12} f={skinHi} />
      <R x={22} y={14} w={6} h={5} f="#1a1a2e" />
      <R x={36} y={14} w={6} h={5} f="#1a1a2e" />
      <R x={24} y={15} w={2} h={2} f="#f87171" />
      <R x={38} y={15} w={2} h={2} f="#f87171" />
      <R x={26} y={22} w={12} h={2} f={skinSh} />
      <R x={24} y={24} w={16} h={3} f={H3} />
      {/* neck / shoulders */}
      <R x={24} y={26} w={16} h={4} f={skin} />
      <R x={14} y={28} w={36} h={6} f={skinSh} />
      {/* fur pauldrons */}
      <R x={10} y={28} w={10} h={10} f={H3} />
      <R x={44} y={28} w={10} h={10} f={H3} />
      <R x={8} y={30} w={6} h={6} f={H2} />
      <R x={50} y={30} w={6} h={6} f={H2} />
      <R x={12} y={32} w={4} h={2} f={H4} />
      <R x={48} y={32} w={4} h={2} f={H4} />
      {/* muscular torso */}
      <R x={18} y={34} w={28} h={14} f={skin} />
      <R x={20} y={36} w={24} h={10} f={skinHi} />
      <R x={26} y={38} w={12} h={6} f={skinSh} />
      <R x={22} y={40} w={4} h={2} f={skinSh} />
      <R x={38} y={40} w={4} h={2} f={skinSh} />
      {/* fur belt */}
      <R x={16} y={46} w={32} h={6} f={H4} />
      <R x={20} y={48} w={24} h={2} f={H2} />
      <R x={26} y={46} w={12} h={6} f={H1} />
      {/* arms */}
      <R x={10} y={36} w={8} h={14} f={skin} />
      <R x={46} y={36} w={6} h={10} f={skin} />
      {/* greataxe */}
      <R x={52} y={14} w={4} h={32} f="#78716c" />
      <R x={50} y={12} w={8} h={2} f="#57534e" />
      <R x={46} y={6} w={16} h={10} f={L2} />
      <R x={48} y={8} w={12} h={6} f={L3} />
      <R x={50} y={4} w={8} h={4} f={L1} />
      <R x={44} y={10} w={4} h={4} f={L3} />
      <R x={52} y={44} w={6} h={4} f={skin} />
      {/* legs */}
      <R x={22} y={52} w={8} h={6} f="#44403c" />
      <R x={34} y={52} w={8} h={6} f="#44403c" />
      <R x={20} y={56} w={12} h={6} f="#1c1917" />
      <R x={34} y={56} w={12} h={6} f="#1c1917" />
      <R x={20} y={61} w={12} h={2} f="#0a0a0a" />
      <R x={34} y={61} w={12} h={2} f="#0a0a0a" />
    </>
  );
}
