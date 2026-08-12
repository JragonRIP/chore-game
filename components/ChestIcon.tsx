"use client";

type ChestVariant = "wooden" | "golden" | "crystal";

export function chestIconVariant(
  type: "normal" | "legendary" | "crystal",
): ChestVariant {
  if (type === "crystal") return "crystal";
  if (type === "legendary") return "golden";
  return "wooden";
}

export function chestLabel(
  type: "normal" | "legendary" | "crystal",
): string {
  if (type === "crystal") return "Crystal Chest";
  if (type === "legendary") return "Golden Chest";
  return "Wooden Chest";
}

export function ChestIcon({
  variant,
  size = 72,
  className = "",
}: {
  variant: ChestVariant;
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={className}
      aria-hidden
    >
      {variant === "wooden" ? (
        <WoodenChest />
      ) : variant === "golden" ? (
        <GoldenChest />
      ) : (
        <CrystalChest />
      )}
    </svg>
  );
}

function WoodenChest() {
  return (
    <>
      {/* shadow */}
      <ellipse cx="32" cy="58" rx="20" ry="4" fill="#152033" opacity="0.12" />
      {/* body */}
      <rect x="10" y="28" width="44" height="26" rx="4" fill="#8B5A2B" />
      <rect x="12" y="30" width="40" height="22" rx="3" fill="#A66B2F" />
      {/* wood planks */}
      <rect x="14" y="33" width="36" height="3" rx="1" fill="#C4893F" opacity="0.55" />
      <rect x="14" y="40" width="36" height="3" rx="1" fill="#7A4A22" opacity="0.35" />
      <rect x="14" y="47" width="36" height="3" rx="1" fill="#C4893F" opacity="0.4" />
      {/* lid */}
      <path
        d="M10 30c0-2 2-4 4-4h36c2 0 4 2 4 4v4H10v-4Z"
        fill="#6E4520"
      />
      <path
        d="M12 28c0-1.5 1.5-3 3-3h34c1.5 0 3 1.5 3 3v3H12v-3Z"
        fill="#B8752F"
      />
      <path
        d="M14 26h36c1 0 2 .8 2 2v1H12v-1c0-1.2 1-2 2-2Z"
        fill="#D49A4A"
      />
      {/* metal bands */}
      <rect x="10" y="34" width="44" height="4" fill="#5C6570" />
      <rect x="10" y="35" width="44" height="1.5" fill="#8B949E" opacity="0.7" />
      <rect x="10" y="48" width="44" height="4" fill="#5C6570" />
      <rect x="10" y="49" width="44" height="1.5" fill="#8B949E" opacity="0.7" />
      {/* lock plate */}
      <rect x="26" y="36" width="12" height="12" rx="2" fill="#6B7280" />
      <rect x="28" y="38" width="8" height="8" rx="1.5" fill="#9CA3AF" />
      <circle cx="32" cy="41" r="2" fill="#4B5563" />
      <rect x="31" y="42" width="2" height="3" rx="0.5" fill="#374151" />
      {/* corner studs */}
      <circle cx="14" cy="36" r="1.5" fill="#9CA3AF" />
      <circle cx="50" cy="36" r="1.5" fill="#9CA3AF" />
      <circle cx="14" cy="50" r="1.5" fill="#9CA3AF" />
      <circle cx="50" cy="50" r="1.5" fill="#9CA3AF" />
    </>
  );
}

