-- NextTask schema: profiles + tasks with RLS
-- Apply in Supabase SQL editor or via supabase CLI

-- Profiles (timezone for logical calendar day rollover at 1:00 AM local)
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  timezone text not null default 'Asia/Kolkata',
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Tasks
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  note text,
  due_date date not null,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

comment on column public.tasks.due_date is 'Scheduled day (user TZ). Incomplete tasks with due_date before effective logical day surface in Backlog.';
comment on column public.tasks.completed_at is 'When completed; purge after retention (5 days) via cron.';

create index if not exists tasks_user_due_idx on public.tasks (user_id, due_date);
create index if not exists tasks_user_completed_idx on public.tasks (user_id, completed_at);

alter table public.tasks enable row level security;

create policy "tasks_select_own"
  on public.tasks for select
  using (auth.uid() = user_id);

create policy "tasks_insert_own"
  on public.tasks for insert
  with check (auth.uid() = user_id);

create policy "tasks_update_own"
  on public.tasks for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "tasks_delete_own"
  on public.tasks for delete
  using (auth.uid() = user_id);

-- Hook: profile row on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, timezone)
  values (new.id, 'Asia/Kolkata')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
