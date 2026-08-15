alter table projects
add column description text not null default '';

alter table categories
add column description text not null default '';