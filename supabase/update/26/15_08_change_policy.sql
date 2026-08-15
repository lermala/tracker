drop policy if exists projects_select_own
on public.projects;

create policy projects_select_member
on public.projects
for select
to authenticated
using (
    user_id = (select auth.uid())

    or exists (
        select 1
        from public.project_members pm
        where pm.project_id = projects.id
          and pm.user_id = (select auth.uid())
    )
);

drop policy if exists categories_select_own
on public.categories;

drop policy if exists categories_insert_own
on public.categories;

drop policy if exists categories_update_own
on public.categories;

drop policy if exists categories_delete_own
on public.categories;


create policy categories_select_member
on public.categories
for select
to authenticated
using (
    exists (
        select 1
        from public.project_members pm
        where pm.project_id = categories.project_id
          and pm.user_id = (select auth.uid())
    )
);


create policy categories_insert_member
on public.categories
for insert
to authenticated
with check (
    exists (
        select 1
        from public.project_members pm
        where pm.project_id = categories.project_id
          and pm.user_id = (select auth.uid())
    )
);


create policy categories_update_member
on public.categories
for update
to authenticated
using (
    exists (
        select 1
        from public.project_members pm
        where pm.project_id = categories.project_id
          and pm.user_id = (select auth.uid())
    )
)
with check (
    exists (
        select 1
        from public.project_members pm
        where pm.project_id = categories.project_id
          and pm.user_id = (select auth.uid())
    )
);


create policy categories_delete_member
on public.categories
for delete
to authenticated
using (
    exists (
        select 1
        from public.project_members pm
        where pm.project_id = categories.project_id
          and pm.user_id = (select auth.uid())
    )
);


drop policy if exists tasks_select_own
on public.tasks;

drop policy if exists tasks_insert_own
on public.tasks;

drop policy if exists tasks_update_own
on public.tasks;

drop policy if exists tasks_delete_own
on public.tasks;


create policy tasks_select_member
on public.tasks
for select
to authenticated
using (
    exists (
        select 1
        from public.project_members pm
        where pm.project_id = tasks.project_id
          and pm.user_id = (select auth.uid())
    )
);


create policy tasks_insert_member
on public.tasks
for insert
to authenticated
with check (
    exists (
        select 1
        from public.project_members pm
        where pm.project_id = tasks.project_id
          and pm.user_id = (select auth.uid())
    )
);


create policy tasks_update_member
on public.tasks
for update
to authenticated
using (
    exists (
        select 1
        from public.project_members pm
        where pm.project_id = tasks.project_id
          and pm.user_id = (select auth.uid())
    )
)
with check (
    exists (
        select 1
        from public.project_members pm
        where pm.project_id = tasks.project_id
          and pm.user_id = (select auth.uid())
    )
);


create policy tasks_delete_member
on public.tasks
for delete
to authenticated
using (
    exists (
        select 1
        from public.project_members pm
        where pm.project_id = tasks.project_id
          and pm.user_id = (select auth.uid())
    )
);