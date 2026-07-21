-- Document Center: invoices, customs declarations, contracts attached to a
-- supplier and/or purchase order. Files live in the 'documents' Storage
-- bucket under `${workspace_id}/...`; this table stores their metadata.

create table documents (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces (id) on delete cascade,
  supplier_id uuid references suppliers (id) on delete cascade,
  purchase_order_id uuid references purchase_orders (id) on delete cascade,
  file_name text not null,
  storage_path text not null,
  file_size integer,
  content_type text,
  uploaded_by uuid not null references auth.users (id),
  created_at timestamptz not null default now()
);

create index documents_workspace_id_idx on documents (workspace_id);
create index documents_supplier_id_idx on documents (supplier_id);
create index documents_purchase_order_id_idx on documents (purchase_order_id);

alter table documents enable row level security;

create policy "workspace members can view documents"
  on documents for select using (workspace_id = current_workspace_id());
create policy "workspace members can insert documents"
  on documents for insert with check (workspace_id = current_workspace_id());
create policy "workspace members can delete documents"
  on documents for delete using (workspace_id = current_workspace_id());

-- Storage RLS: files are stored at `${workspace_id}/...`, so the first path
-- segment must match the caller's workspace.
create policy "workspace members can read own documents"
  on storage.objects for select
  using (
    bucket_id = 'documents'
    and (storage.foldername(name))[1] = current_workspace_id()::text
  );

create policy "workspace members can upload own documents"
  on storage.objects for insert
  with check (
    bucket_id = 'documents'
    and (storage.foldername(name))[1] = current_workspace_id()::text
  );

create policy "workspace members can delete own documents"
  on storage.objects for delete
  using (
    bucket_id = 'documents'
    and (storage.foldername(name))[1] = current_workspace_id()::text
  );
