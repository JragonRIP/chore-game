"use client";

import { useState } from "react";
import { STORY_PANELS } from "@/lib/quests";

export function IntroStory({ onDone }: { onDone: () => void }) {
  const [index, setIndex] = useState(0);
  const panel = STORY_PANELS[index]!;
  const last = index === STORY_PANELS.length - 1;

  return (
    <div className="flex min-h-dvh flex-col bg-navy px-3 py-4 text-cyan-50">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col">
        <div className="mb-3 flex items-center justify-between gap-2">
          <p className="font-pixel text-[10px] leading-relaxed text-gold">
            Daily Chore Treasure Quest
          </p>
          <button
            type="button"
            onClick={onDone}
            className="pixel-btn pixel-btn-ghost min-h-10 px-3 text-[10px]"
          >
            Skip
          </button>
        </div>

        <div className="pixel-panel relative flex flex-1 flex-col overflow-hidden p-4">
          <div className="story-scanlines pointer-events-none absolute inset-0" />
          <p className="font-pixel text-[9px] text-cyan-300/80">
            Chapter {index + 1} / {STORY_PANELS.length}
          </p>
          <h1 className="mt-3 font-pixel text-sm leading-6 text-gold sm:text-base">
            {panel.title}
          </h1>
          <p className="mt-4 flex-1 font-sans text-base leading-relaxed text-cyan-50/90">
            {panel.text}
          </p>
          <div className="mt-6 flex gap-1">
            {STORY_PANELS.map((_, i) => (
              <span
                key={i}
                className={`h-2 flex-1 ${i <= index ? "bg-lime-xp" : "bg-navy-deep"}`}
              />
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={() => (last ? onDone() : setIndex((i) => i + 1))}
          className="pixel-btn pixel-btn-primary mt-4 min-h-12 w-full font-pixel text-[11px]"
        >
          {last ? "Begin Your Legend" : "Continue"}
        </button>
      </div>
    </div>
  );
}
