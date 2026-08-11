-- Run this in Supabase SQL Editor if you already ran the original schema.sql
-- Expands gifts to support gold, gear, pets, and chests.

alter table public.gifts
  alter column gold drop not null;

alter table public.gifts
  drop constraint if exists gifts_gold_check;

alter table public.gifts
  add column if not exists gift_type text not null default 'gold';

alter table public.gifts
  add column if not exists gear_id text;

alter table public.gifts
  add column if not exists pet_id text;

alter table public.gifts
  add column if not exists chest_json jsonb;

alter table public.gifts
  add column if not exists dupe_gold int not null default 25;

update public.gifts set gift_type = 'gold' where gift_type is null or gift_type = '';

alter table public.gifts drop constraint if exists gifts_type_check;
alter table public.gifts
  add constraint gifts_type_check check (
    gift_type in ('gold', 'gear', 'pet', 'chest')
  );

-- Keep send_gold_gift working with gift_type
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

  insert into public.gifts (from_id, to_id, gift_type, gold)
  values (auth.uid(), p_to_player_id, 'gold', p_amount)
  returning * into created;
  return created;
end;
$$;

create or replace function public.send_gear_gift(
  p_to_player_id uuid,
  p_gear_id text,
  p_dupe_gold int default 25
)
returns public.gifts
language plpgsql
security definer
set search_path = public
as $$
declare
  sender public.players%rowtype;
  owned jsonb;
  equipped jsonb;
  slot text;
  created public.gifts%rowtype;
begin
  if p_gear_id is null or length(trim(p_gear_id)) = 0 then
    raise exception 'Pick a gear piece to gift';
  end if;
  if not public.are_friends(auth.uid(), p_to_player_id) then
    raise exception 'You can only gift friends';
  end if;

  select * into sender from public.players where id = auth.uid() for update;
  owned := coalesce(sender.save_json->'ownedGear', '[]'::jsonb);
  if not exists (
    select 1 from jsonb_array_elements_text(owned) x where x = p_gear_id
  ) then
    raise exception 'You do not own that gear';
  end if;

  -- remove from ownedGear
  owned := (
    select coalesce(jsonb_agg(to_jsonb(x)), '[]'::jsonb)
    from jsonb_array_elements_text(owned) x
    where x <> p_gear_id
  );

  -- unequip if worn
  equipped := coalesce(sender.save_json->'equipped', '{}'::jsonb);
  for slot in select * from jsonb_object_keys(equipped)
  loop
    if equipped ->> slot = p_gear_id then
      equipped := jsonb_set(equipped, array[slot], 'null'::jsonb, true);
    end if;
  end loop;

  update public.players
  set save_json = sender.save_json
      || jsonb_build_object('ownedGear', owned, 'equipped', equipped),
      updated_at = now()
  where id = auth.uid();

  insert into public.gifts (from_id, to_id, gift_type, gold, gear_id, dupe_gold)
  values (auth.uid(), p_to_player_id, 'gear', null, p_gear_id, greatest(coalesce(p_dupe_gold, 25), 1))
  returning * into created;
  return created;
end;
$$;

create or replace function public.send_pet_gift(
  p_to_player_id uuid,
  p_pet_id text,
  p_dupe_gold int default 28
)
returns public.gifts
language plpgsql
security definer
set search_path = public
as $$
declare
  sender public.players%rowtype;
  owned jsonb;
  progress jsonb;
  save jsonb;
  created public.gifts%rowtype;
begin
  if p_pet_id is null or length(trim(p_pet_id)) = 0 then
    raise exception 'Pick a pet to gift';
  end if;
  if not public.are_friends(auth.uid(), p_to_player_id) then
    raise exception 'You can only gift friends';
  end if;

  select * into sender from public.players where id = auth.uid() for update;
  owned := coalesce(sender.save_json->'ownedPets', '[]'::jsonb);
  if not exists (
    select 1 from jsonb_array_elements_text(owned) x where x = p_pet_id
  ) then
    raise exception 'You do not own that pet';
  end if;

  owned := (
    select coalesce(jsonb_agg(to_jsonb(x)), '[]'::jsonb)
    from jsonb_array_elements_text(owned) x
    where x <> p_pet_id
  );

  save := sender.save_json || jsonb_build_object('ownedPets', owned);
  if save->>'equippedPet' = p_pet_id then
    save := jsonb_set(save, '{equippedPet}', 'null'::jsonb, true);
  end if;

  progress := coalesce(save->'petProgress', '{}'::jsonb) - p_pet_id;
  save := jsonb_set(save, '{petProgress}', progress, true);

  update public.players
  set save_json = save, updated_at = now()
  where id = auth.uid();

  insert into public.gifts (from_id, to_id, gift_type, gold, pet_id, dupe_gold)
  values (auth.uid(), p_to_player_id, 'pet', null, p_pet_id, greatest(coalesce(p_dupe_gold, 28), 1))
  returning * into created;
  return created;
end;
$$;

