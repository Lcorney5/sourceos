-- Phone-only sign-ups (SMS OTP) have no auth.users.email, but profiles.email
-- is NOT NULL. Without this, handle_new_user() would violate that constraint
-- and silently fail the entire auth.users insert for phone sign-ups.
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, name)
  values (new.id, coalesce(new.email, ''), new.raw_user_meta_data ->> 'name');
  return new;
end;
$$;
