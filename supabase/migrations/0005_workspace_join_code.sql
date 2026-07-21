-- Lets a signed-up user without a workspace join an existing one by its
-- workspace ID, mirroring accept_workspace_invite() but keyed on the
-- workspace ID (shared as a join code) instead of a pending email invite.
--
-- Member limits below mirror PLAN_LIMITS in src/lib/plan-limits.ts — keep
-- these in sync if those numbers ever change.
create function join_workspace_by_id(target_workspace_id uuid)
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
    select count(*) into member_count from public.profiles where workspace_id = target_workspace_id;
    if member_count >= member_limit then
      raise exception 'This workspace has reached its % plan member limit', target_plan;
    end if;
  end if;

  update public.profiles
  set workspace_id = target_workspace_id, role = 'member'
  where id = auth.uid();

  return target_workspace_id;
end;
$$;
