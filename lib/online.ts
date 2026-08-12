import type { GameState, VaultChest } from "@/lib/types";
import {
  getSupabase,
  makeFriendCode,
  usernameToEmail,
} from "@/lib/supabase";
import { normalizeState, weekKey } from "@/lib/math";
import { loadGame } from "@/lib/storage";

export type PlayerRow = {
  id: string;
  username: string;
  display_name: string;
  friend_code: string;
  save_json: unknown;
  updated_at: string;
};

export type FriendEntry = {
  friendshipId: string;
  playerId: string;
  username: string;
  displayName: string;
  friendCode: string;
  status: "pending" | "accepted";
  incoming: boolean;
  weeklyQuests?: number;
  streakDays?: number;
};

export type LeaderboardRow = {
  playerId: string;
  displayName: string;
  weeklyQuests: number;
  streakDays: number;
  isYou: boolean;
};

export type GiftType = "gold" | "gear" | "pet" | "chest";

export type GiftRow = {
  id: string;
  from_id: string;
  to_id: string;
  gift_type: GiftType;
  gold: number | null;
  gear_id: string | null;
  pet_id: string | null;
  chest_json: VaultChest | null;
  dupe_gold: number;
  claimed: boolean;
  created_at: string;
  from_name?: string;
};

export type ClaimGiftResult =
  | { kind: "gold"; gold: number }
  | { kind: "gear"; gearId: string }
  | { kind: "gear-dupe"; gold: number; gearId: string }
  | { kind: "pet"; petId: string }
  | { kind: "pet-dupe"; gold: number; petId: string }
  | { kind: "chest"; chest: VaultChest };

function sb() {
  const c = getSupabase();
  if (!c) throw new Error("Online play is not configured yet.");
  return c;
}

export async function getSessionUserId(): Promise<string | null> {
  const c = getSupabase();
  if (!c) return null;
  const { data } = await c.auth.getSession();
  return data.session?.user.id ?? null;
}

export async function signUpAccount(input: {
  username: string;
  pin: string;
  displayName: string;
}): Promise<{ player: PlayerRow }> {
  const username = input.username.trim().toLowerCase().replace(/[^a-z0-9_]/g, "");
  if (username.length < 3) throw new Error("Username needs at least 3 letters.");
  if (!/^\d{4,8}$/.test(input.pin)) {
    throw new Error("PIN must be 4–8 digits.");
  }
  const email = usernameToEmail(username);
  const c = sb();
  const { data, error } = await c.auth.signUp({
    email,
    password: input.pin,
  });
  if (error) throw new Error(error.message);
  const userId = data.user?.id;
  if (!userId) throw new Error("Could not create account.");

  let friendCode = makeFriendCode();
  for (let i = 0; i < 5; i++) {
    const { data: row, error: insertErr } = await c
      .from("players")
      .insert({
        id: userId,
        username,
        display_name: input.displayName.trim() || username,
        friend_code: friendCode,
        save_json: {},
      })
      .select("*")
      .single();
    if (!insertErr && row) return { player: row as PlayerRow };
    if (insertErr?.code === "23505") {
      friendCode = makeFriendCode();
      continue;
    }
    throw new Error(insertErr?.message ?? "Could not create player profile.");
  }
  throw new Error("Could not assign a friend code. Try again.");
}

export async function signInAccount(input: {
  username: string;
  pin: string;
}): Promise<void> {
  const username = input.username.trim().toLowerCase().replace(/[^a-z0-9_]/g, "");
  const { error } = await sb().auth.signInWithPassword({
    email: usernameToEmail(username),
    password: input.pin,
  });
  if (error) throw new Error("Wrong username or PIN.");
}

export async function signOutAccount(): Promise<void> {
  const c = getSupabase();
  if (!c) return;
  await c.auth.signOut();
}

export async function fetchMyPlayer(): Promise<PlayerRow | null> {
  const c = getSupabase();
  if (!c) return null;
  const uid = await getSessionUserId();
  if (!uid) return null;
  const { data, error } = await c
    .from("players")
    .select("*")
    .eq("id", uid)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return (data as PlayerRow) ?? null;
}

export async function pushCloudSave(state: GameState): Promise<void> {
  const { error } = await sb().rpc("upsert_save", { p_save: state });
  if (error) throw new Error(error.message);
}

