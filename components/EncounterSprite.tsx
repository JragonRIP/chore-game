"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { EncounterDef } from "@/lib/encounters";

export function EncounterSprite({
  encounter,
  size = 160,
  animate = true,
  className = "",
}: {
  encounter: EncounterDef;
  size?: number;
  animate?: boolean;
  className?: string;
}) {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    setFrame(0);
    if (!animate) return;
    const t = window.setInterval(() => {
      setFrame((f) => (f === 0 ? 1 : 0));
    }, 420);
    return () => window.clearInterval(t);
  }, [animate, encounter.id]);

  return (
    <div
      className={`relative mx-auto ${className}`}
      style={{ width: size, height: size }}
    >
      {encounter.frames.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt={i === 0 ? encounter.name : ""}
          width={size}
          height={size}
          className="absolute inset-0 object-contain drop-shadow-md transition-opacity duration-75"
          style={{
            width: size,
            height: size,
            opacity: frame === i ? 1 : 0,
          }}
          unoptimized
          priority={i === 0}
        />
      ))}
    </div>
  );
}
