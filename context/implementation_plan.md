# EagerMinds Bookmarks App — Implementation Plan

This document outlines the step-by-step phases to build the personal bookmarks application as requested by the interviewer.

---

## Technical Stack
- **Framework**: Next.js (App Router, TypeScript)
- **Database & Auth**: Supabase (PostgreSQL with Row Level Security)
- **Email Delivery**: Resend (for welcome emails upon sign-up)
- **Deployment**: Vercel
- **Styling**: Vanilla CSS (CSS Modules) to match the strict visual guidelines and provide a premium, bespoke design.

---

## Phase 1: Project Initialization & Git Setup
1. **Initialize Git**: Verify or initialize git repository in `EAGER_MINDS`.
2. **Next.js Setup**: Initialize a new Next.js project with App Router, TypeScript, and CSS Modules.
3. **Setup Structure**: Create initial folder structures for components, lib/Supabase client, API routes, and styles.
4. **Entire CLI Setup**: Check if Entire CLI is ready for recording agent sessions.

## Phase 2: Database Schema & Supabase Setup
1. **Create Profiles Table**:
   - `id` (uuid, references auth.users, primary key)
   - `handle` (text, unique, not null)
   - `email` (text, not null)
   - `created_at` (timestamptz)
2. **Create Bookmarks Table**:
   - `id` (uuid, primary key)
   - `user_id` (uuid, references profiles.id or auth.users, not null)
   - `title` (text, not null)
   - `url` (text, not null)
   - `is_public` (boolean, default false)
   - `created_at` (timestamptz)
3. **Database Security (RLS)**:
   - Enable Row Level Security (RLS) on both tables.
   - **Profiles Policy**: Anyone can read handles/emails (needed for public profile), but only the owner can update their profile.
   - **Bookmarks Policy**:
     - *Read*: Users can read all bookmarks they own (`auth.uid() = user_id`) OR bookmarks that are marked public (`is_public = true`).
     - *Insert/Update/Delete*: Users can only mutate bookmarks they own (`auth.uid() = user_id`).
4. **Triggers**: Set up a trigger in PostgreSQL to automatically insert a profile row when a new user signs up in Supabase Auth.

## Phase 3: Authentication & Sign-Up Emails
1. **Supabase Client Setup**: Configure the Supabase JS client for Next.js (SSR friendly using `@supabase/ssr`).
2. **Auth Pages**:
   - Login page (`/login`)
   - Signup page (`/signup`) with email, password, and desired unique `@handle`.
3. **Welcome Email Integration**:
   - Create a Next.js route handler (`/api/auth/callback` or `/api/signup-welcome`) that triggers a welcome email using **Resend** when a new account is successfully verified or registered.

## Phase 4: Dashboard & Bookmark Management (Private Views)
1. **Dashboard Route (`/dashboard`)**:
   - Protect this route; redirect unauthenticated users to `/login`.
   - List the user's bookmarks (both public and private).
2. **Bookmark CRUD Operations**:
   - Create bookmark modal/form (Title, URL, is_public checkbox).
   - Edit bookmark form.
   - Delete bookmark functionality with confirmation.
   - Use Next.js Server Actions or client-side fetches with robust server-side authentication verification.

## Phase 5: Public Profiles (`/[handle]`)
1. **Dynamic Handle Route (`/[handle]`)**:
   - Resolve the profile by `@handle` from the database.
   - If not found, show a styled 404 page.
   - Fetch and display only the **public** bookmarks of that user.
   - Anyone (even logged out) can view this page.

## Phase 6: Premium UI Design & Micro-animations
1. **Design System**: Establish colors, typography, glassmorphism tokens, and gradients.
2. **Interactive Polish**: Add hover animations, smooth list transitions, active state highlights, and responsive layouts.
3. **SEO**: Add proper meta titles, descriptions, and OpenGraph tags.

## Phase 7: Deployment & Final Polish
1. **Vercel Configuration**: Define environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`).
2. **README**: Document local execution, AI-agent correction log, and improvement notes.
3. **Verification**: Confirm sessions are logged and synced correctly.
