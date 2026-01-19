-- Valor Home Improvement: Admin allowlist + Leads tables
--
-- How to run:
-- 1) Supabase Dashboard -> SQL Editor -> New query
-- 2) Paste this file and Run
--
-- This creates:
-- - public.admins (email allowlist for admin UI)
-- - public.leads  (public estimate requests)
--
-- Security:
-- - Anyone (anon/authenticated) can INSERT into leads (public website form)
-- - Only allowlisted admins can SELECT/UPDATE leads
-- - Authenticated users can SELECT their own row in admins (used for admin check)

create extension if not exists pgcrypto;

-- Admin allowlist
create table if not exists public.admins (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email text unique not null
);

-- Leads / estimate requests
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text,
  phone text,
  preferred_contact text not null default 'phone',
  address text,
  city text,
  zip text,
  services text[] not null default '{}',
  notes text,
  preferred_times text[],
  status text not null default 'new',
  admin_notes text
);

create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_status_idx on public.leads (status);

-- Row Level Security
alter table public.admins enable row level security;
alter table public.leads enable row level security;

-- ADMINS policies: authenticated users can read ONLY their own allowlist row
-- (so the app can check whether they are an admin)
drop policy if exists "admins_select_self" on public.admins;
create policy "admins_select_self"
on public.admins
for select
to authenticated
using ((auth.jwt() ->> 'email') = email);

-- LEADS policies
-- Public website form can insert a lead (no auth required)
drop policy if exists "leads_insert_public" on public.leads;
create policy "leads_insert_public"
on public.leads
for insert
to anon, authenticated
with check (true);

-- Only allowlisted admins can view leads
drop policy if exists "leads_select_admin" on public.leads;
create policy "leads_select_admin"
on public.leads
for select
to authenticated
using (
  exists (
    select 1 from public.admins a
    where a.email = (auth.jwt() ->> 'email')
  )
);

-- Only allowlisted admins can update leads (status/admin_notes)
drop policy if exists "leads_update_admin" on public.leads;
create policy "leads_update_admin"
on public.leads
for update
to authenticated
using (
  exists (
    select 1 from public.admins a
    where a.email = (auth.jwt() ->> 'email')
  )
)
with check (
  exists (
    select 1 from public.admins a
    where a.email = (auth.jwt() ->> 'email')
  )
);
