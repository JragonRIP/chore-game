"use client";

import { useMemo, useState } from "react";
import { GoldCoin } from "@/components/GoldCoin";
import type { useOnline } from "@/hooks/useOnline";
import { DUPLICATE_COINS, GEAR_BY_ID } from "@/lib/gear";
import { ALL_PETS, PET_DUPLICATE_COINS } from "@/lib/pets";
import type { ClaimGiftResult, GiftType } from "@/lib/online";
import type { GameState } from "@/lib/types";

type OnlineApi = ReturnType<typeof useOnline>;

const PET_BY_ID = Object.fromEntries(ALL_PETS.map((p) => [p.id, p]));

function giftLabel(g: {
  gift_type: GiftType;
  gold: number | null;
  gear_id: string | null;
  pet_id: string | null;
  chest_json: { type?: string } | null;
}): string {
  if (g.gift_type === "gold") return `${g.gold ?? 0} gold`;
  if (g.gift_type === "gear") {
    return GEAR_BY_ID[g.gear_id ?? ""]?.name ?? "Gear";
  }
  if (g.gift_type === "pet") {
    return PET_BY_ID[g.pet_id ?? ""]?.name ?? "Pet";
  }
  const t = g.chest_json?.type === "legendary" ? "Legendary" : "Normal";
  return `${t} chest`;
}

function claimToast(result: ClaimGiftResult): string {
  if (result.kind === "gold") return `Claimed ${result.gold} gold!`;
  if (result.kind === "gear") {
    return `Got ${GEAR_BY_ID[result.gearId]?.name ?? "gear"}!`;
  }
  if (result.kind === "gear-dupe") {
    return `Already owned — +${result.gold} gold!`;
  }
  if (result.kind === "pet") {
    return `Got ${PET_BY_ID[result.petId]?.name ?? "pet"}!`;
  }
  if (result.kind === "pet-dupe") {
    return `Already owned — +${result.gold} gold!`;
  }
  const t = result.chest.type === "legendary" ? "Legendary" : "Normal";
  return `${t} chest added to vault!`;
}

