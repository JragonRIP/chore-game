import type { XpBottleDef, XpBottleId } from "@/lib/types";

export const STORE_XP_BOTTLES: XpBottleDef[] = [
  {
    id: "xp-sip",
    name: "XP Sip",
    xp: 50,
    price: 40,
    hue: 155,
  },
  {
    id: "xp-flask",
    name: "XP Flask",
    xp: 150,
    price: 110,
    hue: 42,
  },
];

export const XP_BOTTLE_BY_ID: Record<XpBottleId, XpBottleDef> =
  Object.fromEntries(STORE_XP_BOTTLES.map((b) => [b.id, b])) as Record<
    XpBottleId,
    XpBottleDef
  >;
