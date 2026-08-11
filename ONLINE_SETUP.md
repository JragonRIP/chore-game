# Online setup (accounts, friends, gifts)

The game works offline without this. Follow these steps only when you want cloud saves + friends.

## 1. Create a Supabase project

1. Go to [https://supabase.com](https://supabase.com) and create a free project.
2. Open **Project Settings → API**.
3. Copy **Project URL** and **anon public** key.

## 2. Add env vars

In the project root, create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

Restart `npm run dev` after saving.

## 3. Run the database schema

**New project:** paste and run everything from `supabase/schema.sql`.

**Existing project** (already ran an older schema): run `supabase/migration_gifts_v2.sql` instead — it adds gear/pet/chest gifts and updates claim.

1. In Supabase, open **SQL Editor → New query**.
2. Paste the file contents.
3. Click **Run**.

## 4. Turn off email confirmation

Kids sign in with **username + PIN** (we use a synthetic email under the hood).

1. **Authentication → Providers → Email**
2. Disable **Confirm email**
3. Save

## 5. Test with 2 accounts

1. Open the app → tap the hero portrait → **Friends**.
2. **Create account** (username + 4–8 digit PIN). Your current progress uploads automatically.
3. Copy your **friend code**.
4. On another browser/device (or incognito), create a second account.
5. Add each other with friend codes → **Accept**.
6. Gift **gold / gear / pet / chest** → other account **Claims** it.

## Gift rules

- Gold: 1–500, deducted from the sender.
- Gear / pet: removed from your inventory (unequipped if worn). Dupes on claim convert to gold.
- Chest: unopened vault chests only — moves to the friend’s vault.

## Notes

- First login with an empty cloud save **keeps** your local progress.
- Signing into an account that already has cloud progress **loads the cloud save**.
- Gifts only work between accepted friends.

## Troubleshooting

| Issue | Fix |
|---|---|
| “Online play isn’t set up” | Missing `.env.local` or forgot to restart dev server |
| Sign up fails / email error | Confirm email must be **disabled** |
| Tables / RPC missing | Re-run `schema.sql` (or `migration_gifts_v2.sql` if upgrading) |
| Gift “Not enough gold” | Earn/sync gold first; cloud save must match local |
| Gear/pet/chest gift RPC missing | Run `migration_gifts_v2.sql` |
