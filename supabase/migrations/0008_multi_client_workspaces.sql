-- Multi-client workspaces (Agency tier): lets an Agency-plan workspace owner
-- create additional "client" workspaces and switch between them from one
-- login, with client workspaces riding for free under the owner's one
-- Agency subscription (no separate billing). Existing single-workspace
-- users are unaffected — every existing profile is backfilled into exactly
-- one membership row and its active workspace stays its home workspace.

-- ---------------------------------------------------------------------------
-- active_workspace_id: which workspace current_workspace_id() resolves to
-- right now. workspace_id remains the "home" workspace — the one that's
-- actually billed, checked for plan entitlement, and where a brand-new
-- user's first workspace lands.
-- ---------------------------------------------------------------------------
alter table profiles add column active_workspace_id uuid references workspaces (id) on delete set null;

update profiles set active_workspace_id = workspace_id where workspace_id is not null;

alter table profiles add constraint profiles_active_requires_home
  check (workspace_id is not null or active_workspace_id is null);

-- ---------------------------------------------------------------------------
-- Client-workspace billing tag. Null = this workspace has (or will have) its
-- own Stripe subscription. Non-null = it rides for free under another
-- workspace's Agency subscription.
-- ---------------------------------------------------------------------------
alter table workspaces add column billed_via_workspace_id uuid references workspaces (id) on delete set null;

-- ---------------------------------------------------------------------------
-- workspace_memberships: every workspace a user belongs to. Source of truth
-- for both "which workspaces can I see/switch into" and "what's my role in
-- this specific workspace" (role is now workspace-scoped, not global).
-- ---------------------------------------------------------------------------
-- user_id references profiles(id) rather than auth.users(id) directly —
-- profiles.id is always exactly auth.users.id (1:1, auto-created by
-- handle_new_user()), and referencing profiles here is what lets PostgREST
-- embed profile data directly in a workspace_memberships query (e.g.
-- `.select("role, profiles(name, email)")` on the Team page).
create table workspace_memberships (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces (id) on delete cascade,
  user_id uuid not null references profiles (id) on delete cascade,
  role text not null default 'member' check (role in ('owner', 'member')),
  created_at timestamptz not null default now(),
  unique (workspace_id, user_id)
);

create index workspace_memberships_user_id_idx on workspace_memberships (user_id);
create index workspace_memberships_workspace_id_idx on workspace_memberships (workspace_id);

-- Backfill: one membership row per existing (workspace_id, role) on profiles.
insert into workspace_memberships (workspace_id, user_id, role)
select workspace_id, id, role from profiles where workspace_id is not null
on conflict do nothing;

alter table workspace_memberships enable row level security;

-- Users can only ever see their own membership rows. Deliberately no
-- insert/update/delete policy — every write goes through the security
-- definer functions below, so a regular client has zero direct write path
-- to this table (can't self-grant membership in someone else's workspace).
create policy "users can view their own memberships"
  on workspace_memberships for select
  using (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- Redefine the RLS backbone to read active_workspace_id instead of
-- workspace_id. create or replace means every existing policy across every
-- prior migration that calls current_workspace_id()/current_user_is_owner()
-- picks up the new behavior automatically, with no other policy text
-- changes required anywhere else in the schema (including the Storage
-- policies in 0003_documents.sql).
-- ---------------------------------------------------------------------------
create or replace function current_workspace_id()
returns uuid
language sql
security definer
stable
set search_path = public
as $$
  select coalesce(active_workspace_id, workspace_id) from public.profiles where id = auth.uid();
$$;

-- Ownership is now workspace-scoped: am I the 'owner' member of whichever
-- workspace is currently active, per workspace_memberships? For every
-- existing single-workspace user this evaluates identically to the old
-- profiles.role = 'owner' check, since their one membership row was
-- backfilled from profiles.role above.
create or replace function current_user_is_owner()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.workspace_memberships
    where user_id = auth.uid()
      and workspace_id = current_workspace_id()
      and role = 'owner'
  );
$$;

-- ---------------------------------------------------------------------------
-- workspaces RLS: the switcher needs to list every workspace the caller is a
-- member of, not just the currently-active one. Replace the single-row
-- policy with a membership-based one.
-- ---------------------------------------------------------------------------
drop policy "workspace members can view their workspace" on workspaces;

