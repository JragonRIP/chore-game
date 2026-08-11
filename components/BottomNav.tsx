"use client";

import type { TabId } from "@/lib/types";

const TABS: Array<{ id: TabId; label: string; glyph: string }> = [
  { id: "quest", label: "Quest", glyph: "Q" },
  { id: "vault", label: "Vault", glyph: "V" },
  { id: "armory", label: "Armory", glyph: "A" },
  { id: "store", label: "Store", glyph: "S" },
];

export function BottomNav({
  tab,
  onChange,
}: {
  tab: TabId;
  onChange: (t: TabId) => void;
}) {
  return (
    <nav className="glass-bar z-30 shrink-0 border-t pb-[max(0.4rem,env(safe-area-inset-bottom))] pt-1.5">
      <div className="mx-auto grid max-w-lg grid-cols-4 gap-1 px-2">
        {TABS.map((t) => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onChange(t.id)}
              className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl transition ${
                active
                  ? "bg-teal text-white shadow-md shadow-teal/25"
                  : "text-ink-soft hover:bg-white/50"
              }`}
            >
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-xl text-xs font-bold ${
                  active ? "bg-white/20" : "bg-ink/5"
                }`}
              >
                {t.glyph}
              </span>
              <span className="text-[11px] font-semibold">{t.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
