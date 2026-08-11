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
    <div className="realm-bg relative flex min-h-dvh flex-col px-4 py-5 text-ink">
      <div className="relative mx-auto flex w-full max-w-md flex-1 flex-col">
        <h1 className="font-display text-3xl text-ink">Create Your Hero</h1>
        <p className="mt-1 text-ink-soft">
          Choose a champion and claim your name in the realm.
        </p>

        <label className="mt-5 block text-sm font-semibold text-ink-soft">
          Hero Name
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={16}
            placeholder="Captain Tidytale"
            className="field mt-2"
          />
        </label>

        <p className="mt-5 text-sm font-semibold text-ink-soft">Choose Avatar</p>
        <div
          className="mt-3 grid grid-cols-3 gap-2.5"
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
                className={`surface flex min-h-[9.5rem] flex-col items-center gap-2 p-2.5 transition duration-200 ${
                  isSelected
                    ? "ring-2 ring-teal ring-offset-2 ring-offset-sky-1"
                    : "opacity-90 hover:opacity-100"
                }`}
              >
                <div className="flex flex-1 items-center justify-center rounded-xl bg-gradient-to-b from-sky-2/50 to-transparent">
                  <PixelAvatar id={a.id} size={88} />
                </div>
                <span
                  className={`font-display text-sm ${
                    isSelected ? "text-teal-deep" : "text-ink"
                  }`}
                >
                  {a.name}
                </span>
              </button>
            );
          })}
        </div>

        {selected && (
          <p className="mt-4 text-center text-sm text-ink-soft rise-in">
            {selected.blurb}
          </p>
        )}

        <button
          type="button"
          disabled={!name.trim()}
          onClick={() => onCreate(name, avatar)}
          className="btn btn-primary mt-auto w-full text-base"
        >
          Enter the Quest Board
        </button>
      </div>
    </div>
  );
}
