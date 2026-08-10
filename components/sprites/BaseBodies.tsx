import type { ReactNode } from "react";
import { BG, EYE, SKIN, SKIN_HI, SKIN_SH } from "@/lib/pixel";
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

/** Detailed 64×64 base heroes (underwear / no gear). */
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

function KnightBody() {
  return (
    <>
      <R x={0} y={0} w={64} h={64} f={BG} />
      {/* short hair under helm area */}
      <R x={22} y={8} w={20} h={4} f="#64748b" />
      <R x={24} y={6} w={16} h={3} f="#94a3b8" />
      {/* head */}
      <R x={22} y={10} w={20} h={14} f={SKIN} />
      <R x={24} y={12} w={16} h={10} f={SKIN_HI} />
      <R x={26} y={14} w={4} h={4} f={EYE} />
      <R x={34} y={14} w={4} h={4} f={EYE} />
      <R x={27} y={15} w={1} h={1} f="#fff" />
      <R x={35} y={15} w={1} h={1} f="#fff" />
      <R x={28} y={20} w={8} h={2} f={SKIN_SH} />
      {/* neck */}
      <R x={28} y={24} w={8} h={4} f={SKIN} />
      {/* tunic */}
      <R x={18} y={28} w={28} h={18} f="#334155" />
      <R x={20} y={30} w={24} h={14} f="#475569" />
      <R x={26} y={32} w={12} h={8} f="#1e293b" />
      {/* arms */}
      <R x={12} y={30} w={6} h={14} f={SKIN} />
      <R x={46} y={30} w={6} h={14} f={SKIN} />
      <R x={12} y={42} w={6} h={3} f={SKIN_SH} />
      <R x={46} y={42} w={6} h={3} f={SKIN_SH} />
      {/* legs */}
      <R x={22} y={46} w={8} h={12} f="#1e293b" />
      <R x={34} y={46} w={8} h={12} f="#1e293b" />
      {/* boots stub */}
      <R x={20} y={56} w={10} h={6} f="#0f172a" />
      <R x={34} y={56} w={10} h={6} f="#0f172a" />
    </>
  );
}

function WizardBody() {
  return (
    <>
      <R x={0} y={0} w={64} h={64} f={BG} />
      <R x={20} y={8} w={24} h={4} f="#155e75" />
      <R x={22} y={6} w={20} h={3} f="#0e7490" />
      <R x={22} y={10} w={20} h={14} f={SKIN} />
      <R x={24} y={12} w={16} h={10} f={SKIN_HI} />
      <R x={26} y={14} w={4} h={4} f={EYE} />
      <R x={34} y={14} w={4} h={4} f={EYE} />
      <R x={27} y={15} w={1} h={1} f="#fff" />
      <R x={35} y={15} w={1} h={1} f="#fff" />
      {/* soft beard hint */}
      <R x={24} y={22} w={16} h={4} f="#e0f2fe" />
      <R x={26} y={24} w={12} h={3} f="#bae6fd" />
      <R x={28} y={26} w={8} h={3} f={SKIN} />
      <R x={18} y={28} w={28} h={18} f="#0e7490" />
      <R x={20} y={30} w={24} h={14} f="#155e75" />
      <R x={26} y={32} w={12} h={10} f="#083344" />
      <R x={12} y={30} w={6} h={14} f={SKIN} />
      <R x={46} y={30} w={6} h={14} f={SKIN} />
      <R x={22} y={46} w={8} h={12} f="#083344" />
      <R x={34} y={46} w={8} h={12} f="#083344" />
      <R x={20} y={56} w={10} h={6} f="#164e63" />
      <R x={34} y={56} w={10} h={6} f="#164e63" />
    </>
  );
}

function ArcherBody() {
  return (
    <>
      <R x={0} y={0} w={64} h={64} f={BG} />
      <R x={20} y={6} w={24} h={5} f="#166534" />
      <R x={22} y={10} w={20} h={14} f={SKIN} />
      <R x={24} y={12} w={16} h={10} f={SKIN_HI} />
      <R x={26} y={14} w={4} h={4} f={EYE} />
      <R x={34} y={14} w={4} h={4} f={EYE} />
      <R x={27} y={15} w={1} h={1} f="#fff" />
      <R x={35} y={15} w={1} h={1} f="#fff" />
      <R x={28} y={20} w={8} h={2} f={SKIN_SH} />
      <R x={28} y={24} w={8} h={4} f={SKIN} />
      <R x={18} y={28} w={28} h={18} f="#16a34a" />
      <R x={20} y={30} w={24} h={14} f="#15803d" />
      <R x={26} y={32} w={12} h={8} f="#14532d" />
      <R x={12} y={30} w={6} h={14} f={SKIN} />
      <R x={46} y={30} w={6} h={14} f={SKIN} />
      <R x={22} y={46} w={8} h={12} f="#14532d" />
      <R x={34} y={46} w={8} h={12} f="#14532d" />
      <R x={20} y={56} w={10} h={6} f="#3f2e1a" />
      <R x={34} y={56} w={10} h={6} f="#3f2e1a" />
    </>
  );
}

