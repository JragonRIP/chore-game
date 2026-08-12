/** Idle rewards while the app is closed (offline). */

export const IDLE_START_MS = 60_000; // first minute away earns nothing
export const IDLE_CAP_MS = 5 * 60 * 60 * 1000; // 5 hours
export const IDLE_MAX_GOLD = 50;
export const IDLE_MAX_XP = 60;

export interface IdleClaim {
  gold: number;
  xp: number;
}

export function idleRewardsForElapsed(elapsedMs: number): IdleClaim & {
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

/** Roll away-time into a pending claim; bump lastActiveAt to now. */
export function settleAwayIdle(
  lastActiveAt: number,
  existing: IdleClaim | null,
  now = Date.now(),
): { idleClaim: IdleClaim | null; lastActiveAt: number } {
  if (existing && (existing.gold > 0 || existing.xp > 0)) {
    return { idleClaim: existing, lastActiveAt: now };
  }
  const rolled = idleRewardsForElapsed(Math.max(0, now - lastActiveAt));
  if (rolled.gold <= 0 && rolled.xp <= 0) {
    return { idleClaim: null, lastActiveAt: now };
  }
  return {
    idleClaim: { gold: rolled.gold, xp: rolled.xp },
    lastActiveAt: now,
  };
}