export function FriendsPanel({
  open,
  onClose,
  state,
  online,
}: {
  open: boolean;
  onClose: () => void;
  state: GameState;
  online: OnlineApi;
}) {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [username, setUsername] = useState("");
  const [pin, setPin] = useState("");
  const [displayName, setDisplayName] = useState(state.hero?.name ?? "");
  const [friendCode, setFriendCode] = useState("");
  const [giftType, setGiftType] = useState<Record<string, GiftType>>({});
  const [giftAmounts, setGiftAmounts] = useState<Record<string, string>>({});
  const [giftGear, setGiftGear] = useState<Record<string, string>>({});
  const [giftPet, setGiftPet] = useState<Record<string, string>>({});
  const [giftChest, setGiftChest] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<string | null>(null);

  const ownedGear = useMemo(
    () =>
      state.ownedGear
        .map((id) => GEAR_BY_ID[id])
        .filter(Boolean)
        .sort((a, b) => a.name.localeCompare(b.name)),
    [state.ownedGear],
  );

  const ownedPets = useMemo(
    () =>
      state.ownedPets
        .map((id) => PET_BY_ID[id])
        .filter(Boolean)
        .sort((a, b) => a.name.localeCompare(b.name)),
    [state.ownedPets],
  );

  if (!open) return null;

  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2500);
  };

  const typeFor = (playerId: string): GiftType =>
    giftType[playerId] ?? "gold";

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-4 backdrop-blur-sm sm:items-center">
      <div className="surface-strong max-h-[90dvh] w-full max-w-md overflow-y-auto p-5 rise-in">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-display text-xl text-ink">Friends</h3>
            <p className="mt-0.5 text-sm text-ink-soft">
              Sign in, add friends, gift gold, gear, pets, or chests.
            </p>
          </div>
          <button type="button" onClick={onClose} className="btn btn-ghost min-h-10 px-3 text-sm">
            Close
          </button>
        </div>

        {!online.configured && (
          <div className="mt-4 rounded-2xl bg-amber-50 p-3 text-sm text-amber-900">
            Online play isn&apos;t set up yet. Add your Supabase keys to{" "}
            <code className="font-mono text-xs">.env.local</code> and run{" "}
            <code className="font-mono text-xs">supabase/schema.sql</code>. See{" "}
            <strong>ONLINE_SETUP.md</strong>.
          </div>
        )}

        {online.error && (
          <p className="mt-3 rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {online.error}
          </p>
        )}
        {toast && (
          <p className="mt-3 rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            {toast}
          </p>
        )}

        {online.configured && !online.player && (
          <div className="mt-4">
            <div className="flex gap-2">
              <button
                type="button"
                className={`chip ${mode === "signin" ? "chip-active" : ""}`}
                onClick={() => setMode("signin")}
              >
                Sign in
              </button>
              <button
                type="button"
                className={`chip ${mode === "signup" ? "chip-active" : ""}`}
                onClick={() => setMode("signup")}
              >
                Create account
              </button>
            </div>
            <p className="mt-3 text-xs text-ink-soft">
              Your current progress stays with you — first login uploads this
              save to your account.
            </p>
            <label className="mt-3 block text-xs font-bold uppercase tracking-wide text-ink-soft">
              Username
              <input
                className="field mt-1"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoCapitalize="off"
                autoCorrect="off"
                placeholder="hero_name"
              />
            </label>
            {mode === "signup" && (
              <label className="mt-3 block text-xs font-bold uppercase tracking-wide text-ink-soft">
                Display name
                <input
                  className="field mt-1"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder={state.hero?.name ?? "Hero"}
                />
              </label>
            )}
            <label className="mt-3 block text-xs font-bold uppercase tracking-wide text-ink-soft">
              PIN (4–8 digits)
              <input
                className="field mt-1"
                type="password"
                inputMode="numeric"
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 8))}
                placeholder="••••"
              />
            </label>
            <button
              type="button"
              disabled={online.busy}
              className="btn btn-primary mt-4 w-full"
              onClick={() => {
                void (async () => {
                  try {
                    if (mode === "signup") {
                      await online.signUp(username, pin, displayName);
                      showToast("Account created — progress saved online!");
                    } else {
                      await online.signIn(username, pin);
                      showToast("Signed in!");
                    }
                  } catch {
                    /* error shown via online.error */
                  }
                })();
              }}
            >
              {online.busy
                ? "Working…"
                : mode === "signup"
                  ? "Create account"
                  : "Sign in"}
            </button>
          </div>
        )}

        {online.player && (
          <div className="mt-4 space-y-4">
            <div className="rounded-2xl bg-sky-1/80 p-3">
              <p className="font-display text-base text-ink">
                {online.player.display_name}
              </p>
              <p className="text-sm text-ink-soft">@{online.player.username}</p>
              <p className="mt-2 text-xs font-bold uppercase tracking-wide text-teal-deep">
                Your friend code
              </p>
              <p className="font-display text-2xl tracking-widest text-ink">
                {online.player.friend_code}
              </p>
              <button
                type="button"
                className="btn btn-ghost mt-2 min-h-10 w-full text-sm"
                onClick={() => {
                  void navigator.clipboard?.writeText(online.player!.friend_code);
                  showToast("Friend code copied!");
                }}
              >
                Copy code
              </button>
            </div>

            {online.gifts.length > 0 && (
              <div>
                <h4 className="font-display text-lg text-ink">Gifts</h4>
                <div className="mt-2 flex flex-col gap-2">
                  {online.gifts.map((g) => (
                    <div
                      key={g.id}
                      className="surface flex items-center justify-between gap-2 p-3"
                    >
                      <div>
                        <p className="text-sm font-semibold text-ink">
                          From {g.from_name ?? "a friend"}
                        </p>
                        <p className="inline-flex items-center gap-1 text-sm text-amber-800">
                          {g.gift_type === "gold" && <GoldCoin size={14} />}
                          {giftLabel(g)}
                        </p>
                      </div>
                      <button
                        type="button"
                        disabled={online.busy}
                        className="btn btn-secondary min-h-10 px-3 text-xs"
                        onClick={() => {
                          void (async () => {
                            try {
                              const result = await online.claimGift(g.id);
                              showToast(claimToast(result));
                            } catch {
                              /* shown */
                            }
                          })();
                        }}
                      >
                        Claim
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h4 className="font-display text-lg text-ink">Add friend</h4>
              <div className="mt-2 flex gap-2">
                <input
                  className="field min-h-11 flex-1 uppercase"
                  value={friendCode}
                  onChange={(e) =>
                    setFriendCode(e.target.value.toUpperCase().slice(0, 8))
                  }
                  placeholder="FRIEND CODE"
                />
                <button
                  type="button"
                  disabled={online.busy || friendCode.length < 4}
                  className="btn btn-primary min-h-11 shrink-0 px-4 text-sm"
                  onClick={() => {
                    void (async () => {
                      try {
                        await online.addFriend(friendCode);
                        setFriendCode("");
                        showToast("Friend request sent!");
                      } catch {
                        /* shown */
                      }
                    })();
                  }}
                >
                  Add
                </button>
              </div>
            </div>

            <div>
              <h4 className="font-display text-lg text-ink">Your friends</h4>
              {online.friends.length === 0 && (
                <p className="mt-2 text-sm text-ink-soft">
                  No friends yet — share your code!
                </p>
              )}
              <div className="mt-2 flex flex-col gap-2">
                {online.friends.map((f) => {
                  const t = typeFor(f.playerId);
                  return (
                    <div key={f.friendshipId} className="surface p-3">
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <p className="font-display text-sm text-ink">
                            {f.displayName}
                          </p>
                          <p className="text-xs text-ink-soft">
                            @{f.username} · {f.friendCode}
                          </p>
                        </div>
                        {f.status === "pending" && f.incoming && (
                          <button
                            type="button"
                            disabled={online.busy}
                            className="btn btn-secondary min-h-10 px-3 text-xs"
                            onClick={() => {
                              void online.acceptFriend(f.friendshipId);
                            }}
                          >
                            Accept
                          </button>
                        )}
                        {f.status === "pending" && !f.incoming && (
                          <span className="text-xs font-semibold text-amber-700">
                            Pending
                          </span>
                        )}
                      </div>
                      {f.status === "accepted" && (
                        <div className="mt-2 space-y-2">
                          <div className="flex flex-wrap gap-1">
                            {(
                              [
                                ["gold", "Gold"],
                                ["gear", "Gear"],
                                ["pet", "Pet"],
                                ["chest", "Chest"],
                              ] as const
                            ).map(([id, label]) => (
                              <button
                                key={id}
                                type="button"
                                className={`chip text-xs ${t === id ? "chip-active" : ""}`}
                                onClick={() =>
                                  setGiftType((m) => ({
                                    ...m,
                                    [f.playerId]: id,
                                  }))
                                }
                              >
                                {label}
                              </button>
                            ))}
                          </div>

                          {t === "gold" && (
                            <div className="flex gap-2">
                              <input
                                className="field min-h-10 flex-1"
                                inputMode="numeric"
                                placeholder="Gold"
                                value={giftAmounts[f.playerId] ?? "25"}
                                onChange={(e) =>
                                  setGiftAmounts((m) => ({
                                    ...m,
                                    [f.playerId]: e.target.value.replace(
                                      /\D/g,
                                      "",
                                    ),
                                  }))
                                }
                              />
                              <button
                                type="button"
                                disabled={online.busy}
                                className="btn btn-primary min-h-10 gap-1 px-3 text-xs"
                                onClick={() => {
                                  const amount = Number(
                                    giftAmounts[f.playerId] ?? 25,
                                  );
                                  void (async () => {
                                    try {
                                      await online.giftGold(f.playerId, amount);
                                      showToast(`Sent ${amount} gold!`);
                                    } catch {
                                      /* shown */
                                    }
                                  })();
                                }}
                              >
                                <GoldCoin size={14} />
                                Send
                              </button>
                            </div>
                          )}

                          {t === "gear" && (
                            <div className="flex gap-2">
                              <select
                                className="field min-h-10 flex-1 text-sm"
                                value={giftGear[f.playerId] ?? ""}
                                onChange={(e) =>
                                  setGiftGear((m) => ({
                                    ...m,
                                    [f.playerId]: e.target.value,
                                  }))
                                }
                              >
                                <option value="">Pick gear…</option>
                                {ownedGear.map((g) => (
                                  <option key={g.id} value={g.id}>
                                    {g.name}
                                    {Object.values(state.equipped).includes(g.id)
                                      ? " (equipped)"
                                      : ""}
                                  </option>
                                ))}
                              </select>
                              <button
                                type="button"
                                disabled={online.busy || !giftGear[f.playerId]}
                                className="btn btn-primary min-h-10 px-3 text-xs"
                                onClick={() => {
                                  const gearId = giftGear[f.playerId];
                                  const gear = GEAR_BY_ID[gearId];
                                  if (!gear) return;
                                  void (async () => {
                                    try {
                                      await online.giftGear(
                                        f.playerId,
                                        gearId,
                                        DUPLICATE_COINS[gear.rarity],
                                      );
                                      setGiftGear((m) => ({
                                        ...m,
                                        [f.playerId]: "",
                                      }));
                                      showToast(`Sent ${gear.name}!`);
                                    } catch {
                                      /* shown */
                                    }
                                  })();
                                }}
                              >
                                Send
                              </button>
                            </div>
                          )}

                          {t === "pet" && (
                            <div className="flex gap-2">
                              <select
                                className="field min-h-10 flex-1 text-sm"
                                value={giftPet[f.playerId] ?? ""}
                                onChange={(e) =>
                                  setGiftPet((m) => ({
                                    ...m,
                                    [f.playerId]: e.target.value,
                                  }))
                                }
                              >
                                <option value="">Pick pet…</option>
                                {ownedPets.map((p) => (
                                  <option key={p.id} value={p.id}>
                                    {p.name}
                                    {state.equippedPet === p.id
                                      ? " (active)"
                                      : ""}
                                  </option>
                                ))}
                              </select>
                              <button
                                type="button"
                                disabled={online.busy || !giftPet[f.playerId]}
                                className="btn btn-primary min-h-10 px-3 text-xs"
                                onClick={() => {
                                  const petId = giftPet[f.playerId];
                                  const pet = PET_BY_ID[petId];
                                  if (!pet) return;
                                  void (async () => {
                                    try {
                                      await online.giftPet(
                                        f.playerId,
                                        petId,
                                        PET_DUPLICATE_COINS[pet.rarity],
                                      );
                                      setGiftPet((m) => ({
                                        ...m,
                                        [f.playerId]: "",
                                      }));
                                      showToast(`Sent ${pet.name}!`);
                                    } catch {
                                      /* shown */
                                    }
                                  })();
                                }}
                              >
                                Send
                              </button>
                            </div>
                          )}

                          {t === "chest" && (
                            <div className="flex gap-2">
                              <select
                                className="field min-h-10 flex-1 text-sm"
                                value={giftChest[f.playerId] ?? ""}
                                onChange={(e) =>
                                  setGiftChest((m) => ({
                                    ...m,
                                    [f.playerId]: e.target.value,
                                  }))
                                }
                              >
                                <option value="">Pick chest…</option>
                                {state.vaultChests.map((c) => (
                                  <option key={c.id} value={c.id}>
                                    {c.type === "legendary"
                                      ? "Legendary"
                                      : "Normal"}{" "}
                                    — {c.reason}
                                  </option>
                                ))}
                              </select>
                              <button
                                type="button"
                                disabled={
                                  online.busy || !giftChest[f.playerId]
                                }
                                className="btn btn-primary min-h-10 px-3 text-xs"
                                onClick={() => {
                                  const chestId = giftChest[f.playerId];
                                  if (!chestId) return;
                                  void (async () => {
                                    try {
                                      await online.giftChest(
                                        f.playerId,
                                        chestId,
                                      );
                                      setGiftChest((m) => ({
                                        ...m,
                                        [f.playerId]: "",
                                      }));
                                      showToast("Chest sent!");
                                    } catch {
                                      /* shown */
                                    }
                                  })();
                                }}
                              >
                                Send
                              </button>
                            </div>
                          )}

                          {(t === "gear" && ownedGear.length === 0) ||
                          (t === "pet" && ownedPets.length === 0) ||
                          (t === "chest" &&
                            state.vaultChests.length === 0) ? (
                            <p className="text-xs text-ink-soft">
                              Nothing to gift in this category yet.
                            </p>
                          ) : null}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              type="button"
              className="btn btn-ghost w-full text-sm text-rose-600"
              onClick={() => {
                void online.signOut();
              }}
            >
              Sign out
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
