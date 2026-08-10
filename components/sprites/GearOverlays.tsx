import { gearPalette } from "@/lib/pixel";
import type { GearDef } from "@/lib/types";
import { R } from "@/components/sprites/BaseBodies";

/** Equipment drawn onto the 64×64 hero body. */
export function EquippedGearLayers({
  pieces,
}: {
  pieces: GearDef[];
}) {
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

  if (set === "starlight") {
    return (
      <>
        <R x={28} y={0} w={8} h={4} f={c.glow} />
        <R x={24} y={4} w={16} h={4} f={c.hi} />
        <R x={18} y={8} w={28} h={6} f={c.main} />
        <R x={16} y={12} w={32} h={8} f={c.mid} />
        <R x={20} y={14} w={24} h={4} f={c.deep} />
        <R x={24} y={16} w={6} h={3} f="#0b1220" />
        <R x={34} y={16} w={6} h={3} f="#0b1220" />
        <R x={30} y={10} w={4} h={2} f={c.trim} />
      </>
    );
  }

  if (set === "mech") {
    return (
      <>
        <R x={18} y={4} w={28} h={4} f={c.hi} />
        <R x={16} y={8} w={32} h={12} f={c.main} />
        <R x={18} y={10} w={28} h={8} f={c.mid} />
        <R x={22} y={12} w={8} h={4} f="#22d3ee" />
        <R x={34} y={12} w={8} h={4} f="#22d3ee" />
        <R x={24} y={13} w={4} h={2} f={c.glow} />
        <R x={36} y={13} w={4} h={2} f={c.glow} />
        <R x={28} y={18} w={8} h={3} f={c.trim} />
      </>
    );
  }

  if (set === "frostbite") {
    return (
      <>
        <R x={20} y={2} w={4} h={6} f={c.glow} />
        <R x={40} y={2} w={4} h={6} f={c.glow} />
        <R x={18} y={6} w={28} h={4} f={c.hi} />
        <R x={16} y={10} w={32} h={10} f={c.main} />
        <R x={20} y={12} w={24} h={6} f={c.mid} />
        <R x={22} y={14} w={6} h={3} f="#0b1220" />
        <R x={36} y={14} w={6} h={3} f="#0b1220" />
        <R x={28} y={18} w={8} h={2} f={c.trim} />
      </>
    );
  }

  // default / scrap / sunfire / dragon / shadow / phantom / wild / relic
  return (
    <>
      {set === "sunfire" || set === "phantom" || gear.rarity === "relic" ? (
        <R x={28} y={0} w={8} h={4} f={c.trim} />
      ) : null}
      {set === "dragonguard" ? (
        <>
          <R x={18} y={4} w={6} h={4} f={c.hi} />
          <R x={40} y={4} w={6} h={4} f={c.hi} />
        </>
      ) : null}
      <R x={18} y={4} w={28} h={4} f={c.metal} />
      <R x={16} y={8} w={32} h={12} f={c.main} />
      <R x={18} y={10} w={28} h={8} f={c.mid} />
      <R x={20} y={12} w={24} h={4} f={c.deep} />
      <R x={22} y={12} w={6} h={4} f="#22d3ee" />
      <R x={36} y={12} w={6} h={4} f="#22d3ee" />
      <R x={24} y={18} w={16} h={4} f={c.hi} />
      <R x={28} y={19} w={8} h={2} f={c.trim} />
      {set === "shadow" || set === "phantom" ? (
        <R x={14} y={10} w={4} h={10} f={c.deep} />
      ) : null}
    </>
  );
}

function ChestLayer({ gear }: { gear: GearDef }) {
  const c = gearPalette(gear.hue, gear.rarity);
  const set = gear.setId;

  return (
    <>
      {/* pauldrons */}
      <R x={10} y={26} w={10} h={8} f={c.main} />
      <R x={44} y={26} w={10} h={8} f={c.main} />
      <R x={8} y={28} w={6} h={6} f={c.mid} />
      <R x={50} y={28} w={6} h={6} f={c.mid} />
      {set === "mech" || set === "scrap" ? (
        <>
          <R x={10} y={28} w={3} h={3} f={c.trim} />
          <R x={51} y={28} w={3} h={3} f={c.trim} />
        </>
      ) : null}
      {/* torso plate / robe */}
      <R x={16} y={28} w={32} h={18} f={c.main} />
      <R x={18} y={30} w={28} h={14} f={c.mid} />
      <R x={22} y={32} w={20} h={10} f={c.deep} />
      {/* emblem */}
      <R x={28} y={34} w={8} h={6} f={c.trim} />
      <R x={30} y={36} w={4} h={3} f={c.glow} />
      {set === "starlight" || set === "shadow" || set === "phantom" ? (
        <>
          <R x={14} y={30} w={4} h={16} f={c.hi} />
          <R x={46} y={30} w={4} h={16} f={c.hi} />
        </>
      ) : null}
      {set === "dragonguard" ? (
        <>
          <R x={20} y={32} w={2} h={2} f={c.hi} />
          <R x={26} y={36} w={2} h={2} f={c.hi} />
          <R x={36} y={32} w={2} h={2} f={c.hi} />
          <R x={42} y={36} w={2} h={2} f={c.hi} />
        </>
      ) : null}
      {/* belt */}
      <R x={18} y={44} w={28} h={4} f={c.deep} />
      <R x={26} y={44} w={12} h={4} f={c.trim} />
      {/* sleeves over arms */}
      <R x={10} y={32} w={8} h={12} f={c.mid} />
      <R x={46} y={32} w={8} h={12} f={c.mid} />
    </>
  );
}

