import { gearPalette } from "@/lib/pixel";
import type { GearDef } from "@/lib/types";
import { R } from "@/components/sprites/BaseBodies";

/** Equipment drawn onto the 64×64 chibi hero (aligned to base body). */
export function EquippedGearLayers({ pieces }: { pieces: GearDef[] }) {
  const bySlot = {
    boots: pieces.find((p) => p.slot === "boots"),
    leggings: pieces.find((p) => p.slot === "leggings"),
    chestplate: pieces.find((p) => p.slot === "chestplate"),
    helmet: pieces.find((p) => p.slot === "helmet"),
    weapon: pieces.find((p) => p.slot === "weapon"),
  };

  return (
    <>
      {bySlot.boots && <BootsLayer gear={bySlot.boots} />}
      {bySlot.leggings && <LeggingsLayer gear={bySlot.leggings} />}
      {bySlot.chestplate && <ChestLayer gear={bySlot.chestplate} />}
      {bySlot.helmet && <HelmetLayer gear={bySlot.helmet} />}
      {bySlot.weapon && <WeaponLayer gear={bySlot.weapon} />}
    </>
  );
}

function HelmetLayer({ gear }: { gear: GearDef }) {
  const c = gearPalette(gear.hue, gear.rarity);
  const set = gear.setId;

  // Covers the big chibi head region (~y 4–30)
  if (set === "starlight") {
    return (
      <>
        <R x={28} y={0} w={8} h={6} f={c.glow} />
        <R x={24} y={4} w={16} h={6} f={c.hi} />
        <R x={18} y={10} w={28} h={6} f={c.main} />
        <R x={16} y={14} w={32} h={14} f={c.mid} />
        <R x={18} y={16} w={28} h={10} f={c.main} />
        <R x={22} y={18} w={6} h={5} f="#0a0a0a" />
        <R x={36} y={18} w={6} h={5} f="#0a0a0a" />
        <R x={28} y={20} w={8} h={2} f={c.deep} />
        <R x={24} y={26} w={16} h={4} f={c.hi} />
      </>
    );
  }

  if (set === "mech") {
    return (
      <>
        <R x={18} y={6} w={28} h={4} f={c.hi} />
        <R x={16} y={10} w={32} h={18} f={c.main} />
        <R x={18} y={12} w={28} h={14} f={c.mid} />
        <R x={20} y={14} w={24} h={4} f={c.deep} />
        <R x={22} y={16} w={8} h={5} f="#22d3ee" />
        <R x={34} y={16} w={8} h={5} f="#22d3ee" />
        <R x={24} y={17} w={4} h={2} f={c.glow} />
        <R x={36} y={17} w={4} h={2} f={c.glow} />
        <R x={26} y={24} w={12} h={4} f={c.trim} />
      </>
    );
  }

  if (set === "frostbite") {
    return (
      <>
        <R x={18} y={2} w={4} h={8} f={c.glow} />
        <R x={42} y={2} w={4} h={8} f={c.glow} />
        <R x={20} y={6} w={24} h={4} f={c.hi} />
        <R x={16} y={10} w={32} h={18} f={c.main} />
        <R x={18} y={12} w={28} h={14} f={c.mid} />
        <R x={22} y={16} w={5} h={5} f="#0a0a0a" />
        <R x={37} y={16} w={5} h={5} f="#0a0a0a" />
        <R x={28} y={18} w={8} h={2} f={c.deep} />
        <R x={24} y={26} w={16} h={4} f={c.hi} />
      </>
    );
  }

  return (
    <>
      {(set === "sunfire" || set === "phantom" || gear.rarity === "relic") && (
        <>
          <R x={28} y={1} w={6} h={6} f={c.trim} />
          <R x={34} y={0} w={8} h={4} f={c.glow} />
        </>
      )}
      {set === "dragonguard" && (
        <>
          <R x={16} y={8} w={6} h={6} f={c.hi} />
          <R x={42} y={8} w={6} h={6} f={c.hi} />
        </>
      )}
      <R x={20} y={6} w={24} h={4} f={c.metal} />
      <R x={18} y={10} w={28} h={18} f={c.main} />
      <R x={20} y={12} w={24} h={14} f={c.mid} />
      <R x={22} y={8} w={20} h={4} f={c.hi} />
      <R x={22} y={16} w={20} h={6} f={c.deep} />
      <R x={24} y={17} w={4} h={4} f="#0a0a0a" />
      <R x={36} y={17} w={4} h={4} f="#0a0a0a" />
      <R x={28} y={18} w={8} h={2} f={c.metal} />
      <R x={24} y={26} w={16} h={4} f={c.hi} />
      <R x={26} y={28} w={12} h={2} f={c.trim} />
    </>
  );
}

