-- Feedback & Support: lets any workspace member log feedback, bug reports,
-- or feature requests. Each member only sees their own submissions (matches
-- the "Your Submissions" panel in the UI) — this isn't a support ticket
-- queue with owner visibility, just a personal log.
create table feedback_submissions (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces (id) on delete cascade,
  submitted_by uuid not null references auth.users (id),
  type text not null check (type in ('feedback', 'bug', 'feature')),
  subject text not null,
  description text not null,
  created_at timestamptz not null default now()
);

create index feedback_submissions_workspace_id_idx on feedback_submissions (workspace_id);
create index feedback_submissions_submitted_by_idx on feedback_submissions (submitted_by);

alter table feedback_submissions enable row level security;

create policy "members can view own feedback submissions"
  on feedback_submissions for select
  using (workspace_id = current_workspace_id() and submitted_by = auth.uid());

create policy "members can create feedback submissions"
  on feedback_submissions for insert
  with check (workspace_id = current_workspace_id() and submitted_by = auth.uid());
