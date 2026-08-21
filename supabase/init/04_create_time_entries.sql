-- =========================================================
-- 1. time_entries
-- =========================================================

create table public.time_entries (
    id uuid primary key default gen_random_uuid(),

    task_id uuid not null
        references public.tasks(id)
        on delete cascade,

    user_id uuid not null
        references public.profiles(id)
        on delete cascade,

    started_at timestamptz not null,
    ended_at timestamptz,

    note text not null default '',

    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),

    constraint time_entries_valid_range
        check (
            ended_at is null
            or ended_at >= started_at
        )
);

create index time_entries_task_id_idx
    on public.time_entries(task_id);

create index time_entries_user_started_at_idx
    on public.time_entries(user_id, started_at);

create unique index time_entries_one_active_per_user_idx
    on public.time_entries(user_id)
    where ended_at is null;


-- =========================================================
-- 2. TRIGGERS
-- =========================================================


create trigger time_entries_set_updated_at
before update on public.time_entries
for each row
execute function public.set_updated_at();


-- =========================================================
-- 3. RLS
-- =========================================================

alter table public.time_entries
    enable row level security;

create policy "Users can view own time entries"
on public.time_entries
for select
to authenticated
using (
    user_id = auth.uid()
);

create policy "Users can create own time entries"
on public.time_entries
for insert
to authenticated
with check (
    user_id = auth.uid()
);

create policy "Users can update own time entries"
on public.time_entries
for update
to authenticated
using (
    user_id = auth.uid()
)
with check (
    user_id = auth.uid()
);

create policy "Users can delete own time entries"
on public.time_entries
for delete
to authenticated
using (
    user_id = auth.uid()
);