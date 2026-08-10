"use client";

import { useState } from "react";
import { AVATARS } from "@/lib/quests";
import type { AvatarId } from "@/lib/types";

export function HeroCreate({
  onCreate,
}: {
  onCreate: (name: string, avatar: AvatarId) => void;
}) {
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState<AvatarId>("knight");

  return (
    <div className="flex min-h-dvh flex-col bg-navy px-3 py-4 text-cyan-50">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col">
        <h1 className="font-pixel text-sm leading-7 text-gold">
          Create Your Hero
        </h1>
        <p className="mt-2 text-sm text-cyan-100/80">
          Choose a champion and claim your name in the realm.
        </p>

        <label className="mt-5 block font-pixel text-[10px] text-cyan-300">
          Hero Name
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={16}
            placeholder="Captain Tidytale"
            className="pixel-input mt-2 w-full min-h-12 text-base"
          />
        </label>

        <p className="mt-5 font-pixel text-[10px] text-cyan-300">Avatar</p>
        <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {AVATARS.map((a) => {
            const selected = avatar === a.id;
            return (
              <button
                key={a.id}
                type="button"
                onClick={() => setAvatar(a.id)}
                className={`pixel-panel flex min-h-16 items-center gap-3 p-3 text-left transition ${
                  selected ? "ring-2 ring-gold" : "opacity-90"
                }`}
              >
                <span className="text-3xl" aria-hidden>
                  {a.emoji}
                </span>
                <span>
                  <span className="block font-pixel text-[10px] text-gold">
                    {a.name}
                  </span>
                  <span className="mt-1 block text-xs text-cyan-100/75">
                    {a.blurb}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

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
