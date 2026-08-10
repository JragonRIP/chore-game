import { createInitialState, normalizeState } from "./math";
import type { GameState } from "./types";

const KEY = "daily-chore-treasure-quest-v1";

export function loadGame(): GameState {
  if (typeof window === "undefined") return createInitialState();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return createInitialState();
    const parsed = JSON.parse(raw) as GameState;
    if (!parsed || parsed.version !== 1) return createInitialState();
    return normalizeState(parsed);
  } catch {
    return createInitialState();
  }
}

export function saveGame(state: GameState): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(state));
}
