create table profiles (
    id uuid primary key
        references auth.users(id)
        on delete cascade,

    name text not null default '',
    avatar_path text,

    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);


create table project_members (
    project_id uuid not null
        references projects(id)
        on delete cascade,

    user_id uuid not null
        references profiles(id)
        on delete cascade,

    created_at timestamptz not null default now(),

    primary key (project_id, user_id)
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
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
    execute procedure public.handle_new_user();


alter table profiles
enable row level security;


create policy "Users can update own profile"
on profiles
for update
to authenticated
using (
    (select auth.uid()) = id
)
with check (
    (select auth.uid()) = id
);

create policy "Users can read own profile"
on profiles
for select
to authenticated
using (
    (select auth.uid()) = id
);


alter table project_members
enable row level security;

create policy "Users can read own memberships"
on project_members
for select
to authenticated
using (
    user_id = auth.uid()
);

create policy "Users can add own membership"
on project_members
for insert
to authenticated
with check (
    user_id = auth.uid()
);



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
    on conflict do nothing;

    return target_project_id;
end;
$$;

revoke all
on function public.join_project(uuid)
from public;

grant execute
on function public.join_project(uuid)
to authenticated;