create policy "workspace members can view their workspaces"
  on workspaces for select
  using (
    exists (
      select 1 from public.workspace_memberships wm
      where wm.workspace_id = workspaces.id and wm.user_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- profiles "teammate" visibility must become membership-based too: the old
-- predicate compared teammate.workspace_id (home) to current_workspace_id()
-- (active), which would hide an agency owner from a client workspace's own
-- team roster (their home workspace_id is the agency workspace, not the
-- client one they've switched into).
-- ---------------------------------------------------------------------------
drop policy "workspace members can view teammate profiles" on profiles;

create policy "workspace members can view teammate profiles"
  on profiles for select
  using (
    exists (
      select 1 from public.workspace_memberships wm
      where wm.workspace_id = current_workspace_id() and wm.user_id = profiles.id
    )
  );

drop policy "owner can manage teammate membership" on profiles;

create policy "owner can manage teammate membership"
  on profiles for update
  using (
    current_user_is_owner()
    and exists (
      select 1 from public.workspace_memberships wm
      where wm.workspace_id = current_workspace_id() and wm.user_id = profiles.id
    )
  );

-- ---------------------------------------------------------------------------
-- create_workspace: also seed the membership row and active pointer.
-- Without this, a brand-new user's first workspace would have no
-- membership row and current_user_is_owner() (now membership-based) would
-- always return false for them.
-- ---------------------------------------------------------------------------
create or replace function create_workspace(workspace_name text)
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
  set workspace_id = new_workspace_id, active_workspace_id = new_workspace_id, role = 'owner'
  where id = auth.uid();

  insert into public.workspace_memberships (workspace_id, user_id, role)
  values (new_workspace_id, auth.uid(), 'owner');

  return new_workspace_id;
end;
$$;

-- ---------------------------------------------------------------------------
-- accept_workspace_invite / join_workspace_by_id: same "must not already
-- belong to a workspace" guard as before (deliberately unchanged — cross-
-- joining an existing workspace is out of scope for now), now also seeding
-- workspace_memberships + active_workspace_id.
-- ---------------------------------------------------------------------------
create or replace function accept_workspace_invite(invite_email text)
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
  set workspace_id = matched_invite.workspace_id,
      active_workspace_id = matched_invite.workspace_id,
      role = 'member'
  where id = auth.uid();

  insert into public.workspace_memberships (workspace_id, user_id, role)
  values (matched_invite.workspace_id, auth.uid(), 'member')
  on conflict (workspace_id, user_id) do nothing;

  delete from public.workspace_invites where id = matched_invite.id;

  return matched_invite.workspace_id;
end;
$$;

create or replace function join_workspace_by_id(target_workspace_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  target_plan text;
  member_limit int;
  member_count int;
begin
  if exists (select 1 from public.profiles where id = auth.uid() and workspace_id is not null) then
    raise exception 'User already belongs to a workspace';
  end if;

  select plan into target_plan from public.workspaces where id = target_workspace_id;
  if target_plan is null then
    raise exception 'No workspace found for that ID';
  end if;

  member_limit := case target_plan
    when 'starter' then 5
    when 'growth' then 15
    else null
  end;

  if member_limit is not null then
    select count(*) into member_count
    from public.workspace_memberships where workspace_id = target_workspace_id;
    if member_count >= member_limit then
      raise exception 'This workspace has reached its % plan member limit', target_plan;
    end if;
  end if;

  update public.profiles
  set workspace_id = target_workspace_id, active_workspace_id = target_workspace_id, role = 'member'
  where id = auth.uid();

  insert into public.workspace_memberships (workspace_id, user_id, role)
  values (target_workspace_id, auth.uid(), 'member')
  on conflict (workspace_id, user_id) do nothing;

  return target_workspace_id;
end;
$$;

-- ---------------------------------------------------------------------------
-- create_client_workspace: Agency-home-owner-only. Authorization is checked
-- against the caller's HOME workspace, deliberately independent of whichever
-- workspace happens to be active right now. Client workspace's own plan is
-- set to 'agency' directly so every existing plan-gate check (PLAN_LIMITS,
-- hasFeature) just works with zero special-casing, and it never has its own
-- Stripe subscription (billed_via_workspace_id marks it as riding under the
-- home workspace instead).
-- ---------------------------------------------------------------------------
create function create_client_workspace(client_name text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  home_id uuid;
  home_plan text;
  new_workspace_id uuid;
begin
  select workspace_id into home_id from public.profiles where id = auth.uid();
  if home_id is null then
    raise exception 'You must belong to a workspace first';
  end if;

  select plan into home_plan from public.workspaces where id = home_id;
  if home_plan is distinct from 'agency' then
    raise exception 'Only Agency-plan workspaces can create client workspaces';
  end if;

  if not exists (
    select 1 from public.workspace_memberships
    where workspace_id = home_id and user_id = auth.uid() and role = 'owner'
  ) then
    raise exception 'Only the workspace owner can create client workspaces';
  end if;

  insert into public.workspaces (name, owner_id, plan, subscription_status, billed_via_workspace_id)
  values (client_name, auth.uid(), 'agency', 'active', home_id)
  returning id into new_workspace_id;

  insert into public.workspace_memberships (workspace_id, user_id, role)
  values (new_workspace_id, auth.uid(), 'owner');

  update public.profiles set active_workspace_id = new_workspace_id where id = auth.uid();

  return new_workspace_id;
end;
$$;

-- ---------------------------------------------------------------------------
-- switch_active_workspace: the only path that changes active_workspace_id
-- for an already-onboarded user. Validates membership first — this is the
-- single security-critical gate for the whole switcher feature.
-- ---------------------------------------------------------------------------
create function switch_active_workspace(target_workspace_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (
    select 1 from public.workspace_memberships
    where workspace_id = target_workspace_id and user_id = auth.uid()
  ) then
    raise exception 'You are not a member of that workspace';
  end if;

  update public.profiles set active_workspace_id = target_workspace_id where id = auth.uid();

  return target_workspace_id;
end;
$$;

-- ---------------------------------------------------------------------------
-- remove_workspace_member: replaces the direct profiles update that used to
-- live in src/lib/actions/workspace.ts's removeMember. Removing a member now
-- has to remove their membership row too, and — since this is only ever
-- called on a user's home workspace in the current UI — resets their home/
-- active pointers so they're kicked back to /onboarding exactly like before.
-- ---------------------------------------------------------------------------
create function remove_workspace_member(target_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  target_workspace uuid := current_workspace_id();
begin
  if not current_user_is_owner() then
    raise exception 'Only the workspace owner can remove members';
  end if;
  if target_user_id = auth.uid() then
    raise exception 'Owners cannot remove themselves';
  end if;

  delete from public.workspace_memberships
  where workspace_id = target_workspace and user_id = target_user_id;

  update public.profiles
  set workspace_id = null, active_workspace_id = null, role = 'member'
  where id = target_user_id and workspace_id = target_workspace;
end;
$$;
