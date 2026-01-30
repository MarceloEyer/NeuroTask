-- Schema for Zen Productivity App
-- Version: 2.0

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Tasks table
create table if not exists public.tasks (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,

  -- Task fields
  title text not null,
  domain text not null check (domain in ('Trabalho', 'Finanças', 'Saúde', 'Casa', 'Relacionamentos', 'Pessoal', 'Aprendizado', 'Projetos', 'Admin')),
  impact integer not null check (impact >= 1 and impact <= 5),
  urgency integer not null check (urgency >= 1 and urgency <= 5),
  emotional_cost integer not null check (emotional_cost >= 1 and emotional_cost <= 5),
  emotional_type text check (emotional_type in ('Cobrança', 'Conflito', 'Conversa difícil', 'Outro')),
  size text not null check (size in ('Pequena', 'Média', 'Grande')),
  deadline date,
  tags jsonb default '[]'::jsonb,
  status text not null check (status in ('inbox', 'agora', 'em_andamento', 'recomendadas', 'concluida', 'adiada')),
  checklist jsonb default '[]'::jsonb,
  defer_reason text,

  -- Timestamps
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  completed_at timestamptz
);

-- RLS Policies
alter table public.tasks enable row level security;

-- Users can read their own tasks
create policy "Users can read own tasks"
  on public.tasks
  for select
  to authenticated
  using (auth.uid() = user_id);

-- Users can insert their own tasks
create policy "Users can insert own tasks"
  on public.tasks
  for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Users can update their own tasks
create policy "Users can update own tasks"
  on public.tasks
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Users can delete their own tasks
create policy "Users can delete own tasks"
  on public.tasks
  for delete
  to authenticated
  using (auth.uid() = user_id);

-- Indexes
create index if not exists idx_tasks_user_id on public.tasks(user_id);
create index if not exists idx_tasks_status on public.tasks(status);
create index if not exists idx_tasks_domain on public.tasks(domain);
create index if not exists idx_tasks_created_at on public.tasks(created_at desc);

-- Updated_at trigger
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at
  before update on public.tasks
  for each row
  execute function public.handle_updated_at();