function GoldenChest() {
  return (
    <>
      <ellipse cx="32" cy="58" rx="20" ry="4" fill="#152033" opacity="0.14" />
      {/* glow */}
      <ellipse cx="32" cy="40" rx="26" ry="22" fill="#F6D28A" opacity="0.35" />
      {/* body */}
      <rect x="10" y="28" width="44" height="26" rx="4" fill="#B45309" />
      <rect x="12" y="30" width="40" height="22" rx="3" fill="#E8A017" />
      <rect x="14" y="32" width="36" height="18" rx="2" fill="#F6D28A" />
      {/* ornate lines */}
      <rect x="16" y="35" width="32" height="2" rx="1" fill="#FDE68A" />
      <rect x="16" y="42" width="32" height="2" rx="1" fill="#D97706" opacity="0.45" />
      <rect x="16" y="48" width="32" height="2" rx="1" fill="#FDE68A" opacity="0.8" />
      {/* lid */}
      <path
        d="M10 30c0-2 2-4 4-4h36c2 0 4 2 4 4v4H10v-4Z"
        fill="#92400E"
      />
      <path
        d="M12 28c0-1.5 1.5-3 3-3h34c1.5 0 3 1.5 3 3v3H12v-3Z"
        fill="#F59E0B"
      />
      <path
        d="M14 26h36c1 0 2 .8 2 2v1H12v-1c0-1.2 1-2 2-2Z"
        fill="#FCD34D"
      />
      {/* gold bands */}
      <rect x="10" y="34" width="44" height="4" fill="#CA8A04" />
      <rect x="10" y="35" width="44" height="1.5" fill="#FEF08A" opacity="0.85" />
      <rect x="10" y="48" width="44" height="4" fill="#CA8A04" />
      <rect x="10" y="49" width="44" height="1.5" fill="#FEF08A" opacity="0.85" />
      {/* jeweled lock */}
      <rect x="25" y="35" width="14" height="14" rx="3" fill="#B45309" />
      <rect x="27" y="37" width="10" height="10" rx="2" fill="#FBBF24" />
      <circle cx="32" cy="41" r="3" fill="#F87171" />
      <circle cx="32" cy="40" r="1.4" fill="#FECACA" />
      {/* crown tip on lid */}
      <path d="M28 18h8l-1.5 5h-5L28 18Z" fill="#FBBF24" />
      <path d="M30 16h4v3h-4v-3Z" fill="#FDE68A" />
      <circle cx="32" cy="15" r="2" fill="#F87171" />
      {/* sparkles */}
      <circle cx="18" cy="22" r="1.2" fill="#FEF9C3" />
      <circle cx="46" cy="20" r="1.5" fill="#FEF9C3" />
      <circle cx="50" cy="30" r="1" fill="#FFF" opacity="0.8" />
    </>
  );
}

function CrystalChest() {
  return (
    <>
      <ellipse cx="32" cy="58" rx="18" ry="3.5" fill="#152033" opacity="0.16" />
      {/* aura */}
      <ellipse cx="32" cy="36" rx="24" ry="26" fill="#67E8F9" opacity="0.28" />
      <ellipse cx="32" cy="34" rx="16" ry="18" fill="#A78BFA" opacity="0.22" />
      {/* crystal body — faceted gem chest */}
      <path
        d="M18 24 L32 10 L46 24 L42 50 L22 50 Z"
        fill="#7C3AED"
      />
      <path
        d="M22 26 L32 14 L42 26 L38 46 L26 46 Z"
        fill="#A78BFA"
      />
      <path d="M32 14 L42 26 L32 30 Z" fill="#DDD6FE" />
      <path d="M32 14 L22 26 L32 30 Z" fill="#C4B5FD" />
      <path d="M22 26 L32 30 L26 46 Z" fill="#8B5CF6" />
      <path d="M42 26 L32 30 L38 46 Z" fill="#6D28D9" />
      <path d="M26 46 L32 30 L38 46 Z" fill="#5B21B6" opacity="0.85" />
      {/* lid facet highlight */}
      <path d="M28 18 L32 12 L36 18 L32 22 Z" fill="#F5F3FF" opacity="0.9" />
      {/* gold clasp */}
      <rect x="28" y="36" width="8" height="10" rx="1.5" fill="#FBBF24" />
      <circle cx="32" cy="40" r="2.2" fill="#67E8F9" />
      <circle cx="32" cy="39.2" r="0.9" fill="#ECFEFF" />
      {/* sparkles */}
      <circle cx="16" cy="20" r="1.4" fill="#ECFEFF" />
      <circle cx="48" cy="18" r="1.8" fill="#F5F3FF" />
      <circle cx="50" cy="34" r="1.1" fill="#A5F3FC" />
      <circle cx="14" cy="38" r="1" fill="#DDD6FE" />
    </>
  );
}
