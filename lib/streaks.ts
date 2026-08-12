import { makeChestId, todayKey } from "@/lib/math";
import type { GameState, VaultChest } from "@/lib/types";

/** Legendary streak chests land on these day counts. */
export const STREAK_LEGENDARY_AT = [7, 14, 21, 30, 60, 100];

export function yesterdayKey(d = new Date()): string {
  const y = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  y.setDate(y.getDate() - 1);
  return todayKey(y);
}

export function nextStreakLegendaryAt(streakDays: number): number {
  const next = STREAK_LEGENDARY_AT.find((n) => n > streakDays);
  if (next != null) return next;
  const last = STREAK_LEGENDARY_AT[STREAK_LEGENDARY_AT.length - 1] ?? 7;
  return last + 7 * Math.ceil((streakDays - last + 1) / 7);
}

export function isStreakLegendaryDay(days: number): boolean {
  return STREAK_LEGENDARY_AT.includes(days);
}

export type StreakTick = {
  streakDays: number;
  streakDate: string;
  streakBest: number;
  chest: VaultChest | null;
  firstOfDay: boolean;
};

export function tickQuestStreak(state: GameState, now = new Date()): StreakTick {
  const today = todayKey(now);
  if (state.streakDate === today) {
    return {
      streakDays: state.streakDays,
      streakDate: state.streakDate,
      streakBest: state.streakBest,
      chest: null,
      firstOfDay: false,
    };
  }

  const yest = yesterdayKey(now);
  const streakDays = state.streakDate === yest ? state.streakDays + 1 : 1;
  const streakBest = Math.max(state.streakBest, streakDays);
  const chest: VaultChest | null = isStreakLegendaryDay(streakDays)
    ? {
        id: makeChestId(),
        type: "legendary",
        reason: `${streakDays}-day streak Golden Chest`,
        earnedAt: Date.now(),
      }
    : null;

  return {
    streakDays,
    streakDate: today,
    streakBest,
    chest,
    firstOfDay: true,
  };
}
