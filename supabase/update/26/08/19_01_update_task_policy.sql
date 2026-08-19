drop policy if exists tasks_select_member
on public.tasks;

drop policy if exists tasks_insert_member
on public.tasks;

drop policy if exists tasks_update_member
on public.tasks;

drop policy if exists tasks_delete_member
on public.tasks;


-- ===== SELECT =====

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


-- ===== INSERT =====

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


-- ===== UPDATE =====

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


-- ===== DELETE =====

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