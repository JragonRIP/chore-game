import { makeChestId } from "@/lib/math";
import { ALL_GEAR } from "@/lib/gear";
import type { ChestType, GearId, VaultChest } from "@/lib/types";

export type EncounterId = "slime" | "shadow-bat" | "treasure-goblin";

export type EncounterReward =
  | { kind: "flat"; gold: number; xp: number }
  | { kind: "gear"; gearId: GearId; gold: number; xp: number }
  | { kind: "chest"; chest: VaultChest; gold: number; xp: number };

export interface EncounterDef {
  id: EncounterId;
  name: string;
  icon: string;
  blurb: string;
  /** Mash taps needed to win. */
  tapsNeeded: number;
  seconds: number;
}

export const ENCOUNTERS: EncounterDef[] = [
  {
    id: "slime",
    name: "Slime",
    icon: "🟢",
    blurb: "A bouncy slime blocks the path!",
    tapsNeeded: 12,
    seconds: 6,
  },
  {
    id: "shadow-bat",
    name: "Shadow Bat",
    icon: "🦇",
    blurb: "A shadow bat swoops in!",
    tapsNeeded: 16,
    seconds: 7,
  },
  {
    id: "treasure-goblin",
    name: "Treasure Goblin",
    icon: "👺",
    blurb: "A treasure goblin flees with a chest!",
    tapsNeeded: 20,
    seconds: 8,
  },
];

export const ENCOUNTER_CHANCE = 0.25;

export function rollEncounter(): EncounterDef {
  return ENCOUNTERS[Math.floor(Math.random() * ENCOUNTERS.length)]!;
}

function rollGoblinChest(): VaultChest {
  const r = Math.random();
  let type: ChestType = "normal";
  if (r < 0.01) type = "crystal";
  else if (r < 0.12) type = "legendary";
  return {
    id: makeChestId(),
    type,
    reason: "Treasure Goblin spoils",
    earnedAt: Date.now(),
  };
}

export function rollEncounterReward(id: EncounterId): EncounterReward {
  if (id === "treasure-goblin") {
    return {
      kind: "chest",
      chest: rollGoblinChest(),
      gold: 8 + Math.floor(Math.random() * 10),
      xp: 10 + Math.floor(Math.random() * 12),
    };
  }
  if (id === "shadow-bat" && Math.random() < 0.35) {
    const scrap = ALL_GEAR.filter((g) => g.rarity === "scrap");
    const gear = scrap[Math.floor(Math.random() * scrap.length)];
    if (gear) {
      return {
        kind: "gear",
        gearId: gear.id,
        gold: 5 + Math.floor(Math.random() * 8),
        xp: 8 + Math.floor(Math.random() * 10),
      };
    }
  }
  return {
    kind: "flat",
    gold: 6 + Math.floor(Math.random() * 12),
    xp: 8 + Math.floor(Math.random() * 14),
  };
}