export async function pullCloudSave(): Promise<GameState | null> {
  const player = await fetchMyPlayer();
  if (!player) return null;
  const raw = player.save_json;
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const obj = raw as Record<string, unknown>;
  if (!obj.hero && !obj.hasSeenStory && obj.version == null) return null;
  return normalizeState(raw);
}

/** Prefer the later calendar date string (YYYY-MM-DD). */
function laterDate(
  a: string | null | undefined,
  b: string | null | undefined,
): string | null {
  if (!a) return b ?? null;
  if (!b) return a;
  return a >= b ? a : b;
}

/** First login: keep local progress if cloud is empty. */
export async function migrateOrLoadCloudSave(
  local: GameState,
): Promise<GameState> {
  const cloud = await pullCloudSave();
  if (!cloud || (!cloud.hero && !cloud.hasSeenStory)) {
    await pushCloudSave(local);
    return local;
  }
  // Disk may have a newer daily-chest claim than the in-memory `local`
  // snapshot if the daily gift ran while this fetch was in flight.
  const disk = loadGame();
  const freeChestDate = laterDate(
    laterDate(local.freeChestDate, disk.freeChestDate),
    cloud.freeChestDate,
  );
  if (freeChestDate === cloud.freeChestDate) return cloud;
  return { ...cloud, freeChestDate };
}

export async function listFriends(): Promise<FriendEntry[]> {
  const uid = await getSessionUserId();
  if (!uid) return [];
  const c = sb();
  const { data, error } = await c
    .from("friendships")
    .select("id, status, requester_id, addressee_id")
    .or(`requester_id.eq.${uid},addressee_id.eq.${uid}`);
  if (error) throw new Error(error.message);

  const rows = data ?? [];
  if (rows.length === 0) return [];

  const otherIds = [
    ...new Set(
      rows.map((r) =>
        r.requester_id === uid ? r.addressee_id : r.requester_id,
      ),
    ),
  ];
  const { data: players, error: pErr } = await c
    .from("players")
    .select("id, username, display_name, friend_code, save_json")
    .in("id", otherIds);
  if (pErr) throw new Error(pErr.message);
  const byId = Object.fromEntries((players ?? []).map((p) => [p.id, p]));

  return rows.map((row) => {
    const otherId =
      row.requester_id === uid ? row.addressee_id : row.requester_id;
    const other = byId[otherId];
    const save =
      other?.save_json &&
      typeof other.save_json === "object" &&
      !Array.isArray(other.save_json)
        ? (other.save_json as Record<string, unknown>)
        : null;
    const thisWeek = weekKey();
    const friendWeek =
      typeof save?.weeklyQuestWeek === "string" ? save.weeklyQuestWeek : null;
    return {
      friendshipId: row.id,
      playerId: otherId,
      username: other?.username ?? "?",
      displayName: other?.display_name ?? "Hero",
      friendCode: other?.friend_code ?? "",
      status: row.status as "pending" | "accepted",
      incoming: row.addressee_id === uid && row.status === "pending",
      weeklyQuests:
        friendWeek === thisWeek && typeof save?.weeklyQuests === "number"
          ? save.weeklyQuests
          : 0,
      streakDays: typeof save?.streakDays === "number" ? save.streakDays : 0,
    };
  });
}

/** You + accepted friends, ranked by weekly quests then streak. */
export function buildWeeklyLeaderboard(
  me: { displayName: string; playerId: string },
  state: GameState,
  friends: FriendEntry[],
): LeaderboardRow[] {
  const rows: LeaderboardRow[] = [
    {
      playerId: me.playerId,
      displayName: me.displayName,
      weeklyQuests: state.weeklyQuests ?? 0,
      streakDays: state.streakDays ?? 0,
      isYou: true,
    },
  ];
  for (const f of friends) {
    if (f.status !== "accepted") continue;
    rows.push({
      playerId: f.playerId,
      displayName: f.displayName,
      weeklyQuests: f.weeklyQuests ?? 0,
      streakDays: f.streakDays ?? 0,
      isYou: false,
    });
  }
  return rows.sort((a, b) => {
    if (b.weeklyQuests !== a.weeklyQuests) {
      return b.weeklyQuests - a.weeklyQuests;
    }
    return b.streakDays - a.streakDays;
  });
}

