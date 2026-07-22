-- Security fix: RLS policies on `profiles` only ever restricted rows
-- (using (id = auth.uid())), never columns. That means any signed-in user
-- could update their own workspace_id (or role) directly from the browser
-- client to any workspace UUID they know, bypassing the invite/join-code
-- flow entirely and its member-limit checks — a real tenant-isolation
-- bypass, not just a theoretical one, now that workspace IDs are shared as
-- join codes on the Team page.
--
-- RLS can't restrict by column, so this uses Postgres column-level GRANTs
-- instead: normal clients can only ever write their own `name`. Every other
-- mutation to profiles (workspace_id, active_workspace_id, role) must go
-- through the existing security-definer functions (create_workspace,
-- join_workspace_by_id, accept_workspace_invite, etc.), which already
-- validate everything properly and run as the function owner, bypassing
-- these grants.
revoke update on public.profiles from authenticated;
grant update (name) on public.profiles to authenticated;