function DragonRiderBody() {
  return (
    <>
      <R x={0} y={0} w={64} h={64} f={BG} />
      {/* small dragon silhouette behind */}
      <R x={42} y={4} w={16} h={8} f="#ea580c" />
      <R x={46} y={2} w={8} h={4} f="#fb923c" />
      <R x={54} y={6} w={4} h={3} f="#fbbf24" />
      <R x={44} y={12} w={12} h={6} f="#c2410c" />
      <R x={48} y={10} w={3} h={2} f={EYE} />
      <R x={50} y={18} w={10} h={4} f="#f97316" />
      <R x={52} y={22} w={8} h={4} f="#ea580c" />
      <R x={54} y={26} w={4} h={8} f="#9a3412" />
      <R x={20} y={6} w={22} h={4} f="#7f1d1d" />
      <R x={22} y={10} w={20} h={14} f={SKIN} />
      <R x={24} y={12} w={16} h={10} f={SKIN_HI} />
      <R x={26} y={14} w={4} h={4} f={EYE} />
      <R x={34} y={14} w={4} h={4} f={EYE} />
      <R x={27} y={15} w={1} h={1} f="#fff" />
      <R x={35} y={15} w={1} h={1} f="#fff" />
      <R x={28} y={20} w={8} h={2} f={SKIN_SH} />
      <R x={28} y={24} w={8} h={4} f={SKIN} />
      <R x={18} y={28} w={28} h={18} f="#991b1b" />
      <R x={20} y={30} w={24} h={14} f="#7f1d1d" />
      <R x={26} y={32} w={12} h={8} f="#450a0a" />
      <R x={12} y={30} w={6} h={14} f={SKIN} />
      <R x={46} y={30} w={6} h={14} f={SKIN} />
      <R x={22} y={46} w={8} h={12} f="#450a0a" />
      <R x={34} y={46} w={8} h={12} f="#450a0a" />
      <R x={20} y={56} w={10} h={6} f="#1c1917" />
      <R x={34} y={56} w={10} h={6} f="#1c1917" />
    </>
  );
}

function BerserkerBody() {
  return (
    <>
      <R x={0} y={0} w={64} h={64} f={BG} />
      <R x={16} y={2} w={32} h={4} f="#a16207" />
      <R x={12} y={4} w={8} h={6} f="#ca8a04" />
      <R x={44} y={4} w={8} h={6} f="#ca8a04" />
      <R x={20} y={0} w={4} h={4} f="#eab308" />
      <R x={30} y={0} w={4} h={3} f="#eab308" />
      <R x={40} y={0} w={4} h={4} f="#eab308" />
      <R x={18} y={8} w={28} h={4} f="#854d0e" />
      <R x={20} y={10} w={24} h={16} f={SKIN} />
      <R x={22} y={12} w={20} h={12} f={SKIN_HI} />
      <R x={24} y={14} w={6} h={4} f={EYE} />
      <R x={34} y={14} w={6} h={4} f={EYE} />
      <R x={26} y={15} w={1} h={1} f="#f87171" />
      <R x={36} y={15} w={1} h={1} f="#f87171" />
      <R x={26} y={22} w={12} h={2} f={SKIN_SH} />
      <R x={24} y={24} w={16} h={2} f="#b45309" />
      <R x={24} y={26} w={16} h={4} f={SKIN} />
      {/* broad shoulders / bare chest */}
      <R x={14} y={28} w={36} h={6} f={SKIN_SH} />
      <R x={16} y={32} w={32} h={14} f={SKIN} />
      <R x={18} y={34} w={28} h={10} f={SKIN_HI} />
      <R x={26} y={36} w={12} h={6} f={SKIN_SH} />
      <R x={10} y={30} w={6} h={16} f={SKIN} />
      <R x={48} y={30} w={6} h={16} f={SKIN} />
      <R x={18} y={46} w={28} h={4} f="#78350f" />
      <R x={22} y={50} w={8} h={8} f="#44403c" />
      <R x={34} y={50} w={8} h={8} f="#44403c" />
      <R x={20} y={56} w={10} h={6} f="#1c1917" />
      <R x={34} y={56} w={10} h={6} f="#1c1917" />
    </>
  );
}
