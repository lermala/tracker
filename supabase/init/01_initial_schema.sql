-- =========================================================
-- 1. PROFILES
-- =========================================================

create table public.profiles (
    id uuid primary key
        references auth.users(id)
        on delete cascade,

    name text not null default '',
    avatar_path text,

    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);


create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
    insert into public.profiles (
        id,
        name
    )
    values (
        new.id,
        coalesce(
            new.raw_user_meta_data ->> 'name',
            ''
        )
    );

    return new;
end;
$$;


create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();


-- =========================================================
-- 2. PROJECTS
-- =========================================================

create table public.projects (
    id uuid primary key,

    user_id uuid not null
        references public.profiles(id)
        on delete cascade,

    title text not null default '',
    description text not null default '',
    color text,
    position integer not null default 0,

    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),

    constraint projects_position_check
        check (position >= 0)
);


-- =========================================================
-- 3. CATEGORIES
-- =========================================================

create table public.categories (
    id uuid primary key,

    project_id uuid not null
        references public.projects(id)
        on delete cascade,

    title text not null default '',
    description text not null default '',
    color text,
    position integer not null default 0,

    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),

    constraint categories_position_check
        check (position >= 0)
);


-- =========================================================
-- 4. TASKS
-- =========================================================

create table public.tasks (
    id uuid primary key,

    project_id uuid
        references public.projects(id)
        on delete cascade,

    category_id uuid
        references public.categories(id)
        on delete set null,

    created_by_id uuid
        references public.profiles(id)
        on delete set null,

    assignee_id uuid
        references public.profiles(id)
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


-- =========================================================
-- 5. PROJECT MEMBERS
-- =========================================================

create table public.project_members (
    project_id uuid not null
        references public.projects(id)
        on delete cascade,

    user_id uuid not null
        references public.profiles(id)
        on delete cascade,

    created_at timestamptz not null default now(),

    primary key (project_id, user_id)
);


-- =========================================================
-- 6. INDEXES
-- =========================================================

create index projects_user_id_idx
    on public.projects(user_id);

create index categories_project_id_idx
    on public.categories(project_id);

create index tasks_project_id_idx
    on public.tasks(project_id);

create index tasks_category_id_idx
    on public.tasks(category_id);

create index tasks_created_by_id_idx
    on public.tasks(created_by_id);

create index tasks_assignee_id_idx
    on public.tasks(assignee_id);

create index project_members_user_id_idx
    on public.project_members(user_id);


-- =========================================================
-- 7. UPDATED_AT TRIGGERS
-- =========================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;


create trigger profiles_set_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

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



-- =========================================================
-- 8. PROJECT MEMBERSHIP HELPERS
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


create or replace function public.add_project_owner_as_member()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
    insert into public.project_members (
        project_id,
        user_id
    )
    values (
        new.id,
        new.user_id
    )
    on conflict (project_id, user_id)
    do nothing;

    return new;
end;
$$;


create trigger on_project_created
after insert on public.projects
for each row
execute function public.add_project_owner_as_member();


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