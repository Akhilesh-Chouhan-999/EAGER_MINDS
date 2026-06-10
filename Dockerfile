# --- Base Node Image ---
FROM node:20-alpine AS base
WORKDIR /app

# --- Build Frontend Stage ---
FROM base AS frontend-builder
# Copy root package.json and workspace lockfile/package.json files
COPY package*.json ./
COPY frontend/package*.json ./frontend/
COPY backend/package*.json ./backend/
# Install all dependencies (dev and prod) for building the frontend
RUN npm ci
# Copy frontend source code
COPY frontend/ ./frontend/
# Build the frontend application
RUN npm run build --prefix frontend

# --- Production Dependencies Stage ---
FROM base AS backend-deps
COPY package*.json ./
COPY frontend/package*.json ./frontend/
COPY backend/package*.json ./backend/
# Install only production dependencies for workspaces
RUN npm ci --omit=dev

# --- Runner Stage ---
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy all production dependencies from the deps stage
COPY --from=backend-deps /app ./

# Copy backend source code (overwrites package/lock/dependency files with actual source code)
COPY backend/ ./backend/

# Copy the compiled frontend build output
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Expose the application port
EXPOSE 10000
ENV PORT=10000

# Run the backend server
CMD ["npm", "start", "--prefix", "backend"]
