create table project_members (
    project_id uuid not null
        references projects(id)
        on delete cascade,

    user_id uuid not null
        references auth.users(id)
        on delete cascade,

    created_at timestamptz not null default now(),

    primary key (project_id, user_id)
);

create table profiles (
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


insert into profiles (
    id,
    name
)
select
    id,
    coalesce(
        raw_user_meta_data ->> 'name',
        ''
    )
from auth.users
on conflict (id) do nothing;

alter table tasks
add column assignee_id uuid
references profiles(id)
on delete set null;

alter table tasks
    drop constraint tasks_assignee_id_fkey,
    drop constraint tasks_created_by_id_fkey;

alter table tasks
add constraint tasks_assignee_id_fkey
    foreign key (assignee_id)
    references profiles(id)
    on delete set null,

add constraint tasks_created_by_id_fkey
    foreign key (created_by_id)
    references profiles(id)
    on delete set null;


insert into project_members (
    project_id,
    user_id
)
select
    id,
    user_id
from projects
where user_id is not null
on conflict do nothing;