"use client";

export function GoldCoin({ size = 20, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      className={className}
      aria-hidden
    >
      <circle cx="16" cy="16" r="14" fill="#B45309" />
      <circle cx="16" cy="16" r="12" fill="#E8A017" />
      <circle cx="16" cy="16" r="10" fill="#F6D28A" />
      <circle cx="16" cy="16" r="8" fill="#F59E0B" />
      <ellipse cx="12" cy="11" rx="4" ry="2.5" fill="#FEF3C7" opacity="0.85" />
      <text
        x="16"
        y="20"
        textAnchor="middle"
        fontSize="10"
        fontWeight="700"
        fill="#92400E"
        fontFamily="system-ui,sans-serif"
      >
        G
      </text>
    </svg>
  );
}
