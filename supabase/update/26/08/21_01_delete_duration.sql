alter table public.tasks
    drop column if exists duration,
    drop column if exists started_at;