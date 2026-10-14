create extension if not exists pgcrypto;

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text unique not null,
  password_hash text not null,
  created_at timestamptz default now()
);

create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  title text not null,
  description text,
  status text not null default 'todo' check (status in ('todo', 'in_progress', 'done')),
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  progress int not null default 0 check (progress between 0 and 100),
  due_date date,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references users(id) on delete cascade,
  name text not null,
  description text,
  color text default '#0d9488',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table tasks add column if not exists project_id uuid references projects(id) on delete cascade;

create table if not exists subtasks (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references tasks(id) on delete cascade,
  title text not null,
  is_completed boolean default false,
  created_at timestamptz default now()
);

create index if not exists tasks_user_id_idx on tasks(user_id);
create index if not exists projects_owner_id_idx on projects(owner_id);
create index if not exists tasks_project_id_idx on tasks(project_id);
create index if not exists tasks_status_idx on tasks(status);
create index if not exists subtasks_task_id_idx on subtasks(task_id);

alter table users enable row level security;
alter table tasks enable row level security;
alter table subtasks enable row level security;
alter table projects enable row level security;
