# Project Progress Tracker

This file tracks all the steps, CLI prompts, database setups, and changes made during development.

---

## Status Overview

| Phase | Description | Status |
|---|---|---|
| **Phase 1** | Project Initialization & Git Setup | ✅ Completed |
| **Phase 2** | Database Schema & Supabase Setup | ✅ Completed |
| **Phase 3** | Authentication & Sign-Up Emails | ✅ Completed |
| **Phase 4** | Dashboard & Bookmark Management | ✅ Completed |
| **Phase 5** | Public Profiles (`/[handle]`) | ✅ Completed |
| **Phase 6** | Premium UI Design & Micro-animations | ✅ Completed |
| **Phase 7** | Deployment & Final Polish | ✅ Completed |
| **Phase 8** | Migration to Frontend/Backend | ✅ Completed |
| **Phase 11**| Google OAuth, Email Confirmations & Workspace Startup | ✅ Completed |
| **Phase 12**| Testing, Bug Fixes (Node.js WebSocket, Supabase Error Handling) | ✅ Completed |

---

## Session Log & Steps Taken

### Phase 1: Project Initialization & Git Setup
* **Step 1.1**: Created the [implementation_plan.md](file:///C:/Users/chouh/OneDrive/Desktop/EAGER_MINDS/context/implementation_plan.md) and [progress.md](file:///C:/Users/chouh/OneDrive/Desktop/EAGER_MINDS/context/progress.md) files in the `context/` directory.
* **Step 1.2**: Initialized a new git repository in the workspace.
* **Step 1.3**: Bootstrapped a Next.js (TypeScript, ESLint, App Router, npm) project inside a temporary lowercase directory `eagerminds` to avoid npm capital letter restrictions.
* **Step 1.4**: Moved all files from `eagerminds` up to the workspace root directory and cleaned up the subfolder.
* **Step 1.5**: Verified the directory structure is setup with Vanilla CSS styling.

### Phase 2: Database Schema & Supabase Setup
* **Step 2.1**: Created [schema.sql](file:///C:/Users/chouh/OneDrive/Desktop/EAGER_MINDS/context/schema.sql) in the `context/` directory, detailing table schema, RLS policies, and triggers.
* **Step 2.2**: Installed client dependencies `@supabase/supabase-js`, `@supabase/ssr`, and `resend`.
* **Step 2.3**: Implemented Supabase client utils: browser client (`src/utils/supabase/client.ts`), server client (`src/utils/supabase/server.ts`), and session middleware (`src/utils/supabase/middleware.ts`).
* **Step 2.4**: Wired up the Next.js global middleware (`src/middleware.ts`) for auth protection.

### Phase 3: Authentication & Sign-Up Emails
* **Step 3.1**: Built Server Actions for Auth (`src/app/auth/actions.ts`) including unique handle verification and Resend welcome email integration.
* **Step 3.2**: Built Route Handler for PKCE authentication callback (`src/app/api/auth/callback/route.ts`).
* **Step 3.3**: Created beautiful signup (`src/app/signup/page.tsx`) and login (`src/app/login/page.tsx`) client pages.

### Phase 4: Dashboard & Bookmark Management
* **Step 4.1**: Implemented Server Actions for CRUD operations (`src/app/dashboard/actions.ts`).
* **Step 4.2**: Created Dashboard Page Component (`src/app/dashboard/page.tsx`) with server-side profile and data fetching.
* **Step 4.3**: Developed stateful, inline-editable `BookmarkManager` (`src/components/BookmarkManager.tsx`) for a fast, responsive user workflow.

### Phase 5: Public Profiles (`/[handle]`)
* **Step 5.1**: Created dynamic route `/[handle]` (`src/app/[handle]/page.tsx`) to serve public bookmarks on-demand.
* **Step 5.2**: Added page guard against collisions with reserved routing keywords.
* **Step 5.3**: Created styled global 404 page (`src/app/not-found.tsx`) for missing handles.

### Phase 6: Premium UI Design & Micro-animations
* **Step 6.1**: Styled global stylesheet (`src/app/globals.css`) with premium dark variables, glassmorphism card panels, dynamic glows, custom gradients, button active/hover scale states, and responsive layouts.
* **Step 6.2**: Built home landing page (`src/app/page.tsx`) with custom hero display and client lookup component (`src/components/SearchProfile.tsx`).

### Phase 7: Deployment & Final Polish
* **Step 7.1**: Fixed ESLint errors, unused state hooks, and escaped entities to ensure 100% clean check.
* **Step 7.2**: Fixed Next.js build prerender errors for dynamic segment `/[handle]` by setting `export const dynamic = 'force-dynamic'`.
* **Step 7.3**: Generated a premium custom [README.md](file:///C:/Users/chouh/OneDrive/Desktop/EAGER_MINDS/README.md) with setup instructions, AI-agent correction log, and future improvement plans.
* **Step 7.4**: Finalized local compilation checks with a successful `npm run build`.

### Phase 8: Migration to Separate Frontend and Backend (React .jsx / Express .js)
* **Step 8.1**: Read requirements in [requirement.txt](file:///C:/Users/chouh/OneDrive/Desktop/EAGER_MINDS/context/requirement.txt) and Gist to verify strict platform requirements (confirming Supabase + Resend + Vercel are indeed interviewer requirements).
* **Step 8.2**: Cleared old Next.js files from root directory.
* **Step 8.3**: Created `backend` service folder, configuring `package.json` and installing Express, Supabase client, and Resend.
* **Step 8.4**: Structured the backend modularly:
  - `backend/config/db.js`: Supabase connection client generator proxying tokens for Row-Level Security.
  - `backend/middlewares/auth.js`: Authorization Bearer token validation middleware.
  - `backend/controllers/`: Separated auth controller (`authController.js`), CRUD controller (`bookmarkController.js`), and public profile controller (`profileController.js`).
  - `backend/routes/`: Custom modular routes mapping for `authRoutes.js`, `bookmarkRoutes.js`, and `profileRoutes.js`.
  - `backend/app.js` & `backend/index.js`: Express bootstrapper, global cors registration, and port listener.
* **Step 8.5**: Bootstrapped `frontend` React SPA using Vite (`react` template, which defaults to standard Javascript with `.jsx` files).
* **Step 8.6**: Installed `react-router-dom` in `frontend` for client-side navigation.
* **Step 8.7**: Configured the frontend client:
  - `frontend/src/config/api.js`: Dynamic backend fetch client automatically attaching localStorage JWT keys in headers.
  - `frontend/src/index.css`: Re-integrated custom dark layout aesthetics.
  - `frontend/src/App.jsx`: Global router map (linking `/`, `/login`, `/signup`, `/dashboard`, and dynamic segment `/:handle`).
  - `frontend/src/pages/`: Modular pages for `Home.jsx`, `Login.jsx`, `Signup.jsx`, `Dashboard.jsx`, `Profile.jsx`, and `NotFound.jsx`.
  - `frontend/src/components/`: Re-created `BookmarkManager.jsx` (inline editing actions calling backend API) and `SearchProfile.jsx`.
* **Step 8.8**: Resolved React 19 linter warnings on synchronous `setState` in `useEffect` in `Home.jsx` and `Profile.jsx`.
* **Step 8.9**: Audited and confirmed Vite production build runs successfully.
* **Step 8.10**: Implemented functional Express route wrapping using `asyncHandler`, wrote a composable OG link parser (`metadataScraper.js`), upgraded the database schema with description and favicon columns, and updated the frontend card layouts to display these features beautifully.

### Phase 9: Modularization & Testing (Refactoring Phase)
* **Step 9.1**: Extracted validation rules into a dedicated validation middleware [backend/middlewares/validation.js](file:///C:/Users/chouh/OneDrive/Desktop/EAGER_MINDS/backend/middlewares/validation.js) to isolate controller actions from input validations.
* **Step 9.2**: Registered validation middleware on signup, login, and bookmark CRUD routes.
* **Step 9.3**: Cleaned up [backend/controllers/authController.js](file:///C:/Users/chouh/OneDrive/Desktop/EAGER_MINDS/backend/controllers/authController.js) and [backend/controllers/bookmarkController.js](file:///C:/Users/chouh/OneDrive/Desktop/EAGER_MINDS/backend/controllers/bookmarkController.js) by removing redundant inline validation checks.
* **Step 9.4**: Configured Jest in `backend/package.json` for running the backend test suites.
* **Step 9.5**: Created comprehensive unit and integration tests:
  - [validation.test.js](file:///C:/Users/chouh/OneDrive/Desktop/EAGER_MINDS/backend/tests/validation.test.js) (validates credentials, handle formatting rules, and URL checks)
  - [auth.test.js](file:///C:/Users/chouh/OneDrive/Desktop/EAGER_MINDS/backend/tests/auth.test.js) (tests auth routes with mocked Supabase client configurations)
  - [bookmarks.test.js](file:///C:/Users/chouh/OneDrive/Desktop/EAGER_MINDS/backend/tests/bookmarks.test.js) (tests bookmark creations, updates, metadata extraction, and deletions)
  - [profile.test.js](file:///C:/Users/chouh/OneDrive/Desktop/EAGER_MINDS/backend/tests/profile.test.js) (tests dynamic handle routes and reserved keyword guards)
* **Step 9.6**: Installed Vitest in the frontend React application for testing.
* **Step 9.7**: Created frontend API fetch test suite [api.test.js](file:///C:/Users/chouh/OneDrive/Desktop/EAGER_MINDS/frontend/src/config/api.test.js) with custom mock storage and fetch stubs.
* **Step 9.8**: Ran and verified all test suites pass with 100% success on both sides.

### Phase 10: Configuration, Supabase CLI, and Repository-Service Pattern
* **Step 10.1**: Configured `.env` file in `backend/` and `.env.local` file in `frontend/` using the live Supabase database credentials.
* **Step 10.2**: Ran `supabase init` using the Supabase CLI, initializing the local Supabase configuration.
* **Step 10.3**: Implemented Clean Architecture by refactoring controllers to use the **Repository Pattern** and **Service Layer Pattern**:
  - Created `userRepository.js` and `bookmarkRepository.js` in `backend/repositories/` to isolate database transactions.
  - Created `authService.js`, `bookmarkService.js`, and `profileService.js` in `backend/services/` to encapsulate business calculations.
* **Step 10.4**: Implemented `AppError.js` in `backend/utils/` to format specific HTTP status codes operational error parameters and handle them in the Express centralized handler.
* **Step 10.5**: Updated `context/implementation_plan.md` to detail the system design diagrams, database RLS policies, and directory patterns.
* **Step 10.6**: Executed and verified both test suites pass with 100% success under the new service-repository architectures.

### Phase 11: Google OAuth, Email Confirmations & Workspace Startup
* **Step 11.1**: Added beautiful, themed Google Sign-In and Sign-Up buttons on both the `Login.jsx` and `Signup.jsx` pages.
* **Step 11.2**: Implemented instant frontend validation checks on signup (handle, email, password formats) matching the backend requirements.
* **Step 11.3**: Implemented synchronous hash parsing in the frontend `useAuth` hook to capture, store, and clear the Supabase Google OAuth redirect token before component mount, avoiding redirection race conditions.
* **Step 11.4**: Configured the backend redirect settings with the `FRONTEND_URL` environment parameter (falling back to localhost) in both the Google OAuth callback and sign-up email confirmation redirects.
* **Step 11.5**: Created a root-level `package.json` with workspace commands (`npm run setup`, `npm run dev` with `concurrently`, and sequential `npm test`) so that the user can configure, start, and test the entire project with single workspace commands.
* **Step 11.6**: Verified that all backend and frontend test suites pass successfully.

---

### Phase 12: Testing, Bug Fixes & Documentation (Current Session)

**Goal**: Test all live functionality (UI, Google OAuth, Auth Service), fix any discovered bugs, and keep context documentation current.

#### Bugs Found & Fixed

##### Bug 1: Node.js 20 WebSocket Crash — Google OAuth Broken
* **Symptom**: `GET /api/auth/google` returned `{"error":"Something went wrong on the server."}` (500).
* **Root Cause**: Node.js 20 does not have native `WebSocket` support (added in Node.js 22+). Supabase's `RealtimeClient` attempted to use `globalThis.WebSocket` and threw: `Error: Node.js 20 detected without native WebSocket support`.
* **Fix** ([`backend/config/db.js`](file:///C:/Users/chouh/OneDrive/Desktop/EAGER_MINDS/backend/config/db.js)):
  - Installed the `ws` npm package: `npm install ws --prefix backend`
  - Added `const ws = require('ws')` and passed `realtime: { transport: ws }` in the Supabase client options.
* **Result**: `GET /api/auth/google` now returns a valid Supabase OAuth redirect URL ✅

##### Bug 2: Supabase AuthApiError Not Handled — Login/Signup Return 500
* **Symptom**: Logging in with wrong credentials returned `{"error":"Something went wrong on the server."}` (500) instead of a user-friendly `401` message.
* **Root Cause**: Supabase's `AuthApiError` objects (thrown from `supabase.auth.signInWithPassword`, etc.) don't have an `isOperational` property. The centralized Express error handler only forwarded errors with `isOperational = true`; all others fell to the generic 500 handler.
* **Fix #1** ([`backend/services/authService.js`](file:///C:/Users/chouh/OneDrive/Desktop/EAGER_MINDS/backend/services/authService.js)):
  - Changed all `if (error) throw error` calls in `signup`, `login`, and `getGoogleOAuthUrl` to use `throw new AppError(error.message, statusCode)` — wrapping the Supabase error in our own operational `AppError`.
  - Made the welcome email call non-blocking (wrapped in `.catch()`) so that a Resend failure doesn't prevent successful signups.
* **Fix #2** ([`backend/app.js`](file:///C:/Users/chouh/OneDrive/Desktop/EAGER_MINDS/backend/app.js)):
  - Added a secondary guard in the error handler: if `err.status` is a number (Supabase's own error format), respond with that status code and message.
  - Improved error logging to use `[Unhandled Error]` prefix.
* **Result**: Invalid login now returns `{"error":"Invalid login credentials"}` with HTTP 401 ✅

##### Bug 3: Frontend Vite Cache Lock — Dev Server EPERM Error
* **Symptom**: `npm run dev:frontend` crashed with `EPERM: operation not permitted, rmdir ...frontend/node_modules/.vite/deps`.
* **Root Cause**: Stale Vite cache directory from a previous session was still locked by the OS.
* **Fix**: Deleted the cache folder: `Remove-Item -Recurse -Force frontend/node_modules/.vite`
* **Result**: Frontend dev server starts normally at `http://localhost:5173` ✅

#### Testing Verification Summary

| Component | Endpoint / Test | Status |
|---|---|---|
| **Google OAuth** | `GET /api/auth/google` | ✅ Returns valid Supabase OAuth URL |
| **Auth - Login (invalid)** | `POST /api/auth/login` (wrong creds) | ✅ Returns 401 + `"Invalid login credentials"` |
| **Auth - /me (no token)** | `GET /api/auth/me` (no header) | ✅ Returns 401 + `"Access token is required"` |
| **Frontend UI** | `http://localhost:5173` | ✅ HTTP 200, Vite serving React app |
| **Backend Tests (Jest)** | 27 tests, 4 suites | ✅ All pass |
| **Frontend Tests (Vitest)** | 3 tests, 1 suite | ✅ All pass |

#### Files Modified This Session

1. [`backend/config/db.js`](file:///C:/Users/chouh/OneDrive/Desktop/EAGER_MINDS/backend/config/db.js) — Added `ws` transport for Node.js 20 compatibility
2. [`backend/services/authService.js`](file:///C:/Users/chouh/OneDrive/Desktop/EAGER_MINDS/backend/services/authService.js) — Proper `AppError` wrapping for Supabase errors; non-blocking email
3. [`backend/app.js`](file:///C:/Users/chouh/OneDrive/Desktop/EAGER_MINDS/backend/app.js) — Enhanced centralized error handler to handle Supabase error shapes

#### Next Steps
- [ ] Deploy backend (e.g., Render / Railway) and frontend (e.g., Vercel) for a live URL
- [ ] Set `FRONTEND_URL` env var to the deployed frontend URL so OAuth redirects properly in production
- [ ] Add `RESEND_API_KEY` with a real key to enable live welcome emails
- [ ] Consider adding an end-to-end (E2E) test using Playwright or Cypress

