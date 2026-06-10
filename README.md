# 🔖 EagerMinds — Personal Bookmark Manager

> A premium, full-stack personal bookmark manager — think **"Linktree meets Pocket"** — built as a hands-on take-home task using an AI coding agent.

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite)](https://vitejs.dev)
[![Express](https://img.shields.io/badge/Express-4-000000?logo=express)](https://expressjs.com)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase)](https://supabase.com)
[![Resend](https://img.shields.io/badge/Email-Resend-000000?logo=maildotru)](https://resend.com)
[![Tests](https://img.shields.io/badge/Tests-30%2B%20passing-brightgreen)](#testing)

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Folder Structure](#folder-structure)
- [Local Setup](#local-setup)
- [API Reference](#api-reference)
- [Database Schema](#database-schema)
- [Testing](#testing)
- [AI Agent Correction Log](#ai-agent-steering--correction-log)
- [What I'd Improve With More Time](#what-id-improve-with-more-time)

---

## ✨ Features

| Feature | Description |
|---|---|
| 📧 **Email / Password Auth** | Full signup & login with Supabase Auth |
| 🔑 **Google OAuth** | One-click "Sign in with Google" |
| 🔖 **Bookmark CRUD** | Create, read, update, delete bookmarks |
| 🏷️ **Tags** | Comma-separated tags with filter-by-tag UI |
| 🌐 **Public / Private toggle** | Per-bookmark visibility control |
| 🤖 **Auto-metadata scraping** | Title, description, and favicon auto-fetched from URLs |
| 👤 **Public @handle profiles** | Share bookmarks at `/:handle` |
| 📬 **Welcome emails** | Resend-powered welcome email on signup |
| 🔍 **Search & filter** | Real-time search + visibility/tag filter + sort |
| 📋 **List & grid view** | Switch between list and card grid |
| ☑️ **Bulk delete** | Select multiple bookmarks and delete in one click |
| 📊 **Stats dashboard** | Total, public, and private bookmark counts |
| 🔒 **Row-Level Security** | Supabase RLS enforced on all database operations |

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite, React Router v6, Vanilla CSS |
| **Backend** | Node.js, Express.js |
| **Database** | Supabase (PostgreSQL) |
| **Auth** | Supabase Auth + Google OAuth 2.0 |
| **Email** | Resend API |
| **Testing** | Jest + Supertest (backend), Vitest (frontend) |

---

## 🏗 Architecture

The application follows a clean **Repository → Service → Controller** pattern:

```
HTTP Request
    │
    ▼
Express Router       ← routes/
    │
    ▼
Validation Middleware ← middlewares/validation.js
    │
    ▼
Auth Middleware       ← middlewares/auth.js
    │
    ▼
Controller           ← controllers/
    │
    ▼
Service Layer        ← services/   (business logic, metadata scraping, error wrapping)
    │
    ▼
Repository Layer     ← repositories/  (pure Supabase database queries)
    │
    ▼
Supabase PostgreSQL
```

---

## 📂 Folder Structure

```
EAGER_MINDS/
├── backend/
│   ├── config/
│   │   └── db.js               # Supabase client factory (with ws transport for Node 20)
│   ├── controllers/
│   │   ├── authController.js   # signup, login, getMe, googleLogin, logout
│   │   ├── bookmarkController.js  # getBookmarks, addBookmark, updateBookmark, deleteBookmark
│   │   └── profileController.js   # getPublicProfile
│   ├── middlewares/
│   │   ├── auth.js             # Bearer token extraction
│   │   └── validation.js       # Input validation (email, password, handle, URL)
│   ├── repositories/
│   │   ├── bookmarkRepository.js  # All bookmark DB queries
│   │   └── userRepository.js      # Profile DB queries
│   ├── routes/
│   │   ├── authRoutes.js       # /api/auth/* routes
│   │   ├── bookmarkRoutes.js   # /api/bookmarks/* routes
│   │   └── profileRoutes.js    # /api/profiles/* routes
│   ├── services/
│   │   ├── authService.js      # Auth business logic, Google OAuth URL
│   │   ├── bookmarkService.js  # CRUD logic, metadata scraping, tag sanitization
│   │   └── profileService.js   # Public profile resolution
│   ├── tests/
│   │   ├── auth.test.js        # Auth route integration tests
│   │   ├── bookmarks.test.js   # Bookmark CRUD + metadata tests
│   │   ├── profile.test.js     # Handle resolution + reserved route guard tests
│   │   └── validation.test.js  # Input validation unit tests
│   ├── utils/
│   │   ├── AppError.js         # Custom operational error class
│   │   ├── asyncHandler.js     # Express async error wrapper
│   │   ├── emailService.js     # Resend welcome email sender
│   │   ├── logger.js           # Structured console logger
│   │   ├── metadataScraper.js  # OG/title/favicon scraper from URLs
│   │   └── response.js         # Consistent JSON response helpers
│   ├── .env                    # Environment variables (git-ignored)
│   ├── app.js                  # Express app setup, CORS, security headers, error handler
│   └── index.js                # Server entry point, env validation, graceful shutdown
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── BookmarkManager.jsx  # Full CRUD UI with search/filter/sort/tags/bulk delete
│   │   │   ├── EmptyState.jsx
│   │   │   ├── ErrorBoundary.jsx    # React error boundary
│   │   │   ├── LoadingSpinner.jsx
│   │   │   └── SearchProfile.jsx    # @handle lookup widget for homepage
│   │   ├── config/
│   │   │   └── api.js              # fetch wrapper with JWT auto-attach
│   │   ├── hooks/
│   │   │   └── useAuth.js          # Session hook: OAuth hash parsing, login/logout
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx       # Authenticated user's bookmark dashboard
│   │   │   ├── Home.jsx            # Landing page with hero and SearchProfile
│   │   │   ├── Login.jsx           # Login form + Google OAuth button
│   │   │   ├── NotFound.jsx        # 404 page
│   │   │   ├── Profile.jsx         # Public @handle profile page
│   │   │   └── Signup.jsx          # Signup form + Google OAuth button
│   │   ├── utils/
│   │   │   └── date.js             # Date formatting helper
│   │   ├── App.jsx                 # Router (BrowserRouter + Routes)
│   │   ├── index.css               # Premium dark theme CSS (glassmorphism, animations)
│   │   └── main.jsx                # Vite entry point
│   └── package.json
├── context/
│   ├── schema.sql               # Full Supabase PostgreSQL schema + RLS policies + triggers
│   ├── requirement.txt          # Original task brief
│   ├── progress.md              # Phase-by-phase development log
│   ├── TECHNICAL_ARCHITECTURE.md
│   └── ...                      # Other context docs
├── package.json                 # Workspace root: setup, dev, test commands
└── README.md                    # This file
```

---

## 🚀 Local Setup

### Prerequisites

- Node.js 18+ (tested on Node 20)
- A [Supabase](https://supabase.com) project
- A [Resend](https://resend.com) account (for welcome emails)
- Google OAuth credentials (optional — for "Sign in with Google")

---

### 1. Database Setup (Supabase)

1. Go to your Supabase project → **SQL Editor**
2. Run the full contents of [`context/schema.sql`](context/schema.sql)

This creates:
- `public.profiles` table with RLS policies
- `public.bookmarks` table with RLS policies and `tags` column
- An auto-trigger that creates a profile row on new user signup

> **If you already have the schema without tags:** Run this migration:
> ```sql
> ALTER TABLE public.bookmarks ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}';
> CREATE INDEX IF NOT EXISTS idx_bookmarks_tags ON public.bookmarks USING GIN(tags);
> ```

---

### 2. Configure Environment Variables

**Backend** — create `backend/.env`:

```env
PORT=3001
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
RESEND_API_KEY=re_your_resend_api_key
GOOGLE_CLIENT_ID=your-google-client-id          # optional
GOOGLE_CLIENT_SECRET=your-google-client-secret  # optional
FRONTEND_URL=http://localhost:5173
```

**Frontend** — create `frontend/.env.local`:

```env
VITE_API_BASE_URL=http://localhost:3001
```

---

### 3. Install Dependencies

```bash
npm run setup
```

This installs packages in both `backend/` and `frontend/` automatically.

---

### 4. Start Development Servers

```bash
npm run dev
```

This runs both servers concurrently via `concurrently`:

| Service | URL |
|---|---|
| Frontend (Vite/React) | http://localhost:5173 |
| Backend (Express) | http://localhost:3001 |
| Backend health check | http://localhost:3001/health |

---

## 📡 API Reference

All endpoints are prefixed with `/api`. Protected endpoints require an `Authorization: Bearer <token>` header.

### Auth

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/signup` | ❌ | Register with email, password & handle |
| `POST` | `/api/auth/login` | ❌ | Login, receive `session.access_token` |
| `GET` | `/api/auth/me` | ✅ | Get current user + profile |
| `GET` | `/api/auth/google` | ❌ | Get Google OAuth redirect URL |
| `POST` | `/api/auth/logout` | ✅ | Invalidate session server-side |

### Bookmarks

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/bookmarks` | ✅ | List all user's bookmarks |
| `POST` | `/api/bookmarks` | ✅ | Create bookmark (auto-scrapes metadata) |
| `PUT` | `/api/bookmarks/:id` | ✅ | Update bookmark |
| `DELETE` | `/api/bookmarks/:id` | ✅ | Delete bookmark |

**Request body for POST/PUT:**
```json
{
  "url": "https://example.com",
  "title": "Optional — auto-fetched if blank",
  "isPublic": false,
  "tags": ["react", "frontend"]
}
```

### Profiles

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/profiles/:handle` | ❌ | Get public profile + public bookmarks |

---

## 🗄 Database Schema

```sql
-- profiles (extends auth.users)
public.profiles (
  id        uuid PRIMARY KEY (references auth.users),
  handle    text UNIQUE NOT NULL,
  email     text NOT NULL,
  created_at timestamptz
)

-- bookmarks
public.bookmarks (
  id          uuid PRIMARY KEY,
  user_id     uuid (references profiles),
  title       text NOT NULL,
  url         text NOT NULL,
  description text,
  favicon_url text,
  tags        text[] DEFAULT '{}',
  is_public   boolean DEFAULT false,
  created_at  timestamptz
)
```

Row-Level Security (RLS) is enabled on both tables. Users can only manage their own bookmarks; public bookmarks are readable by everyone.

---

## 🧪 Testing

Run all tests from the project root:

```bash
npm test
```

Or run them individually:

```bash
# Backend tests (Jest + Supertest) — 27+ tests
npm run test:backend

# Frontend tests (Vitest) — API fetch & JWT integration tests
npm run test:frontend
```

**Test coverage includes:**
- Input validation (email, password, handle, URL formats)
- Auth routes: signup, login, invalid credentials, `getMe`
- Bookmark CRUD: create with metadata, update, delete, pagination
- Reserved handle guard on public profile routes
- Frontend API fetch wrapper with mocked storage + fetch

---

## 🤖 AI Agent Steering & Correction Log

This project was built using an AI coding agent (Claude Code). The following are the key areas where the agent needed steering corrections:

### 1. React 19 State Synchronization Warning
**What the agent did:** Updated loading state synchronously inside `useEffect` on `Home.jsx` and `Profile.jsx`, causing a React ESLint warning about state updates during render.

**How we fixed it:** Computed the loading state from `localStorage` dynamically at render-time (instead of setting it in `useEffect`). For the handle param change in `Profile.jsx`, implemented a render-phase state adjustment (`if (handle !== prevHandle) { setPrevHandle(...) }`) which is the React-recommended pattern for derived state.

---

### 2. Node.js 20 WebSocket Crash — Google OAuth Broken
**What the agent did:** Used the default Supabase client config which tries to use `globalThis.WebSocket`. Node.js 20 doesn't have native WebSocket, causing `GET /api/auth/google` to return a 500 crash.

**How we fixed it:** Installed the `ws` npm package and passed `{ realtime: { transport: ws } }` in the Supabase client options inside `backend/config/db.js`.

---

### 3. Supabase AuthApiError Not Wrapped — Login/Signup Returning 500
**What the agent did:** Let Supabase `AuthApiError` objects bubble up to the Express error handler without wrapping them. Since `AuthApiError` doesn't have `isOperational: true`, they fell through to the generic 500 handler.

**How we fixed it:** Wrapped all Supabase auth errors in `throw new AppError(error.message, statusCode)` in the service layer, and added a secondary guard in the centralized Express error handler for errors with a numeric `.status` property.

---

### 4. Modular Architecture Restructuring
**What the agent initially did:** Placed all logic in a single monolithic Express file.

**How we fixed it:** Restructured into the clean Repository → Service → Controller → Route layered architecture, separating database queries, business logic, and HTTP handling concerns.

---

### 5. Tags Not Persisted to Backend
**What the agent did:** Built a complete tags UI in `BookmarkManager.jsx` (form input, tag pills, filter dropdown) but forgot to include `tags` in the API request body for add/update operations, so tags were never saved.

**How we fixed it:** Added `tags: fields.tags` to both the `handleAdd` and `handleEdit` API call bodies, added `tags[]` column to the Supabase schema, and added `sanitizeTags()` in the service layer to clean and deduplicate tag arrays before database insertion.

---

## 💡 What I'd Improve With More Time

1. **End-to-end (E2E) testing** with Playwright — automated browser tests covering the full signup → login → add bookmark → view profile flow.
2. **Pagination UI** — the backend supports `?page=1&limit=10` pagination but the frontend always fetches all bookmarks. Adding infinite scroll or page controls would scale better.
3. **Tag-based public profiles** — filter a public profile's bookmarks by tag, e.g. `/:handle?tag=react`.
4. **Bookmark import/export** — support importing browser bookmark HTML files or exporting to JSON/CSV.
5. **Real-time updates** — use Supabase Realtime subscriptions so the dashboard updates automatically when bookmarks change across devices.

---

## 📝 Notes

- The backend runs on port `3001` by default (set `PORT` in `.env` to override).
- Google OAuth requires enabling the Google provider in **Supabase → Authentication → Providers** and adding your Google Client ID/Secret.
- Welcome emails require a valid `RESEND_API_KEY`. Signup succeeds even if the email fails (non-blocking).

---

*Built by Akhilesh Chouhan for the EagerMinds take-home task — powered by React, Express, and Supabase.*