function ChestLayer({ gear }: { gear: GearDef }) {
  const c = gearPalette(gear.hue, gear.rarity);
  const set = gear.setId;

  return (
    <>
      {/* cape hint for fancy sets */}
      {(set === "sunfire" ||
        set === "phantom" ||
        set === "shadow" ||
        set === "dragonguard") && (
        <>
          <R x={10} y={28} w={8} h={26} f={c.deep} />
          <R x={8} y={32} w={6} h={24} f={c.mid} />
          <R x={12} y={30} w={4} h={8} f={c.hi} />
        </>
      )}
      {/* pauldrons */}
      <R x={12} y={28} w={10} h={8} f={c.main} />
      <R x={42} y={28} w={10} h={8} f={c.main} />
      <R x={14} y={30} w={6} h={4} f={c.hi} />
      <R x={44} y={30} w={6} h={4} f={c.hi} />
      <R x={12} y={34} w={8} h={2} f={c.deep} />
      <R x={44} y={34} w={8} h={2} f={c.deep} />
      {/* torso */}
      <R x={20} y={30} w={24} h={16} f={c.main} />
      <R x={22} y={32} w={20} h={12} f={c.mid} />
      <R x={24} y={34} w={16} h={4} f={c.hi} />
      <R x={24} y={38} w={16} h={2} f={c.deep} />
      <R x={24} y={40} w={16} h={2} f={c.main} />
      <R x={28} y={34} w={8} h={6} f={c.trim} />
      <R x={30} y={36} w={4} h={3} f={c.glow} />
      {set === "dragonguard" && (
        <>
          <R x={22} y={34} w={2} h={2} f={c.hi} />
          <R x={40} y={34} w={2} h={2} f={c.hi} />
          <R x={24} y={40} w={2} h={2} f={c.hi} />
          <R x={38} y={40} w={2} h={2} f={c.hi} />
        </>
      )}
      {/* sash / belt */}
      <R x={20} y={42} w={24} h={4} f={c.trim} />
      <R x={22} y={43} w={20} h={2} f={c.deep} />
      {/* sleeves / gauntlets */}
      <R x={10} y={36} w={8} h={10} f={c.mid} />
      <R x={46} y={36} w={6} h={8} f={c.mid} />
      <R x={10} y={44} w={8} h={6} f={c.main} />
      <R x={46} y={42} w={6} h={4} f={c.main} />
      <R x={12} y={46} w={4} h={2} f={c.hi} />
      {/* shield for knightly sets */}
      {(set === "sunfire" || set === "scrap" || set === "frostbite") && (
        <>
          <R x={48} y={30} w={12} h={20} f={c.hi} />
          <R x={50} y={32} w={8} h={16} f={c.mid} />
          <R x={52} y={34} w={4} h={12} f={c.deep} />
          <R x={51} y={36} w={6} h={2} f={c.main} />
          <R x={53} y={34} w={2} h={12} f={c.main} />
          <R x={50} y={40} w={8} h={2} f={c.main} />
        </>
      )}
    </>
  );
}

function LeggingsLayer({ gear }: { gear: GearDef }) {
  const c = gearPalette(gear.hue, gear.rarity);
  return (
    <>
      <R x={22} y={46} w={8} h={10} f={c.main} />
      <R x={34} y={46} w={8} h={10} f={c.main} />
      <R x={24} y={48} w={4} h={6} f={c.hi} />
      <R x={36} y={48} w={4} h={6} f={c.hi} />
      <R x={22} y={52} w={8} h={2} f={c.deep} />
      <R x={34} y={52} w={8} h={2} f={c.deep} />
    </>
  );
}

function BootsLayer({ gear }: { gear: GearDef }) {
  const c = gearPalette(gear.hue, gear.rarity);
  return (
    <>
      <R x={20} y={54} w={12} h={6} f={c.main} />
      <R x={34} y={54} w={12} h={6} f={c.main} />
      <R x={22} y={56} w={8} h={2} f={c.hi} />
      <R x={36} y={56} w={8} h={2} f={c.hi} />
      <R x={20} y={58} w={12} h={2} f={c.trim} />
      <R x={34} y={58} w={12} h={2} f={c.trim} />
      <R x={20} y={60} w={12} h={2} f={c.deep} />
      <R x={34} y={60} w={12} h={2} f={c.deep} />
    </>
  );
}

