-- ============================================================
-- MIGRATION: Add missing columns to existing bookmarks table
-- Run this in: https://supabase.com/dashboard/project/ggcqzqnsqbjkzqdnqpaj/sql/new
-- ============================================================

ALTER TABLE public.bookmarks ADD COLUMN IF NOT EXISTS favicon_url text;
ALTER TABLE public.bookmarks ADD COLUMN IF NOT EXISTS description text;
ALTER TABLE public.bookmarks ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}';

CREATE INDEX IF NOT EXISTS idx_bookmarks_tags ON public.bookmarks USING GIN(tags);
