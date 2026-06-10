-- ============================================================
-- EAGER MINDS — Complete Database Schema
-- Run this entire file in the Supabase SQL Editor
-- ============================================================

-- -------------------------------------------------------
-- 1. PROFILES TABLE
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT NOT NULL,
  handle      TEXT NOT NULL UNIQUE,
  full_name   TEXT,
  avatar_url  TEXT,
  bio         TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS profiles_handle_idx ON public.profiles(handle);

-- -------------------------------------------------------
-- 2. BOOKMARKS TABLE
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.bookmarks (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  url         TEXT NOT NULL,
  title       TEXT,
  description TEXT,
  tags        TEXT[],
  is_public   BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS bookmarks_user_id_idx  ON public.bookmarks(user_id);
CREATE INDEX IF NOT EXISTS bookmarks_is_public_idx ON public.bookmarks(is_public);

-- -------------------------------------------------------
-- 3. ROW LEVEL SECURITY (RLS)
-- -------------------------------------------------------

ALTER TABLE public.profiles  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

-- Drop existing policies before recreating (safe re-run)
DROP POLICY IF EXISTS "profiles: anyone can read"           ON public.profiles;
DROP POLICY IF EXISTS "profiles: user can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "profiles: user can insert own profile" ON public.profiles;

DROP POLICY IF EXISTS "bookmarks: user can read own"           ON public.bookmarks;
DROP POLICY IF EXISTS "bookmarks: public bookmarks readable by all" ON public.bookmarks;
DROP POLICY IF EXISTS "bookmarks: user can insert own"         ON public.bookmarks;
DROP POLICY IF EXISTS "bookmarks: user can update own"         ON public.bookmarks;
DROP POLICY IF EXISTS "bookmarks: user can delete own"         ON public.bookmarks;

-- PROFILES policies
CREATE POLICY "profiles: anyone can read"
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "profiles: user can update own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "profiles: user can insert own profile"
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- BOOKMARKS policies
CREATE POLICY "bookmarks: user can read own"
  ON public.bookmarks FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "bookmarks: public bookmarks readable by all"
  ON public.bookmarks FOR SELECT USING (is_public = true);

CREATE POLICY "bookmarks: user can insert own"
  ON public.bookmarks FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "bookmarks: user can update own"
  ON public.bookmarks FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "bookmarks: user can delete own"
  ON public.bookmarks FOR DELETE USING (auth.uid() = user_id);

-- -------------------------------------------------------
-- 4. AUTO-CREATE PROFILE ON SIGNUP (Trigger)
-- -------------------------------------------------------

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, handle)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data->>'handle',
      LOWER(REGEXP_REPLACE(SPLIT_PART(NEW.email, '@', 1), '[^a-z0-9_]', '', 'g'))
    )
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- -------------------------------------------------------
-- 5. UPDATED_AT auto-update for bookmarks
-- -------------------------------------------------------

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS bookmarks_set_updated_at ON public.bookmarks;
CREATE TRIGGER bookmarks_set_updated_at
  BEFORE UPDATE ON public.bookmarks
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();
