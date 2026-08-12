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
      <ellipse cx="32" cy="58" rx="20" ry="3.5" fill="#152033" opacity="0.14" />
      {/* soft pink aura */}
      <ellipse cx="32" cy="38" rx="26" ry="22" fill="#F9A8D4" opacity="0.28" />
      {/* body — frosted white crystal */}
      <path
        d="M11 30 L14 52 L50 52 L53 30 Z"
        fill="#E8EEF5"
      />
      <path d="M14 32 L17 50 L31 50 L31 32 Z" fill="#F8FAFC" />
      <path d="M31 32 L31 50 L47 50 L50 32 Z" fill="#D7DEE8" />
      {/* jagged crystal facets on body */}
      <path d="M16 36 L20 34 L22 42 L17 44 Z" fill="#FFFFFF" opacity="0.75" />
      <path d="M24 40 L28 37 L30 48 L25 48 Z" fill="#CBD5E1" opacity="0.7" />
      <path d="M36 35 L42 33 L44 46 L37 47 Z" fill="#FFFFFF" opacity="0.55" />
      <path d="M40 40 L48 38 L49 48 L42 49 Z" fill="#94A3B8" opacity="0.35" />
      {/* lid */}
      <path
        d="M10 30 L14 18 L50 18 L54 30 Z"
        fill="#F1F5F9"
      />
      <path d="M14 20 L17 28 L31 28 L31 20 Z" fill="#FFFFFF" />
      <path d="M31 20 L31 28 L47 28 L50 20 Z" fill="#D0D7E2" />
      {/* lid crystal chips */}
      <path d="M18 22 L22 19 L24 26 L19 27 Z" fill="#E2E8F0" />
      <path d="M40 21 L46 20 L47 27 L41 27 Z" fill="#FFFFFF" opacity="0.8" />
      {/* pink seam glow under lid */}
      <rect x="13" y="29" width="38" height="2.5" fill="#F472B6" opacity="0.85" />
      <rect x="15" y="29.4" width="34" height="1.2" fill="#FBCFE8" opacity="0.9" />
      {/* glowing magenta orb on lid */}
      <circle cx="32" cy="16" r="7" fill="#FB7185" opacity="0.35" />
      <circle cx="32" cy="16" r="5.2" fill="#EC4899" />
      <circle cx="32" cy="16" r="3.4" fill="#F472B6" />
      <circle cx="30.5" cy="14.6" r="1.4" fill="#FCE7F3" />
      {/* dark hexagonal lock */}
      <path
        d="M32 34 L36 36.5 L36 41.5 L32 44 L28 41.5 L28 36.5 Z"
        fill="#1E1B2E"
      />
      <path
        d="M32 35.5 L34.5 37 L34.5 40.5 L32 42 L29.5 40.5 L29.5 37 Z"
        fill="#312E45"
      />
      <circle cx="32" cy="38.5" r="1.2" fill="#F472B6" opacity="0.7" />
      {/* sparkles */}
      <circle cx="18" cy="14" r="1.1" fill="#FCE7F3" />
      <circle cx="48" cy="15" r="1.3" fill="#FFFFFF" />
      <circle cx="52" cy="34" r="1" fill="#F9A8D4" />
      <circle cx="12" cy="40" r="0.9" fill="#E0F2FE" />
    </>
  );
}
