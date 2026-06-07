# Bookmark Hub — EagerMinds Take-Home Task

A premium, minimalist personal bookmarks application (think "linktree meets pocket") built with **Next.js (App Router, TypeScript)**, **Supabase (Auth + Database)**, and **Resend (Onboarding Emails)**.

---

## Features

1. **Authentication & Signups**: Users can sign up and log in securely. On signup, a welcome onboarding email is sent automatically via Resend.
2. **Bookmarks CRUD**: Signed-in users can create, read, update, and delete bookmarks.
3. **Public/Private Toggle**: Each bookmark can be marked public or private.
4. **Handles & Public Profiles**: Users claim a unique `@handle` on signup. Anyone can visit `/<handle>` to view their public bookmarks.
5. **Strict Row-Level Privacy**: RLS policies enforce that users can only modify their own bookmarks, and private bookmarks are never leaked via API endpoints or URLs.

---

## Local Setup & Run Instructions

### 1. Database Setup (Supabase)
Run the contents of [context/schema.sql](file:///C:/Users/chouh/OneDrive/Desktop/EAGER_MINDS/context/schema.sql) in the **SQL Editor** of your Supabase project. This:
- Creates the `profiles` and `bookmarks` tables.
- Sets up database triggers to automatically create public profiles upon signup.
- Configures Row Level Security (RLS) policies for complete privacy.

### 2. Configure Environment Variables
Create a `.env.local` file in the root of the project with the following keys:
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
RESEND_API_KEY=your-resend-api-key
```

### 3. Install & Start Development Server
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## AI Agent Steering & Correction Log (2-4 Honest Sentences)

During pair programming, we steering-corrected the coding agent in three key areas:
1. **Naming conflicts during initialization**: The agent originally failed to initialize Next.js in the `EAGER_MINDS` folder due to npm uppercase restrictions, which we fixed by bootstrapping in a lowercase folder and moving files up.
2. **React 19 State Synchronization Warning**: The agent attempted to sync query parameter errors via a `useEffect` hook, which triggered a React 19 linter warning for synchronous state updates; we fixed this by computing the display error directly during rendering.
3. **Dynamic Build Failure**: The agent's dynamic handle path `/[handle]` caused compilation errors during `npm run build` because Next.js tried to statically generate it; we resolved this by adding `export const dynamic = 'force-dynamic'` to force on-demand server rendering.

---

## One Thing I'd Improve with More Time

If I had more time, I would implement **automatic metadata fetching (link scraping)** for new bookmarks. When a user pastes a URL, the backend API would scrape the target site's HTML to retrieve its OpenGraph metadata (title, description, and favicons) and pre-fill the bookmark form automatically. This would offer a much more fluid bookmark saving experience.
