-- SourceOS initial schema: workspaces, profiles, suppliers, quotes, samples,
-- purchase orders, WhatsApp messages, and workspace invites.
-- Workspace isolation is enforced via Row Level Security, not just app-level filtering.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- workspaces
-- ---------------------------------------------------------------------------
create table workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner_id uuid not null references auth.users (id) on delete restrict,
  plan text not null default 'starter' check (plan in ('starter', 'growth', 'agency')),
  subscription_status text not null default 'inactive'
    check (subscription_status in ('inactive', 'trialing', 'active', 'past_due', 'canceled')),
  stripe_customer_id text,
  stripe_subscription_id text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- profiles (1:1 with auth.users; workspace_id is null until onboarding)
-- ---------------------------------------------------------------------------
create table profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  name text,
  workspace_id uuid references workspaces (id) on delete set null,
  role text not null default 'member' check (role in ('owner', 'member')),
  created_at timestamptz not null default now()
);

-- Auto-create a profile row whenever a new auth user signs up.
create function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, name)
  values (new.id, new.email, new.raw_user_meta_data ->> 'name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- Helper: current user's workspace_id, bypassing RLS recursion on profiles.
create function current_workspace_id()
returns uuid
language sql
security definer
stable
set search_path = public
as $$
  select workspace_id from public.profiles where id = auth.uid();
$$;

-- Helper: whether the current user is the owner of their workspace.
create function current_user_is_owner()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select role = 'owner' from public.profiles where id = auth.uid();
$$;

-- Atomically create a workspace and attach the calling user as its owner.
create function create_workspace(workspace_name text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  new_workspace_id uuid;
begin
  if exists (select 1 from public.profiles where id = auth.uid() and workspace_id is not null) then
    raise exception 'User already belongs to a workspace';
  end if;

  insert into public.workspaces (name, owner_id)
  values (workspace_name, auth.uid())
  returning id into new_workspace_id;

  update public.profiles
  set workspace_id = new_workspace_id, role = 'owner'
  where id = auth.uid();

  return new_workspace_id;
end;
$$;

-- ---------------------------------------------------------------------------
-- suppliers
-- ---------------------------------------------------------------------------
create table suppliers (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces (id) on delete cascade,
  name text not null,
  location text,
  moq integer,
  lead_time_days integer,
  contact_email text,
  contact_phone text,
  whatsapp_number text,
  whatsapp_connected boolean not null default false,
  notes text,
  communication_log jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- quotes
-- ---------------------------------------------------------------------------
create table quotes (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces (id) on delete cascade,
  supplier_id uuid not null references suppliers (id) on delete cascade,
  product_name text not null,
  unit_price numeric(12, 2) not null,
  currency text not null default 'USD',
  moq integer,
  lead_time_days integer,
  date_received date not null default current_date,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'rejected')),
  notes text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- samples
-- ---------------------------------------------------------------------------
create table samples (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces (id) on delete cascade,
  supplier_id uuid not null references suppliers (id) on delete cascade,
  product_name text not null,
  revision integer not null default 1,
  status text not null default 'requested'
    check (status in ('requested', 'in_transit', 'received', 'approved', 'rejected')),
  notes text,
  photo_urls text[] not null default '{}',
  date_updated timestamptz not null default now(),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- purchase_orders
-- ---------------------------------------------------------------------------
create table purchase_orders (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces (id) on delete cascade,
  supplier_id uuid not null references suppliers (id) on delete cascade,
  product_name text not null,
  total_amount numeric(12, 2) not null,
  currency text not null default 'USD',
  deposit_amount numeric(12, 2) not null default 0,
  deposit_paid boolean not null default false,
  deposit_due_date date,
  balance_amount numeric(12, 2) not null default 0,
  balance_paid boolean not null default false,
  balance_due_date date,
  stage text not null default 'quoting'
    check (stage in ('quoting', 'sampling', 'deposit_paid', 'in_production', 'shipping', 'delivered')),
  order_date date not null default current_date,
  target_delivery_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Computed overdue status: true if a due date has passed for an unpaid
-- milestone and the PO hasn't reached 'delivered'.
create view purchase_orders_with_status as
select
  po.*,
  (
    po.stage <> 'delivered'
    and (
      (po.deposit_due_date is not null and not po.deposit_paid and po.deposit_due_date < current_date)
      or (po.balance_due_date is not null and not po.balance_paid and po.balance_due_date < current_date)
    )
  ) as is_overdue
from purchase_orders po;

alter view purchase_orders_with_status set (security_invoker = on);

-- ---------------------------------------------------------------------------
-- whatsapp_messages
-- ---------------------------------------------------------------------------
create table whatsapp_messages (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces (id) on delete cascade,
  supplier_id uuid not null references suppliers (id) on delete cascade,
  direction text not null check (direction in ('inbound', 'outbound')),
  body text not null,
  "timestamp" timestamptz not null default now(),
  synced_via text not null default 'api' check (synced_via in ('api', 'manual'))
);

-- ---------------------------------------------------------------------------
-- workspace_invites (pending invitations by email, consumed on signup)
-- ---------------------------------------------------------------------------
create table workspace_invites (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces (id) on delete cascade,
  email text not null,
  invited_by uuid not null references auth.users (id),
  created_at timestamptz not null default now(),
  unique (workspace_id, email)
);

-- ---------------------------------------------------------------------------
-- indexes
-- ---------------------------------------------------------------------------
create index suppliers_workspace_id_idx on suppliers (workspace_id);
create index quotes_workspace_id_idx on quotes (workspace_id);
create index quotes_supplier_id_idx on quotes (supplier_id);
create index quotes_product_name_idx on quotes (workspace_id, product_name);
create index samples_workspace_id_idx on samples (workspace_id);
create index samples_supplier_id_idx on samples (supplier_id);
create index purchase_orders_workspace_id_idx on purchase_orders (workspace_id);
create index purchase_orders_supplier_id_idx on purchase_orders (supplier_id);
create index whatsapp_messages_workspace_id_idx on whatsapp_messages (workspace_id);
create index whatsapp_messages_supplier_id_idx on whatsapp_messages (supplier_id);
create index profiles_workspace_id_idx on profiles (workspace_id);

-- ---------------------------------------------------------------------------
-- updated_at maintenance
-- ---------------------------------------------------------------------------
create function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger suppliers_set_updated_at before update on suppliers
  for each row execute function set_updated_at();
create trigger purchase_orders_set_updated_at before update on purchase_orders
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table workspaces enable row level security;
alter table profiles enable row level security;
alter table suppliers enable row level security;
alter table quotes enable row level security;
alter table samples enable row level security;
alter table purchase_orders enable row level security;
alter table whatsapp_messages enable row level security;
alter table workspace_invites enable row level security;

-- workspaces: members can read their own workspace; only the owner can update
-- billing/settings fields or delete the workspace. Creation goes through the
-- create_workspace() RPC (security definer), so no direct insert policy.
create policy "workspace members can view their workspace"
  on workspaces for select
  using (id = current_workspace_id());

create policy "workspace owner can update their workspace"
  on workspaces for update
  using (id = current_workspace_id() and current_user_is_owner());

create policy "workspace owner can delete their workspace"
  on workspaces for delete
  using (id = current_workspace_id() and current_user_is_owner());

-- profiles: members can view profiles in their workspace; users can update
-- their own name; only the owner can change roles or remove members.
create policy "users can view own profile"
  on profiles for select
  using (id = auth.uid());

create policy "workspace members can view teammate profiles"
  on profiles for select
  using (workspace_id is not null and workspace_id = current_workspace_id());

create policy "users can update own profile name"
  on profiles for update
  using (id = auth.uid())
  with check (id = auth.uid());

create policy "owner can manage teammate membership"
  on profiles for update
  using (workspace_id = current_workspace_id() and current_user_is_owner());

-- suppliers / quotes / samples / purchase_orders / whatsapp_messages:
-- standard workspace-scoped CRUD for any member.
create policy "workspace members can view suppliers"
  on suppliers for select using (workspace_id = current_workspace_id());
create policy "workspace members can insert suppliers"
  on suppliers for insert with check (workspace_id = current_workspace_id());
create policy "workspace members can update suppliers"
  on suppliers for update using (workspace_id = current_workspace_id());
create policy "workspace members can delete suppliers"
  on suppliers for delete using (workspace_id = current_workspace_id());

create policy "workspace members can view quotes"
  on quotes for select using (workspace_id = current_workspace_id());
create policy "workspace members can insert quotes"
  on quotes for insert with check (workspace_id = current_workspace_id());
create policy "workspace members can update quotes"
  on quotes for update using (workspace_id = current_workspace_id());
create policy "workspace members can delete quotes"
  on quotes for delete using (workspace_id = current_workspace_id());

create policy "workspace members can view samples"
  on samples for select using (workspace_id = current_workspace_id());
create policy "workspace members can insert samples"
  on samples for insert with check (workspace_id = current_workspace_id());
create policy "workspace members can update samples"
  on samples for update using (workspace_id = current_workspace_id());
create policy "workspace members can delete samples"
  on samples for delete using (workspace_id = current_workspace_id());

create policy "workspace members can view purchase orders"
  on purchase_orders for select using (workspace_id = current_workspace_id());
create policy "workspace members can insert purchase orders"
  on purchase_orders for insert with check (workspace_id = current_workspace_id());
create policy "workspace members can update purchase orders"
  on purchase_orders for update using (workspace_id = current_workspace_id());
create policy "workspace members can delete purchase orders"
  on purchase_orders for delete using (workspace_id = current_workspace_id());

create policy "workspace members can view whatsapp messages"
  on whatsapp_messages for select using (workspace_id = current_workspace_id());
create policy "workspace members can insert whatsapp messages"
  on whatsapp_messages for insert with check (workspace_id = current_workspace_id());

-- workspace_invites: owner-only.
create policy "owner can view invites"
  on workspace_invites for select
  using (workspace_id = current_workspace_id() and current_user_is_owner());
create policy "owner can create invites"
  on workspace_invites for insert
  with check (workspace_id = current_workspace_id() and current_user_is_owner());
create policy "owner can delete invites"
  on workspace_invites for delete
  using (workspace_id = current_workspace_id() and current_user_is_owner());

-- Let a newly-signed-up user consume an invite addressed to their email,
-- attaching them to that workspace as a member (mirrors create_workspace()).
create function accept_workspace_invite(invite_email text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  matched_invite workspace_invites%rowtype;
begin
  if exists (select 1 from public.profiles where id = auth.uid() and workspace_id is not null) then
    raise exception 'User already belongs to a workspace';
  end if;

  select * into matched_invite
  from public.workspace_invites
  where email = invite_email
  order by created_at desc
  limit 1;

  if matched_invite.id is null then
    raise exception 'No pending invite for this email';
  end if;

  update public.profiles
  set workspace_id = matched_invite.workspace_id, role = 'member'
  where id = auth.uid();

  delete from public.workspace_invites where id = matched_invite.id;

  return matched_invite.workspace_id;
end;
$$;
