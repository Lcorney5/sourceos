-- Public waitlist capture for the marketing landing page.
create table waitlist_signups (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);

alter table waitlist_signups enable row level security;

-- Anonymous visitors may join the waitlist but never read it back.
create policy "anyone can join the waitlist"
  on waitlist_signups for insert
  with check (true);
