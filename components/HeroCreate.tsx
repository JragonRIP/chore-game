"use client";

import { useState } from "react";
import { PixelAvatar } from "@/components/PixelAvatar";
import { AVATARS } from "@/lib/quests";
import type { AvatarId } from "@/lib/types";

export function HeroCreate({
  onCreate,
}: {
  onCreate: (name: string, avatar: AvatarId) => void;
}) {
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState<AvatarId>("knight");
  const selected = AVATARS.find((a) => a.id === avatar);

  return (
    <div className="flex min-h-dvh flex-col bg-navy px-3 py-4 text-cyan-50">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col">
        <h1 className="font-pixel text-sm leading-7 text-gold">
          Create Your Hero
        </h1>
        <p className="mt-2 text-sm text-cyan-100/80">
          Tap a champion, then name your legend.
        </p>

        <label className="mt-4 block font-pixel text-[10px] text-cyan-300">
          Hero Name
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={16}
            placeholder="Captain Tidytale"
            className="pixel-input mt-2 w-full min-h-12 text-base"
          />
        </label>

        <p className="mt-4 font-pixel text-[10px] text-cyan-300">
          Choose Avatar
        </p>

        <div
          className="mt-2 grid grid-cols-3 gap-2"
          role="listbox"
          aria-label="Hero avatars"
        >
          {AVATARS.map((a) => {
            const isSelected = avatar === a.id;
            return (
              <button
                key={a.id}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => setAvatar(a.id)}
                className={`pixel-panel flex min-h-[9rem] flex-col items-center justify-between gap-1 p-2 transition active:scale-[0.97] ${
                  isSelected
                    ? "border-gold shadow-[0_0_0_2px_#fbbf24] ring-0"
                    : "opacity-85 hover:opacity-100"
                }`}
              >
                <div
                  className={`flex flex-1 items-center justify-center rounded-sm ${
                    isSelected ? "bg-navy-deep" : "bg-navy/60"
                  }`}
                >
                  <PixelAvatar id={a.id} size={96} />
                </div>
                <span
                  className={`font-pixel text-center text-[8px] leading-tight sm:text-[9px] ${
                    isSelected ? "text-gold" : "text-cyan-100"
                  }`}
                >
                  {a.name}
                </span>
              </button>
            );
          })}
        </div>

        {selected && (
          <p className="mt-3 text-center text-sm text-cyan-100/80">
            {selected.blurb}
          </p>
        )}

        <button
          type="button"
          disabled={!name.trim()}
          onClick={() => onCreate(name, avatar)}
          className="pixel-btn pixel-btn-primary mt-auto min-h-12 w-full font-pixel text-[11px] disabled:opacity-40"
        >
          Enter the Quest Board
        </button>
      </div>
    </div>
  );
}
