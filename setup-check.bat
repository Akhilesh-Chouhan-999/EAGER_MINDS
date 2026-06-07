@echo off
REM EagerMinds - Setup & Testing Helper Script for Windows

setlocal enabledelayedexpansion

cls
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║   EagerMinds Bookmarks - Setup & Testing Helper           ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

echo [1] Checking File Structure...
if exist "backend\.env" (
    echo ✓ Found: backend\.env
) else (
    echo ✗ Missing: backend\.env
)

if exist "frontend\.env.local" (
    echo ✓ Found: frontend\.env.local
) else (
    echo ✗ Missing: frontend\.env.local
)
echo.

echo [2] Checking Backend Environment Variables...
if exist "backend\.env" (
    for /f "tokens=1,2 delims==" %%a in ('type backend\.env') do (
        if "%%a"=="PORT" echo ✓ PORT: %%b
        if "%%a"=="SUPABASE_URL" echo ✓ SUPABASE_URL: %%b
        if "%%a"=="SUPABASE_ANON_KEY" echo ✓ SUPABASE_ANON_KEY: [set]
        if "%%a"=="RESEND_API_KEY" echo ✓ RESEND_API_KEY: %%b
    )
)
echo.

echo [3] Checking Frontend Environment Variables...
if exist "frontend\.env.local" (
    for /f "tokens=1,2 delims==" %%a in ('type frontend\.env.local') do (
        if "%%a"=="VITE_API_BASE_URL" echo ✓ VITE_API_BASE_URL: %%b
    )
)
echo.

echo [4] Checking Dependencies...
if exist "node_modules" (
    echo ✓ Root node_modules exists
) else (
    echo ✗ Root node_modules missing - Run: npm run setup
)

if exist "backend\node_modules" (
    echo ✓ Backend node_modules exists
) else (
    echo ✗ Backend node_modules missing - Run: npm run setup
)

if exist "frontend\node_modules" (
    echo ✓ Frontend node_modules exists
) else (
    echo ✗ Frontend node_modules missing - Run: npm run setup
)
echo.

echo [5] Checking Ports...
netstat -ano | findstr ":5000" >nul
if !errorlevel! equ 0 (
    echo ✓ Port 5000 (Backend) is available
) else (
    echo ✗ Port 5000 (Backend) is in use
)

netstat -ano | findstr ":5173" >nul
if !errorlevel! equ 0 (
    echo ✓ Port 5173 (Frontend) is available
) else (
    echo ✗ Port 5173 (Frontend) is in use
)
echo.

echo [6] Quick Start Commands:
echo.
echo Development:
echo   npm run setup          - Install all dependencies
echo   npm run dev            - Start both frontend and backend
echo   npm run dev:backend    - Backend only (port 5000)
echo   npm run dev:frontend   - Frontend only (port 5173)
echo.
echo Testing:
echo   npm test               - All tests
echo   npm run test:backend   - Backend tests
echo   npm run test:frontend  - Frontend tests
echo.
echo Health Check:
echo   curl http://localhost:5000/health
echo.
echo [7] Credentials Needed:
echo.
echo   REQUIRED FOR 100%% WORKING:
echo   1. Resend API Key (for emails)
echo      - Go to: https://resend.com
echo      - Sign up (free)
echo      - Get API key
echo      - Add to: backend\.env as RESEND_API_KEY
echo.
echo   2. Google OAuth Credentials (for Google login)
echo      - Go to: https://console.cloud.google.com
echo      - Create project
echo      - Create OAuth 2.0 credentials
echo      - Add to backend\.env:
echo        GOOGLE_CLIENT_ID=...
echo        GOOGLE_CLIENT_SECRET=...
echo      - Configure in Supabase Auth
echo.
echo [8] Database Check:
echo   - Backend/.env has SUPABASE_URL? YES
echo   - Backend/.env has SUPABASE_ANON_KEY? YES
echo   - Database schema initialized? 
echo     Go to Supabase SQL Editor and run: context/schema.sql
echo.

pause
