# Bookmark Hub — EagerMinds Take-Home Task

A premium, minimalist personal bookmarks application (think "linktree meets pocket") built with a modular architecture:
- **`frontend/`**: React SPA (Vite, JavaScript `.jsx` files, Vanilla CSS)
- **`backend/`**: Node.js & Express API Server (Modular Javascript `.js` files, Supabase, Resend)

---

## Folder Structure

```
EAGER_MINDS/
├── backend/
│   ├── config/              # Configuration (db.js setup)
│   ├── controllers/         # Request handling logic (auth, bookmarks, profiles)
│   ├── middlewares/         # Auth and input validation middlewares
│   ├── routes/              # Routing definitions
│   ├── tests/               # Backend API integration and unit test suite
│   ├── app.js               # Express app setups
│   ├── index.js             # Express server entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── config/          # Fetch API config
│   │   ├── components/      # Shared components (BookmarkManager, SearchProfile)
│   │   ├── pages/           # Pages (Home, Login, Signup, Dashboard, Profile, NotFound)
│   │   ├── App.jsx          # Route mappings (react-router-dom)
│   │   ├── main.jsx         # App bootstrap
│   │   └── index.css        # Premium custom design CSS styling
│   └── package.json
└── context/                 # Gist instructions and requirements (retained)
```

---

## Local Setup & Run Instructions

### 1. Database Setup (Supabase)
Run the contents of [context/schema.sql](file:///C:/Users/chouh/OneDrive/Desktop/EAGER_MINDS/context/schema.sql) in the **SQL Editor** of your Supabase project.

### 2. Configure Backend Environment
Create a `.env` file in the `backend/` directory with the following variables:
```env
PORT=5000
SUPABASE_URL=your-supabase-project-url
SUPABASE_ANON_KEY=your-supabase-anon-key
RESEND_API_KEY=your-resend-api-key
```

### 3. Setup Project Dependencies
Run the unified setup command in the project root:
```bash
npm run setup
```
This automatically installs package dependencies in both `backend` and `frontend` folders.

### 4. Configure Environments
- Create a `.env` file in the `backend/` directory:
  ```env
  PORT=5000
  SUPABASE_URL=your-supabase-project-url
  SUPABASE_ANON_KEY=your-supabase-anon-key
  RESEND_API_KEY=your-resend-api-key
  ```
- Create a `.env.local` file in the `frontend/` directory:
  ```env
  VITE_API_BASE_URL=http://localhost:5000
  ```

### 5. Start Development Servers
Start both the backend server and the frontend client concurrently with a single command from the project root:
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

### 6. Run the Test Suites

To verify correctness, security, and validation logic, run the test suites directly from the project root:

```bash
npm test
```

This runs both:

- **Backend Tests (Jest & Supertest)**:
  ```bash
  cd backend
  npm test
  ```
  This runs all 26 integration/unit tests for validation, authentication, bookmarks CRUD, and public profiles.

- **Frontend Tests (Vitest)**:
  ```bash
  cd frontend
  npm test
  ```
  This runs the frontend unit tests checking API request/response handling and JWT integration.

---

## AI Agent Steering & Correction Log

During the migration to the frontend/backend architecture, we steering-corrected the coding agent in these areas:
1. **React 19 State Synchronization Warning**: The agent originally updated loading states synchronously within a `useEffect` on the Home and Profile pages. We corrected this by computing the loading state from localStorage dynamically at render-time and implementing a render-phase state adjustment for handle parameter changes, resolving the ESLint warnings.
2. **Modular Architecture Restructuring**: We restructured the Express backend from a monolithic file into isolated configs, middlewares, controllers, and routes to satisfy the modularity requirement.

---

## One Thing I'd Improve with More Time

Add **end-to-end (E2E) testing** using Cypress or Playwright. E2E tests would automate browser behaviors (such as user signup, email verification simulation, login, bookmarks management, dynamic handle navigation) to guarantee complete verification of frontend and backend integration.