create or replace function public.send_chest_gift(
  p_to_player_id uuid,
  p_chest_id text
)
returns public.gifts
language plpgsql
security definer
set search_path = public
as $$
declare
  sender public.players%rowtype;
  chests jsonb;
  kept jsonb := '[]'::jsonb;
  found jsonb;
  elem jsonb;
  created public.gifts%rowtype;
begin
  if p_chest_id is null or length(trim(p_chest_id)) = 0 then
    raise exception 'Pick a chest to gift';
  end if;
  if not public.are_friends(auth.uid(), p_to_player_id) then
    raise exception 'You can only gift friends';
  end if;

  select * into sender from public.players where id = auth.uid() for update;
  chests := coalesce(sender.save_json->'vaultChests', '[]'::jsonb);

  for elem in select * from jsonb_array_elements(chests)
  loop
    if elem->>'id' = p_chest_id then
      found := elem;
    else
      kept := kept || jsonb_build_array(elem);
    end if;
  end loop;

  if found is null then
    raise exception 'Chest not found in your vault';
  end if;

  update public.players
  set save_json = jsonb_set(sender.save_json, '{vaultChests}', kept, true),
      updated_at = now()
  where id = auth.uid();

  insert into public.gifts (from_id, to_id, gift_type, gold, chest_json)
  values (auth.uid(), p_to_player_id, 'chest', null, found)
  returning * into created;
  return created;
end;
$$;

-- Claim any gift type; returns jsonb summary (drop old int-returning overload)
drop function if exists public.claim_gift(uuid);
create or replace function public.claim_gift(p_gift_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  g public.gifts%rowtype;
  receiver public.players%rowtype;
  save jsonb;
  current_gold int;
  owned jsonb;
  chests jsonb;
  result jsonb;
begin
  select * into g from public.gifts where id = p_gift_id for update;
  if g.id is null or g.to_id <> auth.uid() then
    raise exception 'Gift not found';
  end if;
  if g.claimed then
    raise exception 'Gift already claimed';
  end if;

  select * into receiver from public.players where id = auth.uid() for update;
  save := receiver.save_json;
  current_gold := coalesce((save->>'gold')::int, 0);

  if coalesce(g.gift_type, 'gold') = 'gold' then
    current_gold := current_gold + coalesce(g.gold, 0);
    save := jsonb_set(save, '{gold}', to_jsonb(current_gold), true);
    result := jsonb_build_object('kind', 'gold', 'gold', g.gold);

  elsif g.gift_type = 'gear' then
    owned := coalesce(save->'ownedGear', '[]'::jsonb);
    if exists (select 1 from jsonb_array_elements_text(owned) x where x = g.gear_id) then
      current_gold := current_gold + coalesce(g.dupe_gold, 25);
      save := jsonb_set(save, '{gold}', to_jsonb(current_gold), true);
      result := jsonb_build_object('kind', 'gear-dupe', 'gold', g.dupe_gold, 'gearId', g.gear_id);
    else
      owned := owned || to_jsonb(g.gear_id);
      save := jsonb_set(save, '{ownedGear}', owned, true);
      result := jsonb_build_object('kind', 'gear', 'gearId', g.gear_id);
    end if;

  elsif g.gift_type = 'pet' then
    owned := coalesce(save->'ownedPets', '[]'::jsonb);
    if exists (select 1 from jsonb_array_elements_text(owned) x where x = g.pet_id) then
      current_gold := current_gold + coalesce(g.dupe_gold, 28);
      save := jsonb_set(save, '{gold}', to_jsonb(current_gold), true);
      result := jsonb_build_object('kind', 'pet-dupe', 'gold', g.dupe_gold, 'petId', g.pet_id);
    else
      owned := owned || to_jsonb(g.pet_id);
      save := jsonb_set(save, '{ownedPets}', owned, true);
      save := jsonb_set(save, '{petsUnlocked}', 'true'::jsonb, true);
      result := jsonb_build_object('kind', 'pet', 'petId', g.pet_id);
    end if;

  elsif g.gift_type = 'chest' then
    if g.chest_json is null then
      raise exception 'Chest gift is empty';
    end if;
    chests := coalesce(save->'vaultChests', '[]'::jsonb) || jsonb_build_array(g.chest_json);
    save := jsonb_set(save, '{vaultChests}', chests, true);
    result := jsonb_build_object('kind', 'chest', 'chest', g.chest_json);

  else
    raise exception 'Unknown gift type';
  end if;

  update public.players
  set save_json = save, updated_at = now()
  where id = auth.uid();

  update public.gifts set claimed = true where id = g.id;
  return result;
end;
$$;

grant execute on function public.send_gold_gift(uuid, int) to authenticated;
grant execute on function public.send_gear_gift(uuid, text, int) to authenticated;
grant execute on function public.send_pet_gift(uuid, text, int) to authenticated;
grant execute on function public.send_chest_gift(uuid, text) to authenticated;
grant execute on function public.claim_gift(uuid) to authenticated;
