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