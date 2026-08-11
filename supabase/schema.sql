-- Chore Game online: run this in Supabase → SQL Editor → New query → Run
-- Then: Authentication → Providers → Email → disable "Confirm email"

-- Profiles linked to auth.users
create table if not exists public.players (
  id uuid primary key references auth.users (id) on delete cascade,
  username text not null unique,
  display_name text not null,
  friend_code text not null unique,
  save_json jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create index if not exists players_friend_code_idx on public.players (friend_code);
create index if not exists players_username_idx on public.players (username);

create table if not exists public.friendships (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null references public.players (id) on delete cascade,
  addressee_id uuid not null references public.players (id) on delete cascade,
  status text not null check (status in ('pending', 'accepted')),
  created_at timestamptz not null default now(),
  unique (requester_id, addressee_id),
  check (requester_id <> addressee_id)
);

create index if not exists friendships_requester_idx on public.friendships (requester_id);
create index if not exists friendships_addressee_idx on public.friendships (addressee_id);

create table if not exists public.gifts (
  id uuid primary key default gen_random_uuid(),
  from_id uuid not null references public.players (id) on delete cascade,
  to_id uuid not null references public.players (id) on delete cascade,
  gold int not null check (gold > 0 and gold <= 500),
  claimed boolean not null default false,
  created_at timestamptz not null default now(),
  check (from_id <> to_id)
);

create index if not exists gifts_to_unclaimed_idx on public.gifts (to_id) where claimed = false;

alter table public.players enable row level security;
alter table public.friendships enable row level security;
alter table public.gifts enable row level security;

-- Players: read own + limited public fields for everyone authenticated
drop policy if exists "players_select" on public.players;
create policy "players_select" on public.players
  for select to authenticated
  using (true);

drop policy if exists "players_insert_own" on public.players;
create policy "players_insert_own" on public.players
  for insert to authenticated
  with check (auth.uid() = id);

drop policy if exists "players_update_own" on public.players;
create policy "players_update_own" on public.players
  for update to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Friendships
drop policy if exists "friendships_select" on public.friendships;
create policy "friendships_select" on public.friendships
  for select to authenticated
  using (auth.uid() = requester_id or auth.uid() = addressee_id);

drop policy if exists "friendships_insert" on public.friendships;
create policy "friendships_insert" on public.friendships
  for insert to authenticated
  with check (auth.uid() = requester_id);

drop policy if exists "friendships_update" on public.friendships;
create policy "friendships_update" on public.friendships
  for update to authenticated
  using (auth.uid() = addressee_id or auth.uid() = requester_id);

-- Gifts
drop policy if exists "gifts_select" on public.gifts;
create policy "gifts_select" on public.gifts
  for select to authenticated
  using (auth.uid() = from_id or auth.uid() = to_id);

-- Helper: are two players friends?
create or replace function public.are_friends(a uuid, b uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.friendships f
    where f.status = 'accepted'
      and (
        (f.requester_id = a and f.addressee_id = b)
        or (f.requester_id = b and f.addressee_id = a)
      )
  );
$$;

-- Upsert cloud save
create or replace function public.upsert_save(p_save jsonb)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.players
  set save_json = p_save, updated_at = now()
  where id = auth.uid();
end;
$$;

-- Request friend by code
create or replace function public.request_friend(p_friend_code text)
returns public.friendships
language plpgsql
security definer
set search_path = public
as $$
declare
  target public.players%rowtype;
  existing public.friendships%rowtype;
  created public.friendships%rowtype;
begin
  select * into target from public.players
  where upper(friend_code) = upper(trim(p_friend_code));
  if target.id is null then
    raise exception 'No player with that friend code';
  end if;
  if target.id = auth.uid() then
    raise exception 'You cannot friend yourself';
  end if;

  select * into existing from public.friendships
  where (requester_id = auth.uid() and addressee_id = target.id)
     or (requester_id = target.id and addressee_id = auth.uid());

  if existing.id is not null then
    if existing.status = 'accepted' then
      raise exception 'Already friends';
    end if;
    -- If they already requested you, accept
    if existing.addressee_id = auth.uid() and existing.status = 'pending' then
      update public.friendships set status = 'accepted' where id = existing.id
      returning * into created;
      return created;
    end if;
    raise exception 'Friend request already pending';
  end if;

  insert into public.friendships (requester_id, addressee_id, status)
  values (auth.uid(), target.id, 'pending')
  returning * into created;
  return created;
end;
$$;

create or replace function public.accept_friend(p_friendship_id uuid)
returns public.friendships
language plpgsql
security definer
set search_path = public
as $$
declare
  row public.friendships%rowtype;
begin
  update public.friendships
  set status = 'accepted'
  where id = p_friendship_id
    and addressee_id = auth.uid()
    and status = 'pending'
  returning * into row;
  if row.id is null then
    raise exception 'Friend request not found';
  end if;
  return row;
end;
$$;

-- Send gold gift (deducts from sender cloud save)
create or replace function public.send_gold_gift(p_to_player_id uuid, p_amount int)
returns public.gifts
language plpgsql
security definer
set search_path = public
as $$
declare
  sender public.players%rowtype;
  current_gold int;
  created public.gifts%rowtype;
begin
  if p_amount is null or p_amount < 1 or p_amount > 500 then
    raise exception 'Gift must be between 1 and 500 gold';
  end if;
  if not public.are_friends(auth.uid(), p_to_player_id) then
    raise exception 'You can only gift friends';
  end if;

  select * into sender from public.players where id = auth.uid() for update;
  current_gold := coalesce((sender.save_json->>'gold')::int, 0);
  if current_gold < p_amount then
    raise exception 'Not enough gold';
  end if;

  update public.players
  set save_json = jsonb_set(save_json, '{gold}', to_jsonb(current_gold - p_amount), true),
      updated_at = now()
  where id = auth.uid();

  insert into public.gifts (from_id, to_id, gold)
  values (auth.uid(), p_to_player_id, p_amount)
  returning * into created;
  return created;
end;
$$;

-- Claim gift (adds gold to receiver cloud save)
create or replace function public.claim_gift(p_gift_id uuid)
returns int
language plpgsql
security definer
set search_path = public
as $$
declare
  g public.gifts%rowtype;
  receiver public.players%rowtype;
  current_gold int;
begin
  select * into g from public.gifts where id = p_gift_id for update;
  if g.id is null or g.to_id <> auth.uid() then
    raise exception 'Gift not found';
  end if;
  if g.claimed then
    raise exception 'Gift already claimed';
  end if;

  select * into receiver from public.players where id = auth.uid() for update;
  current_gold := coalesce((receiver.save_json->>'gold')::int, 0);

  update public.players
  set save_json = jsonb_set(save_json, '{gold}', to_jsonb(current_gold + g.gold), true),
      updated_at = now()
  where id = auth.uid();

  update public.gifts set claimed = true where id = g.id;
  return g.gold;
end;
$$;

grant execute on function public.upsert_save(jsonb) to authenticated;
grant execute on function public.request_friend(text) to authenticated;
grant execute on function public.accept_friend(uuid) to authenticated;
grant execute on function public.send_gold_gift(uuid, int) to authenticated;
grant execute on function public.claim_gift(uuid) to authenticated;
grant execute on function public.are_friends(uuid, uuid) to authenticated;
