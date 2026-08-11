"use client";

import { useState } from "react";
import { STORY_PANELS } from "@/lib/quests";

const CHAPTER_ART = ["🌅", "🗝️", "⚔️", "✨", "🏆"];

export function IntroStory({ onDone }: { onDone: () => void }) {
  const [index, setIndex] = useState(0);
  const panel = STORY_PANELS[index]!;
  const last = index === STORY_PANELS.length - 1;

  return (
    <div className="realm-bg relative flex min-h-dvh flex-col px-4 py-5 text-ink">
      <div className="relative mx-auto flex w-full max-w-md flex-1 flex-col">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="font-display text-lg text-teal-deep">
              Daily Chore Treasure Quest
            </p>
            <p className="text-sm text-ink-soft">Your legend begins</p>
          </div>
          <button type="button" onClick={onDone} className="btn btn-ghost min-h-10 px-4 text-sm">
            Skip
          </button>
        </div>

        <div key={index} className="surface relative flex flex-1 flex-col overflow-hidden p-5 rise-in">
          <div className="mx-auto mb-4 flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-sky-2 to-teal/30 text-5xl float-y">
            {CHAPTER_ART[index]}
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal">
            Chapter {index + 1} of {STORY_PANELS.length}
          </p>
          <h1 className="mt-2 font-display text-2xl leading-tight text-ink sm:text-3xl">
            {panel.title}
          </h1>
          <p className="mt-4 flex-1 text-base leading-relaxed text-ink-soft">
            {panel.text}
          </p>
          <div className="mt-6 flex gap-2">
            {STORY_PANELS.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  i <= index ? "bg-teal" : "bg-ink/10"
                }`}
              />
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={() => (last ? onDone() : setIndex((i) => i + 1))}
          className="btn btn-primary mt-4 w-full text-base"
        >
          {last ? "Begin Your Legend" : "Continue"}
        </button>
      </div>
    </div>
  );
}
