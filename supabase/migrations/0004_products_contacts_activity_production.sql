-- Products catalog, Directory contacts, activity log, and per-PO production
-- logs. All workspace-scoped with the same RLS pattern as 0001_init.sql.

-- ---------------------------------------------------------------------------
-- products
-- ---------------------------------------------------------------------------
create table products (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces (id) on delete cascade,
  name text not null,
  sku text,
  category text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index products_workspace_id_idx on products (workspace_id);

create trigger products_set_updated_at before update on products
  for each row execute function set_updated_at();

alter table products enable row level security;

create policy "workspace members can view products"
  on products for select using (workspace_id = current_workspace_id());
create policy "workspace members can insert products"
  on products for insert with check (workspace_id = current_workspace_id());
create policy "workspace members can update products"
  on products for update using (workspace_id = current_workspace_id());
create policy "workspace members can delete products"
  on products for delete using (workspace_id = current_workspace_id());

-- ---------------------------------------------------------------------------
-- contacts (Directory: non-supplier contacts — freight forwarders, agents, etc.)
-- ---------------------------------------------------------------------------
create table contacts (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces (id) on delete cascade,
  name text not null,
  company text,
  role text,
  email text,
  phone text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index contacts_workspace_id_idx on contacts (workspace_id);

create trigger contacts_set_updated_at before update on contacts
  for each row execute function set_updated_at();

alter table contacts enable row level security;

create policy "workspace members can view contacts"
  on contacts for select using (workspace_id = current_workspace_id());
create policy "workspace members can insert contacts"
  on contacts for insert with check (workspace_id = current_workspace_id());
create policy "workspace members can update contacts"
  on contacts for update using (workspace_id = current_workspace_id());
create policy "workspace members can delete contacts"
  on contacts for delete using (workspace_id = current_workspace_id());

-- ---------------------------------------------------------------------------
-- production_logs (dated notes/photos per PO while it's in production)
-- ---------------------------------------------------------------------------
create table production_logs (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces (id) on delete cascade,
  purchase_order_id uuid not null references purchase_orders (id) on delete cascade,
  note text not null,
  photo_urls text[] not null default '{}',
  created_by uuid not null references auth.users (id),
  created_at timestamptz not null default now()
);

create index production_logs_workspace_id_idx on production_logs (workspace_id);
create index production_logs_po_id_idx on production_logs (purchase_order_id);

alter table production_logs enable row level security;

create policy "workspace members can view production logs"
  on production_logs for select using (workspace_id = current_workspace_id());
create policy "workspace members can insert production logs"
  on production_logs for insert with check (workspace_id = current_workspace_id());
create policy "workspace members can delete production logs"
  on production_logs for delete using (workspace_id = current_workspace_id());

-- ---------------------------------------------------------------------------
-- activity_log (audit trail)
-- ---------------------------------------------------------------------------
create table activity_log (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces (id) on delete cascade,
  actor_id uuid references auth.users (id) on delete set null,
  actor_label text not null,
  action text not null,
  entity_type text not null,
  entity_label text,
  entity_id uuid,
  created_at timestamptz not null default now()
);

create index activity_log_workspace_id_idx on activity_log (workspace_id, created_at desc);

alter table activity_log enable row level security;

create policy "workspace members can view activity log"
  on activity_log for select using (workspace_id = current_workspace_id());
create policy "workspace members can insert activity log"
  on activity_log for insert with check (workspace_id = current_workspace_id());
