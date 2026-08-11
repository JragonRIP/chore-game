"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  acceptFriendRequest,
  addFriendByCode,
  claimGift as claimGiftRpc,
  fetchMyPlayer,
  listFriends,
  listIncomingGifts,
  migrateOrLoadCloudSave,
  pullCloudSave,
  pushCloudSave,
  sendChestGift,
  sendGearGift,
  sendGoldGift,
  sendPetGift,
  signInAccount,
  signOutAccount,
  signUpAccount,
  type ClaimGiftResult,
  type FriendEntry,
  type GiftRow,
  type PlayerRow,
} from "@/lib/online";
import { isOnlineConfigured } from "@/lib/supabase";
import type { GameState } from "@/lib/types";

export function useOnline(opts: {
  state: GameState | null;
  replaceState: (next: GameState) => void;
}) {
  const { state, replaceState } = opts;
  const [configured] = useState(() => isOnlineConfigured());
  const [ready, setReady] = useState(false);
  const [player, setPlayer] = useState<PlayerRow | null>(null);
  const [friends, setFriends] = useState<FriendEntry[]>([]);
  const [gifts, setGifts] = useState<GiftRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const syncedOnce = useRef(false);
  const pushTimer = useRef<number | null>(null);

  const refreshSocial = useCallback(async () => {
    if (!configured) return;
    try {
      const [f, g] = await Promise.all([listFriends(), listIncomingGifts()]);
      setFriends(f);
      setGifts(g);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load friends.");
    }
  }, [configured]);

  const syncFromCloud = useCallback(async () => {
    const cloud = await pullCloudSave();
    if (cloud) replaceState(cloud);
  }, [replaceState]);

  const bootstrap = useCallback(async () => {
    if (!configured) {
      setReady(true);
      return;
    }
    try {
      const me = await fetchMyPlayer();
      setPlayer(me);
      if (me && state && !syncedOnce.current) {
        syncedOnce.current = true;
        const next = await migrateOrLoadCloudSave(state);
        replaceState(next);
        await refreshSocial();
      } else if (me) {
        await refreshSocial();
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Online sync failed.");
    } finally {
      setReady(true);
    }
  }, [configured, state, replaceState, refreshSocial]);

  useEffect(() => {
    if (!state) return;
    void bootstrap();
    // only once when state first hydrates
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Boolean(state)]);

  // Debounced cloud push while logged in
  useEffect(() => {
    if (!configured || !player || !state) return;
    if (pushTimer.current) window.clearTimeout(pushTimer.current);
    pushTimer.current = window.setTimeout(() => {
      void pushCloudSave(state).catch(() => {
        /* ignore transient sync errors */
      });
    }, 2000);
    return () => {
      if (pushTimer.current) window.clearTimeout(pushTimer.current);
    };
  }, [configured, player, state]);

  const signUp = useCallback(
    async (username: string, pin: string, displayName: string) => {
      setBusy(true);
      setError(null);
      try {
        const { player: created } = await signUpAccount({
          username,
          pin,
          displayName,
        });
        if (state) await pushCloudSave(state);
        setPlayer(created);
        syncedOnce.current = true;
        await refreshSocial();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Sign up failed.");
        throw e;
      } finally {
        setBusy(false);
      }
    },
    [state, refreshSocial],
  );

  const signIn = useCallback(
    async (username: string, pin: string) => {
      setBusy(true);
      setError(null);
      try {
        await signInAccount({ username, pin });
        const me = await fetchMyPlayer();
        setPlayer(me);
        if (state) {
          const next = await migrateOrLoadCloudSave(state);
          replaceState(next);
        }
        syncedOnce.current = true;
        await refreshSocial();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Sign in failed.");
        throw e;
      } finally {
        setBusy(false);
      }
    },
    [state, replaceState, refreshSocial],
  );

  const signOut = useCallback(async () => {
    await signOutAccount();
    setPlayer(null);
    setFriends([]);
    setGifts([]);
    syncedOnce.current = false;
  }, []);

  const addFriend = useCallback(
    async (code: string) => {
      setBusy(true);
      setError(null);
      try {
        await addFriendByCode(code);
        await refreshSocial();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not add friend.");
        throw e;
      } finally {
        setBusy(false);
      }
    },
    [refreshSocial],
  );

  const acceptFriend = useCallback(
    async (friendshipId: string) => {
      setBusy(true);
      setError(null);
      try {
        await acceptFriendRequest(friendshipId);
        await refreshSocial();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not accept.");
        throw e;
      } finally {
        setBusy(false);
      }
    },
    [refreshSocial],
  );

  const runGift = useCallback(
    async (fn: () => Promise<void>) => {
      if (!state) throw new Error("Game not ready.");
      setBusy(true);
      setError(null);
      try {
        await pushCloudSave(state);
        await fn();
        await syncFromCloud();
        await refreshSocial();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Gift failed.");
        throw e;
      } finally {
        setBusy(false);
      }
    },
    [state, syncFromCloud, refreshSocial],
  );

  const giftGold = useCallback(
    async (toPlayerId: string, amount: number) => {
      if (!state || state.gold < amount) {
        throw new Error("Not enough gold.");
      }
      await runGift(() => sendGoldGift(toPlayerId, amount));
    },
    [state, runGift],
  );

  const giftGear = useCallback(
    async (toPlayerId: string, gearId: string, dupeGold: number) => {
      if (!state?.ownedGear.includes(gearId)) {
        throw new Error("You do not own that gear.");
      }
      await runGift(() => sendGearGift(toPlayerId, gearId, dupeGold));
    },
    [state, runGift],
  );

  const giftPet = useCallback(
    async (toPlayerId: string, petId: string, dupeGold: number) => {
      if (!state?.ownedPets.includes(petId)) {
        throw new Error("You do not own that pet.");
      }
      await runGift(() => sendPetGift(toPlayerId, petId, dupeGold));
    },
    [state, runGift],
  );

  const giftChest = useCallback(
    async (toPlayerId: string, chestId: string) => {
      if (!state?.vaultChests.some((c) => c.id === chestId)) {
        throw new Error("Chest not found in your vault.");
      }
      await runGift(() => sendChestGift(toPlayerId, chestId));
    },
    [state, runGift],
  );

  const claimGift = useCallback(
    async (giftId: string): Promise<ClaimGiftResult> => {
      setBusy(true);
      setError(null);
      try {
        const result = await claimGiftRpc(giftId);
        await syncFromCloud();
        await refreshSocial();
        return result;
      } catch (e) {
        setError(e instanceof Error ? e.message : "Claim failed.");
        throw e;
      } finally {
        setBusy(false);
      }
    },
    [syncFromCloud, refreshSocial],
  );

  return {
    configured,
    ready,
    player,
    friends,
    gifts,
    error,
    setError,
    busy,
    signUp,
    signIn,
    signOut,
    addFriend,
    acceptFriend,
    giftGold,
    giftGear,
    giftPet,
    giftChest,
    claimGift,
    refreshSocial,
  };
}
