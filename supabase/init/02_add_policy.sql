-- =========================================================
-- ENABLE RLS
-- =========================================================

alter table public.projects
enable row level security;

alter table public.categories
enable row level security;

alter table public.tasks
enable row level security;

alter table public.profiles
enable row level security;

alter table public.project_members
enable row level security;


-- =========================================================
-- HELPERS
-- =========================================================

create or replace function public.is_project_member(
    target_project_id uuid
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
    select exists (
        select 1
        from public.project_members
        where project_id = target_project_id
          and user_id = auth.uid()
    );
$$;

revoke all
on function public.is_project_member(uuid)
from public;

grant execute
on function public.is_project_member(uuid)
to authenticated;


-- =========================================================
-- PROJECTS
-- =========================================================

create policy projects_select_member
on public.projects
for select
to authenticated
using (
    user_id = (select auth.uid())
    or public.is_project_member(id)
);


create policy projects_insert_own
on public.projects
for insert
to authenticated
with check (
    user_id = (select auth.uid())
);


create policy projects_update_own
on public.projects
for update
to authenticated
using (
    user_id = (select auth.uid())
)
with check (
    user_id = (select auth.uid())
);


create policy projects_delete_own
on public.projects
for delete
to authenticated
using (
    user_id = (select auth.uid())
);


-- =========================================================
-- CATEGORIES
-- =========================================================

create policy categories_select_member
on public.categories
for select
to authenticated
using (
    public.is_project_member(project_id)
);


create policy categories_insert_member
on public.categories
for insert
to authenticated
with check (
    public.is_project_member(project_id)
);


create policy categories_update_member
on public.categories
for update
to authenticated
using (
    public.is_project_member(project_id)
)
with check (
    public.is_project_member(project_id)
);


create policy categories_delete_member
on public.categories
for delete
to authenticated
using (
    public.is_project_member(project_id)
);


-- =========================================================
-- TASKS
-- =========================================================

create policy tasks_select_access
on public.tasks
for select
to authenticated
using (
    (
        project_id is null
        and created_by_id = auth.uid()
    )
    or
    (
        project_id is not null
        and public.is_project_member(project_id)
    )
);


create policy tasks_insert_access
on public.tasks
for insert
to authenticated
with check (
    (
        project_id is null
        and created_by_id = auth.uid()
    )
    or
    (
        project_id is not null
        and public.is_project_member(project_id)
    )
);


create policy tasks_update_access
on public.tasks
for update
to authenticated
using (
    (
        project_id is null
        and created_by_id = auth.uid()
    )
    or
    (
        project_id is not null
        and public.is_project_member(project_id)
    )
)
with check (
    (
        project_id is null
        and created_by_id = auth.uid()
    )
    or
    (
        project_id is not null
        and public.is_project_member(project_id)
    )
);


create policy tasks_delete_access
on public.tasks
for delete
to authenticated
using (
    (
        project_id is null
        and created_by_id = auth.uid()
    )
    or
    (
        project_id is not null
        and public.is_project_member(project_id)
    )
);


-- =========================================================
-- PROJECT MEMBERS
-- =========================================================

create policy project_members_select_member
on public.project_members
for select
to authenticated
using (
    public.is_project_member(project_id)
);


create policy project_members_insert_own
on public.project_members
for insert
to authenticated
with check (
    user_id = (select auth.uid())
);


-- =========================================================
-- PROFILES
-- =========================================================

create policy profiles_select_authenticated
on public.profiles
for select
to authenticated
using (
    true
);


create policy profiles_update_own
on public.profiles
for update
to authenticated
using (
    id = (select auth.uid())
)
with check (
    id = (select auth.uid())
);


-- =========================================================
-- JOIN PROJECT
-- =========================================================

create or replace function public.join_project(
    target_project_id uuid
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
begin
    if auth.uid() is null then
        raise exception 'Not authenticated';
    end if;

    if not exists (
        select 1
        from public.projects
        where id = target_project_id
    ) then
        raise exception 'Project not found';
    end if;

    insert into public.project_members (
        project_id,
        user_id
    )
    values (
        target_project_id,
        auth.uid()
    )
    on conflict (project_id, user_id)
    do nothing;

    return target_project_id;
end;
$$;

revoke all
on function public.join_project(uuid)
from public;

grant execute
on function public.join_project(uuid)
to authenticated;