function WeaponLayer({ gear }: { gear: GearDef }) {
  const c = gearPalette(gear.hue, gear.rarity);
  const set = gear.setId;
  const axeLike =
    set === "dragonguard" ||
    set === "mech" ||
    gear.id.includes("axe") ||
    gear.id.includes("hammer") ||
    gear.id.includes("broom") ||
    gear.id.includes("cleaver");

  if (set === "starlight" || set === "shadow") {
    return (
      <>
        <R x={52} y={10} w={4} h={40} f={c.metal} />
        <R x={48} y={4} w={12} h={10} f={c.main} />
        <R x={50} y={6} w={8} h={6} f={c.hi} />
        <R x={52} y={2} w={4} h={4} f={c.glow} />
        <R x={50} y={14} w={8} h={2} f={c.trim} />
      </>
    );
  }

  if (axeLike) {
    return (
      <>
        <R x={54} y={16} w={4} h={32} f={c.metal} />
        <R x={46} y={8} w={16} h={12} f={c.main} />
        <R x={48} y={10} w={12} h={8} f={c.hi} />
        <R x={50} y={6} w={8} h={4} f={c.glow} />
        <R x={52} y={46} w={6} h={4} f={c.trim} />
      </>
    );
  }

  if (set === "frostbite") {
    return (
      <>
        <R x={54} y={8} w={3} h={40} f={c.metal} />
        <R x={50} y={6} w={10} h={6} f={c.hi} />
        <R x={52} y={2} w={6} h={6} f={c.glow} />
        <R x={51} y={12} w={8} h={2} f={c.trim} />
      </>
    );
  }

  return (
    <>
      <R x={54} y={6} w={4} h={36} f={c.hi} />
      <R x={53} y={8} w={6} h={30} f={c.main} />
      <R x={50} y={40} w={12} h={4} f={c.mid} />
      <R x={54} y={44} w={4} h={8} f={c.trim} />
      <R x={52} y={4} w={8} h={4} f={c.glow} />
      {(gear.rarity === "relic" || gear.rarity === "mythic") && (
        <R x={55} y={12} w={2} h={18} f={c.trim} />
      )}
    </>
  );
}

/** Standalone 32×32 inventory icon art */
export function GearIconArt({ gear }: { gear: GearDef }) {
  const c = gearPalette(gear.hue, gear.rarity);
  switch (gear.slot) {
    case "helmet":
      return (
        <>
          <R x={12} y={2} w={8} h={3} f={c.trim} />
          <R x={10} y={4} w={12} h={3} f={c.hi} />
          <R x={8} y={7} w={16} h={14} f={c.main} />
          <R x={10} y={9} w={12} h={10} f={c.mid} />
          <R x={11} y={12} w={4} h={4} f="#0a0a0a" />
          <R x={17} y={12} w={4} h={4} f="#0a0a0a" />
          <R x={12} y={20} w={8} h={3} f={c.hi} />
          <R x={13} y={21} w={6} h={1} f={c.trim} />
        </>
      );
    case "chestplate":
      return (
        <>
          <R x={5} y={6} w={5} h={8} f={c.hi} />
          <R x={22} y={6} w={5} h={8} f={c.hi} />
          <R x={8} y={6} w={16} h={18} f={c.main} />
          <R x={10} y={8} w={12} h={14} f={c.mid} />
          <R x={12} y={10} w={8} h={4} f={c.hi} />
          <R x={13} y={12} w={6} h={4} f={c.trim} />
          <R x={10} y={20} w={12} h={3} f={c.trim} />
        </>
      );
    case "leggings":
      return (
        <>
          <R x={8} y={4} w={16} h={6} f={c.main} />
          <R x={8} y={10} w={6} h={16} f={c.mid} />
          <R x={18} y={10} w={6} h={16} f={c.mid} />
          <R x={9} y={12} w={4} h={10} f={c.hi} />
          <R x={19} y={12} w={4} h={10} f={c.hi} />
          <R x={8} y={24} w={6} h={3} f={c.trim} />
          <R x={18} y={24} w={6} h={3} f={c.trim} />
        </>
      );
    case "boots":
      return (
        <>
          <R x={6} y={8} w={8} h={14} f={c.main} />
          <R x={18} y={8} w={8} h={14} f={c.main} />
          <R x={4} y={20} w={12} h={6} f={c.hi} />
          <R x={16} y={20} w={12} h={6} f={c.hi} />
          <R x={6} y={10} w={8} h={2} f={c.trim} />
          <R x={18} y={10} w={8} h={2} f={c.trim} />
          <R x={4} y={25} w={12} h={2} f={c.deep} />
          <R x={16} y={25} w={12} h={2} f={c.deep} />
        </>
      );
    case "weapon":
      return (
        <>
          <R x={14} y={2} w={4} h={20} f={c.hi} />
          <R x={13} y={4} w={6} h={16} f={c.main} />
          <R x={10} y={20} w={12} h={4} f={c.mid} />
          <R x={14} y={24} w={4} h={6} f={c.trim} />
          <R x={12} y={2} w={8} h={3} f={c.glow} />
        </>
      );
  }
}
