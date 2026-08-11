import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

export function isOnlineConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

export function getSupabase(): SupabaseClient | null {
  if (!isOnlineConfigured()) return null;
  if (client) return client;
  client = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    },
  );
  return client;
}

/** Synthetic email so kids can use username + PIN with Supabase Auth. */
export function usernameToEmail(username: string): string {
  const clean = username.trim().toLowerCase().replace(/[^a-z0-9_]/g, "");
  return `${clean}@choregame.players`;
}

export function makeFriendCode(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return code;
}
