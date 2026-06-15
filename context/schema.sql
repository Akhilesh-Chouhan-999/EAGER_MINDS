-- Database Schema for EagerMinds Bookmarks Application
-- Run in: https://supabase.com/dashboard/project/ggcqzqnsqbjkzqdnqpaj/sql/new
--
-- ⚠️  If tables already exist, run context/migration.sql instead!

-- 1. Create Profiles Table (extends auth.users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  handle text unique not null,
  email text not null,
  created_at timestamptz default timezone('utc'::text, now()) not null,
  
  constraint handle_length check (char_length(handle) >= 3)
);

-- Enable Row Level Security (RLS) for Profiles
alter table public.profiles enable row level security;

-- Profiles Policies
do $$ begin
  create policy "Public profiles are viewable by everyone" 
    on public.profiles for select 
    using (true);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Users can update their own profile" 
    on public.profiles for update 
    using (auth.uid() = id);
exception when duplicate_object then null; end $$;

-- 2. Create Bookmarks Table
create table if not exists public.bookmarks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  url text not null,
  description text,
  favicon_url text,
  tags text[] default '{}' not null,
  is_public boolean default false not null,
  created_at timestamptz default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS) for Bookmarks
alter table public.bookmarks enable row level security;

-- Bookmarks Policies
do $$ begin
  create policy "Users can view their own bookmarks, or anyone can view public bookmarks" 
    on public.bookmarks for select 
    using (
      auth.uid() = user_id 
      or is_public = true
    );
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Users can insert their own bookmarks" 
    on public.bookmarks for insert 
    with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Users can update their own bookmarks" 
    on public.bookmarks for update 
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Users can delete their own bookmarks" 
    on public.bookmarks for delete 
    using (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

-- GIN index for efficient tag queries
create index if not exists idx_bookmarks_tags on public.bookmarks using gin(tags);

-- Composite index for fast user dashboard and profile page queries sorted by date
create index if not exists idx_bookmarks_user_id_created_at on public.bookmarks(user_id, created_at desc);

-- 3. Automatic Profile Creation Trigger on Signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  raw_handle text;
  final_handle text;
  suffix_num integer := 1;
begin
  raw_handle := coalesce(
    new.raw_user_meta_data->>'handle', 
    split_part(new.email, '@', 1)
  );
  
  raw_handle := lower(regexp_replace(raw_handle, '[^a-zA-Z0-9_]', '', 'g'));
  
  if char_length(raw_handle) < 3 then
    raw_handle := raw_handle || 'usr';
  end if;

  final_handle := raw_handle;

  while exists(select 1 from public.profiles where handle = final_handle) loop
    final_handle := raw_handle || suffix_num::text;
    suffix_num := suffix_num + 1;
  end loop;

  insert into public.profiles (id, email, handle)
  values (
    new.id,
    new.email,
    final_handle
  );
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
