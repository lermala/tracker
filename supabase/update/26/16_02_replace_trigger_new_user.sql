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
            nullif(trim(new.raw_user_meta_data ->> 'name'), ''),
            split_part(new.email, '@', 1)
        )
    );

    return new;
end;
$$;

update public.profiles as p
set name = split_part(u.email, '@', 1)
from auth.users as u
where p.id = u.id
  and (
      p.name is null
      or trim(p.name) = ''
  );