-- ==========================================================
-- Palate PWA — Supabase Database Schema & Realtime Setup
-- ==========================================================

-- 1. Table: Live Community Food Check-Ins
create table if not exists public.palate_checkins (
    id text primary key,
    dish_id text not null,
    dish_name text not null,
    venue_name text not null,
    reaction text not null check (reaction in ('GOD_TIER', 'SKIP')),
    note text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Index for speedy timeline queries
create index if not exists idx_palate_checkins_created_at on public.palate_checkins (created_at desc);
create index if not exists idx_palate_checkins_dish_id on public.palate_checkins (dish_id);

-- Enable RLS
alter table public.palate_checkins enable row level security;

-- Allow public read access to check-ins (Anti-Regret Community Radar)
create policy "Public can read check-ins" 
on public.palate_checkins 
for select 
to anon, authenticated 
using (true);

-- Allow public insert of check-ins (1-Tap Check-In from PWA)
create policy "Public can insert check-ins" 
on public.palate_checkins 
for insert 
to anon, authenticated 
with check (true);

-- 2. Table: Merchant Perk Counter Redemptions
create table if not exists public.palate_perk_redemptions (
    id text primary key,
    voucher_code text not null,
    venue_name text not null,
    perk_title text not null,
    redeemed_at timestamp with time zone default timezone('utc'::text, now()) not null,
    cashier_pin_verified boolean default false,
    bill_amount numeric
);

create index if not exists idx_palate_perks_code on public.palate_perk_redemptions (voucher_code);
create index if not exists idx_palate_perks_redeemed_at on public.palate_perk_redemptions (redeemed_at desc);

-- Enable RLS
alter table public.palate_perk_redemptions enable row level security;

create policy "Public can read and verify perks" 
on public.palate_perk_redemptions 
for select 
to anon, authenticated 
using (true);

create policy "Cashiers and users can record redemptions" 
on public.palate_perk_redemptions 
for insert 
to anon, authenticated 
with check (true);

-- 3. Enable Realtime Publications
begin;
  -- Drop existing publications if already present
  drop publication if exists supabase_realtime;
  create publication supabase_realtime for table public.palate_checkins, public.palate_perk_redemptions;
commit;
