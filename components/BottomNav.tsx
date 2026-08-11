"use client";

import type { TabId } from "@/lib/types";

const TABS: Array<{ id: TabId; label: string; icon: React.ReactNode }> = [
  {
    id: "quest",
    label: "Quest",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 19V5a2 2 0 0 1 2-2h9l5 5v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z" />
        <path d="M14 3v5h5M8 13h8M8 17h5" />
      </svg>
    ),
  },
  {
    id: "vault",
    label: "Vault",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="8" width="18" height="12" rx="2" />
        <path d="M7 8V6a5 5 0 0 1 10 0v2" />
        <circle cx="12" cy="14" r="2" />
      </svg>
    ),
  },
  {
    id: "armory",
    label: "Armory",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 3 4 7v5c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V7l-8-4Z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
  {
    id: "pets",
    label: "Pets",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="8" cy="9" r="2.2" />
        <circle cx="16" cy="9" r="2.2" />
        <circle cx="5.5" cy="14.5" r="2" />
        <circle cx="18.5" cy="14.5" r="2" />
        <ellipse cx="12" cy="16.5" rx="3.2" ry="2.6" />
      </svg>
    ),
  },
  {
    id: "store",
    label: "Store",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 9h16l-1.5 10.5A2 2 0 0 1 16.5 21h-9a2 2 0 0 1-2-1.5L4 9Z" />
        <path d="M8 9V6a4 4 0 0 1 8 0v3" />
      </svg>
    ),
  },
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
      <div className="mx-auto grid max-w-lg grid-cols-5 gap-0.5 px-1.5">
        {TABS.map((t) => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onChange(t.id)}
              className={`flex min-h-14 flex-col items-center justify-center gap-0.5 rounded-2xl transition ${
                active
                  ? "bg-teal text-white shadow-md shadow-teal/25"
                  : "text-ink-soft hover:bg-white/50"
              }`}
            >
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-xl ${
                  active ? "bg-white/20" : "bg-ink/5"
                }`}
              >
                {t.icon}
              </span>
              <span className="text-[10px] font-semibold">{t.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
