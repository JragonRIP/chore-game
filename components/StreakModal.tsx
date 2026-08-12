"use client";

import { ChestIcon } from "@/components/ChestIcon";
import type { StreakPopup } from "@/hooks/useGameState";

export function StreakModal({
  data,
  onDismiss,
}: {
  data: StreakPopup;
  onDismiss: () => void;
}) {
  const daysLeft = Math.max(0, data.nextAt - data.days);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-4 backdrop-blur-sm sm:items-center">
      <div className="surface-strong w-full max-w-sm p-5 text-center rise-in">
        <p className="text-4xl">🔥</p>
        <h3 className="mt-2 font-display text-2xl text-ink">
          {data.days}-day streak!
        </h3>
        <p className="mt-2 text-sm text-ink-soft">
          First quest of the day is in. Keep the flame going tomorrow.
        </p>
        {data.awardedChest ? (
          <div className="mt-4 flex flex-col items-center gap-2">
            <div className="pulse-soft">
              <ChestIcon variant="golden" size={72} />
            </div>
            <p className="text-sm font-bold text-amber-800">
              Golden Chest added to your Vault!
            </p>
          </div>
        ) : (
          <p className="mt-4 rounded-2xl bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-900">
            Next Golden Chest in {daysLeft} day{daysLeft === 1 ? "" : "s"}{" "}
            (day {data.nextAt})
          </p>
        )}
        <button
          type="button"
          onClick={onDismiss}
          className="btn btn-primary mt-5 w-full"
        >
          Keep going
        </button>
      </div>
    </div>
  );
}