function LeggingsLayer({ gear }: { gear: GearDef }) {
  const c = gearPalette(gear.hue, gear.rarity);
  return (
    <>
      <R x={20} y={46} w={10} h={12} f={c.main} />
      <R x={34} y={46} w={10} h={12} f={c.main} />
      <R x={22} y={48} w={6} h={8} f={c.mid} />
      <R x={36} y={48} w={6} h={8} f={c.mid} />
      <R x={22} y={52} w={6} h={2} f={c.trim} />
      <R x={36} y={52} w={6} h={2} f={c.trim} />
    </>
  );
}

function BootsLayer({ gear }: { gear: GearDef }) {
  const c = gearPalette(gear.hue, gear.rarity);
  return (
    <>
      <R x={18} y={54} w={12} h={8} f={c.main} />
      <R x={34} y={54} w={12} h={8} f={c.main} />
      <R x={16} y={58} w={14} h={4} f={c.hi} />
      <R x={34} y={58} w={14} h={4} f={c.hi} />
      <R x={20} y={56} w={8} h={2} f={c.trim} />
      <R x={36} y={56} w={8} h={2} f={c.trim} />
      <R x={16} y={61} w={14} h={2} f={c.deep} />
      <R x={34} y={61} w={14} h={2} f={c.deep} />
    </>
  );
}

function WeaponLayer({ gear }: { gear: GearDef }) {
  const c = gearPalette(gear.hue, gear.rarity);
  const set = gear.setId;

  if (set === "starlight" || set === "shadow") {
    return (
      <>
        <R x={52} y={12} w={4} h={36} f={c.metal} />
        <R x={50} y={8} w={8} h={8} f={c.main} />
        <R x={48} y={6} w={12} h={4} f={c.hi} />
        <R x={52} y={4} w={4} h={4} f={c.glow} />
        <R x={50} y={16} w={8} h={2} f={c.trim} />
      </>
    );
  }

  if (
    set === "dragonguard" ||
    set === "mech" ||
    gear.id.includes("axe") ||
    gear.id.includes("hammer") ||
    gear.id.includes("broom") ||
    gear.id.includes("cleaver")
  ) {
    return (
      <>
        <R x={54} y={16} w={4} h={30} f={c.metal} />
        <R x={48} y={10} w={14} h={10} f={c.main} />
        <R x={50} y={12} w={10} h={6} f={c.hi} />
        <R x={52} y={8} w={6} h={4} f={c.glow} />
        <R x={52} y={44} w={6} h={4} f={c.trim} />
      </>
    );
  }

  if (set === "frostbite") {
    return (
      <>
        <R x={54} y={10} w={3} h={38} f={c.metal} />
        <R x={50} y={8} w={10} h={4} f={c.hi} />
        <R x={52} y={4} w={6} h={6} f={c.glow} />
        <R x={51} y={12} w={8} h={2} f={c.trim} />
      </>
    );
  }

  return (
    <>
      <R x={54} y={8} w={4} h={34} f={c.hi} />
      <R x={53} y={10} w={6} h={28} f={c.main} />
      <R x={50} y={40} w={12} h={4} f={c.mid} />
      <R x={54} y={44} w={4} h={8} f={c.trim} />
      <R x={52} y={6} w={8} h={4} f={c.glow} />
      {gear.rarity === "relic" || gear.rarity === "mythic" ? (
        <R x={55} y={14} w={2} h={16} f={c.trim} />
      ) : null}
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
          <R x={10} y={4} w={12} h={3} f={c.hi} />
          <R x={8} y={7} w={16} h={12} f={c.main} />
          <R x={10} y={9} w={12} h={8} f={c.mid} />
          <R x={11} y={11} w={4} h={4} f="#0b1220" />
          <R x={17} y={11} w={4} h={4} f="#0b1220" />
          <R x={12} y={18} w={8} h={3} f={c.trim} />
          <R x={14} y={2} w={4} h={3} f={c.glow} />
        </>
      );
    case "chestplate":
      return (
        <>
          <R x={6} y={6} w={4} h={8} f={c.hi} />
          <R x={22} y={6} w={4} h={8} f={c.hi} />
          <R x={8} y={6} w={16} h={18} f={c.main} />
          <R x={10} y={8} w={12} h={14} f={c.mid} />
          <R x={12} y={10} w={8} h={6} f={c.trim} />
          <R x={14} y={12} w={4} h={3} f={c.glow} />
          <R x={10} y={22} w={12} h={3} f={c.deep} />
        </>
      );
    case "leggings":
      return (
        <>
          <R x={8} y={4} w={16} h={6} f={c.main} />
          <R x={8} y={10} w={6} h={16} f={c.mid} />
          <R x={18} y={10} w={6} h={16} f={c.mid} />
          <R x={9} y={12} w={4} h={10} f={c.deep} />
          <R x={19} y={12} w={4} h={10} f={c.deep} />
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
