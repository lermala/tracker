alter table public.projects
alter column color drop not null,
alter column color drop default;

alter table public.categories
alter column color drop not null,
alter column color drop default;