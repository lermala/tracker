alter table public.tasks
    drop column due_at,
    add column due_date date,
    add column due_time time;