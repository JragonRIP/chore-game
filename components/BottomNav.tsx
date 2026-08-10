"use client";

import type { TabId } from "@/lib/types";

const TABS: Array<{ id: TabId; label: string; icon: string }> = [
  { id: "quest", label: "Quest", icon: "⚔️" },
  { id: "vault", label: "Vault", icon: "💎" },
  { id: "armory", label: "Armory", icon: "🛡️" },
  { id: "store", label: "Store", icon: "🏪" },
];

export function BottomNav({
  tab,
  onChange,
}: {
  tab: TabId;
  onChange: (t: TabId) => void;
}) {
  return (
    <nav className="sticky bottom-0 z-30 border-t-2 border-cyan-900/80 bg-navy-deep/95 pb-[max(0.35rem,env(safe-area-inset-bottom))] pt-1 backdrop-blur-sm">
      <div className="mx-auto grid max-w-lg grid-cols-4 gap-0.5 px-1">
        {TABS.map((t) => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onChange(t.id)}
              className={`flex min-h-14 flex-col items-center justify-center gap-0.5 px-1 ${
                active ? "text-gold" : "text-cyan-200/60"
              }`}
            >
              <span className="text-lg" aria-hidden>
                {t.icon}
              </span>
              <span className="font-pixel text-[8px] leading-none sm:text-[9px]">
                {t.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
