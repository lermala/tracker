create table public.projects (
    id uuid primary key,

    user_id uuid not null
        references auth.users(id)
        on delete cascade,

    title text not null default '',
    color text,
    position integer not null default 0,

    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),

    constraint projects_position_check
        check (position >= 0)
);

create table public.categories (
    id uuid primary key,

    project_id uuid not null
        references public.projects(id)
        on delete cascade,

    title text not null default '',
    color text,
    position integer not null default 0,

    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),

    constraint categories_position_check
        check (position >= 0)
);

create table public.tasks (
    id uuid primary key,

    project_id uuid not null
        references public.projects(id)
        on delete cascade,

    category_id uuid
        references public.categories(id)
        on delete set null,

    created_by_id uuid
        references auth.users(id)
        on delete set null,

    assignee_id uuid
        references auth.users(id)
        on delete set null,

    title text not null default '',
    description text not null default '',

    priority text not null default 'none',

    duration integer not null default 0,
    position integer not null default 0,

    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),

    started_at timestamptz,
    completed_at timestamptz,
    due_date date,
    due_time time,

    constraint tasks_priority_check
        check (
            priority in (
                'none',
                'low',
                'medium',
                'high'
            )
        ),

    constraint tasks_duration_check
        check (duration >= 0),

    constraint tasks_position_check
        check (position >= 0)
);

create index projects_user_id_idx
    on public.projects(user_id);

create index categories_project_id_idx
    on public.categories(project_id);

create index tasks_project_id_idx
    on public.tasks(project_id);

create index tasks_category_id_idx
    on public.tasks(category_id);

create index tasks_assignee_id_idx
    on public.tasks(assignee_id);


alter table public.projects enable row level security;
alter table public.categories enable row level security;
alter table public.tasks enable row level security;

create policy "projects_select_own"
on public.projects
for select
to authenticated
using (
    (select auth.uid()) = user_id
);

create policy "projects_insert_own"
on public.projects
for insert
to authenticated
with check (
    (select auth.uid()) = user_id
);

create policy "projects_update_own"
on public.projects
for update
to authenticated
using (
    (select auth.uid()) = user_id
)
with check (
    (select auth.uid()) = user_id
);

create policy "projects_delete_own"
on public.projects
for delete
to authenticated
using (
    (select auth.uid()) = user_id
);


create policy "categories_select_own"
on public.categories
for select
to authenticated
using (
    project_id in (
        select id
        from public.projects
        where user_id = (select auth.uid())
    )
);

create policy "categories_insert_own"
on public.categories
for insert
to authenticated
with check (
    project_id in (
        select id
        from public.projects
        where user_id = (select auth.uid())
    )
);

create policy "categories_update_own"
on public.categories
for update
to authenticated
using (
    project_id in (
        select id
        from public.projects
        where user_id = (select auth.uid())
    )
)
with check (
    project_id in (
        select id
        from public.projects
        where user_id = (select auth.uid())
    )
);

create policy "categories_delete_own"
on public.categories
for delete
to authenticated
using (
    project_id in (
        select id
        from public.projects
        where user_id = (select auth.uid())
    )
);

create policy "tasks_select_own"
on public.tasks
for select
to authenticated
using (
    project_id in (
        select id
        from public.projects
        where user_id = (select auth.uid())
    )
);

create policy "tasks_insert_own"
on public.tasks
for insert
to authenticated
with check (
    project_id in (
        select id
        from public.projects
        where user_id = (select auth.uid())
    )
);

create policy "tasks_update_own"
on public.tasks
for update
to authenticated
using (
    project_id in (
        select id
        from public.projects
        where user_id = (select auth.uid())
    )
)
with check (
    project_id in (
        select id
        from public.projects
        where user_id = (select auth.uid())
    )
);

create policy "tasks_delete_own"
on public.tasks
for delete
to authenticated
using (
    project_id in (
        select id
        from public.projects
        where user_id = (select auth.uid())
    )
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

create trigger projects_set_updated_at
before update on public.projects
for each row
execute function public.set_updated_at();

create trigger categories_set_updated_at
before update on public.categories
for each row
execute function public.set_updated_at();

create trigger tasks_set_updated_at
before update on public.tasks
for each row
execute function public.set_updated_at();