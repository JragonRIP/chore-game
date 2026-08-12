/** Idle rewards while the app stays open. */

export const IDLE_START_MS = 60_000; // first minute earns nothing
export const IDLE_CAP_MS = 5 * 60 * 60 * 1000; // 5 hours
export const IDLE_MAX_GOLD = 50;
export const IDLE_MAX_XP = 60;

export function idleRewardsForElapsed(elapsedMs: number): {
  gold: number;
  xp: number;
  progress: number;
} {
  if (elapsedMs <= IDLE_START_MS) {
    return { gold: 0, xp: 0, progress: 0 };
  }
  const usable = Math.min(elapsedMs, IDLE_CAP_MS) - IDLE_START_MS;
  const span = IDLE_CAP_MS - IDLE_START_MS;
  const t = Math.max(0, Math.min(1, usable / span));
  return {
    gold: Math.floor(IDLE_MAX_GOLD * t),
    xp: Math.floor(IDLE_MAX_XP * t),
    progress: t,
  };
}
