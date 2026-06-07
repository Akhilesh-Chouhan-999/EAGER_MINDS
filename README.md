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
│   ├── middlewares/         # Authorization check middlewares
│   ├── routes/              # Routing definitions
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

### 3. Start Backend API Server
```bash
cd backend
npm install
npm start
```
The server will boot on `http://localhost:5000`.

### 4. Configure Frontend Environment
Create a `.env.local` file in the `frontend/` directory with the API endpoint:
```env
VITE_API_BASE_URL=http://localhost:5000
```

### 5. Start Frontend Dev Server
```bash
cd frontend
npm install
npm run dev
```
Open the local URL output by Vite (usually `http://localhost:5173`) in your browser.

---

## AI Agent Steering & Correction Log

During the migration to the frontend/backend architecture, we steering-corrected the coding agent in these areas:
1. **React 19 State Synchronization Warning**: The agent originally updated loading states synchronously within a `useEffect` on the Home and Profile pages. We corrected this by computing the loading state from localStorage dynamically at render-time and implementing a render-phase state adjustment for handle parameter changes, resolving the ESLint warnings.
2. **Modular Architecture Restructuring**: We restructured the Express backend from a monolithic file into isolated configs, middlewares, controllers, and routes to satisfy the modularity requirement.

---

## One Thing I'd Improve with More Time

Implement **automatic link metadata extraction (scraping)** inside the Express backend. When saving a new link, the server would automatically fetch the HTML, extract OpenGraph metadata (title, image, description, favicon), and save it to the DB so the user doesn't have to fill in titles manually.