export async function addFriendByCode(friendCode: string): Promise<void> {
  const { error } = await sb().rpc("request_friend", {
    p_friend_code: friendCode.trim().toUpperCase(),
  });
  if (error) throw new Error(error.message);
}

export async function acceptFriendRequest(friendshipId: string): Promise<void> {
  const { error } = await sb().rpc("accept_friend", {
    p_friendship_id: friendshipId,
  });
  if (error) throw new Error(error.message);
}

export async function listIncomingGifts(): Promise<GiftRow[]> {
  const uid = await getSessionUserId();
  if (!uid) return [];
  const c = sb();
  const { data, error } = await c
    .from("gifts")
    .select(
      "id, from_id, to_id, gift_type, gold, gear_id, pet_id, chest_json, dupe_gold, claimed, created_at",
    )
    .eq("to_id", uid)
    .eq("claimed", false)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  const rows = data ?? [];
  if (rows.length === 0) return [];

  const fromIds = [...new Set(rows.map((g) => g.from_id))];
  const { data: players } = await c
    .from("players")
    .select("id, display_name")
    .in("id", fromIds);
  const names = Object.fromEntries(
    (players ?? []).map((p) => [p.id, p.display_name]),
  );

  return rows.map((g) => ({
    id: g.id,
    from_id: g.from_id,
    to_id: g.to_id,
    gift_type: (g.gift_type ?? "gold") as GiftType,
    gold: g.gold,
    gear_id: g.gear_id ?? null,
    pet_id: g.pet_id ?? null,
    chest_json: (g.chest_json as VaultChest | null) ?? null,
    dupe_gold: g.dupe_gold ?? 25,
    claimed: g.claimed,
    created_at: g.created_at,
    from_name: names[g.from_id],
  }));
}

export async function sendGoldGift(
  toPlayerId: string,
  amount: number,
): Promise<void> {
  const { error } = await sb().rpc("send_gold_gift", {
    p_to_player_id: toPlayerId,
    p_amount: amount,
  });
  if (error) throw new Error(error.message);
}

export async function sendGearGift(
  toPlayerId: string,
  gearId: string,
  dupeGold: number,
): Promise<void> {
  const { error } = await sb().rpc("send_gear_gift", {
    p_to_player_id: toPlayerId,
    p_gear_id: gearId,
    p_dupe_gold: dupeGold,
  });
  if (error) throw new Error(error.message);
}

export async function sendPetGift(
  toPlayerId: string,
  petId: string,
  dupeGold: number,
): Promise<void> {
  const { error } = await sb().rpc("send_pet_gift", {
    p_to_player_id: toPlayerId,
    p_pet_id: petId,
    p_dupe_gold: dupeGold,
  });
  if (error) throw new Error(error.message);
}

export async function sendChestGift(
  toPlayerId: string,
  chestId: string,
): Promise<void> {
  const { error } = await sb().rpc("send_chest_gift", {
    p_to_player_id: toPlayerId,
    p_chest_id: chestId,
  });
  if (error) throw new Error(error.message);
}

export async function claimGift(giftId: string): Promise<ClaimGiftResult> {
  const { data, error } = await sb().rpc("claim_gift", {
    p_gift_id: giftId,
  });
  if (error) throw new Error(error.message);
  const raw = data as Record<string, unknown> | null;
  if (!raw || typeof raw !== "object") {
    throw new Error("Unexpected claim response.");
  }
  const kind = String(raw.kind ?? "");
  if (kind === "gold") {
    return { kind: "gold", gold: Number(raw.gold ?? 0) };
  }
  if (kind === "gear") {
    return { kind: "gear", gearId: String(raw.gearId ?? "") };
  }
  if (kind === "gear-dupe") {
    return {
      kind: "gear-dupe",
      gold: Number(raw.gold ?? 0),
      gearId: String(raw.gearId ?? ""),
    };
  }
  if (kind === "pet") {
    return { kind: "pet", petId: String(raw.petId ?? "") };
  }
  if (kind === "pet-dupe") {
    return {
      kind: "pet-dupe",
      gold: Number(raw.gold ?? 0),
      petId: String(raw.petId ?? ""),
    };
  }
  if (kind === "chest") {
    return { kind: "chest", chest: raw.chest as VaultChest };
  }
  throw new Error("Unknown gift claim result.");
}
