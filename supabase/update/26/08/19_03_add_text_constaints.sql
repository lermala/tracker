alter table public.projects
add constraint projects_title_length_check
check (char_length(title) <= 100);

alter table public.projects
add constraint projects_description_length_check
check (char_length(description) <= 10000);



alter table public.categories
add constraint categories_title_length_check
check (char_length(title) <= 100);

alter table public.categories
add constraint categories_description_length_check
check (char_length(description) <= 10000);



alter table public.tasks
add constraint tasks_title_length_check
check (char_length(title) <= 255);

alter table public.tasks
add constraint tasks_description_length_check
check (char_length(description) <= 10000);

